# GlobeTrotter

**Odoo Hackathon 2026 — Team GlobeTrotter**

A full-stack personalized multi-city travel planning platform.

## Project Structure
```
Odoo1/
├── frontend/    ← React + Vite + TypeScript (Tailwind CSS + Framer Motion)
└── backend/     ← Node.js + Express + Firebase + Prisma (to be built)
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm run dev    # http://localhost:3001
```

## Team Branches
| Member | Branch | Scope |
|--------|--------|-------|
| Member 1 (Lead) | `feat/member1-auth-core` | Auth, scaffolding, DB, navigation |
| Member 2 | `feat/member2-trip-itinerary` | Trip creation, itinerary builder, budget view |
| Member 3 | `feat/member3-explore-community` | Dashboard, search, community |
| Member 4 | `feat/member4-calendar-admin` | My trips, profile, calendar, admin |

## Commit Every Hour!
```bash
git add -A
git commit -m "feat(scope): what you built"
git push origin your-branch
```

## Pages Built (Landing)
- `/` — Cinematic landing page with hero carousel, features, destinations, community, CTA
- `/login` — Sign In page
- `/signup` — Sign Up page
