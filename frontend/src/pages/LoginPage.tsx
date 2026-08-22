import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Globe, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2, Sparkles, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
  const { login, register, googleAuth, checkProvider, linkPassword, loginAsDemo, user, isAuthenticated } = useAuth()

  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Smart Provider Check states
  const [emailStep, setEmailStep] = useState<'ENTER_EMAIL' | 'ENTER_PASSWORD' | 'GOOGLE_ONLY'>('ENTER_EMAIL')
  const [checkedProvider, setCheckedProvider] = useState<string | null>(null)

  // Password Setup modal for Google-authenticated users
  const [showPasswordSetupModal, setShowPasswordSetupModal] = useState(false)
  const [linkPasswordVal, setLinkPasswordVal] = useState('')
  const [linkConfirmVal, setLinkConfirmVal] = useState('')

  // Form states
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    bio: '',
    password: '',
    avatarUrl: ''
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrorMessage(null)
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (field === 'email' && emailStep !== 'ENTER_EMAIL') {
      setEmailStep('ENTER_EMAIL')
    }
  }

  // Photo upload handler for signup
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatarPreview(base64)
      setForm((prev) => ({ ...prev, avatarUrl: base64 }))
    }
    reader.readAsDataURL(file)
  }

  // 1. Email Step Check (Smart Provider Detection Flow)
  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) {
      setErrorMessage('Please enter your email address')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const result = await checkProvider(form.email)
      setCheckedProvider(result.provider)

      if (result.exists && result.provider === 'GOOGLE' && !result.hasPassword) {
        setEmailStep('GOOGLE_ONLY')
      } else {
        setEmailStep('ENTER_PASSWORD')
      }
    } catch (err: any) {
      setEmailStep('ENTER_PASSWORD')
    } finally {
      setLoading(false)
    }
  }

  // 2. Email + Password Sign In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.password) {
      setErrorMessage('Please enter your password')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.message?.includes('Google Sign-In')) {
        setEmailStep('GOOGLE_ONLY')
      } else {
        setErrorMessage(err.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  // 3. Google Sign-In
  const handleGoogleSignIn = async (emailOverride?: string) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      // If an emailOverride is explicitly passed (e.g. from Google-detected alert), use it;
      // otherwise pass undefined so the genuine Firebase Google Popup opens!
      const param = emailOverride ? { email: emailOverride } : undefined
      const loggedUser = await googleAuth(param)

      if (loggedUser.authProvider === 'GOOGLE' && loggedUser.needsPasswordSetup) {
        setShowPasswordSetupModal(true)
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      if (err.message?.includes('cancelled') || err.code === 'auth/popup-closed-by-user') {
        return
      }
      setErrorMessage(err.message || 'Google Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  // 4. Link Password to Google Account
  const handleLinkPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (linkPasswordVal.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }
    if (linkPasswordVal !== linkConfirmVal) {
      setErrorMessage('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await linkPassword(linkPasswordVal, linkConfirmVal)
      setShowPasswordSetupModal(false)
      navigate('/dashboard')
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to link password')
    } finally {
      setLoading(false)
    }
  }

  // 5. User Registration Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.email || !form.password) {
      setErrorMessage('First Name, Email, and Password are required.')
      return
    }
    // Block admin email from public signup
    if (form.email.trim().toLowerCase() === 'admin@globetrotter.com') {
      setErrorMessage('This email is reserved. Use the admin credentials shown above to sign in.')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      await register(form)
      setSuccessMessage('Account created successfully! Redirecting to Dashboard...')
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }


  // Quick Demo Access Handler
  const handleDemo = async (role: 'traveler' | 'admin' | 'google') => {
    setLoading(true)
    setErrorMessage(null)
    try {
      if (role === 'google') {
        form.email = 'rahul@gmail.com'
        await handleGoogleSignIn('rahul@gmail.com')
      } else {
        await loginAsDemo(role)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* ── Top Quick Access Bar ── */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 w-full max-w-5xl bg-blue-950/40 border border-blue-500/20 backdrop-blur-xl rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 text-blue-300 font-semibold">
          <Sparkles size={16} className="text-yellow-400" />
          <span>Quick Access:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleDemo('traveler')}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 rounded-xl text-white font-medium transition-all cursor-pointer"
          >
            👤 Traveler Login (Alex)
          </button>

          {/* Admin credentials — static display, no auto-login */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 border border-purple-500/30 rounded-xl text-purple-200">
            <span>🛡️</span>
            <span className="font-semibold text-purple-300">Admin:</span>
            <span className="font-mono text-white/80 select-all">admin@globetrotter.com</span>
            <span className="text-white/40 mx-0.5">/</span>
            <span className="font-mono text-white/80 select-all">admin123</span>
          </div>

          <button
            onClick={() => handleDemo('google')}
            disabled={loading}
            className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 rounded-xl text-white font-medium transition-all cursor-pointer"
          >
            🌐 Google Account (Rahul)
          </button>
        </div>
      </motion.div>


      {/* ── Main Split Panel Container ── */}
      <div className="w-full max-w-5xl bg-neutral-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex min-h-[640px] backdrop-blur-2xl">

        {/* ── LEFT: Auth Form Panel ── */}
        <div className="flex-1 flex flex-col px-8 md:px-12 py-10 overflow-y-auto max-h-[90vh]">
          
          {/* Header & Back Link */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Home
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Globe size={14} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm">
                Globe<span className="text-blue-400">Trotter</span>
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              {tab === 'signin' ? 'Welcome Back, Wanderer' : 'Join GlobeTrotter'}
            </h1>
            <p className="text-xs text-white/50">
              {tab === 'signin'
                ? 'Sign in to access your customized multi-city itineraries and budget breakdown.'
                : 'Create your account to start planning, budgeting, and sharing journeys.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t)
                  setErrorMessage(null)
                  setEmailStep('ENTER_EMAIL')
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* ── SIGN IN TAB FLOW ── */}
          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.div
                key="signin-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-4"
              >
                {/* STEP 1: Enter Email */}
                {emailStep === 'ENTER_EMAIL' && (
                  <form onSubmit={handleEmailContinue} className="flex flex-col gap-4">
                    <InputField
                      icon={<Mail size={15} />}
                      type="email"
                      placeholder="Email address (e.g. rahul@gmail.com)"
                      value={form.email}
                      onChange={handleChange('email')}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
                    >
                      {loading ? 'Checking account...' : 'Continue'}
                    </button>
                  </form>
                )}

                {/* STEP 2A: Google-Only Account Detected Edge Case */}
                {emailStep === 'GOOGLE_ONLY' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30 rounded-2xl flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                      <AlertCircle size={18} />
                      <span>Google Account Detected</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      This account (<span className="text-white font-bold">{form.email}</span>) was created using <span className="text-blue-300 font-semibold">Google Sign-In</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn(form.email)}
                      disabled={loading}
                      className="w-full py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer text-xs"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailStep('ENTER_EMAIL')}
                      className="text-xs text-white/40 hover:text-white text-center mt-1 cursor-pointer"
                    >
                      Use a different email address
                    </button>
                  </motion.div>
                )}

                {/* STEP 2B: Password Input */}
                {emailStep === 'ENTER_PASSWORD' && (
                  <form onSubmit={handlePasswordSignIn} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-white/60 px-1">
                      <span>Signing in as: <strong className="text-white">{form.email}</strong></span>
                      <button
                        type="button"
                        onClick={() => setEmailStep('ENTER_EMAIL')}
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div className="relative">
                      <InputField
                        icon={<Lock size={15} />}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange('password')}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    <div className="text-right">
                      <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
                    >
                      {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                  </form>
                )}

                <Divider />

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                    Sign in with Google
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── SIGN UP TAB (All Wireframe Fields) ── */
              <motion.form
                key="signup-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegister}
                className="flex flex-col gap-3.5"
              >
                {/* Photo Upload Circle — Real File Upload */}
                <div className="flex flex-col items-center mb-1 gap-1">
                  <label className="relative cursor-pointer group">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-400/40 bg-blue-500/10 hover:border-blue-400 hover:bg-blue-500/20 transition-all overflow-hidden flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <User size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-blue-300 mt-0.5 font-medium">Photo</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <span className="text-[9px] text-white font-semibold">Change</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[9px] text-white/40">Click to upload profile photo</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <InputField icon={<User size={13} />} placeholder="First Name *" value={form.firstName} onChange={handleChange('firstName')} required />
                  <InputField icon={<User size={13} />} placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} />
                </div>

                <InputField icon={<Mail size={13} />} type="email" placeholder="Email Address *" value={form.email} onChange={handleChange('email')} required />

                <div className="relative">
                  <InputField
                    icon={<Lock size={13} />}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Create Password *"
                    value={form.password}
                    onChange={handleChange('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <InputField icon={<Phone size={13} />} type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange('phone')} />

                <div className="grid grid-cols-2 gap-2.5">
                  <InputField icon={<MapPin size={13} />} placeholder="City" value={form.city} onChange={handleChange('city')} />
                  <InputField icon={<Globe size={13} />} placeholder="Country" value={form.country} onChange={handleChange('country')} />
                </div>

                <textarea
                  placeholder="Additional Information (Bio, preferred travel style...)"
                  value={form.bio}
                  onChange={handleChange('bio')}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 resize-none transition-all"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider mt-1"
                >
                  {loading ? 'Creating Account...' : 'Register Users'}
                </button>

                <Divider />

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                  Sign up with Google
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Cinematic Image Panel with Bubbles ── */}
        <div className="hidden lg:block w-[45%] relative overflow-hidden">
          <img
            src={panelImages[0]}
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Floating animated bubble circles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              style={{
                width: [60, 40, 80, 30, 50, 70][i],
                height: [60, 40, 80, 30, 50, 70][i],
                top: `${[8, 20, 5, 35, 15, 25][i]}%`,
                left: `${[10, 60, 40, 20, 75, 55][i]}%`,
              }}
              animate={{ y: [0, -12, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          <div className="absolute bottom-10 left-8 right-8">
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2 block">
              Multi-City Planning Platform
            </span>
            <p className="text-white/90 text-sm leading-relaxed font-serif italic">
              "Discover the world through GlobeTrotter, where we curate exceptional adventures, unveil hidden gems, and fuel your wanderlust."
            </p>
          </div>
        </div>
      </div>

      {/* ── PASSWORD SETUP MODAL FOR GOOGLE USERS ── */}
      <AnimatePresence>
        {showPasswordSetupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-neutral-900 border border-blue-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create a Password for Your Account</h3>
                <p className="text-xs text-white/60 mt-1">
                  You are authenticated with Google. Set a password if you'd also like to log in via Email + Password in the future.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLinkPassword} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={linkPasswordVal}
                  onChange={(e) => setLinkPasswordVal(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-blue-400"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={linkConfirmVal}
                  onChange={(e) => setLinkConfirmVal(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-blue-400"
                  required
                />

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSetupModal(false)
                      navigate('/dashboard')
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    Skip for Now
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    {loading ? 'Saving...' : 'Link Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

function InputField({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  autoFocus
}: {
  icon?: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoFocus?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/30 transition-all">
      {icon && <span className="text-white/40 shrink-0">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
        className="flex-1 bg-transparent text-xs text-white placeholder-white/40 outline-none"
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}
