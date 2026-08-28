'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CATEGORY_COLORS } from '@/lib/gamification';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'priority' | 'xp' | 'level' | 'streak';
  category?: string;
  priority?: 'Low' | 'Medium' | 'High';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  category,
  priority,
  className,
  icon,
}: BadgeProps) {
  let styleClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (variant === 'category' && category) {
    const theme = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
    styleClass = `${theme.bg} ${theme.text} ${theme.border}`;
  } else if (variant === 'priority' && priority) {
    if (priority === 'High') {
      styleClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    } else if (priority === 'Medium') {
      styleClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    } else {
      styleClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  } else if (variant === 'xp') {
    styleClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold';
  } else if (variant === 'streak') {
    styleClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 font-bold';
  } else if (variant === 'level') {
    styleClass = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-bold';
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors select-none',
          styleClass,
          className
        )
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
