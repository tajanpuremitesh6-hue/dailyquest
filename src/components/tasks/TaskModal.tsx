'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Task, TaskPriority, TaskCategory } from '@/types/database.types';
import { CATEGORIES, PRIORITY_XP, formatDateKey } from '@/lib/gamification';
import { useTasks } from '@/context/TaskContext';
import { Sparkles, Calendar, Tag, ShieldAlert } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export function TaskModal({ isOpen, onClose, taskToEdit }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory | string>('Coding');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [xp, setXp] = useState<number>(50);
  const [dueDate, setDueDate] = useState<string>(formatDateKey(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset form when taskToEdit or isOpen changes
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setXp(taskToEdit.xp);
      setDueDate(taskToEdit.due_date);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Coding');
      setPriority('Medium');
      setXp(PRIORITY_XP['Medium']);
      setDueDate(formatDateKey(new Date()));
    }
    setErrorMessage(null);
  }, [taskToEdit, isOpen]);

  // Automatically update XP recommendation when Priority changes, unless user modified XP
  const handlePriorityChange = (newPriority: TaskPriority) => {
    setPriority(newPriority);
    if (!taskToEdit) {
      setXp(PRIORITY_XP[newPriority] || 50);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a quest title.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    let res: { error: string | null };

    if (taskToEdit) {
      res = await updateTask(taskToEdit.id, {
        title,
        description,
        category,
        priority,
        xp,
        due_date: dueDate,
      });
    } else {
      res = await createTask({
        title,
        description,
        category,
        priority,
        xp,
        due_date: dueDate,
      });
    }

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Quest' : 'Add New Quest'}
      description={
        taskToEdit
          ? 'Update your quest details, rewards, and deadlines.'
          : 'Define a new daily objective to conquer and earn XP.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Title */}
        <Input
          label="Quest Title"
          placeholder="e.g. Solve 3 LeetCode problems"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        {/* Description */}
        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Details or notes about this quest..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category & Priority in 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />

          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    priority === p
                      ? p === 'High'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : p === 'Medium'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* XP Reward & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="XP Reward"
            type="number"
            min={0}
            max={1000}
            leftIcon={<Sparkles className="w-4 h-4 text-purple-500" />}
            value={xp}
            onChange={(e) => setXp(Math.max(0, parseInt(e.target.value) || 0))}
          />

          <Input
            label="Due Date"
            type="date"
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="glow" isLoading={isSubmitting}>
            {taskToEdit ? 'Save Changes' : 'Create Quest'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
