import { Router, Request, Response } from 'express'
import { ACTIVITIES } from '../data/db'

const router = Router()

// GET /api/activities - Search activities with filters (?category=, ?maxPrice=, ?cityId=)
router.get('/', (req: Request, res: Response) => {
  const { category, maxPrice, cityId } = req.query

  let result = [...ACTIVITIES]

  if (category && typeof category === 'string') {
    // Support comma-separated categories like "Food,Sightseeing" or single "Food"
    const categoriesArray = category.split(',').map(c => c.trim().toLowerCase())
    result = result.filter(act => categoriesArray.includes(act.category.toLowerCase()))
  }

  if (maxPrice) {
    const priceNum = parseFloat(maxPrice as string)
    if (!isNaN(priceNum)) {
      result = result.filter(act => act.cost <= priceNum)
    }
  }

  if (cityId && typeof cityId === 'string') {
    result = result.filter(act => act.cityId.toLowerCase() === cityId.toLowerCase())
  }

  res.json(result)
})

export default router
