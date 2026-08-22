import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  DollarSign, 
  Calendar, 
  Clock, 
  Layers,
  MapPin,
  FileText,
  HelpCircle,
  Briefcase
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

const CATEGORY_OPTIONS = ['Transport', 'Stay', 'Activity', 'Meals', 'Misc'] as const

export default function ItineraryBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Trip metadata loaded from parent or localStorage
  const [trip, setTrip] = useState<TripData | null>(null)
  
  // Sections state
  const [sections, setSections] = useState<Section[]>([])
  
  // Custom new activity form state (per section)
  const [newActivityNames, setNewActivityNames] = useState<Record<string, string>>({})
  const [newActivityCosts, setNewActivityCosts] = useState<Record<string, string>>({})
  const [newActivityTimes, setNewActivityTimes] = useState<Record<string, string>>({})

  // Load Trip Data
  useEffect(() => {
    let activeTrip: TripData | null = null
    
    // 1. Try location state
    if (location.state && (location.state as any).tripData) {
      activeTrip = (location.state as any).tripData
    }
    
    // 2. Try specific trip ID in localStorage
    if (!activeTrip && id && id !== 'new') {
      const stored = localStorage.getItem(`globetrotter_trip_${id}`)
      if (stored) activeTrip = JSON.parse(stored)
    }
    
    // 3. Fallback to newest trip
    if (!activeTrip) {
      const storedNew = localStorage.getItem('globetrotter_trip_new')
      if (storedNew) activeTrip = JSON.parse(storedNew)
    }

    // 4. Default mock trip if none exists
    if (!activeTrip) {
      activeTrip = {
        id: id || 'new-trip',
        title: 'Exploring the Magic of Paris',
        city: 'Paris',
        startDate: '2026-09-01',
        endDate: '2026-09-07',
        budget: 3000,
        themes: ['Culture', 'Luxury'],
        activities: [
          { id: 'par-1', name: 'Eiffel Tower Tour', category: 'Sightseeing', cost: 45, duration: '2 hours', timeSlot: '09:00 AM' },
          { id: 'par-2', name: 'Louvre Museum Visit', category: 'Culture', cost: 65, duration: '3 hours', timeSlot: '02:00 PM' }
        ]
      }
    }

    setTrip(activeTrip)

    // Load existing sections for this trip, or create default templates
    const savedSections = localStorage.getItem(`globetrotter_sections_${activeTrip.id}`)
    if (savedSections) {
      setSections(JSON.parse(savedSections))
    } else {
      // Setup initial default sections
      const defaultSections: Section[] = [
        {
          id: 'sec-1',
          name: 'Flight & Travel details',
          category: 'Transport',
          description: 'Outbound and return flight bookings',
          startDate: activeTrip.startDate,
          endDate: activeTrip.startDate,
          budget: Math.round(activeTrip.budget * 0.3),
          activities: []
        },
        {
          id: 'sec-2',
          name: 'Hotel & Stay Accommodations',
          category: 'Stay',
          description: 'Check-in and check-out confirmations',
          startDate: activeTrip.startDate,
          endDate: activeTrip.endDate,
          budget: Math.round(activeTrip.budget * 0.4),
          activities: []
        },
        {
          id: 'sec-3',
          name: 'Sightseeing & Activities',
          category: 'Activity',
          description: 'Key landmarks, museum tours and workshops',
          startDate: activeTrip.startDate,
          endDate: activeTrip.endDate,
          budget: Math.round(activeTrip.budget * 0.2),
          // Pre-populate with the activities selected in Screen 4
          activities: activeTrip.activities || []
        }
      ]
      setSections(defaultSections)
    }
  }, [id, location.state])

  // Save changes to local state & redirect
  const handleSaveAndRedirect = () => {
    if (!trip) return

    // Save sections to localStorage
    localStorage.setItem(`globetrotter_sections_${trip.id}`, JSON.stringify(sections))
    
    // Calculate total actual budget of all sections
    const totalSectionBudget = sections.reduce((sum, sec) => sum + sec.budget, 0)
    
    // Update the trip budget sum and save trip metadata
    const updatedTrip = { ...trip, totalEstimatedBudget: totalSectionBudget }
    localStorage.setItem(`globetrotter_trip_${trip.id}`, JSON.stringify(updatedTrip))
    localStorage.setItem('globetrotter_trip_new', JSON.stringify(updatedTrip))

    // Redirect to Screen 9 (View Itinerary Flowchart)
    navigate(`/trips/${trip.id}/view`)
  }

  // Calculate stats
  const calculateTotalDays = () => {
    if (!trip) return 0
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays || 0
  }

  const liveCalculatedTotalBudget = sections.reduce((sum, section) => sum + section.budget, 0)

  // Section Management
  const addSection = () => {
    if (!trip) return
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      name: `Section ${sections.length + 1}: Custom Section`,
      category: 'Activity',
      description: '',
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: 0,
      activities: []
    }
    setSections([...sections, newSec])
  }

  const updateSectionField = (secId: string, field: keyof Section, value: any) => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return { ...sec, [field]: value }
      }
      return sec
    }))
  }

  const removeSection = (secId: string) => {
    setSections(sections.filter(sec => sec.id !== secId))
  }

  // Activity Management inside Sections
  const handleAddCustomActivity = (secId: string) => {
    const actName = newActivityNames[secId]?.trim() || ''
    const actCost = parseFloat(newActivityCosts[secId]) || 0
    const actTime = newActivityTimes[secId] || '10:00 AM'

    if (!actName) return

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      name: actName,
      category: 'Custom',
      cost: actCost,
      duration: '2 hours',
      timeSlot: actTime
    }

    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          activities: [...sec.activities, newAct]
        }
      }
      return sec
    }))

    // Reset inputs
    setNewActivityNames(prev => ({ ...prev, [secId]: '' }))
    setNewActivityCosts(prev => ({ ...prev, [secId]: '' }))
    setNewActivityTimes(prev => ({ ...prev, [secId]: '' }))
  }

  const handleRemoveActivity = (secId: string, actId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          activities: sec.activities.filter(act => act.id !== actId)
        }
      }
      return sec
    }))
  }

  // Move activities up or down within a section
  const handleMoveActivity = (secId: string, index: number, direction: 'up' | 'down') => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        const newActivities = [...sec.activities]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex >= 0 && targetIndex < newActivities.length) {
          const temp = newActivities[index]
          newActivities[index] = newActivities[targetIndex]
          newActivities[targetIndex] = temp
        }
        return { ...sec, activities: newActivities }
      }
      return sec
    }))
  }

  if (!trip) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Loading trip data...</p>
      </div>
    )
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-32 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-850 pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Briefcase size={14} /> Itinerary Section Builder
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-100">{trip.title}</h1>
              <p className="text-neutral-400 text-sm mt-1 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-neutral-500" /> {trip.city}</span>
                <span className="flex items-center gap-1"><Calendar size={14} className="text-neutral-500" /> {trip.startDate} to {trip.endDate}</span>
                {trip.themes.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Layers size={14} className="text-neutral-500" /> {trip.themes.join(', ')}
                  </span>
                )}
              </p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-5 py-3.5 self-start md:self-auto flex flex-col">
              <span className="text-xs text-neutral-400 font-medium">Allocated Budget</span>
              <span className="text-2xl font-black text-emerald-400">${trip.budget}</span>
            </div>
          </div>

          {/* Section Stack */}
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {sections.map((section, secIndex) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={section.id}
                  className="bg-zinc-950 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group"
                >
                  {/* Decorative tag for Category */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />

                  {/* Section Title, Category, Budget Line */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start mb-6">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Section Name</label>
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSectionField(section.id, 'name', e.target.value)}
                        className="w-full bg-transparent text-lg font-bold border-b border-transparent focus:border-neutral-700 pb-1 focus:outline-none text-neutral-200"
                        placeholder="e.g. Flight Details"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                      <select
                        value={section.category}
                        onChange={(e) => updateSectionField(section.id, 'category', e.target.value as any)}
                        className="w-full bg-black/60 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-neutral-900 text-neutral-300">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-0.5">
                        <DollarSign size={10} /> Estimated Budget
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-bold">$</span>
                        <input
                          type="number"
                          value={section.budget || ''}
                          onChange={(e) => updateSectionField(section.id, 'budget', parseFloat(e.target.value) || 0)}
                          className="w-full bg-black/60 border border-neutral-800 rounded-lg pl-6 pr-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-900/60 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Section Description and Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pt-4 border-t border-neutral-900">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText size={12} /> Notes & Description
                      </label>
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSectionField(section.id, 'description', e.target.value)}
                        placeholder="Add flight numbers, hotel booking reference IDs, etc."
                        rows={2}
                        className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-blue-500/80 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Section Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={section.startDate}
                          onChange={(e) => updateSectionField(section.id, 'startDate', e.target.value)}
                          className="bg-black/60 border border-neutral-800 rounded-lg p-2 text-[10px] text-neutral-200 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="date"
                          value={section.endDate}
                          onChange={(e) => updateSectionField(section.id, 'endDate', e.target.value)}
                          className="bg-black/60 border border-neutral-800 rounded-lg p-2 text-[10px] text-neutral-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Activity Slots (Draggable Chips) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      Scheduled Activity Slots
                    </label>

                    {section.activities.length === 0 ? (
                      <div className="bg-black/20 border border-dashed border-neutral-800 rounded-xl py-6 px-4 text-center">
                        <p className="text-neutral-500 text-xs">No activities scheduled in this section. Add one below!</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {section.activities.map((act, index) => (
                          <motion.div
                            layout
                            key={act.id}
                            className="bg-neutral-900 border border-neutral-800 rounded-full pl-4 pr-2.5 py-1.5 flex items-center gap-3 transition-colors hover:border-neutral-700 max-w-full"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-neutral-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-[200px]">
                                {act.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-semibold text-blue-400 flex items-center gap-0.5">
                                  <Clock size={8} /> {act.timeSlot}
                                </span>
                                <span className="text-[9px] font-extrabold text-emerald-400">${act.cost}</span>
                              </div>
                            </div>

                            {/* Reordering and Actions */}
                            <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
                              <button
                                type="button"
                                onClick={() => handleMoveActivity(section.id, index, 'up')}
                                disabled={index === 0}
                                className={`text-neutral-500 hover:text-neutral-200 p-0.5 disabled:opacity-30 disabled:hover:text-neutral-500 cursor-pointer`}
                              >
                                <ArrowUp size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveActivity(section.id, index, 'down')}
                                disabled={index === section.activities.length - 1}
                                className={`text-neutral-500 hover:text-neutral-200 p-0.5 disabled:opacity-30 disabled:hover:text-neutral-500 cursor-pointer`}
                              >
                                <ArrowDown size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveActivity(section.id, act.id)}
                                className="text-neutral-500 hover:text-red-400 p-0.5 ml-0.5 cursor-pointer"
                              >
                                <Plus size={10} className="rotate-45" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Add custom Activity row */}
                    <div className="mt-3 bg-black/40 border border-neutral-900 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 items-end">
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[9px] text-neutral-500 uppercase tracking-wider">New Activity Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Visit Sacre Coeur"
                          value={newActivityNames[section.id] || ''}
                          onChange={(e) => setNewActivityNames({ ...newActivityNames, [section.id]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-full md:w-28 space-y-1">
                        <label className="text-[9px] text-neutral-500 uppercase tracking-wider">Cost ($)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newActivityCosts[section.id] || ''}
                          onChange={(e) => setNewActivityCosts({ ...newActivityCosts, [section.id]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-full md:w-28 space-y-1">
                        <label className="text-[9px] text-neutral-500 uppercase tracking-wider flex items-center gap-0.5">
                          <Clock size={10} /> Time
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 02:00 PM"
                          value={newActivityTimes[section.id] || ''}
                          onChange={(e) => setNewActivityTimes({ ...newActivityTimes, [section.id]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddCustomActivity(section.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 px-4 rounded-lg text-xs flex items-center gap-1 w-full md:w-auto justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={14} /> Add Slot
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Section Button */}
            <motion.button
              type="button"
              onClick={addSection}
              className="w-full border border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/20 hover:bg-neutral-950/40 rounded-3xl py-5 flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-all font-semibold cursor-pointer"
            >
              <Plus size={16} /> Add another Section
            </motion.button>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-neutral-850 py-4 px-6 md:px-8 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Days</span>
              <span className="text-base font-black text-neutral-200">{calculateTotalDays()} Days</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Sections</span>
              <span className="text-base font-black text-neutral-200">{sections.length} Active</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Live Calculated Budget</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-black ${liveCalculatedTotalBudget > trip.budget ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${liveCalculatedTotalBudget}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">/ ${trip.budget} limit</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveAndRedirect}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/35 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <Save size={16} />
            Save & View Itinerary Flow
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
