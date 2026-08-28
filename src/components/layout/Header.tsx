'use client';

import React from 'react';
import { Flame, Zap, Plus, Menu } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenNewTask?: () => void;
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenNewTask, onOpenMobileMenu }: HeaderProps) {
  const { stats } = useTasks();

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      {/* Mobile Menu Button & Mobile Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
            DailyQuest
          </span>
        </div>
      </div>

      {/* Desktop Welcome or Page Context */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Welcome to your quest log
        </span>
      </div>

      {/* Right Side Stats & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{stats.currentStreak} Day{stats.currentStreak === 1 ? '' : 's'}</span>
        </div>

        {/* XP Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold shadow-xs">
          <Zap className="w-4 h-4 fill-purple-500 text-purple-500" />
          <span>{stats.xpEarned.toLocaleString()} XP</span>
        </div>

        {/* Theme Segmented Switcher (Light / Dark / System) */}
        <ThemeToggle variant="pill" />

        {/* Quick Add Quest Button (Desktop/Mobile) */}
        <Button
          onClick={onOpenNewTask}
          size="sm"
          variant="glow"
          leftIcon={<Plus className="w-4 h-4" />}
          className="hidden sm:inline-flex"
        >
          Add Quest
        </Button>
      </div>
    </header>
  );
}
