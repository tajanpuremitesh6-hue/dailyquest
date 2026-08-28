'use client';

import React, { useState } from 'react';
import { Task } from '@/types/database.types';
import { Badge } from '../ui/Badge';
import { Check, Edit3, Trash2, Calendar, Sparkles } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const { toggleTaskCompletion } = useTasks();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    await toggleTaskCompletion(task.id);
    setIsToggling(false);
  };

  return (
    <div
      className={`group relative flex items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-80'
          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-indigo-500/30'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Custom Gamified Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={task.completed ? 'Mark quest incomplete' : 'Mark quest complete'}
          className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
            task.completed
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xs shadow-emerald-500/30 scale-105'
              : 'border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-transparent'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold tracking-tight transition-all truncate ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {/* XP Pill */}
            <Badge variant="xp" icon={<Sparkles className="w-3 h-3 text-purple-500" />}>
              +{task.xp} XP
            </Badge>
          </div>

          {task.description && (
            <p
              className={`text-xs mt-1 line-clamp-2 ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
            <Badge variant="category" category={task.category}>
              {task.category}
            </Badge>
            <Badge variant="priority" priority={task.priority}>
              {task.priority}
            </Badge>
            {task.due_date && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <Calendar className="w-3 h-3" />
                {task.due_date}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (Edit & Delete) */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          title="Edit quest"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Delete quest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
