'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useTasks } from '@/context/TaskContext';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { Task } from '@/types/database.types';
import { formatDateKey, calculateWeeklyStats } from '@/lib/gamification';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Flame, 
  Trophy, 
  Zap, 
  Target, 
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

export default function HistoryPage() {
  const { tasks, stats, isLoading } = useTasks();

  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // 7-day Weekly Stats
  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats(tasks);
  }, [tasks]);

  // Tasks for the currently selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.due_date === selectedDate);
  }, [tasks, selectedDate]);

  const selectedDateCompleted = useMemo(() => {
    return selectedDateTasks.filter((t) => t.completed).length;
  }, [selectedDateTasks]);

  const selectedDateXp = useMemo(() => {
    return selectedDateTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + (t.xp || 0), 0);
  }, [selectedDateTasks]);

  const selectedDateRate = useMemo(() => {
    if (selectedDateTasks.length === 0) return 0;
    return Math.round((selectedDateCompleted / selectedDateTasks.length) * 100);
  }, [selectedDateCompleted, selectedDateTasks]);

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Map tasks by date for the month
    const taskMap = new Map<string, { total: number; completed: number; xp: number }>();
    tasks.forEach((t) => {
      const curr = taskMap.get(t.due_date) || { total: 0, completed: 0, xp: 0 };
      curr.total++;
      if (t.completed) {
        curr.completed++;
        curr.xp += t.xp || 0;
      }
      taskMap.set(t.due_date, curr);
    });

    const days: Array<{
      dayNumber: number;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      stats?: { total: number; completed: number; xp: number };
    }> = [];

    // Empty padding slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dayNumber: 0,
        dateKey: `pad-${i}`,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    const todayStr = formatDateKey(new Date());

    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateKey = formatDateKey(dateObj);
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === todayStr,
        stats: taskMap.get(dateKey),
      });
    }

    return days;
  }, [currentMonth, tasks]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Productivity History & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your quest completion trends, lifetime metrics, and historical logs.
          </p>
        </div>

        {/* Lifetime Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Quests Completed
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.tasksCompleted}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total XP Earned
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-current" />
              {stats.xpEarned.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Current Streak
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-current" />
              {stats.currentStreak}d
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Best Streak
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {stats.bestStreak}d
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Avg. Completion
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Target className="w-4 h-4" />
              {stats.averageCompletion}%
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Chart */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Last 7 Days Activity
              </h2>
            </div>
            <span className="text-xs text-slate-500">Completion rate %</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 items-end min-h-[160px]">
            {weeklyStats.map((day) => {
              const isSelected = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {day.percentage}%
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-xl h-24 flex items-end p-1 overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        day.percentage > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-purple-500'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${Math.max(4, day.percentage)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      {day.label}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {day.completed}/{day.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Section: Calendar & Selected Date Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Heatmap (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                {monthLabel}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-xs">
              {calendarDays.map((item) => {
                if (!item.isCurrentMonth) {
                  return <div key={item.dateKey} className="h-10" />;
                }

                const isSelected = item.dateKey === selectedDate;
                const hasCompleted = item.stats && item.stats.completed > 0;
                const total = item.stats?.total || 0;
                const completed = item.stats?.completed || 0;

                return (
                  <button
                    key={item.dateKey}
                    onClick={() => setSelectedDate(item.dateKey)}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 font-bold'
                        : item.isToday
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30'
                        : hasCompleted
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{item.dayNumber}</span>
                    {total > 0 && (
                      <span className={`text-[9px] font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {completed}/{total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Quest Logs (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs space-y-5">
            {/* Header info for selected date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Logs for {selectedDate}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDateCompleted} of {selectedDateTasks.length} quests completed
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
                    +{selectedDateXp} XP
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {selectedDateRate}% Completion
                  </span>
                </div>
              </div>
            </div>

            {/* Quests List */}
            {selectedDateTasks.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No quests on this date"
                description={`No quests were scheduled or logged for ${selectedDate}. Select another date on the calendar.`}
              />
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={(t) => setTaskToEdit(t)}
                    onDelete={(t) => setTaskToDelete(t)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {taskToEdit && (
        <TaskModal
          isOpen={Boolean(taskToEdit)}
          onClose={() => setTaskToEdit(null)}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Delete Modal */}
      {taskToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(taskToDelete)}
          onClose={() => setTaskToDelete(null)}
          task={taskToDelete}
        />
      )}
    </AppShell>
  );
}
