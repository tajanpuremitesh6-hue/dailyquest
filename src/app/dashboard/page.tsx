'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { TaskItem } from '@/components/tasks/TaskItem';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Task } from '@/types/database.types';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskListSkeleton, StatsCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { 
  Flame, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Target, 
  Sparkles,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { 
    todayTasks, 
    todayCompletionRate, 
    todayCompletedCount, 
    todayTotalCount, 
    stats, 
    isLoading 
  } = useTasks();

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Formatted date string
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Hero';

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {greeting}, {displayName} 👋
              </h1>
              <p className="text-sm text-indigo-100/90 max-w-lg">
                Ready to conquer today&apos;s objectives? Keep your streak alive and level up your productivity.
              </p>
            </div>

            <Button
              onClick={() => setIsNewTaskModalOpen(true)}
              variant="secondary"
              size="lg"
              leftIcon={<Plus className="w-5 h-5 text-indigo-600" />}
              className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg font-bold shrink-0 self-start md:self-auto"
            >
              Add Today&apos;s Quest
            </Button>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Gamified Stat Cards */}
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Streak Card */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Streak</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current animate-pulse" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1.5">
                  {stats.currentStreak}
                  <span className="text-xs font-semibold text-slate-400">days</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Best: <strong className="text-amber-500 font-semibold">{stats.bestStreak} days</strong>
                </p>
              </div>
            </div>

            {/* Level Card */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Level {stats.level}
                </div>
                <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((stats.currentLevelXp / stats.nextLevelXp) * 100))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {stats.currentLevelXp} / {stats.nextLevelXp} XP to Level {stats.level + 1}
                </p>
              </div>
            </div>

            {/* Total XP Card */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats.xpEarned.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Across {stats.tasksCompleted} completed quests
                </p>
              </div>
            </div>

            {/* Daily Goal Card */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Rate</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1.5">
                  {todayCompletionRate}%
                  <span className="text-xs font-semibold text-slate-400">
                    ({todayCompletedCount}/{todayTotalCount})
                  </span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={todayCompletionRate} size="sm" variant="success" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Quests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Today&apos;s Quests
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {todayCompletedCount} / {todayTotalCount}
              </span>
            </div>

            <Button
              onClick={() => setIsNewTaskModalOpen(true)}
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Quest
            </Button>
          </div>

          {isLoading ? (
            <TaskListSkeleton />
          ) : todayTasks.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No quests for today"
              description="You have no tasks scheduled for today. Start your daily adventure by adding your first quest!"
              actionLabel="Add Your First Quest"
              onAction={() => setIsNewTaskModalOpen(true)}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={(t) => setTaskToEdit(t)}
                  onDelete={(t) => setTaskToDelete(t)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {taskToEdit && (
        <TaskModal
          isOpen={Boolean(taskToEdit)}
          onClose={() => setTaskToEdit(null)}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Delete Modal */}
      {taskToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(taskToDelete)}
          onClose={() => setTaskToDelete(null)}
          task={taskToDelete}
        />
      )}

      {/* New Task Modal triggered from this view */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </AppShell>
  );
}
