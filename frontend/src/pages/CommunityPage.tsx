import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Copy, 
  Search, 
  Clock, 
  MapPin, 
  Check, 
  Sparkles, 
  Compass, 
  Share2, 
  Filter, 
  ArrowUpDown
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface PublicTrip {
  id: string
  title: string
  authorName: string
  authorAvatar: string
  city: string
  citiesVisited: string[]
  durationDays: number
  likes: number
  liked: boolean
  copies: number
  image: string
  budget: number
  activities: {
    id: string
    name: string
    category: string
    cost: number
    duration: string
  }[]
}

const PUBLIC_TRIPS_FEED: PublicTrip[] = [
  {
    id: 'pub-1',
    title: 'Gourmet Paris & Rome Romancero',
    authorName: 'Clara Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    city: 'Paris',
    citiesVisited: ['Paris', 'Rome'],
    durationDays: 10,
    likes: 312,
    liked: false,
    copies: 48,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    budget: 4200,
    activities: [
      { id: 'pa-1', name: 'Seine Dinner Cruise', category: 'Food', cost: 95, duration: '2.5h' },
      { id: 'pa-2', name: 'Louvre Museum Tour', category: 'Sightseeing', cost: 65, duration: '3h' },
      { id: 'pa-3', name: 'Colosseum VIP Entry', category: 'Sightseeing', cost: 52, duration: '3h' }
    ]
  },
  {
    id: 'pub-2',
    title: 'Ultramodern Tokyo Foodie Trail',
    authorName: 'Jin Kenji',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    city: 'Tokyo',
    citiesVisited: ['Tokyo'],
    durationDays: 5,
    likes: 204,
    liked: false,
    copies: 87,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    budget: 2200,
    activities: [
      { id: 'tk-1', name: 'Shibuya Izakaya Food Crawl', category: 'Food', cost: 60, duration: '3h' },
      { id: 'tk-2', name: 'Robot Restaurant Digital Show', category: 'Nightlife', cost: 80, duration: '2h' }
    ]
  },
  {
    id: 'pub-3',
    title: 'Aussie Beaches & Coastal Hikes',
    authorName: 'Oliver Hughes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    city: 'Sydney',
    citiesVisited: ['Sydney', 'Bondi'],
    durationDays: 8,
    likes: 124,
    liked: false,
    copies: 19,
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    budget: 3100,
    activities: [
      { id: 'sy-1', name: 'Opera House Tour', category: 'Sightseeing', cost: 50, duration: '2h' },
      { id: 'sy-2', name: 'Harbour Bridge Climb', category: 'Adventure', cost: 195, duration: '3.5h' }
    ]
  },
  {
    id: 'pub-4',
    title: 'Crypts & Historic Rome Ruins',
    authorName: 'Alessandro R.',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    city: 'Rome',
    citiesVisited: ['Rome'],
    durationDays: 7,
    likes: 185,
    liked: false,
    copies: 33,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    budget: 2800,
    activities: [
      { id: 'rm-1', name: 'Vatican Museums Sistine Chapel', category: 'Sightseeing', cost: 42, duration: '4h' },
      { id: 'rm-2', name: 'Rome Crypts & Catacombs Tour', category: 'Adventure', cost: 42, duration: '2.5h' }
    ]
  }
]

