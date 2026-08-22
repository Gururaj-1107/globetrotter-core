import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
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
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Route registrations
app.use('/api/cities', citiesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/community', communityRouter)
app.use('/api/admin', adminRouter)

// Basic Liveness Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend listening on http://localhost:${PORT}`)
})
