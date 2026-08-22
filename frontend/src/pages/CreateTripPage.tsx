import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, DollarSign, Tag, ArrowRight, Check, Compass } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

// Mock Data for Cities and their corresponding Activities Suggestions
interface ActivitySuggestion {
  id: string
  name: string
  category: 'Sightseeing' | 'Adventure' | 'Food' | 'Culture'
  cost: number
  duration: string
  image: string
  description: string
}

const citySuggestions: Record<string, ActivitySuggestion[]> = {
  'Paris': [
    { id: 'par-1', name: 'Eiffel Tower Summit Access', category: 'Sightseeing', cost: 45, duration: '2 hours', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80', description: 'Experience breathtaking panoramic views from the top of Paris.' },
    { id: 'par-2', name: 'Louvre Museum Guided Tour', category: 'Culture', cost: 65, duration: '3 hours', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80', description: 'Skip the line and explore the world\'s largest art museum.' },
    { id: 'par-3', name: 'Seine River Cruise & Dinner', category: 'Food', cost: 95, duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80', description: 'Dine on classic French cuisine while cruising past illuminated monuments.' },
    { id: 'par-4', name: 'Montmartre Artists & Cafés Walk', category: 'Culture', cost: 25, duration: '2 hours', image: 'https://images.unsplash.com/photo-1509060464153-4466739f78ad?auto=format&fit=crop&w=500&q=80', description: 'Stroll through bohemian streets and visit the stunning Sacré-Cœur.' },
    { id: 'par-5', name: 'Catacombs of Paris Exploration', category: 'Adventure', cost: 35, duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80', description: 'Explore the mysterious underground ossuaries holding millions of skeletons.' }
  ],
  'Tokyo': [
    { id: 'tok-1', name: 'Shibuya Crossing & Foodie Walk', category: 'Food', cost: 55, duration: '3 hours', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80', description: 'Navigate the world\'s busiest crossing and taste local yakitori.' },
    { id: 'tok-2', name: 'Senso-ji Temple & Asakusa Tour', category: 'Culture', cost: 20, duration: '2 hours', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80', description: 'Discover Tokyo\'s oldest Buddhist temple and its historic streets.' },
    { id: 'tok-3', name: 'Mount Fuji Day Trip & Cable Car', category: 'Adventure', cost: 120, duration: '9 hours', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80', description: 'Get scenic views of Mt. Fuji, visit Lake Ashi, and ride the ropeway.' },
    { id: 'tok-4', name: 'Robot Restaurant Digital Show', category: 'Culture', cost: 75, duration: '2 hours', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=500&q=80', description: 'Witness neon lights, high-tech dance routines, and giant robots.' },
    { id: 'tok-5', name: 'Ghibli Museum Visit', category: 'Culture', cost: 30, duration: '3 hours', image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=500&q=80', description: 'Immerse yourself in the whimsical art and animation of Studio Ghibli.' }
  ],
  'New York': [
    { id: 'nyc-1', name: 'Empire State Building Observatory', category: 'Sightseeing', cost: 48, duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80', description: 'Take in 360-degree views of the Manhattan skyline.' },
    { id: 'nyc-2', name: 'Broadway Show Tickets (Standard)', category: 'Culture', cost: 110, duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', description: 'Experience an award-winning musical in the heart of the Theater District.' },
    { id: 'nyc-3', name: 'Central Park Bicycle Rental & Tour', category: 'Adventure', cost: 30, duration: '2 hours', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80', description: 'Cycle past Bethesda Fountain, Strawberry Fields, and Belvedere Castle.' },
    { id: 'nyc-4', name: 'Chelsea Market & High Line Food Tour', category: 'Food', cost: 60, duration: '3 hours', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=500&q=80', description: 'Savor gourmet bites along Manhattan\'s elevated parkway.' }
  ],
  'Rome': [
    { id: 'rom-1', name: 'Colosseum & Roman Forum Fast Track', category: 'Culture', cost: 38, duration: '3 hours', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80', description: 'Step back in time to the arena of gladiators and the ancient center of Rome.' },
    { id: 'rom-2', name: 'Vatican Museums & Sistine Chapel', category: 'Culture', cost: 42, duration: '4 hours', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=500&q=80', description: 'Admire Michelangelo\'s masterpiece and the treasures of the Holy See.' },
    { id: 'rom-3', name: 'Pasta & Tiramisu Making Class', category: 'Food', cost: 70, duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80', description: 'Learn to roll fresh pasta and whip up dessert from a local chef.' },
    { id: 'rom-4', name: 'Trevi Fountain & Piazza Navona Walk', category: 'Sightseeing', cost: 15, duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=500&q=80', description: 'Toss a coin into the fountain and enjoy the Baroque squares.' }
  ],
  'Sydney': [
    { id: 'syd-1', name: 'Sydney Opera House Behind-the-Scenes', category: 'Culture', cost: 50, duration: '2 hours', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80', description: 'Explore the history and architecture of this world-famous landmark.' },
    { id: 'syd-2', name: 'Bondi to Coogee Coastal Walk', category: 'Adventure', cost: 10, duration: '3 hours', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=500&q=80', description: 'A breathtaking hike along Australia\'s picturesque cliffs and beaches.' },
    { id: 'syd-3', name: 'Harbour Bridge Climb (Standard)', category: 'Adventure', cost: 195, duration: '3.5 hours', image: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=500&q=80', description: 'Scale the iconic bridge for unbeatable views of Sydney Harbour.' },
    { id: 'syd-4', name: 'Seafood Platter at Fish Market', category: 'Food', cost: 40, duration: '1 hour', image: 'https://images.unsplash.com/photo-1534080391025-09795d197a5b?auto=format&fit=crop&w=500&q=80', description: 'Enjoy fresh oysters, lobsters, and prawns by the water.' }
  ]
}

const defaultSuggestions: ActivitySuggestion[] = [
  { id: 'gen-1', name: 'Local Historical Walking Tour', category: 'Culture', cost: 20, duration: '2 hours', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80', description: 'Uncover hidden histories and local architecture with an expert guide.' },
  { id: 'gen-2', name: 'Fine Dining / Gastronomy Experience', category: 'Food', cost: 80, duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80', description: 'Savor seasonal local delicacies in a curated dinner menu.' },
  { id: 'gen-3', name: 'Sunset Scenic Hike / Vantage Point', category: 'Adventure', cost: 15, duration: '3 hours', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=500&q=80', description: 'Trek to the highest local point to capture panoramic sunset views.' },
  { id: 'gen-4', name: 'Local Souvenir & Market Shopping', category: 'Sightseeing', cost: 10, duration: '2 hours', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80', description: 'Explore bustling merchant alleys and find authentic handcrafted goods.' }
]

const themes = ['Solo', 'Family', 'Adventure', 'Luxury']
const popularCities = ['Paris', 'Tokyo', 'New York', 'Rome', 'Sydney']

export default function CreateTripPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Form States
  const [title, setTitle] = useState('')
  const [selectedCity, setSelectedCity] = useState('Paris')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  
  // Activities state
  const [activities, setActivities] = useState<ActivitySuggestion[]>([])
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])

  // Load suggestions when city changes
  useEffect(() => {
    const list = citySuggestions[selectedCity] || defaultSuggestions
    setActivities(list)
    setSelectedActivityIds([]) // Reset selections when city changes
  }, [selectedCity])

  const handleThemeToggle = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme))
    } else {
      setSelectedThemes([...selectedThemes, theme])
    }
  }

  const handleActivityToggle = (id: string) => {
    if (selectedActivityIds.includes(id)) {
      setSelectedActivityIds(selectedActivityIds.filter((aid) => aid !== id))
    } else {
      setSelectedActivityIds([...selectedActivityIds, id])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a trip title.')
      return
    }
    if (!startDate || !endDate) {
      alert('Please select start and end dates.')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be prior to end date.')
      return
    }

    const selectedActivitiesFull = activities.filter((act) => selectedActivityIds.includes(act.id))
    
    // Create the trip payload
    const currentUserId = user?.id || 'usr-demo-wanderer'
    const newTripId = `trip-${Date.now()}`
    const tripData = {
      id: newTripId,
      userId: currentUserId,
      title,
      city: selectedCity,
      startDate,
      endDate,
      budget: parseFloat(budget) || 0,
      themes: selectedThemes,
      activities: selectedActivitiesFull.map((act) => ({
        id: act.id,
        name: act.name,
        category: act.category,
        cost: act.cost,
        duration: act.duration,
        timeSlot: '09:00 AM' // default timeslot
      }))
    }

    // Persist to localStorage
    localStorage.setItem('globetrotter_trip_new', JSON.stringify(tripData))
    localStorage.setItem(`globetrotter_trip_${tripData.id}`, JSON.stringify(tripData))

    // Navigate to builder
    navigate('/trips/new/builder', { state: { tripData } })
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4"
            >
              <Compass size={28} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent"
            >
              Plan Your Next Adventure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-neutral-400 mt-2 max-w-xl mx-auto"
            >
              Configure details, select highlights, and design the ultimate itinerary.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form Section (Left 1/3) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 bg-neutral-905 bg-zinc-950 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold text-neutral-200 border-b border-neutral-800 pb-3">Trip Specifications</h2>
              
              {/* Trip Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block">Trip Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Summer getaway in Paris"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all"
                />
              </div>

              {/* Destination Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block flex items-center gap-1">
                  <MapPin size={12} /> Destination
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all cursor-pointer"
                  >
                    {popularCities.map((city) => (
                      <option key={city} value={city} className="bg-neutral-900 text-white">
                        {city}
                      </option>
                    ))}
                    <option value="London" className="bg-neutral-900 text-white">London</option>
                    <option value="Bali" className="bg-neutral-900 text-white">Bali</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block flex items-center gap-1">
                    <Calendar size={12} /> Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block flex items-center gap-1">
                    <Calendar size={12} /> End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Trip Budget */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block flex items-center gap-1">
                  <DollarSign size={12} /> Total Budget ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all"
                />
              </div>

              {/* Themes Multi-Select */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400 block flex items-center gap-1">
                  <Tag size={12} /> Trip Themes
                </label>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme) => {
                    const isSelected = selectedThemes.includes(theme)
                    return (
                      <button
                        type="button"
                        key={theme}
                        onClick={() => handleThemeToggle(theme)}
                        className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 font-medium cursor-pointer ${
                          isSelected
                            ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-black/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                        }`}
                      >
                        {theme}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Continue to Itinerary Builder
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Suggestions Grid Section (Right 2/3) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                    Must-Visit Places in {selectedCity}
                  </h2>
                  <p className="text-neutral-400 text-sm mt-0.5">Toggle suggestions to automatically inject them as itinerary slots.</p>
                </div>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full font-semibold">
                  {selectedActivityIds.length} Added
                </span>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {activities.map((act, index) => {
                    const isAdded = selectedActivityIds.includes(act.id)
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        key={act.id}
                        className={`group bg-neutral-900/40 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                          isAdded
                            ? 'border-blue-500 bg-neutral-900/80 shadow-lg shadow-blue-500/5'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {/* Thumbnail Card */}
                        <div>
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={act.image}
                              alt={act.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Category Tag overlay */}
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/15">
                              {act.category}
                            </div>
                            {/* Cost Tag overlay */}
                            <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-white border border-blue-400/20">
                              ${act.cost}
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-neutral-100 text-base leading-tight group-hover:text-white transition-colors">
                                {act.name}
                              </h3>
                            </div>
                            <p className="text-neutral-400 text-xs line-clamp-2">
                              {act.description}
                            </p>
                          </div>
                        </div>

                        {/* Footer button inside card */}
                        <div className="p-4 pt-0 border-t border-neutral-800 flex items-center justify-between gap-4 mt-2">
                          <span className="text-xs text-neutral-400 font-medium">{act.duration}</span>
                          <button
                            type="button"
                            onClick={() => handleActivityToggle(act.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-extrabold'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={12} />
                                Added
                              </>
                            ) : (
                              'Add to Itinerary'
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
