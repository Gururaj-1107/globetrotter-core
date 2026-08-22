import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Map, 
  Layers, 
  DollarSign, 
  Trash2, 
  ShieldAlert, 
  Check, 
  UserX, 
  TrendingUp, 
  Activity, 
  Sliders,
  Compass
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api } from '../services/api'
import { AdminStats } from '../services/mockData'

interface UserRecord {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE'
  registeredDate: string
}

const INITIAL_USERS: UserRecord[] = [
  { id: 'usr-1', name: 'John Doe', email: 'john.doe@globetrotter.com', role: 'USER', status: 'ACTIVE', registeredDate: '2026-05-12' },
  { id: 'usr-2', name: 'Clara Martin', email: 'clara.m@gmail.com', role: 'ADMIN', status: 'ACTIVE', registeredDate: '2025-11-04' },
  { id: 'usr-3', name: 'Jin Kenji', email: 'jin.kenji@yahoo.co.jp', role: 'USER', status: 'ACTIVE', registeredDate: '2026-02-18' },
  { id: 'usr-4', name: 'Oliver Hughes', email: 'oliver.h@sydney.edu', role: 'USER', status: 'ACTIVE', registeredDate: '2026-07-22' },
  { id: 'usr-5', name: 'Takeshi Sato', email: 'sato.t@gmail.com', role: 'USER', status: 'INACTIVE', registeredDate: '2026-01-30' }
]

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Timeframe selector state
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '1year'>('30days')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch admin stats when timeframe selector changes
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const data = await api.getAdminMetrics(timeRange)
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [timeRange])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to suspend / delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
      showToast('User account successfully suspended.')
    }
  }

  const handleToggleRole = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
        showToast(`User role updated to ${newRole}`)
        return { ...u, role: newRole }
      }
      return u
    }))
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        showToast(`User account set to ${newStatus}`)
        return { ...u, status: newStatus }
      }
      return u
    }))
  }

  // Helper function to build dynamic SVG line charts path
  const getGrowthSvgPath = () => {
    if (!stats) return ''
    const points = stats.userGrowth[timeRange] || []
    if (points.length === 0) return ''
    const minVal = Math.min(...points.map((p) => p.count)) - 50
    const maxVal = Math.max(...points.map((p) => p.count)) + 50
    const height = 150
    const width = 300
    
    return points.map((p, idx) => {
      const x = 15 + (idx / (points.length - 1)) * (width - 30)
      const ratio = (p.count - minVal) / (maxVal - minVal)
      const y = height - 20 - ratio * (height - 40)
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  const getGrowthFillPath = () => {
    const strokePath = getGrowthSvgPath()
    if (!strokePath || !stats) return ''
    const points = stats.userGrowth[timeRange] || []
    const width = 300
    const lastX = 15 + (points.length - 1) / (points.length - 1) * (width - 30)
    return `${strokePath} L ${lastX.toFixed(1)} 140 L 15 140 Z`
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Toast Toast */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl border border-blue-400/20 text-xs flex items-center gap-2">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Heading */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Sliders className="text-blue-400" size={28} />
              Admin Control Center & Analytics
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Monitor user metrics, manage account credentials, and inspect analytics data logs.</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex border border-neutral-900 bg-zinc-950 p-1 rounded-2xl w-fit">
            {(['7days', '30days', '1year'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === tab 
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === '7days' ? '7 Days' : tab === '30days' ? '30 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Accounts', val: stats?.metrics.totalUsers.toLocaleString() || '1,420', diff: '+12% this month', icon: <Users className="text-blue-400" size={22} /> },
            { label: 'Active Trips', val: stats?.metrics.activeTrips.toLocaleString() || '842', diff: '+8% this month', icon: <Map className="text-cyan-400" size={22} /> },
            { label: 'Total Itineraries', val: stats?.metrics.totalItineraries.toLocaleString() || '3,892', diff: '+15% total logs', icon: <Layers className="text-emerald-400" size={22} /> },
            { label: 'Total Budget Vol.', val: `$${((stats?.metrics.revenueBudgetVolume || 1250000) / 1000000).toFixed(2)}M`, diff: 'Average $3.1K/trip', icon: <DollarSign className="text-amber-400" size={22} /> }
          ].map((metric, idx) => (
            <div key={idx} className="bg-zinc-950 border border-neutral-900 rounded-3xl p-5 shadow-xl flex items-center gap-4">
              <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-2xl shrink-0">
                {metric.icon}
              </div>
              <div className="space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">{metric.label}</span>
                <h3 className="font-extrabold text-2xl text-white">{metric.val}</h3>
                <span className="text-emerald-400 font-semibold text-[10px] block">{metric.diff}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Charts & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Popular Cities (Bar Chart) */}
          <div className="lg:col-span-1 bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-1.5">
                <Compass size={18} className="text-blue-400" />
                Popular Destination Hubs
              </h3>
              <p className="text-neutral-500 text-xs mt-0.5">Top cities by active user itineraries</p>
            </div>
            
            {/* SVG Custom Bar Chart */}
            <div className="h-56 w-full flex items-end justify-between px-2 pt-4 relative border-b border-neutral-900 pb-2">
              {(stats?.popularCities || [
                { city: 'Paris', percentage: 78 },
                { city: 'Tokyo', percentage: 92 },
                { city: 'Rome', percentage: 65 },
                { city: 'Sydney', percentage: 54 },
                { city: 'NYC', percentage: 84 }
              ]).map((bar, index) => {
                const colors = [
                  'from-blue-500 to-cyan-400',
                  'from-amber-500 to-orange-400',
                  'from-emerald-500 to-teal-400',
                  'from-rose-500 to-pink-400',
                  'from-violet-500 to-purple-400'
                ]
                return (
                  <div key={index} className="flex flex-col items-center gap-2 group relative w-1/6">
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-neutral-900 border border-neutral-800 text-white text-[9px] px-1.5 py-0.5 rounded font-bold transition-all shadow-lg z-10">
                      {bar.percentage}%
                    </span>
                    
                    <div className="w-6 bg-neutral-900 rounded-t-lg h-40 flex items-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${colors[index % colors.length]} shadow-md`}
                      />
                    </div>
                    
                    <span className="text-[10px] text-neutral-400 font-bold mt-1 truncate w-full text-center">{bar.city}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* User Growth Trend Lines */}
          <div className="lg:col-span-1 bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-1.5">
                <TrendingUp size={18} className="text-blue-400" />
                User Account Registrations
              </h3>
              <p className="text-neutral-500 text-xs mt-0.5">Growth curve over selected timeframe</p>
            </div>

            {/* SVG Trend Line */}
            <div className="h-56 w-full relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">Loading charts...</div>
              ) : (
                <>
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    <line x1="0" y1="30" x2="300" y2="30" stroke="#1f1f1f" strokeDasharray="3,3" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#1f1f1f" strokeDasharray="3,3" />
                    <line x1="0" y1="120" x2="300" y2="120" stroke="#1f1f1f" strokeDasharray="3,3" />

                    {/* Area under line */}
                    <motion.path
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      d={getGrowthFillPath()}
                      fill="url(#gradient-area-dynamic)"
                    />

                    {/* Path line */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                      d={getGrowthSvgPath()}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Points */}
                    {(stats?.userGrowth[timeRange] || []).map((pt, idx, arr) => {
                      const minVal = Math.min(...arr.map(p => p.count)) - 50
                      const maxVal = Math.max(...arr.map(p => p.count)) + 50
                      const x = 15 + (idx / (arr.length - 1)) * (300 - 30)
                      const ratio = (pt.count - minVal) / (maxVal - minVal)
                      const y = 150 - 20 - ratio * 110
                      return (
                        <g key={idx} className="group/dot cursor-pointer">
                          <circle cx={x} cy={y} r="4" fill={idx === arr.length - 1 ? '#06b6d4' : '#3b82f6'} stroke="#000" strokeWidth="1.5" />
                          <circle cx={x} cy={y} r="8" fill="transparent" />
                        </g>
                      )
                    })}

                    <defs>
                      <linearGradient id="gradient-area-dynamic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="flex justify-between text-[9px] text-neutral-500 px-2 mt-2 font-semibold uppercase">
                    {(stats?.userGrowth[timeRange] || []).map((pt, idx) => (
                      <span key={idx}>{pt.label}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top Activities (List Ranking) */}
          <div className="lg:col-span-1 bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-1.5">
                <Activity size={18} className="text-blue-400" />
                Top Activity Bookings
              </h3>
              <p className="text-neutral-500 text-xs mt-0.5">Highest rated activity logs in database</p>
            </div>

            <div className="space-y-4">
              {(stats?.topActivities || [
                { name: 'Eiffel Tower guided climb', city: 'Paris', percentage: 92, count: 184 },
                { name: 'Izakaya food tour crawl', city: 'Tokyo', percentage: 86, count: 160 },
                { name: 'Sydney Harbour bridge climb', city: 'Sydney', percentage: 74, count: 142 },
                { name: 'Vatican / Colosseum pass', city: 'Rome', percentage: 68, count: 110 }
              ]).map((act, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[190px]">{act.name} <span className="text-[9px] text-neutral-500 font-semibold">({act.city})</span></span>
                    <span className="text-neutral-400 text-[10px] font-medium">{act.count} logs</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-850">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${act.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-lg border-b border-neutral-900 pb-3">User Directory Management</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role Badge</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/25 transition-colors">
                    {/* User profile details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="text-neutral-500 text-xs">{u.email}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        u.role === 'ADMIN' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' 
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Reg Date */}
                    <td className="py-3.5 px-4 text-neutral-400">
                      {new Date(u.registeredDate).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        u.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="text-[10px] font-semibold bg-neutral-900 hover:bg-neutral-850 px-2 py-1.5 rounded-lg border border-neutral-800 transition-colors text-neutral-300 cursor-pointer"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="text-[10px] font-semibold bg-neutral-900 hover:bg-neutral-850 px-2 py-1.5 rounded-lg border border-neutral-800 transition-colors text-neutral-300 cursor-pointer"
                      >
                        Suspend/Revive
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