export default function CommunityPage() {
  const navigate = useNavigate()
  const [feed, setFeed] = useState<PublicTrip[]>(PUBLIC_TRIPS_FEED)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Sorting & Filtering
  const [selectedCityFilter, setSelectedCityFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'Likes' | 'Duration' | 'Budget'>('Likes')

  // Handle Like Button click
  const handleLikeToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFeed(prev => prev.map(trip => {
      if (trip.id === id) {
        return {
          ...trip,
          liked: !trip.liked,
          likes: trip.liked ? trip.likes - 1 : trip.likes + 1
        }
      }
      return trip
    }))
  }

  // Copy Trip details to user's personal list in localStorage
  const handleCopyTrip = (trip: PublicTrip, e: React.MouseEvent) => {
    e.stopPropagation()

    // Calculate dates starting today
    const start = new Date()
    const end = new Date()
    end.setDate(start.getDate() + trip.durationDays)

    const newTripData = {
      id: `trip-copy-${Date.now()}`,
      title: `Cloned: ${trip.title}`,
      city: trip.city,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      budget: trip.budget,
      themes: ['Community', 'Curated'],
      activities: trip.activities.map(act => ({
        ...act,
        timeSlot: '11:00 AM'
      }))
    }

    // Save to localStorage
    localStorage.setItem(`globetrotter_trip_${newTripData.id}`, JSON.stringify(newTripData))
    
    // Increment copy count locally
    setFeed(prev => prev.map(t => {
      if (t.id === trip.id) {
        return { ...t, copies: t.copies + 1 }
      }
      return t
    }))

    triggerToast(`"${trip.title}" copied to My Trips list!`)
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter & Sort
  const filteredFeed = feed.filter(trip => {
    const queryMatch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const cityMatch = selectedCityFilter === 'All' || trip.city === selectedCityFilter
    return queryMatch && cityMatch
  }).sort((a, b) => {
    if (sortBy === 'Likes') return b.likes - a.likes
    if (sortBy === 'Duration') return b.durationDays - a.durationDays
    if (sortBy === 'Budget') return b.budget - a.budget
    return 0
  })

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Toast Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl border border-blue-400/20 text-xs flex items-center gap-2"
            >
              <Check size={16} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Share2 className="text-blue-400" size={28} />
              Community Shared Feeds
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Browse, duplicate, and build upon trips shared by experienced travelers worldwide.</p>
          </div>
        </div>

        {/* Search, Filter & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-zinc-950 p-4 rounded-2xl border border-neutral-900">
          {/* Search bar */}
          <div className="md:col-span-2 relative flex items-center bg-black border border-neutral-800 rounded-xl px-3">
            <Search className="text-neutral-500 shrink-0 mr-2" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by itinerary name, creator, or city..."
              className="w-full bg-transparent border-none outline-none py-2 text-xs placeholder-neutral-500"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center bg-black border border-neutral-800 rounded-xl px-3">
            <Filter className="text-neutral-500 shrink-0 mr-2" size={14} />
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Paris">Paris</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Sydney">Sydney</option>
              <option value="Rome">Rome</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center bg-black border border-neutral-800 rounded-xl px-3">
            <ArrowUpDown className="text-neutral-500 shrink-0 mr-2" size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-transparent border-none outline-none py-2 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="Likes">Sort by Likes</option>
              <option value="Duration">Sort by Duration</option>
              <option value="Budget">Sort by Budget</option>
            </select>
          </div>
        </div>

        {/* Public trip cards grid */}
        {filteredFeed.length === 0 ? (
          <div className="bg-zinc-950 border border-neutral-900 rounded-3xl p-16 text-center space-y-3">
            <Compass className="text-neutral-700 mx-auto" size={40} />
            <h3 className="font-bold text-lg text-white">No community trips found</h3>
            <p className="text-neutral-500 text-sm">Try modifying your query options or checking another city filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeed.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/trips/${trip.id}/view`)}
                className="group bg-zinc-950 border border-neutral-900 hover:border-neutral-800 p-5 rounded-3xl cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Photo & author */}
                <div>
                  <div className="h-48 w-full rounded-2xl overflow-hidden relative mb-4">
                    <img 
                      src={trip.image} 
                      alt={trip.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500" 
                    />
                    
                    {/* Author Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                      <img 
                        src={trip.authorAvatar} 
                        alt={trip.authorName} 
                        className="w-5 h-5 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-[10px] font-bold text-white tracking-tight">{trip.authorName}</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-blue-600/90 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={12} />
                      {trip.durationDays} Days
                    </div>
                  </div>

                  <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-blue-400 transition-colors mb-2">
                    {trip.title}
                  </h3>

                  {/* Visited Cities Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mr-1">Visits:</span>
                    {trip.citiesVisited.map((city) => (
                      <span key={city} className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-neutral-300 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-md">
                        <MapPin size={9} className="text-neutral-500" />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer like button & Copy button */}
                <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                  <div className="flex gap-4">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLikeToggle(trip.id, e)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        trip.liked 
                          ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                          : 'bg-transparent border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <Heart size={14} className={trip.liked ? 'fill-current' : ''} />
                      <span>{trip.likes}</span>
                    </button>
                    
                    {/* Copies Counter */}
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold px-2 py-1.5">
                      <Copy size={13} />
                      <span>{trip.copies} Clones</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleCopyTrip(trip, e)}
                    className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Copy size={13} />
                    Copy Trip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
