# 🌍 GlobeTrotter — Smart Multi-City Travel Planner

> **Odoo Hackathon 2026**  
> A full-stack travel platform for personalized multi-city itinerary building, day-by-day flowchart visualization, smart categorized budgeting, calendar scheduling, community trip copying, and administrative analytics.

---

## 🏗️ Architecture & Tech Stack

```text
┌──────────────────────────────────────────────────────────┐
│                   GLOBETROTTER PLATFORM                  │
├────────────────────────────┬─────────────────────────────┤
│   Frontend (Port 5173)     │      Backend (Port 3001)    │
│  React 18 + Vite + TS      │  Node.js + Express + TS     │
│  Tailwind CSS v4           │  Prisma ORM (PostgreSQL)    │
│  Framer Motion             │  JWT + bcryptjs             │
│  Lucide Icons              │  Firebase Admin SDK         │
└────────────────────────────┴─────────────────────────────┘
```

---

## 🚀 2-Minute Quick Start Guide for Judges & Teammates

### 1. Clone the Repository
```bash
git clone https://github.com/Gururaj-1107/globetrotter-core.git
cd globetrotter-core
```

---

### 2. Frontend Setup (Client)
```bash
cd frontend
# 1. Copy env file
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
🌐 **Frontend URL:** [http://localhost:5173](http://localhost:5173)

---

### 3. Backend & PostgreSQL Database Setup
```bash
cd ../backend
# 1. Copy env file
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Create tables in PostgreSQL (Prisma Push)
npm run prisma:push

# 4. Seed database with 10+ cities, 40+ activities, trips, and users
npm run seed

# 5. Start backend API server
npm run dev
```
⚙️ **Backend API URL:** [http://localhost:3001](http://localhost:3001)  
💓 **Health Check:** [http://localhost:3001/health](http://localhost:3001/health)

---

## 🗄️ Database Setup & Zero-Crash Guarantee

### What if an evaluator does NOT have PostgreSQL installed?
> [!NOTE]
> **Zero-Crash Portability Guarantee**:  
> The frontend and backend are engineered with a **resilient hybrid data layer**. If PostgreSQL is running on standard port `5432`, all data reads and writes directly query PostgreSQL via Prisma. If PostgreSQL is not started or installed, the application automatically falls back to our local data layer. **The platform will NEVER crash or show an empty screen during evaluation.**

### If running PostgreSQL locally:
1. Make sure PostgreSQL is running on port `5432`.
2. Check your `.env` connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/globetrotter?schema=public"
   ```
3. Run `npm run prisma:push` followed by `npm run seed`.

---

## 🔐 Authentication & The Google Account Edge Case

We implemented a dual-layer authentication architecture:
- **Layer 1 (Firebase Auth)**: Live Google OAuth Popups + Email/Password authentication.
- **Layer 2 (PostgreSQL User Store)**: Single application user profile tied to the Firebase UID / Email, preventing duplicate database records.

### 💡 The Google-Only Account Detection Edge Case (Tested on `/login`):
1. **User enters email** (e.g. `rahul@gmail.com`) and clicks **Continue**.
2. **Provider Detection**: The system checks if the email is a Google-only account.
   - If yes: Displays ⚠️ *"This account was created using Google Sign-In"* and reveals `[Continue with Google]`.
3. **Password Linking Modal**:
   - Once authenticated with Google, a user can set a password via the modal: *"Create a password for your account"*.
   - Both Google and Email/Password now link to the **exact same user profile**.

---

## ⚡ Instant 1-Click Demo Accounts (Fast Testing)

At the top of the Login page ([http://localhost:5173/login](http://localhost:5173/login)), click any button for instant access:

| Account | Email | Password | Role | Pre-loaded Data |
| :--- | :--- | :--- | :--- | :--- |
| **👤 Demo Traveler** | `traveler@globetrotter.com` | `password123` | `USER` | Alex Rivers (Paris, Tokyo, Sydney itineraries) |
| **🛡️ Demo Admin** | `admin@globetrotter.com` | `admin123` | `ADMIN` | Clara Martin (User management & analytics charts) |
| **🌐 Google Account** | `rahul@gmail.com` | Google Auth | `USER` | Rahul Sharma (Google account detection demo) |

---

## 📱 Complete 12-Screen Navigation Guide

| # | Screen Name | Route | Description |
| :---: | :--- | :--- | :--- |
| **1 & 2** | **Login & Registration** | `/login` / `/signup` | Firebase Google Auth, Smart Provider detection, Photo upload, all registration fields |
| **3** | **Main Dashboard** | `/dashboard` | Regional Selections, Previous Trips gallery, Search filters, "+ Plan a Trip" CTA |
| **4** | **Create Trip** | `/trips/create` | Destination picker, Date range selector, Activity recommendation cards |
| **5** | **Build Itinerary** | `/trips/:id/builder` | Multi-section builder (Transport, Stay, Activities), Live budget calculator |
| **6** | **My Trips** | `/trips/my-trips` | Ongoing, Upcoming, Completed trip listings with user isolation |
| **7** | **User Profile** | `/profile` | Editable user profile, avatar synchronization, preplanned/previous trip galleries |
| **8** | **Activity Search** | `/search` | Real-time category checkboxes, duration, price slider, and Add-to-Trip modal |
| **9** | **Itinerary View** | `/trips/:id/view` | Day-by-day flowchart with vertical arrows (`↓`) and expense breakdown boxes |
| **10** | **Community Feed** | `/community` | Public trip feed with like counters and 1-Click **"Copy Trip"** feature |
| **11** | **Calendar View** | `/calendar` | Monthly calendar highlighting multi-day trip spans (Paris, Tokyo, Sydney) |
| **12** | **Admin Analytics** | `/admin` | Protected Admin dashboard with user management table & 7d/30d/1y metric charts |

---

## 👥 Team & Contribution Guidelines

- Keep all feature branches active (e.g. `feat/member2-trips-builder`, `feat/member3-explore-admin`).
- Ensure `.env` files are never committed (keep `.env.example` updated).
- Commit code frequently with standard conventional commit messages (`feat:`, `fix:`, `chore:`).

---

© 2026 Team GlobeTrotter. Built for the Odoo Hackathon.
