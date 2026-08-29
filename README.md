# DailyQuest

> A modern, gamified full-stack productivity web application designed to help users build consistent daily habits through quest-based task management, XP progression, and streak tracking.

---

## 📖 Problem Statement

Traditional to-do list applications often feel monotonous and transactional, leading to low user engagement, task fatigue, and inconsistent habit formation. Without positive reinforcement or visual momentum, individuals struggle to sustain daily productivity and track long-term progress.

**DailyQuest** addresses this challenge by transforming everyday tasks into an interactive role-playing experience. By combining structured task organization with RPG mechanics—such as experience points (XP), leveling, streak tracking, interactive analytics, and instant celebratory feedback—DailyQuest turns personal productivity into an engaging, habit-building habit loop.

---

## 🎯 Features

### 1. 🛡️ User Authentication & Session Management
- **Complete Auth Flow**: User Registration (Sign Up), User Login, Password Reset request, and Password Update.
- **Protected Routing**: Route protection via Next.js middleware ensuring secure access to authenticated routes (`/dashboard`, `/tasks`, `/history`, `/settings`).
- **Session Persistence**: Seamless session handling via `@supabase/ssr` cookies and client-side authentication context.

### 2. ⚡ Gamification Engine
- **Experience Points (XP)**: Earn XP rewards based on task difficulty upon completion:
  - *Low Priority*: +25 XP
  - *Medium Priority*: +50 XP
  - *High Priority*: +100 XP
  - *Custom XP*: Support for user-defined XP rewards.
- **Leveling System**: Dynamic level calculation based on cumulative XP earned (1 Level per 500 XP).
- **Streak Tracker**: Tracks active consecutive days of completed tasks as well as the all-time best streak.
- **Reward Celebrations**: Interactive confetti animations when completing quests.

### 3. 📋 Quest Management (Tasks)
- **Full CRUD Operations**: Create, edit, complete, uncomplete, and delete quests.
- **Categorization**: Categorize tasks into Coding, Study, Fitness, Reading, Work, Personal, and Other.
- **Priority Levels**: Assign Low, Medium, or High priority to each quest.
- **Live Search & Filtering**: Filter quests by status (*All / In Progress / Completed*), Category, and Priority with instant text search.
- **Multi-Field Sorting**: Sort quests by creation date, due date, priority, or XP reward.

### 4. 📊 History, Calendar & Analytics
- **Lifetime Summary Metrics**: Track total completed quests, total XP earned, active streak, best streak, and overall completion rate.
- **7-Day Completion Chart**: Weekly visual breakdown showing daily completion percentages.
- **Monthly Activity Calendar**: Interactive heatmap view of monthly quest activity with date-selection to inspect historical task logs.

### 5. ⚙️ User Settings & Data Management
- **Theme Preferences**: Toggle between Light, Dark, and System appearance modes with instant persistence.
- **Daily Target Goal**: Configurable daily target goal (e.g., 5 quests/day) with real-time progress bar.
- **Data Export**: Export user profile, settings, and quest data as a downloadable `.json` file.
- **Account Management**: Secure server-side account deletion with confirmation safeguards.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (v16 App Router) | React server & client components, routing, and server API routes |
| **UI Library** | [React](https://react.dev/) (v19) | Component-driven UI architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static typing and interface definitions |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (v4) | Utility-first styling, CSS variables, dark mode, and responsive UI |
| **Database & Auth** | [Supabase](https://supabase.com/) | Managed PostgreSQL database and Supabase Auth |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography across the application |
| **Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Gamified completion celebration particle effects |

---

## 📸 Screenshots

### 1. Login & Authentication Screen
![Login Screen](login.png)

### 2. Dashboard Screen
![Dashboard Screen](dashboard.png)

### 3. Quest Management (Tasks) Screen
![Tasks Screen](tasks.png)

### 4. History & Analytics Screen
![History & Analytics Screen](history.png)

### 5. Settings & Profile Screen
![Settings Screen](settings.png)

---

## 🚀 Live Demo

- **Application URL**: [https://dailyquest-alpha.vercel.app/dashboard](https://dailyquest-alpha.vercel.app/dashboard)

---

## ⚙️ Backend

DailyQuest utilizes **Supabase** as its backend infrastructure:
- **Authentication**: Email/password authentication, session management, secure cookie storage via Next.js SSR middleware.
- **Database**: Hosted PostgreSQL database instance.
- **Row Level Security (RLS)**: Fine-grained access control enforced directly at the database engine level.
- **Serverless API Routes**: Next.js App Router Route Handlers for server-privileged tasks (e.g. account deletion).

---

## 🏗️ Project Architecture

```text
+-------------------------------------------------------------+
|                         User Browser                        |
+-------------------------------------------------------------+
                              |
                              | HTTP / HTTPS Requests
                              v
+-------------------------------------------------------------+
|                     Next.js Frontend                        |
|  - App Router Pages (/dashboard, /tasks, /history, /settings)|
|  - Auth & Task Context Providers (Client State)              |
|  - Next.js Middleware (Route Protection & Token Refresh)     |
|  - Route Handlers (Server API for Privileged Operations)     |
+-------------------------------------------------------------+
                              |
                              | Supabase Client (@supabase/ssr)
                              v
+-------------------------------------------------------------+
|                       Supabase Backend                      |
|  - Supabase Auth (JWT verification & User Sessions)         |
|  - Supabase PostgREST Database API                          |
+-------------------------------------------------------------+
                              |
                              | SQL Queries with auth.uid() context
                              v
+-------------------------------------------------------------+
|                     PostgreSQL Database                     |
|  - Tables: profiles, tasks, daily_stats, user_settings      |
|  - Row Level Security (RLS) Policies                        |
+-------------------------------------------------------------+
```

---

## 🗄️ Database & Security

### Database Schema
The database schema consists of four core tables in PostgreSQL:
- `profiles`: Stores user profile data (email, full name, avatar URL) linked to `auth.users`.
- `user_settings`: Stores user preferences (theme, daily goal target, notification flags).
- `tasks`: Stores quest items with titles, descriptions, categories, priorities, XP reward, completion status, and timestamps.
- `daily_stats`: Aggregates historical quest completion counts, XP earned, and streak data per user per day.

### Security & Row Level Security (RLS)
- **Row Level Security**: Enabled on all public schema tables. Policies enforce that users can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` records where `auth.uid() = user_id`.
- **Credential Protection**: Passwords are encrypted and managed exclusively through Supabase Auth; no plain-text credentials are ever handled or stored by the application.
- **API Key Segregation**: 
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is restricted by RLS policies for client operations.
  - `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side Route Handlers and is never bundled to client-side code.

---

## 💻 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or compatible package manager
- A free [Supabase](https://supabase.com/) account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in the Supabase dashboard.
3. Open `supabase/schema.sql` from this project, paste its contents into the SQL Editor, and click **Run**.
4. Retrieve your project credentials from **Project Settings -> API**.

### 4. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```bash
cp .env.example .env.local
```
Configure the required environment variables inside `.env.local` (see [Environment Variables](#-environment-variables)).

### 5. Run the Application
Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 Environment Variables

The project requires the following environment variables configured in `.env.local`:

| Variable Name | Required | Scope | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client & Server | The unique HTTPS URL for your Supabase project instance |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client & Server | The public anonymous API key for authenticating requests with RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only | Privileged secret key used exclusively in server Route Handlers |

> **Security Notice**: Never commit actual environment variable values, secret keys, or passwords to version control.
