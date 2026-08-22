import { Router, Request, Response } from 'express'
import { CITIES, ACTIVITIES } from '../data/db'

const router = Router()

// GET /api/cities - Get all cities with search/region filtering
router.get('/', (req: Request, res: Response) => {
  const { search, region } = req.query

  let result = [...CITIES]

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    result = result.filter(
      c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.country.toLowerCase().includes(searchLower)
    )
  }

  if (region && typeof region === 'string' && region !== 'All') {
    result = result.filter(c => c.region.toLowerCase() === region.toLowerCase())
  }

  res.json(result)
})

// GET /api/cities/:id - Get specific city by ID with related activities
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  const city = CITIES.find(c => c.id === id)
  if (!city) {
    res.status(404).json({ error: 'City not found' })
    return
  }

  const relatedActivities = ACTIVITIES.filter(act => act.cityId === id)

  res.json({
    ...city,
    activities: relatedActivities
  })
})

export default router
