export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskCategory = 
  | 'Coding'
  | 'Study'
  | 'Fitness'
  | 'Reading'
  | 'Work'
  | 'Personal'
  | 'Other';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  user_id: string;
  theme: ThemePreference;
  daily_goal: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: TaskCategory | string;
  priority: TaskPriority;
  xp: number;
  completed: boolean;
  due_date: string; // YYYY-MM-DD
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyStats {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  tasks_completed: number;
  tasks_total: number;
  xp_earned: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface OverallStats {
  tasksCompleted: number;
  xpEarned: number;
  currentStreak: number;
  bestStreak: number;
  averageCompletion: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
}
