import { Task, TaskPriority, OverallStats } from '@/types/database.types';

export const PRIORITY_XP: Record<TaskPriority, number> = {
  Low: 25,
  Medium: 50,
  High: 100,
};

export const XP_PER_LEVEL = 500;

export const CATEGORIES = [
  'Coding',
  'Study',
  'Fitness',
  'Reading',
  'Work',
  'Personal',
  'Other',
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Coding: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  Study: { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  Fitness: { bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
  Reading: { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  Work: { bg: 'bg-purple-500/10 dark:bg-purple-500/15', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  Personal: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  Other: { bg: 'bg-slate-500/10 dark:bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30', glow: 'shadow-slate-500/20' },
};

/**
 * Calculates level from total XP: Level = floor(totalXP / 500) + 1
 */
export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

/**
 * Calculates XP earned inside the current level and XP target
 */
export function calculateLevelProgress(totalXp: number): { currentLevelXp: number; nextLevelXp: number; percentage: number } {
  const safeXp = Math.max(0, totalXp);
  const currentLevelXp = safeXp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const percentage = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  return { currentLevelXp, nextLevelXp, percentage };
}

/**
 * Formats a Date object into YYYY-MM-DD local format
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates streaks and overall statistics from a list of tasks
 */
export function calculateProductivityStats(tasks: Task[]): OverallStats {
  const completedTasks = tasks.filter((t) => t.completed);
  const totalXp = completedTasks.reduce((sum, t) => sum + (t.xp || 0), 0);
  const level = calculateLevel(totalXp);
  const { currentLevelXp, nextLevelXp } = calculateLevelProgress(totalXp);

  // Group completed tasks by active completion date
  const completedDates = new Set<string>();
  completedTasks.forEach((task) => {
    if (task.completed_at) {
      const dateKey = formatDateKey(new Date(task.completed_at));
      completedDates.add(dateKey);
    } else if (task.due_date) {
      completedDates.add(task.due_date);
    }
  });

  // Calculate Streaks
  const today = new Date();
  const todayKey = formatDateKey(today);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  // Determine starting point: streak is active if today is completed OR yesterday was completed
  let currentStreak = 0;
  let checkDate = new Date(today);

  if (!completedDates.has(todayKey)) {
    // If today is not completed yet, check if yesterday was completed to keep the streak alive
    if (completedDates.has(yesterdayKey)) {
      checkDate = yesterday;
    } else {
      // Neither today nor yesterday had completed tasks -> streak is 0
      checkDate = new Date(0); // won't loop
    }
  }

  if (checkDate.getTime() > 0) {
    while (completedDates.has(formatDateKey(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate Best Streak across all dates
  const sortedDates = Array.from(completedDates).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDateObj: Date | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDateObj = new Date(y, m - 1, d);

    if (!prevDateObj) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentDateObj.getTime() - prevDateObj.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    prevDateObj = currentDateObj;
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // Calculate average completion rate across active task days
  const tasksByDate = new Map<string, { total: number; completed: number }>();
  tasks.forEach((t) => {
    const d = t.due_date || (t.created_at ? formatDateKey(new Date(t.created_at)) : todayKey);
    const curr = tasksByDate.get(d) || { total: 0, completed: 0 };
    curr.total++;
    if (t.completed) curr.completed++;
    tasksByDate.set(d, curr);
  });

  let totalRates = 0;
  let activeDaysCount = 0;
  tasksByDate.forEach((stat) => {
    if (stat.total > 0) {
      totalRates += (stat.completed / stat.total) * 100;
      activeDaysCount++;
    }
  });

  const averageCompletion = activeDaysCount > 0 ? Math.round(totalRates / activeDaysCount) : 0;

  return {
    tasksCompleted: completedTasks.length,
    xpEarned: totalXp,
    currentStreak,
    bestStreak,
    averageCompletion,
    level,
    currentLevelXp,
    nextLevelXp,
  };
}

/**
 * Calculates 7-day weekly stats for chart visualization
 */
export function calculateWeeklyStats(tasks: Task[]) {
  const days: { date: string; label: string; completed: number; total: number; percentage: number; xp: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayTasks = tasks.filter((t) => t.due_date === dateKey);
    const completedTasks = dayTasks.filter((t) => t.completed);
    const xp = completedTasks.reduce((sum, t) => sum + (t.xp || 0), 0);
    const total = dayTasks.length;
    const completed = completedTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    days.push({
      date: dateKey,
      label: dayLabel,
      completed,
      total,
      percentage,
      xp,
    });
  }

  return days;
}
