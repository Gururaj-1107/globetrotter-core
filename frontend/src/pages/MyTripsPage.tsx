import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  Trash2, 
  Sparkles,
  Layers,
  Compass,
  Plus
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Activity {
  id: string
  name: string
  category: string
  cost: number
  duration: string
}

interface StoredTrip {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
  activities: Activity[]
  status: 'ONGOING' | 'UPCOMING' | 'COMPLETED'
  image: string
  stopsCount: number
}

// Mock trips to show when local storage is empty
const MOCK_TRIPS: StoredTrip[] = [
  {
    id: 'trip-ongoing-1',
    title: 'Summer Solstice in Paris',
    city: 'Paris',
    startDate: '2026-08-15',
    endDate: '2026-08-25',
    budget: 3500,
    themes: ['Sightseeing', 'Food'],
    activities: [
      { id: 'act-1', name: 'Eiffel Tower Climb', category: 'Sightseeing', cost: 45, duration: '2h' },
      { id: 'act-2', name: 'Louvre Museum Guided Tour', category: 'Sightseeing', cost: 65, duration: '3h' },
      { id: 'act-3', name: 'Seine River Cruise', category: 'Food', cost: 95, duration: '2.5h' }
    ],
    status: 'ONGOING',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    stopsCount: 3
  },
  {
    id: 'trip-upcoming-1',
    title: 'Neon Nights & Temples in Tokyo',
    city: 'Tokyo',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    budget: 5000,
    themes: ['Adventure', 'Culture'],
    activities: [
      { id: 'act-4', name: 'Shibuya Crossing food walk', category: 'Food', cost: 55, duration: '3h' },
      { id: 'act-5', name: 'Mount Fuji Day Trip', category: 'Adventure', cost: 120, duration: '9h' }
    ],
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    stopsCount: 4
  },
  {
    id: 'trip-completed-1',
    title: 'Chasing Sunsets in Sydney',
    city: 'Sydney',
    startDate: '2026-01-05',
    endDate: '2026-01-12',
    budget: 3000,
    themes: ['Beach', 'Nature'],
    activities: [
      { id: 'act-6', name: 'Sydney Opera House Tour', category: 'Culture', cost: 50, duration: '2h' },
      { id: 'act-7', name: 'Harbour Bridge Climb', category: 'Adventure', cost: 195, duration: '3.5h' }
    ],
    status: 'COMPLETED',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    stopsCount: 2
  }
]

const CITY_IMAGES: Record<string, string> = {
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80'
}

export default function MyTripsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'UPCOMING' | 'COMPLETED'>('ONGOING')
  const [trips, setTrips] = useState<StoredTrip[]>([])

  // Load trips from localStorage & merge with mock data to look full and beautiful
  useEffect(() => {
    const list: StoredTrip[] = []
    
    // Parse localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('globetrotter_trip_') && key !== 'globetrotter_trip_new') {
        try {
          const tripData = JSON.parse(localStorage.getItem(key) || '')
          
          // Determine status based on dates
          const today = new Date('2026-08-22') // matching local time context
          const start = new Date(tripData.startDate)
          const end = new Date(tripData.endDate)
          
          let status: 'ONGOING' | 'UPCOMING' | 'COMPLETED' = 'UPCOMING'
          if (today >= start && today <= end) {
            status = 'ONGOING'
          } else if (today > end) {
            status = 'COMPLETED'
          }

          list.push({
            id: tripData.id,
            title: tripData.title,
            city: tripData.city,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            budget: tripData.budget || 3000,
            themes: tripData.themes || [],
            activities: tripData.activities || [],
            status,
            image: CITY_IMAGES[tripData.city] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
            stopsCount: tripData.activities ? Math.max(2, tripData.activities.length) : 3
          })
        } catch (e) {
          // ignore
        }
      }
    }

    // Merge with mock trips if they don't exist already to avoid empty screens
    const mergedList = [...list]
    MOCK_TRIPS.forEach(mockTrip => {
      if (!mergedList.some(t => t.id === mockTrip.id)) {
        mergedList.push(mockTrip)
      }
    })

    setTrips(mergedList)
  }, [])

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this trip itinerary?')) {
      localStorage.removeItem(`globetrotter_trip_${id}`)
      setTrips(trips.filter(t => t.id !== id))
    }
  }

  // Filter trips based on active tab
  const filteredTrips = trips.filter(t => t.status === activeTab)

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Compass className="text-blue-400" size={28} />
              My Trip Itineraries
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Manage and track your ongoing, upcoming, and past travel schedules.</p>
          </div>
          <button
            onClick={() => navigate('/trips/create')}
            className="bg-white hover:bg-neutral-200 text-black font-semibold px-5 py-2.5 rounded-full transition-all text-xs flex items-center gap-1.5 shadow-lg w-fit cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Plan New Trip
          </button>
        </div>

        {/* Tabbed segmented switch */}
        <div className="flex border-b border-neutral-900 mb-8 p-1 bg-zinc-950 rounded-2xl w-fit">
          {(['ONGOING', 'UPCOMING', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Trip list grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredTrips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-950 border border-neutral-900 rounded-3xl p-16 text-center space-y-4"
              >
                <Layers className="text-neutral-700 mx-auto" size={44} />
                <h3 className="font-bold text-lg text-white">No trips in this category</h3>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto">You have no active plans categorized under {activeTab.toLowerCase()}. Let's build one!</p>
              </motion.div>
            ) : (
              filteredTrips.map((trip) => {
                // Calculate budget used
                const activitiesCost = trip.activities ? trip.activities.reduce((sum, act) => sum + act.cost, 0) : 0
                // For demonstration, let's assume we spent 65% of budget on transport/stays, plus activity costs
                const budgetUsed = Math.min(trip.budget, Math.round(trip.budget * 0.6 + activitiesCost))
                const budgetPercent = Math.round((budgetUsed / trip.budget) * 100)

                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-zinc-950 border border-neutral-900 hover:border-neutral-800 p-5 rounded-3xl flex flex-col md:flex-row gap-6 shadow-xl transition-all relative overflow-hidden"
                  >
                    {/* Destination Photo */}
                    <div className="w-full md:w-56 h-40 shrink-0 rounded-2xl overflow-hidden relative">
                      <img 
                        src={trip.image} 
                        alt={trip.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[9px] px-2.5 py-0.5 rounded font-bold text-white border border-white/10 uppercase tracking-wide">
                        {trip.city}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">
                            {trip.title}
                          </h3>
                          
                          {/* Only show delete button for non-mock items or allow on all */}
                          <button
                            onClick={(e) => handleDeleteTrip(trip.id, e)}
                            className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Trip"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Dates & Stops */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-neutral-500" />
                            {new Date(trip.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                          </span>
                          <span className="text-neutral-700">•</span>
                          <span className="flex items-center gap-1">
                            <Layers size={13} className="text-neutral-500" />
                            {trip.stopsCount} Sections / Stops
                          </span>
                          <span className="text-neutral-700">•</span>
                          <div className="flex gap-1">
                            {trip.themes?.slice(0, 2).map((t) => (
                              <span key={t} className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Budget Tracker Indicator */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-400">Budget Spent: <strong className="text-neutral-200">${budgetUsed}</strong> / ${trip.budget}</span>
                          <span className="font-semibold text-blue-400">{budgetPercent}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-850">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, budgetPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action trigger */}
                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={() => navigate(`/trips/${trip.id}/view`)}
                          className="bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-blue-600 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          View Itinerary
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
