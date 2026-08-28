'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useTasks } from '@/context/TaskContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ThemePreference } from '@/types/database.types';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Download, 
  Trash2, 
  LogOut, 
  User as UserIcon, 
  Mail, 
  Target, 
  ShieldAlert, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, settings, updateProfile, updateSettings, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { tasks, stats } = useTasks();

  const [displayName, setDisplayName] = useState('');
  const [dailyGoal, setDailyGoal] = useState<number>(5);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Account deletion modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
    }
    if (settings) {
      setDailyGoal(settings.daily_goal || 5);
    }
  }, [profile, settings]);

  const handleSaveProfileAndGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const pRes = await updateProfile(displayName.trim());
    const sRes = await updateSettings({ daily_goal: dailyGoal });

    setIsSaving(false);

    if (pRes.error || sRes.error) {
      setSaveError(pRes.error || sRes.error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleThemeSelect = async (newTheme: ThemePreference) => {
    setTheme(newTheme);
    await updateSettings({ theme: newTheme });
  };

  const handleExportData = () => {
    const exportObject = {
      user: {
        id: user?.id,
        email: user?.email,
        displayName: profile?.display_name,
        createdAt: user?.created_at,
      },
      settings: settings || { theme, daily_goal: dailyGoal },
      statistics: stats,
      tasks: tasks,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dailyquest-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete account');
      }

      await signOut();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Error deleting account');
      setIsDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your app theme, daily goals, account profile, and data portability.
          </p>
        </div>

        {/* 1. Appearance / Theme */}
        <section className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-xs text-slate-500">
              Select your preferred appearance mode: Light, Dark, or automatically match your System.
            </p>
          </div>

          <ThemeToggle variant="buttons" />
        </section>

        {/* 2. Account Profile & Daily Goal Form */}
        <section className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Profile & Goals
            </h2>
            <p className="text-xs text-slate-500">
              Manage your hero identity and daily quest targets.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}

          {saveError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs">
              {saveError}
            </div>
          )}

          <form onSubmit={handleSaveProfileAndGoal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                helperText="Email is managed via Supabase Auth."
              />

              <Input
                label="Display Name"
                placeholder="Your Adventurer Name"
                leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="max-w-xs">
              <Input
                label="Daily Quest Goal"
                type="number"
                min={1}
                max={50}
                leftIcon={<Target className="w-4 h-4 text-slate-400" />}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                helperText="Target number of quests to accomplish per day."
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="glow" size="sm" isLoading={isSaving}>
                Save Preferences
              </Button>
            </div>
          </form>
        </section>

        {/* 3. Data Export */}
        <section className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Export
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export all your quests, streak history, settings, and XP statistics as a JSON file.
            </p>
          </div>

          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-indigo-600" />}
            className="shrink-0"
          >
            Export My Data
          </Button>
        </section>

        {/* 4. Account Actions (Sign Out & Delete) */}
        <section className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Management
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Button
              onClick={signOut}
              variant="secondary"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Log Out of DailyQuest
            </Button>

            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Account
            </Button>
          </div>
        </section>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account?"
        description="This will permanently remove your DailyQuest data."
        maxWidth="sm"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs">
              {deleteError}
            </div>
          )}

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              Warning: All your quests, XP progress, level badges, and streaks will be wiped out forever. This action cannot be reversed.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Delete Account Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
