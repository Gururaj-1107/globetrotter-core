import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search as SearchIcon, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Plus, 
  X, 
  Compass, 
  Check, 
  Info,
  Calendar
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api } from '../services/api'

interface Activity {
  id: string
  name: string
  city: string
  category: 'Food' | 'Sightseeing' | 'Adventure' | 'Nightlife' | 'Culture' | 'Stay' | 'Transport'
  cost: number
  duration: string
  rating: number
  image: string
  description: string
}

interface StoredTrip {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
  activities: any[]
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // State for search query
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  
  // Dynamic Activities list
  const [activitiesList, setActivitiesList] = useState<Activity[]>([])
  
  // State for Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Food', 'Sightseeing', 'Adventure', 'Nightlife', 'Culture', 'Stay', 'Transport'])
  const [priceRange, setPriceRange] = useState<number>(300)
  const [selectedDuration, setSelectedDuration] = useState<string>('All')
  const [selectedRating, setSelectedRating] = useState<number>(0)
  
  // Add to Trip Modal States
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [userTrips, setUserTrips] = useState<StoredTrip[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Fetch activities from API / mockData store
  useEffect(() => {
    const loadActivities = async () => {
      const data = await api.getActivities()
      const mapped = data.map(act => ({
        id: act.id,
        name: act.name,
        city: act.cityId.charAt(0).toUpperCase() + act.cityId.slice(1),
        category: act.category as any,
        cost: act.cost,
        duration: act.duration,
        rating: act.rating,
        image: act.imageUrl,
        description: act.description
      }))
      setActivitiesList(mapped)
    }
    loadActivities()
  }, [])

  // Load user trips from localStorage
  useEffect(() => {
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
    setUserTrips(list)
    if (list.length > 0) {
      setSelectedTripId(list[0].id)
    }
  }, [selectedActivity])

  // Sync search query parameter to state
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) {
      setQuery(q)
    }
  }, [searchParams])

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  // Filter Catalog dynamically
  const filteredActivities = useMemo(() => {
    return activitiesList.filter(activity => {
      // 1. Text Query Filter
      const qLower = query.toLowerCase()
      const matchesQuery = 
        activity.name.toLowerCase().includes(qLower) ||
        activity.city.toLowerCase().includes(qLower) ||
        activity.category.toLowerCase().includes(qLower) ||
        activity.description.toLowerCase().includes(qLower)

      // 2. Category Checkboxes
      const matchesCategory = selectedCategories.includes(activity.category)

      // 3. Price Filter
      const matchesPrice = activity.cost <= priceRange

      // 4. Rating Filter
      const matchesRating = activity.rating >= selectedRating

      // 5. Duration Filter
      let matchesDuration = true
      if (selectedDuration !== 'All') {
        const hrs = parseFloat(activity.duration)
        if (selectedDuration === 'Short') {
          matchesDuration = hrs <= 2
        } else if (selectedDuration === 'Medium') {
          matchesDuration = hrs > 2 && hrs <= 4
        } else if (selectedDuration === 'Long') {
          matchesDuration = hrs > 4
        }
      }

      return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesDuration
    })
  }, [query, activitiesList, selectedCategories, priceRange, selectedRating, selectedDuration])

  // Add selected activity to a trip
  const handleAddToTrip = () => {
    if (!selectedActivity) return

    if (!selectedTripId) {
      // Prompt user to create a trip first
      alert('Please create a trip first! Redirecting...')
      navigate('/trips/create')
      return
    }

    const tripKey = `globetrotter_trip_${selectedTripId}`
    const stored = localStorage.getItem(tripKey)
    if (stored) {
      try {
        const trip: StoredTrip = JSON.parse(stored)
        if (!trip.activities) trip.activities = []
        
        // Avoid duplicates
        if (trip.activities.some(act => act.id === selectedActivity.id)) {
          showToast(`"${selectedActivity.name}" is already in "${trip.title}"!`)
          setSelectedActivity(null)
          return
        }

        // Add
        trip.activities.push({
          id: selectedActivity.id,
          name: selectedActivity.name,
          category: selectedActivity.category,
          cost: selectedActivity.cost,
          duration: selectedActivity.duration,
          timeSlot: '10:00 AM' // default time slot
        })

        // Re-save
        localStorage.setItem(tripKey, JSON.stringify(trip))
        showToast(`Successfully added "${selectedActivity.name}" to "${trip.title}"!`)
      } catch (e) {
        showToast('Error saving activity.')
      }
    }
    setSelectedActivity(null)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl border border-blue-400/20 text-sm flex items-center gap-2"
            >
              <Check size={18} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Compass className="text-blue-400" size={28} />
            Explore Activities & Excursions
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Discover sightseeing, dining, nightlife, and adventure across global hot spots.</p>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-8 bg-zinc-950 border border-neutral-800 p-2 rounded-2xl flex items-center shadow-xl">
          <SearchIcon className="text-neutral-500 ml-3 shrink-0" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchParams(e.target.value ? { q: e.target.value } : {})
            }}
            placeholder="Type city (e.g. Paris, Tokyo, Sydney) or activity name..."
            className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-2.5 text-white placeholder-neutral-500 text-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSearchParams({})
              }}
              className="text-neutral-500 hover:text-white p-2"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Left 1/4) */}
          <div className="lg:col-span-1 bg-zinc-950 border border-neutral-850 rounded-3xl p-6 shadow-xl space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-bold text-base text-white">Refine Search</h2>
              <button 
                onClick={() => {
                  setSelectedCategories(['Food', 'Sightseeing', 'Adventure', 'Nightlife'])
                  setPriceRange(150)
                  setSelectedDuration('All')
                  setSelectedRating(0)
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Category</label>
              <div className="flex flex-col gap-2.5">
                {['Food', 'Sightseeing', 'Adventure', 'Nightlife'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4.5 h-4.5 bg-neutral-900 border-neutral-800 rounded text-blue-600 focus:ring-blue-600/30"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
                <span>Max Cost</span>
                <span className="text-blue-400 font-bold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>$10</span>
                <span>$300</span>
              </div>
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'All', value: 'All' },
                  { label: '≤ 2 hours', value: 'Short' },
                  { label: '2-4 hours', value: 'Medium' },
                  { label: '> 4 hours', value: 'Long' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedDuration(item.value)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                      selectedDuration === item.value
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Min Rating</label>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      selectedRating === stars
                        ? 'bg-amber-500 border-amber-500 text-black font-semibold'
                        : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {stars === 0 ? 'Any' : (
                      <>
                        {stars}
                        <Star size={10} className="fill-current" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results List / Grid (Right 3/4) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-2xl text-xs text-neutral-400">
              <span>Showing <strong>{filteredActivities.length}</strong> matching activities</span>
              <span>Catalog size: 16 listings</span>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="bg-zinc-950 border border-neutral-900 rounded-3xl p-16 text-center space-y-4">
                <Compass className="text-neutral-700 mx-auto" size={48} />
                <h3 className="font-bold text-lg text-white">No results match your criteria</h3>
                <p className="text-neutral-500 text-sm max-w-sm mx-auto">Try resetting filters, searching for a different destination, or shortening your query.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredActivities.map((act) => (
                  <motion.div
                    key={act.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-zinc-950 border border-neutral-900 hover:border-neutral-800 p-4 rounded-3xl flex flex-col md:flex-row gap-5 shadow-lg transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-44 h-36 shrink-0 rounded-2xl overflow-hidden relative">
                      <img 
                        src={act.image} 
                        alt={act.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[9px] px-2 py-0.5 rounded font-bold text-neutral-300 border border-white/5 uppercase">
                        {act.category}
                      </span>
                    </div>

                    {/* Metadata Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <h3 className="font-bold text-base md:text-lg text-white group-hover:text-blue-400 transition-colors">
                            {act.name}
                          </h3>
                          <div className="flex items-center gap-1.5 shrink-0 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-xl">
                            <span className="text-emerald-400 font-bold text-sm">${act.cost}</span>
                            <span className="text-[10px] text-neutral-500 font-medium">/ person</span>
                          </div>
                        </div>

                        <p className="text-neutral-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Bottom row attributes & Action button */}
                      <div className="mt-4 pt-3 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                          <span className="flex items-center gap-1 font-semibold text-neutral-300">
                            <MapPin size={13} className="text-neutral-500" />
                            {act.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-neutral-500" />
                            {act.duration}
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                            <Star size={13} className="fill-current text-amber-500" />
                            {act.rating}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedActivity(act)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 shadow-md hover:shadow-blue-600/20 cursor-pointer"
                        >
                          <Plus size={14} className="stroke-[2.5]" />
                          Add to Trip
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add to Trip Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-950 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl z-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  Select Target Trip
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Add <strong>{selectedActivity.name}</strong> (${selectedActivity.cost}) to one of your active itineraries.
                </p>
              </div>

              {userTrips.length === 0 ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-2xl flex items-start gap-2.5 text-left">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    <p className="text-xs leading-normal">
                      You don't have any active travel plans right now. Plan your first trip to schedule this activity.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedActivity(null)
                      navigate('/trips/create')
                    }}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl transition-all text-sm cursor-pointer shadow"
                  >
                    Start Planning a Trip
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Choose Active Trip</label>
                    <select
                      value={selectedTripId}
                      onChange={(e) => setSelectedTripId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {userTrips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedActivity(null)}
                      className="flex-1 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 font-semibold py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToTrip}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-lg shadow-blue-600/20"
                    >
                      Confirm Add
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
