import { Router, Request, Response } from 'express'
import { COMMUNITY_POSTS } from '../data/db'

const router = Router()

// GET /api/community - Get all public shared itineraries
router.get('/', (req: Request, res: Response) => {
  res.json(COMMUNITY_POSTS)
})

// POST /api/community/:id/like - Increment like count on a community post
router.post('/:id/like', (req: Request, res: Response) => {
  const { id } = req.params
  const post = COMMUNITY_POSTS.find(p => p.id === id)
  if (!post) {
    res.status(404).json({ error: 'Itinerary not found' })
    return
  }

  // Dynamically increment likes count in memory
  post.likes += 1

  res.json({
    success: true,
    likes: post.likes
  })
})

// POST /api/community/:id/copy - Increment copy/duplicate count for a community post
router.post('/:id/copy', (req: Request, res: Response) => {
  const { id } = req.params
  const post = COMMUNITY_POSTS.find(p => p.id === id)
  if (!post) {
    res.status(404).json({ error: 'Itinerary not found' })
    return
  }

  // Dynamically increment copy count in memory
  post.copies += 1

  res.json({
    success: true,
    copies: post.copies
  })
})

export default router
