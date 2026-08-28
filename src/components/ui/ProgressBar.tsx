'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'xp' | 'streak';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'primary',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const gradientClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    xp: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500',
    streak: 'bg-gradient-to-r from-amber-500 to-orange-600',
  };

  return (
    <div className={twMerge('w-full space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out shadow-xs', gradientClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
