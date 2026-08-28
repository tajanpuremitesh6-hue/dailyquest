'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useTasks } from '@/context/TaskContext';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { Task, TaskCategory, TaskPriority } from '@/types/database.types';
import { CATEGORIES } from '@/lib/gamification';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskListSkeleton } from '@/components/ui/LoadingSkeleton';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  CheckSquare, 
  ListFilter,
  Layers
} from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'completed';
type SortOption = 'default' | 'priority' | 'xp' | 'dueDate' | 'createdDate';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = (task.description || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'default') {
          // Default: Pending first, then High priority, then nearest due date
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          const priorityScore = { High: 3, Medium: 2, Low: 1 };
          const pA = priorityScore[a.priority] || 0;
          const pB = priorityScore[b.priority] || 0;
          if (pA !== pB) return pB - pA;
          return a.due_date.localeCompare(b.due_date);
        }

        if (sortBy === 'priority') {
          const priorityScore = { High: 3, Medium: 2, Low: 1 };
          return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
        }

        if (sortBy === 'xp') {
          return (b.xp || 0) - (a.xp || 0);
        }

        if (sortBy === 'dueDate') {
          return a.due_date.localeCompare(b.due_date);
        }

        if (sortBy === 'createdDate') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }

        return 0;
      });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    };
  }, [tasks]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Quest Log
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage, filter, and prioritize all your productivity quests.
            </p>
          </div>

          <Button
            onClick={() => setIsNewTaskModalOpen(true)}
            variant="glow"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Quest
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-4">
          {/* Top row: Status Tabs & Search Input */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {(['all', 'pending', 'completed'] as StatusFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab} ({counts[tab]})
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="w-full md:w-72">
              <Input
                placeholder="Search quest title or notes..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Bottom row: Category, Priority, Sort dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                ...CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />

            <Select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' },
              ]}
            />

            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={[
                { value: 'default', label: 'Default (High Priority & Pending)' },
                { value: 'priority', label: 'Priority (High to Low)' },
                { value: 'xp', label: 'XP Reward (High to Low)' },
                { value: 'dueDate', label: 'Due Date (Earliest first)' },
                { value: 'createdDate', label: 'Created Date (Newest first)' },
              ]}
            />
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <TaskListSkeleton />
        ) : filteredAndSortedTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title={tasks.length === 0 ? 'No quests yet' : 'No matching quests found'}
            description={
              tasks.length === 0
                ? 'Create your first quest to start earning XP and leveling up!'
                : 'Try adjusting your search query, status, category, or priority filters.'
            }
            actionLabel={tasks.length === 0 ? 'Create Your First Quest' : undefined}
            onAction={tasks.length === 0 ? () => setIsNewTaskModalOpen(true) : undefined}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        ) : (
          <div className="space-y-3">
            {filteredAndSortedTasks.map((task) => (
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

      {/* New Task Modal */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </AppShell>
  );
}
