import { Router, Request, Response } from 'express'
import { ADMIN_STATS } from '../data/db'

const router = Router()

// GET /api/admin/metrics - Return total users count, popular destinations breakdown, and trend data
router.get('/metrics', (req: Request, res: Response) => {
  const { timeRange } = req.query

  const responseStats = { ...ADMIN_STATS }

  // We can return the metrics, popularCities, topActivities and subset the growth logs based on active timeframe
  // Since CITIES and ACTIVITIES are loaded, we can keep the static/seeded growth lists but focus on selected values
  res.json(responseStats)
})

export default router
