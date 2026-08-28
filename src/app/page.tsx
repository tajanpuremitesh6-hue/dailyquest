'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Zap, Flame, ShieldCheck, CheckCircle2, BarChart2, ArrowRight, Lock, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            DailyQuest
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector on Landing */}
          <ThemeToggle variant="pill" />

          {user ? (
            <Link href="/dashboard">
              <Button variant="glow" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="glow" size="sm">
                  Sign Up Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-8 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" /> 100% Free & Open Gamified Productivity
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl">
          Turn Your Daily Grind Into an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Epic RPG Quest
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
          Complete daily tasks, earn XP, maintain unyielding streaks, level up your productivity, and track detailed analytics — with zero paid subscriptions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href={user ? '/dashboard' : '/signup'}>
            <Button size="lg" variant="glow" rightIcon={<ArrowRight className="w-5 h-5" />}>
              {user ? 'Open Your Quests' : 'Start Your Journey Free'}
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In to Existing Quest
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              XP & Leveling System
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every task grants XP based on its priority. Level up every 500 XP and visualize your climb.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Streak Tracking
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Build daily momentum. Complete at least one task per day to keep your active streak blazing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              History & Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive calendar heatmap and 7-day productivity charts to review your performance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>DailyQuest — $0 Free Full-Stack Productivity Tracker. Built with Next.js, TypeScript & Supabase.</p>
      </footer>
    </div>
  );
}
