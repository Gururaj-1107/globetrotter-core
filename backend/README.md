# GlobeTrotter Backend

This is the backend folder — to be built by teammate(s).

## Tech Stack
- Node.js + Express (or Fastify)
- Firebase Admin SDK for auth verification
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)

## Getting Started
```bash
npm install
npm run dev
```

## Folder Structure (to be created)
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts        # Firebase token verification
│   │   ├── trips.ts       # Trip CRUD
│   │   ├── activities.ts  # Cities & activities
│   │   ├── community.ts   # Community posts
│   │   ├── calendar.ts    # Calendar data
│   │   └── admin.ts       # Admin analytics
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.ts
├── package.json
└── .env
```

## Environment Variables
```
DATABASE_URL=file:./dev.db
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
PORT=3001
```
