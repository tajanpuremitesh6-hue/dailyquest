'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Task, TaskPriority, TaskCategory, OverallStats } from '@/types/database.types';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';
import { calculateProductivityStats, formatDateKey, PRIORITY_XP } from '@/lib/gamification';
import confetti from 'canvas-confetti';

interface CreateTaskInput {
  title: string;
  description?: string;
  category: TaskCategory | string;
  priority: TaskPriority;
  xp?: number;
  due_date: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory | string;
  priority?: TaskPriority;
  xp?: number;
  due_date?: string;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  stats: OverallStats;
  todayTasks: Task[];
  todayCompletionRate: number;
  todayCompletedCount: number;
  todayTotalCount: number;
  createTask: (input: CreateTaskInput) => Promise<{ error: string | null }>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<{ error: string | null }>;
  deleteTask: (id: string) => Promise<{ error: string | null }>;
  toggleTaskCompletion: (id: string) => Promise<{ error: string | null }>;
  refreshTasks: () => Promise<void>;
  getTasksForDate: (dateKey: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchErr) {
        console.error('Error fetching tasks from Supabase:', fetchErr);
        setError('Unable to load your tasks. Please check your connection.');
      } else {
        setTasks(data || []);
      }
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setError('An unexpected error occurred while fetching tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Overall Gamification Stats
  const stats = useMemo(() => {
    return calculateProductivityStats(tasks);
  }, [tasks]);

  // Today's Tasks & Metrics
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.due_date === todayKey);
  }, [tasks, todayKey]);

  const todayCompletedCount = useMemo(() => {
    return todayTasks.filter((t) => t.completed).length;
  }, [todayTasks]);

  const todayTotalCount = todayTasks.length;

  const todayCompletionRate = useMemo(() => {
    if (todayTotalCount === 0) return 0;
    return Math.round((todayCompletedCount / todayTotalCount) * 100);
  }, [todayCompletedCount, todayTotalCount]);

  const createTask = async (input: CreateTaskInput) => {
    if (!user) return { error: 'You must be logged in to create a task.' };

    const xpAmount = input.xp !== undefined && input.xp >= 0 ? input.xp : PRIORITY_XP[input.priority] || 50;

    const newTaskPayload = {
      user_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      category: input.category,
      priority: input.priority,
      xp: xpAmount,
      completed: false,
      due_date: input.due_date,
      completed_at: null,
    };

    try {
      const { data, error: insertErr } = await supabase
        .from('tasks')
        .insert(newTaskPayload)
        .select()
        .single();

      if (insertErr) {
        return { error: insertErr.message };
      }

      if (data) {
        setTasks((prev) => [data, ...prev]);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Failed to create task.' };
    }
  };

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    if (!user) return { error: 'Not authenticated.' };

    try {
      const updates: Partial<Task> = {};
      if (input.title !== undefined) updates.title = input.title.trim();
      if (input.description !== undefined) updates.description = input.description.trim();
      if (input.category !== undefined) updates.category = input.category;
      if (input.priority !== undefined) updates.priority = input.priority;
      if (input.xp !== undefined) updates.xp = input.xp;
      if (input.due_date !== undefined) updates.due_date = input.due_date;

      const { data, error: updateErr } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateErr) {
        return { error: updateErr.message };
      }

      if (data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Failed to update task.' };
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return { error: 'Not authenticated.' };

    try {
      const { error: delErr } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (delErr) {
        return { error: delErr.message };
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Failed to delete task.' };
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    if (!user) return { error: 'Not authenticated.' };

    const target = tasks.find((t) => t.id === id);
    if (!target) return { error: 'Task not found.' };

    const nextCompleted = !target.completed;
    const nextCompletedAt = nextCompleted ? new Date().toISOString() : null;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: nextCompleted, completed_at: nextCompletedAt }
          : t
      )
    );

    // Fire celebration confetti if marking completed!
    if (nextCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Safe if canvas is unavailable
      }
    }

    try {
      const { data, error: toggleErr } = await supabase
        .from('tasks')
        .update({
          completed: nextCompleted,
          completed_at: nextCompletedAt,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (toggleErr) {
        // Revert on error
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? target : t))
        );
        return { error: toggleErr.message };
      }

      if (data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      }

      return { error: null };
    } catch (err: unknown) {
      // Revert on exception
      setTasks((prev) => prev.map((t) => (t.id === id ? target : t)));
      return { error: err instanceof Error ? err.message : 'Failed to update task completion.' };
    }
  };

  const getTasksForDate = useCallback(
    (dateKey: string) => {
      return tasks.filter((t) => t.due_date === dateKey);
    },
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        stats,
        todayTasks,
        todayCompletionRate,
        todayCompletedCount,
        todayTotalCount,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks: fetchTasks,
        getTasksForDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
