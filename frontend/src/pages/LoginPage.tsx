import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react'

// Background images for the split panel — cycling automatically
const panelImages = [
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
]

interface LoginPageProps {
  defaultTab?: 'signin' | 'signup'
}

export default function LoginPage({ defaultTab = 'signin' }: LoginPageProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [imgIdx] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', bio: '', password: '',
  })

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">

        {/* ── LEFT: Auth Form Panel ── */}
        <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto max-h-[90vh]">
          {/* Back + Logo */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Globe size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">
                Globe<span className="text-blue-500">Trotter</span>
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {tab === 'signin' ? 'Welcome back, wanderer' : 'Join GlobeTrotter'}
            </h1>
            <p className="text-sm text-gray-500">
              {tab === 'signin'
                ? 'Sign in to access your trips and itineraries.'
                : 'Create your account and start planning epic trips.'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
                onSubmit={(e) => { e.preventDefault(); navigate('/dashboard') }}
              >
                <InputField
                  icon={<Mail size={15} />}
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange('email')}
                />
                <div className="relative">
                  <InputField
                    icon={<Lock size={15} />}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="text-right">
                  <a href="#" className="text-xs text-blue-500 hover:text-blue-700">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                >
                  Sign In
                </button>

                <Divider />
                <SocialButtons />

                <p className="text-xs text-gray-400 text-center mt-2">
                  Discover the world through GlobeTrotter, where we curate exceptional adventures,
                  unveil hidden gems, and fuel your wanderlust.
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
                onSubmit={(e) => { e.preventDefault(); navigate('/dashboard') }}
              >
                {/* Photo upload */}
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-300 bg-blue-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all group">
                    <User size={20} className="text-blue-400 group-hover:text-blue-600" />
                    <span className="text-[9px] text-blue-400 mt-0.5">Photo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={<User size={14} />} placeholder="First Name" value={form.firstName} onChange={handleChange('firstName')} />
                  <InputField icon={<User size={14} />} placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} />
                </div>
                <InputField icon={<Mail size={14} />} type="email" placeholder="Email Address" value={form.email} onChange={handleChange('email')} />
                <InputField icon={<Phone size={14} />} type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange('phone')} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={<MapPin size={14} />} placeholder="City" value={form.city} onChange={handleChange('city')} />
                  <InputField icon={<Globe size={14} />} placeholder="Country" value={form.country} onChange={handleChange('country')} />
                </div>
                <textarea
                  placeholder="Additional Information (Bio, travel style...)"
                  value={form.bio}
                  onChange={handleChange('bio')}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                >
                  Create Account
                </button>

                <Divider />
                <SocialButtons />
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Image Panel ── */}
        <div className="hidden lg:block w-[45%] relative overflow-hidden">
          <img
            src={panelImages[imgIdx]}
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Floating bubbles decoration */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              style={{
                width: [60, 40, 80, 30, 50, 70][i],
                height: [60, 40, 80, 30, 50, 70][i],
                top: `${[8, 20, 5, 35, 15, 25][i]}%`,
                left: `${[10, 60, 40, 20, 75, 55][i]}%`,
              }}
              animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          <div className="absolute bottom-8 left-6 right-6">
            <p className="text-white/80 text-sm leading-relaxed text-center italic">
              "Discover the world through GlobeTrotter, where we curate exceptional adventures,
              unveil hidden gems, and fuel your wanderlust."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helper components ────────────────────────────────────────────────

function InputField({
  icon, type = 'text', placeholder, value, onChange,
}: {
  icon?: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

function SocialButtons() {
  return (
    <div className="flex flex-col gap-2.5">
      <button className="flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
        Sign in with Google
      </button>
      <button className="flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
        <svg className="w-4 h-4" viewBox="0 0 814 1000" fill="currentColor">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.8-155.5-108.8c-47.3-62.2-88.8-162-88.8-258.2C190 229.7 330 150 465 150c71.9 0 132.9 39.5 173.7 39.5 39.5 0 110.7-42.8 195.2-42.8 31.1 0 106.9 2.6 166.5 75.7zm-252.9-185.6c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
        </svg>
        Sign in with Apple
      </button>
    </div>
  )
}
