'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemePreference } from '@/types/database.types';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'buttons' | 'pill' | 'select';
  className?: string;
}

export function ThemeToggle({ variant = 'pill', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options: { id: ThemePreference; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  if (variant === 'buttons') {
    return (
      <div className={`grid grid-cols-3 gap-3 ${className}`}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-current'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">{opt.label}</span>
              {isSelected && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                  Active {theme === 'system' ? `(${resolvedTheme})` : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Pill / Segmented Control
  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 ${className}`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            title={`Switch to ${opt.label} mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
