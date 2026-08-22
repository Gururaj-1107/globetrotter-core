import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoutes'
import tripsRouter from './routes/tripsRoutes'
import citiesRouter from './routes/citiesRoutes'
import activitiesRouter from './routes/activitiesRoutes'
import communityRouter from './routes/communityRoutes'
import adminRouter from './routes/adminRoutes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Route registrations
app.use('/api/auth', authRouter)
app.use('/api/trips', tripsRouter)
app.use('/api/cities', citiesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/community', communityRouter)
app.use('/api/admin', adminRouter)

// Basic Liveness Route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'PostgreSQL Ready',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend listening on http://localhost:${PORT}`)
})

export default app
