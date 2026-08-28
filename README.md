# DailyQuest — Free Full-Stack Productivity Tracker

> **A modern, gamified, $0-cost full-stack productivity web application built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.**

---

## 🌟 Core Principle

The entire MVP is designed, buildable, deployable, and usable **without purchasing any subscription or paid API**.

- **100% Free-Tier Services**:
  - **Supabase Free Tier**: Authentication + PostgreSQL Database with strict Row Level Security (RLS)
  - **Vercel Hobby**: Zero-cost hosting & continuous deployment
  - **Open-source ecosystem**: Next.js, React, Tailwind CSS, Lucide Icons, Canvas Confetti

---

## ✨ Features

### 1. 🛡️ Authentication & User Isolation
- Complete authentication flow: Sign Up, Log In, Log Out, Forgot Password, and Password Reset.
- Session persistence and route protection via Next.js SSR middleware (`/dashboard`, `/tasks`, `/history`, `/settings`).
- **PostgreSQL Row Level Security (RLS)** ensuring users can only read, insert, update, and delete their own tasks.

### 2. ⚡ Gamification Engine
- **XP System**: Earn experience points upon quest completion.
  - Low Priority: **+25 XP**
  - Medium Priority: **+50 XP**
  - High Priority: **+100 XP**
  - Custom editable XP values.
- **Leveling System**: Level up every 500 XP formula:
  $$\text{Level} = \lfloor \frac{\text{totalXP}}{500} \rfloor + 1$$
- **Streak Tracking**: Complete at least one task per day to keep your active streak blazing. Calculates both current and all-time best streaks.
- **Confetti Celebrations**: Canvas confetti fires upon marking quests complete.

### 3. 📋 Task Management (Quest Log)
- Create, edit, complete, uncomplete, and delete quests.
- Categories: Coding, Study, Fitness, Reading, Work, Personal, Other.
- Priorities: Low, Medium, High.
- Filter by status (*All / Pending / Completed*), Category, and Priority.
- Live search by title and description.
- Multi-criteria sorting (Default, Priority, XP Reward, Due Date, Created Date).

### 4. 📊 History, Calendar & Analytics
- **Lifetime Stats**: Total quests completed, total XP earned, current streak, best streak, average completion rate.
- **7-Day Weekly Bar Chart**: Visualizes completion percentage for each day over the past week.
- **Interactive Calendar Heatmap**: Monthly view highlighting task activity with a date picker to inspect historical quest logs.

### 5. ⚙️ Preferences & Portability
- **Theme Support**: Light, Dark, and System modes with instant toggle and persistence.
- **Daily Quest Goal**: Configurable daily target (e.g., 5 quests/day).
- **Data Export**: Export all user data (profile, settings, tasks, statistics) as a clean `.json` file.
- **Account Deletion**: Server-side user data deletion with confirmation safety.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Server & Client Components)
- **Language**: TypeScript with strict types
- **Styling**: Tailwind CSS, CSS variables, Glassmorphism, Responsive design
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Quick Start & Setup Guide

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd project
npm install
```

### 2. Set Up Free Supabase Backend

1. Go to [supabase.com](https://supabase.com) and create a **Free** project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository, paste its contents into the SQL Editor, and click **Run**.
   - This creates all necessary tables (`profiles`, `user_settings`, `tasks`, `daily_stats`).
   - Sets up triggers for auto-creating profiles on signup.
   - Activates Row Level Security (RLS) policies.
4. In your Supabase project, go to **Project Settings -> API** and copy:
   - **Project URL**
   - **anon / public key**
   - *(Optional)* **service_role key** (server-side only for complete user deletion)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/account/delete/ # Server-side account deletion route
│   │   ├── dashboard/          # Daily quest dashboard view
│   │   ├── forgot-password/    # Password reset request page
│   │   ├── history/            # History, analytics & calendar page
│   │   ├── login/              # Sign in page
│   │   ├── reset-password/     # Password update page
│   │   ├── settings/           # User settings, themes & data export
│   │   ├── signup/             # Account creation page
│   │   ├── tasks/              # Quest management with filters & search
│   │   ├── globals.css         # Tailwind & theme styles
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Hero landing page
│   ├── components/
│   │   ├── layout/             # AppShell, Sidebar, Header, MobileNav
│   │   ├── tasks/              # TaskItem, TaskModal, DeleteConfirmModal
│   │   └── ui/                 # Button, Input, Select, Modal, Badge, ProgressBar, EmptyState, Skeleton
│   ├── context/
│   │   ├── AuthContext.tsx     # Supabase auth session & profile provider
│   │   ├── TaskContext.tsx     # Quest state, CRUD, & gamification calculator
│   │   └── ThemeContext.tsx    # Light/Dark/System theme provider
│   ├── lib/
│   │   ├── gamification.ts     # XP, Level, Streak & Stats formulas
│   │   └── supabase/           # Browser, Server, & Middleware Supabase clients
│   ├── middleware.ts           # Route protection middleware
│   └── types/
│       └── database.types.ts   # TypeScript schema definitions
├── supabase/
│   └── schema.sql              # Complete PostgreSQL schema & RLS policies
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

---

## 🔒 Security & Row Level Security (RLS)

DailyQuest implements strict database security:
- **No client-side security trust**: Every database query is verified against the authenticated user's JWT (`auth.uid() = user_id`).
- **Service role key isolation**: The `SUPABASE_SERVICE_ROLE_KEY` is only used inside server-side Route Handlers and is never leaked to client bundles.
- **Zero plain-text credentials**: Passwords are encrypted and handled exclusively by Supabase Auth.

---

## 📦 Deployment (Vercel Free Tier)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**.

---

## 📜 License

MIT License — Free and open source.
