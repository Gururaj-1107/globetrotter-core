import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  Layers, 
  X,
  Compass
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface StoredTrip {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
}

const DEFAULT_CALENDAR_TRIPS: StoredTrip[] = [
  {
    id: 'trip-ongoing-1',
    title: 'Paris Summer Exploration',
    city: 'Paris',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    budget: 3500,
    themes: ['Sightseeing', 'Food']
  },
  {
    id: 'trip-upcoming-1',
    title: 'Tokyo Neon & Temples Escapade',
    city: 'Tokyo',
    startDate: '2026-08-26',
    endDate: '2026-08-30',
    budget: 5000,
    themes: ['Adventure', 'Culture']
  },
  {
    id: 'trip-completed-1',
    title: 'Sydney Coastal Adventure',
    city: 'Sydney',
    startDate: '2026-08-02',
    endDate: '2026-08-07',
    budget: 3000,
    themes: ['Beach', 'Nature']
  }
]

export default function CalendarPage() {
  const navigate = useNavigate()
  
  // Current calendar view month/year
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)) // August 2026
  const [trips, setTrips] = useState<StoredTrip[]>([])
  
  // Hover or Click tooltip preview state
  const [selectedTrip, setSelectedTrip] = useState<StoredTrip | null>(null)

  // Load user trips from localStorage & merge with defaults
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
    // merge
    const merged = [...list]
    DEFAULT_CALENDAR_TRIPS.forEach(mockTrip => {
      if (!merged.some(t => t.id === mockTrip.id)) {
        merged.push(mockTrip)
      }
    })
    setTrips(merged)
  }, [])

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Calendar calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate()
  
  // Day of week of the first day
  const firstDayIndex = new Date(year, month, 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Find if a trip exists on a given day
  const getTripsForDay = (dayNum: number) => {
    const dayDate = new Date(year, month, dayNum)
    return trips.filter(trip => {
      const start = new Date(trip.startDate)
      // Strip hours for correct matching
      start.setHours(0,0,0,0)
      const end = new Date(trip.endDate)
      end.setHours(23,59,59,999)
      return dayDate >= start && dayDate <= end
    })
  }

  // Render Days Grid
  const renderDays = () => {
    const days = []
    
    // Empty cells for alignment before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-zinc-950/20 border border-neutral-900/60 text-transparent pointer-events-none" />)
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const dayTrips = getTripsForDay(d)
      const isToday = d === 22 && month === 7 && year === 2026 // matching today in mock context

      days.push(
        <div 
          key={`day-${d}`} 
          className={`h-24 bg-zinc-950 border border-neutral-900 p-2 flex flex-col justify-between group transition-colors relative hover:bg-neutral-900/40 ${
            isToday ? 'ring-1 ring-blue-500 ring-inset' : ''
          }`}
        >
          {/* Day number */}
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${isToday ? 'text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded' : 'text-neutral-500'}`}>
              {d}
            </span>
          </div>

          {/* Trips Spanning on this Day */}
          <div className="space-y-1 overflow-hidden mt-1.5 flex-grow flex flex-col justify-end">
            {dayTrips.map((trip) => {
              // Color code based on trip index or city
              let bgClass = 'bg-blue-600/20 border-blue-500 text-blue-300'
              if (trip.city === 'Tokyo') bgClass = 'bg-amber-600/20 border-amber-500 text-amber-300'
              if (trip.city === 'Sydney') bgClass = 'bg-emerald-600/20 border-emerald-500 text-emerald-300'

              return (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`w-full text-left text-[9px] font-bold py-1 px-1.5 rounded border border-l-2 truncate block cursor-pointer transition-all ${bgClass} hover:opacity-90`}
                >
                  {trip.title}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <CalendarIcon className="text-blue-400" size={28} />
            Trip Schedule Calendar
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Visualize and track your scheduled trip dates across standard monthly schedules.</p>
        </div>

        {/* Monthly Calendar Widget */}
        <div className="bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-1.5">
              <span>{monthNames[month]}</span>
              <span className="text-neutral-500 font-semibold">{year}</span>
            </h2>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 hover:text-white rounded-xl text-neutral-400 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(2026, 7, 1))}
                className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 hover:text-white rounded-xl text-xs font-semibold text-neutral-400 transition-colors cursor-pointer"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 hover:text-white rounded-xl text-neutral-400 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-px text-center border-b border-neutral-900 pb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>
      </main>

      {/* Tooltip Preview Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrip(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Tooltip Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-950 border border-neutral-850 rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4"
            >
              <button 
                onClick={() => setSelectedTrip(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded uppercase border border-neutral-800 tracking-wide">
                  {selectedTrip.city}
                </span>
                <h3 className="font-extrabold text-lg text-white pt-1">{selectedTrip.title}</h3>
              </div>

              <div className="space-y-2 text-xs text-neutral-400 border-y border-neutral-900 py-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={14} className="text-neutral-500" />
                  <span>{new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-neutral-500" />
                  <span>Allocated Budget: <strong className="text-white">${selectedTrip.budget}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-neutral-500" />
                  <span>Main Destination Hub: {selectedTrip.city}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 border border-neutral-800 hover:border-neutral-700 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  Close Preview
                </button>
                
                <button
                  onClick={() => navigate(`/trips/${selectedTrip.id}/view`)}
                  className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  View Full Details
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
