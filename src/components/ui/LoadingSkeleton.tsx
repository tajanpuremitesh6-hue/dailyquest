'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80', className)
      )}
    />
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs"
        >
          <Skeleton className="w-6 h-6 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-12 h-4" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
