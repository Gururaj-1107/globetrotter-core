import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  Plus, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  Compass
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import voyaraBanner from '../assets/voyara_travels.jpg'

interface RegionalDestination {
  id: string
  name: string
  country: string
  image: string
  description: string
  badge: string
  popularity: string
}

const REGIONAL_SELECTIONS: RegionalDestination[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'City of Light, fashion, gastronomy, and architectural masterpieces.',
    badge: 'Europe',
    popularity: 'Trending'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    description: 'Ultramodern neon skyscrapers juxtaposed with historic temples.',
    badge: 'Asia',
    popularity: 'Popular'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'The cultural capital, home to broadway, skyscrapers, and Central Park.',
    badge: 'North America',
    popularity: 'Must Visit'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    description: 'A colossal empire preserved in stone, pasta, and vibrant piazzas.',
    badge: 'Europe',
    popularity: 'Classic'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic harborside Opera House, gorgeous beaches, and warm sunshine.',
    badge: 'Oceania',
    popularity: 'Top Beach'
  }
]

interface StoredTrip {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
}

const DEFAULT_PREVIOUS_TRIPS: StoredTrip[] = [
  {
    id: 'prev-1',
    title: 'Autumn in Kyoto',
    city: 'Kyoto',
    startDate: '2025-10-10',
    endDate: '2025-10-17',
    budget: 2500,
    themes: ['Culture', 'Adventure']
  },
  {
    id: 'prev-2',
    title: 'Rome & Amalfi Escape',
    city: 'Rome',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    budget: 4500,
    themes: ['Luxury', 'Food']
  }
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Popularity')

  // Get previous trips from local storage, fallback to defaults
  const [previousTrips] = useState<StoredTrip[]>(() => {
    const list: StoredTrip[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('globetrotter_trip_') && key !== 'globetrotter_trip_new') {
        try {
          const trip = JSON.parse(localStorage.getItem(key) || '')
          list.push(trip)
        } catch (e) {
          // ignore
        }
      }
    }
    return list.length > 0 ? list : DEFAULT_PREVIOUS_TRIPS
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/search')
    }
  }

  const handleQuickAddTrip = (destination: RegionalDestination) => {
    navigate('/trips/create', { state: { prefilledCity: destination.name } })
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Header Banner */}
        <section className="relative h-[65vh] flex flex-col justify-end pb-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={voyaraBanner} 
              alt="Voyara Travels Banner" 
              className="w-full h-full object-cover opacity-85 scale-100 transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center w-full">
            {/* Global Search Bar Overlay */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto"
            >
              <div className="relative flex flex-col md:flex-row gap-2 bg-neutral-900/90 backdrop-blur-xl p-2 rounded-2xl md:rounded-full border border-white/10 shadow-2xl">
                <div className="flex-grow flex items-center px-4 py-2">
                  <Search className="text-neutral-500 mr-3 shrink-0" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city, activity, or category (e.g. food, hike)..."
                    className="w-full bg-transparent text-white placeholder-neutral-500 border-none outline-none focus:ring-0 text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-1.5 px-2 md:px-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={`p-2 rounded-full border transition-colors flex items-center gap-1.5 text-xs ${
                      filterOpen ? 'bg-blue-500 border-blue-500 text-white' : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Filter size={14} />
                    <span className="hidden md:inline">Filters</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sorts = ['Popularity', 'Price', 'Rating']
                      const next = sorts[(sorts.indexOf(selectedSort) + 1) % sorts.length]
                      setSelectedSort(next)
                    }}
                    className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <ArrowUpDown size={14} />
                    <span className="hidden md:inline">Sort: {selectedSort}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-grow md:flex-initial bg-white hover:bg-neutral-200 text-black font-semibold px-6 py-2 rounded-full transition-all text-sm flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    Explore
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Dynamic Filter Dropdowns inside banner */}
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-250"
                >
                  <div>
                    <label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Group By</label>
                    <select 
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="mt-1.5 w-full bg-black border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="All">All Regions</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="North America">North America</option>
                      <option value="Oceania">Oceania</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Category</label>
                    <div className="mt-1.5 flex gap-2 flex-wrap">
                      {['Food', 'Adventure', 'Sightseeing'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className="bg-black hover:bg-neutral-800 border border-neutral-800 text-[10px] px-2 py-1.5 rounded-md"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Search Options</label>
                    <p className="text-[11px] text-neutral-400 mt-1">Filtering by active queries, instant search is enabled on our full directory.</p>
                  </div>
                </motion.div>
              )}
            </motion.form>
          </div>
        </section>

        {/* Top Regional Selections */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Compass size={22} className="text-blue-400" />
                Top Regional Selections
              </h2>
              <p className="text-neutral-400 text-sm">Handpicked top-rated global destinations ready to copy</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 group"
            >
              Browse All
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {REGIONAL_SELECTIONS.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-neutral-955 rounded-2xl overflow-hidden border border-neutral-900 hover:border-neutral-800 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="h-44 w-full relative overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    {dest.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[10px] px-2 py-0.5 rounded-md text-amber-400 border border-amber-500/30 font-semibold">
                    {dest.popularity}
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      <MapPin size={14} className="text-neutral-500 shrink-0" />
                      {dest.name}, {dest.country}
                    </h3>
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleQuickAddTrip(dest)}
                    className="mt-4 w-full bg-neutral-900 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-all text-xs flex items-center justify-center gap-1 border border-neutral-800 hover:border-blue-600 cursor-pointer"
                  >
                    <Plus size={14} />
                    Plan Trip Here
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Previous Trips Card Gallery */}
        <section className="py-12 bg-neutral-950 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={22} className="text-neutral-400" />
              Previous Trips & Highlights
            </h2>
            
            {previousTrips.length === 0 ? (
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-10 text-center">
                <p className="text-neutral-500 text-sm">No previous trips recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {previousTrips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ y: -4 }}
                    className="bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
                    onClick={() => navigate(`/trips/${trip.id}/view`)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full uppercase">
                          {trip.city}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">${trip.budget}</span>
                      </div>
                      <h3 className="font-bold text-white text-base line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">{trip.title}</h3>
                      <p className="text-neutral-500 text-[11px] flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <div className="flex gap-1">
                        {trip.themes?.slice(0, 2).map(theme => (
                          <span key={theme} className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-blue-400 font-medium flex items-center gap-0.5 group-hover:underline">
                        View
                        <ChevronRight size={10} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating '+ Plan a trip' Primary CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/trips/create')}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:from-blue-500 hover:to-cyan-400 transition-all border border-blue-400/30 cursor-pointer"
      >
        <Plus size={20} className="stroke-[3]" />
        <span>Plan a trip</span>
      </motion.button>

      <Footer />
    </div>
  )
}
