import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Search, 
  Filter, 
  Grid, 
  ArrowUpDown, 
  DollarSign, 
  Clock, 
  Compass, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Activity {
  id: string
  name: string
  category: string
  cost: number
  duration: string
  timeSlot: string
  sectionName?: string
  sectionCategory?: string
  dayNumber?: number
}

interface Section {
  id: string
  name: string
  category: 'Transport' | 'Stay' | 'Activity' | 'Meals' | 'Misc'
  description: string
  startDate: string
  endDate: string
  budget: number
  activities: Activity[]
}

interface TripData {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
  activities: Activity[]
}

export default function ItineraryViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Load data states
  const [trip, setTrip] = useState<TripData | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  
  // Interactive UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [groupBy, setGroupBy] = useState<'Day' | 'Category' | 'Cost'>('Day')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Time' | 'Cost' | 'Name'>('Time')

  // Notification Modals
  const [showShareModal, setShowShareModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Load Itinerary from LocalStorage
  useEffect(() => {
    let activeTrip: TripData | null = null
    let activeSections: Section[] = []

    if (id) {
      const storedTrip = localStorage.getItem(`globetrotter_trip_${id}`)
      if (storedTrip) activeTrip = JSON.parse(storedTrip)

      const storedSections = localStorage.getItem(`globetrotter_sections_${id}`)
      if (storedSections) activeSections = JSON.parse(storedSections)
    }

    // Fallbacks if no data found
    if (!activeTrip) {
      const storedNew = localStorage.getItem('globetrotter_trip_new')
      if (storedNew) activeTrip = JSON.parse(storedNew)
    }

    if (!activeTrip) {
      activeTrip = {
        id: 'new',
        title: 'Exploring the Magic of Paris',
        city: 'Paris',
        startDate: '2026-09-01',
        endDate: '2026-09-07',
        budget: 3000,
        themes: ['Culture', 'Adventure'],
        activities: []
      }
    }

    if (activeSections.length === 0) {
      // Setup some default mock sections if none were built
      activeSections = [
        {
          id: 'sec-1',
          name: 'Flight details',
          category: 'Transport',
          description: 'Outbound flight details',
          startDate: activeTrip.startDate,
          endDate: activeTrip.startDate,
          budget: 800,
          activities: [
            { id: 'act-1', name: 'Fly to Charles de Gaulle Airport', category: 'Transport', cost: 650, duration: '8 hours', timeSlot: '08:00 AM' }
          ]
        },
        {
          id: 'sec-2',
          name: 'Hotel Accommodations',
          category: 'Stay',
          description: 'Boutique Hotel in Montmartre',
          startDate: activeTrip.startDate,
          endDate: activeTrip.endDate,
          budget: 1200,
          activities: [
            { id: 'act-2', name: 'Check-in at Hotel Amour', category: 'Stay', cost: 150, duration: '1 hour', timeSlot: '03:00 PM' }
          ]
        },
        {
          id: 'sec-3',
          name: 'Sightseeing & Tours',
          category: 'Activity',
          description: 'Monuments and history',
          startDate: activeTrip.startDate,
          endDate: activeTrip.endDate,
          budget: 600,
          activities: [
            { id: 'act-3', name: 'Eiffel Tower Tour', category: 'Activity', cost: 45, duration: '2 hours', timeSlot: '09:00 AM' },
            { id: 'act-4', name: 'Louvre Museum Visit', category: 'Activity', cost: 65, duration: '3 hours', timeSlot: '02:00 PM' }
          ]
        }
      ]
    }

    setTrip(activeTrip)
    setSections(activeSections)
  }, [id])

  // Extract flat list of activities with computed metadata (Day, Section Category, etc.)
  const getProcessedActivities = (): Activity[] => {
    if (!trip) return []

    const list: Activity[] = []

    sections.forEach((section) => {
      // Determine day number relative to trip start
      const tripStart = new Date(trip.startDate)
      const sectionStart = new Date(section.startDate)
      const diffTime = sectionStart.getTime() - tripStart.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      const calculatedDay = diffDays > 0 ? diffDays : 1

      section.activities.forEach((act) => {
        list.push({
          ...act,
          sectionName: section.name,
          sectionCategory: section.category,
          dayNumber: calculatedDay
        })
      })
    })

    return list
  }

  const allActivities = getProcessedActivities()

  // Apply search, filters and sorting
  const filteredActivities = allActivities.filter((act) => {
    // 1. Search Query
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (act.sectionName && act.sectionName.toLowerCase().includes(searchQuery.toLowerCase()))

    // 2. Category Filter
    let matchesCategory = true
    if (filterCategory !== 'All') {
      const actCat = (act.category || act.sectionCategory || 'Misc').toLowerCase()
      const filterCat = filterCategory.toLowerCase()
      if (filterCat === 'activities') {
        matchesCategory = actCat.includes('activ') || actCat.includes('sightseeing') || actCat.includes('culture') || actCat.includes('adventure')
      } else if (filterCat === 'food') {
        matchesCategory = actCat.includes('food') || actCat.includes('meal')
      } else {
        matchesCategory = actCat.includes(filterCat)
      }
    }

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    // 3. Sort Order
    if (sortBy === 'Cost') {
      return b.cost - a.cost
    }
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name)
    }
    // Default: Sort by Time (needs rough parsing if possible, or just alphabetical on timeslots)
    return a.timeSlot.localeCompare(b.timeSlot)
  })

  // Group activities based on state choice
  const getGroupedItems = () => {
    if (groupBy === 'Category') {
      const groups: Record<string, Activity[]> = {}
      filteredActivities.forEach((act) => {
        const cat = act.sectionCategory || 'Misc'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(act)
      })
      return groups
    }

    if (groupBy === 'Cost') {
      const groups: Record<string, Activity[]> = {
        'Budget ($0 - $50)': [],
        'Moderate ($50 - $150)': [],
        'Premium ($150+)': []
      }
      filteredActivities.forEach((act) => {
        if (act.cost <= 50) {
          groups['Budget ($0 - $50)'].push(act)
        } else if (act.cost <= 150) {
          groups['Moderate ($50 - $150)'].push(act)
        } else {
          groups['Premium ($150+)'].push(act)
        }
      })
      // remove empty categories
      return Object.keys(groups).reduce((acc, key) => {
        if (groups[key].length > 0) acc[key] = groups[key]
        return acc
      }, {} as Record<string, Activity[]>)
    }

    // Default: Group by Day
    const groups: Record<string, Activity[]> = {}
    filteredActivities.forEach((act) => {
      const dayKey = `Day ${act.dayNumber || 1}`
      if (!groups[dayKey]) groups[dayKey] = []
      groups[dayKey].push(act)
    })
    return groups
  }

  const groupedData = getGroupedItems()

  // Calculate actual costs spent per category
  const getCategoryExpenses = () => {
    const expenses = {
      Transport: 0,
      Stay: 0,
      Activities: 0,
      Food: 0,
      Misc: 0
    }

    allActivities.forEach((act) => {
      const category = (act.category || act.sectionCategory || 'Misc').toLowerCase()
      if (category.includes('trans')) {
        expenses.Transport += act.cost
      } else if (category.includes('stay') || category.includes('hotel')) {
        expenses.Stay += act.cost
      } else if (category.includes('activ') || category.includes('sight') || category.includes('culture') || category.includes('advent')) {
        expenses.Activities += act.cost
      } else if (category.includes('food') || category.includes('meal')) {
        expenses.Food += act.cost
      } else {
        expenses.Misc += act.cost
      }
    })

    return expenses
  }

  const categoryExpenses = getCategoryExpenses()
  const totalActualExpense = Object.values(categoryExpenses).reduce((a, b) => a + b, 0)

  // Simulation handlers
  const handleExportPDF = () => {
    setExporting(true)
    setTimeout(() => {
      window.print()
      setExporting(false)
    }, 1000)
  }

  const handleShareTrip = () => {
    setShowShareModal(true)
  }

  if (!trip) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Loading itinerary visualization...</p>
      </div>
    )
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation & Info Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(`/trips/${trip.id}/builder`)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Section Builder
            </button>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/35 text-blue-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Finalized Itinerary Flow
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-850 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{trip.title}</h1>
              <p className="text-neutral-400 text-sm mt-1 flex items-center gap-2">
                <MapPin size={14} className="text-neutral-500" /> {trip.city} &bull; {trip.startDate} to {trip.endDate}
              </p>
            </div>
            {/* Top right PDF/Share actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-750 hover:bg-neutral-850 text-neutral-200 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download size={14} />
                {exporting ? 'Generating...' : 'Export PDF'}
              </button>
              <button
                onClick={handleShareTrip}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/30 cursor-pointer"
              >
                <Share2 size={14} />
                Share to Community
              </button>
            </div>
          </div>

          {/* Interactive controls bar */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-neutral-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/80 transition-colors"
              />
            </div>

            {/* Filter, Group and Sort Selectors */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Group By */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-neutral-850 rounded-xl px-3 py-1.5">
                <Grid size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-400 font-medium">Group by:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none font-bold cursor-pointer"
                >
                  <option value="Day" className="bg-neutral-900">Day</option>
                  <option value="Category" className="bg-neutral-900">Category</option>
                  <option value="Cost" className="bg-neutral-900">Cost</option>
                </select>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-neutral-850 rounded-xl px-3 py-1.5">
                <Filter size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-400 font-medium">Filter:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none font-bold cursor-pointer"
                >
                  <option value="All" className="bg-neutral-900">All Categories</option>
                  <option value="Transport" className="bg-neutral-900">Transport</option>
                  <option value="Stay" className="bg-neutral-900">Stay</option>
                  <option value="Activities" className="bg-neutral-900">Activities</option>
                  <option value="Food" className="bg-neutral-900">Food</option>
                  <option value="Misc" className="bg-neutral-900">Misc</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-neutral-850 rounded-xl px-3 py-1.5">
                <ArrowUpDown size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none font-bold cursor-pointer"
                >
                  <option value="Time" className="bg-neutral-900">Time Slot</option>
                  <option value="Cost" className="bg-neutral-900">Cost (High-Low)</option>
                  <option value="Name" className="bg-neutral-900">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Flowchart Timeline Panel (Left 2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {Object.keys(groupedData).length === 0 ? (
                <div className="bg-zinc-950 border border-neutral-850 rounded-3xl py-12 px-6 text-center">
                  <p className="text-neutral-500 text-sm">No activity nodes match the specified search/filter parameters.</p>
                </div>
              ) : (
                Object.keys(groupedData).map((groupTitle, groupIndex) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                    key={groupTitle}
                    className="space-y-4"
                  >
                    {/* Header of Group */}
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
                      <h2 className="text-lg font-bold text-neutral-200">{groupTitle}</h2>
                    </div>

                    {/* Flowchart Node Stack */}
                    <div className="relative pl-6 space-y-5">
                      {/* Central vertical connecting line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500/60 to-neutral-800" />

                      {groupedData[groupTitle].map((act, actIndex) => {
                        const isLast = actIndex === groupedData[groupTitle].length - 1
                        return (
                          <div key={act.id} className="relative group">
                            {/* Directional Connector Arrow inside the line */}
                            {!isLast && (
                              <div className="absolute left-[-20px] bottom-[-22px] z-10 flex items-center justify-center w-5 h-5 text-neutral-700 bg-black rounded-full">
                                <span className="text-[10px] font-bold">↓</span>
                              </div>
                            )}

                            {/* Bullet Circle marker on line */}
                            <div className="absolute left-[-20px] top-4.5 w-2.5 h-2.5 rounded-full border-2 border-neutral-900 bg-neutral-700 group-hover:bg-blue-500 group-hover:border-blue-300 transition-all duration-300" />

                            {/* Node Body */}
                            <div className="bg-zinc-950 border border-neutral-850 hover:border-neutral-750 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 shadow-lg">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {act.category || act.sectionCategory || 'Misc'}
                                  </span>
                                  <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">
                                    <Clock size={10} /> {act.timeSlot} ({act.duration || '2 hours'})
                                  </span>
                                </div>
                                <h3 className="font-bold text-neutral-100 text-sm md:text-base group-hover:text-white transition-colors">
                                  {act.name}
                                </h3>
                                {act.sectionName && (
                                  <p className="text-[10px] text-neutral-500 italic">Part of: {act.sectionName}</p>
                                )}
                              </div>

                              {/* Dedicated Expense Pill Box */}
                              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-2 text-right shadow-sm shrink-0 flex flex-col items-end">
                                <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wide">Expense</span>
                                <span className="text-sm font-black text-emerald-400">${act.cost}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar breakdown panel (Right 1/3) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Financial Recap Card */}
              <div className="bg-zinc-950 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-neutral-200 border-b border-neutral-850 pb-3 flex items-center gap-1.5">
                  <DollarSign size={18} className="text-emerald-400" /> Expense Analysis
                </h2>

                <div className="space-y-4">
                  {/* Estimated budget vs actual breakdown */}
                  <div className="flex justify-between items-center bg-black/40 border border-neutral-900 rounded-xl p-3.5">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Planned Budget</p>
                      <p className="text-xl font-black text-neutral-200">${trip.budget}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Spent Expenses</p>
                      <p className={`text-xl font-black ${totalActualExpense > trip.budget ? 'text-red-400' : 'text-emerald-400'}`}>
                        ${totalActualExpense}
                      </p>
                    </div>
                  </div>

                  {/* Visual Comparison progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-neutral-400">
                      <span>Budget Usage</span>
                      <span>{Math.round((totalActualExpense / trip.budget) * 100) || 0}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-850">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          totalActualExpense > trip.budget 
                            ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        }`}
                        style={{ width: `${Math.min((totalActualExpense / trip.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Categorized progress bars */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Breakdown by Category</h3>
                  
                  {Object.entries(categoryExpenses).map(([category, value]) => {
                    const percentage = totalActualExpense > 0 ? Math.round((value / totalActualExpense) * 100) : 0
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-300 font-medium">{category}</span>
                          <span className="text-neutral-400 font-bold">${value} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-neutral-900">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mini Community Callout */}
              <div className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-blue-500/15 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Compass size={80} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1">
                  <Sparkles size={14} className="text-blue-400 animate-pulse" /> Publish to Feed
                </h3>
                <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                  Make your itinerary public so other globetrotters can copy and adjust it for their travels.
                </p>
                <button
                  type="button"
                  onClick={handleShareTrip}
                  className="mt-4 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-400/25 hover:border-blue-400/40 text-blue-400 hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl w-full transition-all cursor-pointer"
                >
                  Share Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Share Confirmation Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Itinerary Shared Successfully!</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Your trip <strong>{trip.title}</strong> has been shared to the GlobeTrotter community. Other users can now view, review, and clone your itinerary into their personal dashboard.
              </p>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full bg-neutral-900 hover:bg-neutral-850 text-white font-bold py-2.5 rounded-xl border border-neutral-800 text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
