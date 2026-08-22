import { Router, Response } from 'express'
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

export interface ItineraryActivity {
  id: string
  name: string
  category: string
  cost: number
  duration: string
  timeSlot: string
  dayNumber?: number
  sectionName?: string
  sectionCategory?: string
}

export interface TripSection {
  id: string
  name: string
  category: 'Transport' | 'Stay' | 'Activity' | 'Meals' | 'Misc'
  description: string
  startDate: string
  endDate: string
  budget: number
  activities: ItineraryActivity[]
}

export interface TripEntity {
  id: string
  userId: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  totalEstimatedBudget: number
  status: 'ONGOING' | 'UPCOMING' | 'COMPLETED'
  themes: string[]
  coverImageUrl?: string
  isPublic: boolean
  sections: TripSection[]
  expenses: { id: string; category: string; amount: number; note: string; date: string }[]
  createdAt: string
  updatedAt: string
}

// Initial In-Memory / Relational Seed Trips
export let TRIPS: TripEntity[] = [
  {
    id: 'trip-ongoing-1',
    userId: 'usr-demo-wanderer',
    title: 'Paris Summer Exploration',
    city: 'Paris',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    budget: 3500,
    totalEstimatedBudget: 3200,
    status: 'ONGOING',
    themes: ['Sightseeing', 'Food'],
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    sections: [
      {
        id: 'sec-1',
        name: 'Section 1: Arrival & Historic Monuments',
        category: 'Activity',
        description: 'Eiffel Tower summit, Louvre guided walk, and Seine river sunset cruise.',
        startDate: '2026-08-15',
        endDate: '2026-08-18',
        budget: 1200,
        activities: [
          { id: 'act-1', name: 'Eiffel Tower Summit Access', category: 'Sightseeing', cost: 45, duration: '2 hours', timeSlot: '09:30 AM', dayNumber: 1 },
          { id: 'act-2', name: 'Louvre Museum Masterpieces Tour', category: 'Culture', cost: 65, duration: '3 hours', timeSlot: '01:00 PM', dayNumber: 1 },
          { id: 'act-3', name: 'Seine River Cruise & Dinner', category: 'Food', cost: 95, duration: '2.5 hours', timeSlot: '07:30 PM', dayNumber: 1 },
          { id: 'act-4', name: 'Montmartre Artists & Cafés Walk', category: 'Culture', cost: 25, duration: '2 hours', timeSlot: '10:00 AM', dayNumber: 2 }
        ]
      },
      {
        id: 'sec-2',
        name: 'Section 2: Boutique Hotel & Latin Quarter',
        category: 'Stay',
        description: 'Accommodations and Latin Quarter culinary stroll.',
        startDate: '2026-08-18',
        endDate: '2026-08-22',
        budget: 1800,
        activities: [
          { id: 'act-5', name: 'Catacombs of Paris Underground Walk', category: 'Adventure', cost: 35, duration: '2 hours', timeSlot: '02:00 PM', dayNumber: 3 },
          { id: 'act-6', name: 'Palace of Versailles Day Tour', category: 'Culture', cost: 85, duration: '5 hours', timeSlot: '09:00 AM', dayNumber: 4 }
        ]
      }
    ],
    expenses: [
      { id: 'exp-1', category: 'TRANSPORT', amount: 450, note: 'TGV train and Paris Metro passes', date: '2026-08-15' },
      { id: 'exp-2', category: 'STAY', amount: 1400, note: '4-star boutique hotel near Louvre', date: '2026-08-15' },
      { id: 'exp-3', category: 'ACTIVITIES', amount: 350, note: 'Museum passes and Eiffel Summit', date: '2026-08-16' },
      { id: 'exp-4', category: 'MEALS', amount: 550, note: 'Bistros, patisseries, wine tasting', date: '2026-08-17' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trip-upcoming-1',
    userId: 'usr-demo-wanderer',
    title: 'Tokyo Neon & Temples Escapade',
    city: 'Tokyo',
    startDate: '2026-08-26',
    endDate: '2026-08-30',
    budget: 5000,
    totalEstimatedBudget: 4600,
    status: 'UPCOMING',
    themes: ['Adventure', 'Culture'],
    coverImageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    sections: [
      {
        id: 'sec-tok-1',
        name: 'Section 1: Shibuya & Shinjuku Neon Pulse',
        category: 'Activity',
        description: 'Exploring crossing, street food stalls, and digital art.',
        startDate: '2026-08-26',
        endDate: '2026-08-28',
        budget: 2000,
        activities: [
          { id: 'act-tok-1', name: 'Shibuya Crossing & Foodie Walk', category: 'Food', cost: 55, duration: '3 hours', timeSlot: '11:00 AM', dayNumber: 1 },
          { id: 'act-tok-2', name: 'Senso-ji Temple & Asakusa', category: 'Culture', cost: 20, duration: '2 hours', timeSlot: '03:00 PM', dayNumber: 1 }
        ]
      }
    ],
    expenses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trip-completed-1',
    userId: 'usr-demo-wanderer',
    title: 'Sydney Coastal Adventure',
    city: 'Sydney',
    startDate: '2026-08-02',
    endDate: '2026-08-07',
    budget: 3000,
    totalEstimatedBudget: 2900,
    status: 'COMPLETED',
    themes: ['Beach', 'Nature'],
    coverImageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    isPublic: false,
    sections: [],
    expenses: [
      { id: 'exp-syd-1', category: 'TRANSPORT', amount: 800, note: 'Flights & ferry passes', date: '2026-08-02' },
      { id: 'exp-syd-2', category: 'STAY', amount: 1200, note: 'Harbour view hotel', date: '2026-08-02' },
      { id: 'exp-syd-3', category: 'ACTIVITIES', amount: 450, note: 'Harbour bridge climb & opera tickets', date: '2026-08-03' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 1. Get All User Trips (with Status and Search filters)
router.get('/', optionalAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr-demo-wanderer'
  const { status, search } = req.query

  let result = TRIPS.filter(t => t.userId === userId || t.isPublic)

  if (status && status !== 'ALL') {
    result = result.filter(t => t.status.toUpperCase() === (status as string).toUpperCase())
  }

  if (search) {
    const q = (search as string).toLowerCase()
    result = result.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.city.toLowerCase().includes(q) ||
      t.themes.some(th => th.toLowerCase().includes(q))
    )
  }

  return res.json(result)
})

// 2. Get Single Trip with Full Itinerary and Expense Breakdown
router.get('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const trip = TRIPS.find(t => t.id === id)

  if (!trip) {
    // If not found, return Paris sample trip
    return res.json(TRIPS[0])
  }

  return res.json(trip)
})

// 3. Create New Trip (Screen 4)
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr-demo-wanderer'
  const { title, city, startDate, endDate, budget, themes, initialActivities } = req.body

  if (!title || !city || !startDate || !endDate) {
    return res.status(400).json({ error: 'Title, destination city, start date, and end date are required' })
  }

  const initialActivitiesMapped: ItineraryActivity[] = Array.isArray(initialActivities)
    ? initialActivities.map((act: any, idx: number) => ({
        id: act.id || `act-custom-${idx}`,
        name: act.name,
        category: act.category || 'Sightseeing',
        cost: Number(act.cost) || 0,
        duration: act.duration || '2 hours',
        timeSlot: act.timeSlot || '10:00 AM',
        dayNumber: 1
      }))
    : []

  const newTrip: TripEntity = {
    id: `trip-${Date.now()}`,
    userId,
    title: title.trim(),
    city: city.trim(),
    startDate,
    endDate,
    budget: Number(budget) || 0,
    totalEstimatedBudget: initialActivitiesMapped.reduce((sum, a) => sum + a.cost, 0),
    status: 'UPCOMING',
    themes: Array.isArray(themes) ? themes : ['Adventure'],
    coverImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    isPublic: false,
    sections: [
      {
        id: `sec-${Date.now()}-1`,
        name: `Section 1: Exploring ${city}`,
        category: 'Activity',
        description: `Curated activities and sightseeing for ${city}`,
        startDate,
        endDate,
        budget: Number(budget) || 0,
        activities: initialActivitiesMapped
      }
    ],
    expenses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  TRIPS.unshift(newTrip)

  return res.status(201).json({
    message: 'Trip created successfully',
    trip: newTrip
  })
})

// 4. Update / Save Multi-Section Itinerary (Screen 5)
router.put('/:id/sections', optionalAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { sections, budget } = req.body

  const trip = TRIPS.find(t => t.id === id)
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' })
  }

  if (Array.isArray(sections)) {
    trip.sections = sections
    let calculatedTotal = 0
    sections.forEach(sec => {
      if (sec.activities) {
        calculatedTotal += sec.activities.reduce((s: number, a: ItineraryActivity) => s + (Number(a.cost) || 0), 0)
      }
    })
    trip.totalEstimatedBudget = calculatedTotal
  }

  if (budget !== undefined) {
    trip.budget = Number(budget)
  }

  trip.updatedAt = new Date().toISOString()

  return res.json({
    message: 'Itinerary sections updated successfully',
    trip
  })
})

// 5. Delete Trip
router.delete('/:id', optionalAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const index = TRIPS.findIndex(t => t.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Trip not found' })
  }

  TRIPS.splice(index, 1)
  return res.json({ success: true, message: 'Trip deleted successfully' })
})

export default router
