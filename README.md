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
│  Firebase Auth             │  Firebase Admin SDK         │
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

### 2. Frontend Setup
```bash
cd frontend

# Copy env file (Firebase credentials are pre-configured)
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```
🌐 **Frontend:** [http://localhost:5173](http://localhost:5173)

---

### 3. Backend & Database Setup
```bash
cd ../backend

# Copy env file
cp .env.example .env

# Install dependencies
npm install

# Push Prisma schema to PostgreSQL
npm run prisma:push

# Seed with cities, activities, trips, and users
npm run seed

# Start backend API server
npm run dev
```
⚙️ **Backend API:** [http://localhost:3001](http://localhost:3001)  
💓 **Health Check:** [http://localhost:3001/health](http://localhost:3001/health)

---

## 🗄️ Database — PostgreSQL Setup

> [!NOTE]
> **Zero-Crash Guarantee**: If PostgreSQL is not running, the app falls back to a built-in in-memory data layer. All 12 screens remain fully functional for evaluation without a database.

**If running PostgreSQL locally:**

1. Ensure PostgreSQL is running on port `5432`.
2. Update the connection string in `backend/.env` if your password differs:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/globetrotter?schema=public"
   ```
3. Run schema push + seed:
   ```bash
   npm run prisma:push
   npm run seed
   ```

---

## 🔐 Authentication

- **Google OAuth** — Real Firebase popup (`globetrotter-auth` project)
- **Email + Password** — Firebase + PostgreSQL sync
- **Edge Case Handled**: If an account was created with Google and the user later tries Email login, the system detects this and offers Google Sign-In + optional password linking to the same account.

---

## ⚡ Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Traveler** | `traveler@globetrotter.com` | `password123` |
| **Admin** | `admin@globetrotter.com` | `admin123` |
| **Google User** | `rahul@gmail.com` | Google Sign-In |

> **Admin note**: Admin accounts cannot be created through the signup form. Only the credentials above grant admin access.

---

## 📱 Complete Screen Navigation

| Screen | Route | Description |
| :---: | :--- | :--- |
| **Login / Register** | `/login` | Firebase Google Auth, smart provider detection, photo upload |
| **Dashboard** | `/dashboard` | Voyara Travels banner, regional selections, search, previous trips |
| **Create Trip** | `/trips/create` | Destination picker, dates, activity recommendations |
| **Itinerary Builder** | `/trips/:id/builder` | Multi-section builder, live budget calculator |
| **My Trips** | `/trips/my-trips` | User-isolated trip list (Ongoing / Upcoming / Completed) |
| **Profile** | `/profile` | Editable profile with avatar upload |
| **Activity Search** | `/search` | Category filter, price slider, Add-to-Trip modal |
| **Itinerary View** | `/trips/:id/view` | Day-by-day flowchart with expense breakdown |
| **Community Feed** | `/community` | Public trips, likes, 1-Click Copy Trip |
| **Calendar** | `/calendar` | Monthly calendar with trip spans highlighted |
| **Admin Dashboard** | `/admin` | All-users data, analytics charts, user management table |

---

## 👥 Team Contribution

- Push code at least once per hour to `main`
- Use conventional commit messages: `feat:`, `fix:`, `chore:`
- Never commit `.env` files — only `.env.example` is tracked

---

© 2026 Team GlobeTrotter. Built for the Odoo Hackathon.
