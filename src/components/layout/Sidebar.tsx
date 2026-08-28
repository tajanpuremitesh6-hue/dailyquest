'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  History, 
  Settings, 
  Flame, 
  Zap, 
  LogOut, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';

interface SidebarProps {
  onOpenNewTask?: () => void;
}

export function Sidebar({ onOpenNewTask }: SidebarProps) {
  const pathname = usePathname();
  const { profile, user, signOut } = useAuth();
  const { stats } = useTasks();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'History & Stats', href: '/history', icon: History },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            DailyQuest
            <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/30">
              FREE
            </span>
          </span>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Gamified Productivity</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <button
          onClick={onOpenNewTask}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Level & Streak Mini Card */}
      <div className="p-4 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-500/20 dark:border-indigo-500/30">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" /> Level {stats.level}
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500" /> {stats.currentStreak}d streak
          </span>
        </div>
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((stats.currentLevelXp / stats.nextLevelXp) * 100))}%` }}
          />
        </div>
        <p className="text-[11px] text-right text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {stats.currentLevelXp} / {stats.nextLevelXp} XP
        </p>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {profile?.display_name || 'Adventurer'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.email || 'user@dailyquest'}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
