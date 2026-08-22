import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  BookOpen, 
  Camera, 
  Save, 
  Check, 
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface ProfileData {
  name: string
  email: string
  phone: string
  city: string
  country: string
  bio: string
  avatar: string
}

interface StoredTrip {
  id: string
  title: string
  city: string
  startDate: string
  endDate: string
  budget: number
  themes: string[]
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'John Doe',
  email: 'john.doe@globetrotter.com',
  phone: '+1 (555) 234-5678',
  city: 'San Francisco',
  country: 'United States',
  bio: 'Passionate globetrotter, photographer, and coffee enthusiast. Exploring the world one city at a time.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
}

const PREPLANNED_TRIPS: StoredTrip[] = [
  {
    id: 'pre-1',
    title: 'Ultimate Swiss Alps Escape',
    city: 'Zurich',
    startDate: '2027-02-10',
    endDate: '2027-02-20',
    budget: 4500,
    themes: ['Adventure', 'Luxury']
  },
  {
    id: 'pre-2',
    title: 'Cherry Blossom Tour',
    city: 'Kyoto',
    startDate: '2027-04-01',
    endDate: '2027-04-08',
    budget: 3200,
    themes: ['Culture', 'Sightseeing']
  }
]

const PREVIOUS_TRIPS: StoredTrip[] = [
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

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'PREPLANNED' | 'PREVIOUS'>('PREPLANNED')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form Fields State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('globetrotter_user_profile')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setProfile(data)
        initForm(data)
      } catch (e) {
        initForm(DEFAULT_PROFILE)
      }
    } else {
      initForm(DEFAULT_PROFILE)
    }
  }, [])

  const initForm = (data: ProfileData) => {
    setName(data.name)
    setEmail(data.email)
    setPhone(data.phone)
    setCity(data.city)
    setCountry(data.country)
    setBio(data.bio)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updated = { ...profile, avatar: reader.result as string }
        setProfile(updated)
        localStorage.setItem('globetrotter_user_profile', JSON.stringify(updated))
        showToast('Profile photo updated successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: ProfileData = {
      ...profile,
      name,
      email,
      phone,
      city,
      country,
      bio
    }
    setProfile(updated)
    localStorage.setItem('globetrotter_user_profile', JSON.stringify(updated))
    setIsEditing(false)
    showToast('Profile information saved!')
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Toast Toast */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl border border-blue-400/20 text-xs flex items-center gap-2">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details Box (Left 1/3) */}
          <div className="lg:col-span-1 bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl h-fit relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />

            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              {/* Avatar Upload Container */}
              <div className="relative group w-28 h-28 rounded-full border-4 border-neutral-900 overflow-hidden shadow-2xl">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h2 className="font-extrabold text-xl">{profile.name}</h2>
                <p className="text-neutral-400 text-xs flex items-center justify-center gap-1">
                  <MapPin size={12} className="text-neutral-500" />
                  {profile.city}, {profile.country}
                </p>
              </div>

              <p className="text-neutral-400 text-xs leading-relaxed max-w-xs border-y border-neutral-900 py-3.5 italic">
                "{profile.bio}"
              </p>

              {/* Bio Details */}
              <div className="w-full space-y-2.5 text-left text-xs text-neutral-400 pt-2">
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-neutral-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-neutral-500" />
                  <span>{profile.phone}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isEditing) initForm(profile)
                  setIsEditing(!isEditing)
                }}
                className="w-full mt-4 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile Details'}
              </button>
            </div>
          </div>

          {/* Form / Tabs Box (Right 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {isEditing ? (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSave} 
                className="bg-zinc-950 border border-neutral-900 rounded-3xl p-6 shadow-xl space-y-6"
              >
                <h3 className="font-bold text-lg border-b border-neutral-900 pb-3">Edit Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">City</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Country</label>
                    <input 
                      type="text" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Short Bio</label>
                    <textarea 
                      rows={3}
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Save size={14} />
                    Save Profile
                  </button>
                </div>
              </motion.form>
            ) : (
              <div className="space-y-6">
                {/* Trip Galleries Tabs */}
                <div className="flex border-b border-neutral-900 bg-zinc-950 p-1.5 rounded-2xl w-fit">
                  <button
                    onClick={() => setActiveSubTab('PREPLANNED')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeSubTab === 'PREPLANNED'
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Preplanned Trips
                  </button>
                  <button
                    onClick={() => setActiveSubTab('PREVIOUS')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeSubTab === 'PREVIOUS'
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Previous Trips
                  </button>
                </div>

                {/* Sub Tab Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeSubTab === 'PREPLANNED' ? PREPLANNED_TRIPS : PREVIOUS_TRIPS).map((trip) => (
                    <div 
                      key={trip.id}
                      onClick={() => navigate(`/trips/${trip.id}/view`)}
                      className="bg-zinc-950 hover:bg-neutral-900/40 border border-neutral-900 hover:border-neutral-850 p-5 rounded-2xl cursor-pointer flex flex-col justify-between h-40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wide">
                            {trip.city}
                          </span>
                          <span className="text-emerald-400 font-bold text-xs">${trip.budget}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm line-clamp-1 pt-1.5">{trip.title}</h4>
                        <p className="text-neutral-500 text-[10px] flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-neutral-900/60">
                        <div className="flex gap-1">
                          {trip.themes.map((theme) => (
                            <span key={theme} className="text-[8px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded">
                              {theme}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5">
                          View
                          <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
