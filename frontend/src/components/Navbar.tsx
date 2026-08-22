import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Globe, Menu, X, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const landingLinks = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
]

const baseAppLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Explore Search', href: '/search' },
  { label: 'My Trips', href: '/trips/my-trips' },
  { label: 'Community Feed', href: '/community' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Profile', href: '/profile' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  // Determine if we are on landing pages or in-app dashboard views
  const isAppView = 
    isAuthenticated ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/search') ||
    location.pathname.startsWith('/trips') ||
    location.pathname.startsWith('/community') ||
    location.pathname.startsWith('/calendar') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/admin')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Only show Admin Metrics if user is ADMIN
  const appLinks = user?.role === 'ADMIN'
    ? [...baseAppLinks, { label: 'Admin Metrics', href: '/admin' }]
    : baseAppLinks

  const activeLinks = isAppView ? appLinks : landingLinks

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const userAvatar = user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isAppView
            ? 'bg-transparent backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60 transition-shadow">
              <Globe size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Voyara <span className="text-blue-400">Travels</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {activeLinks.map((link) => {
              const isActive = location.pathname === link.href
              const isAdminLink = link.href === '/admin'
              return isAppView ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide uppercase transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : isAdminLink
                        ? 'text-purple-300 hover:text-purple-200'
                        : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAdminLink && <Shield size={12} className="text-purple-400" />}
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Auth Buttons / Profile Trigger */}
          <div className="hidden md:flex items-center gap-3">
            {isAppView ? (
              <div className="flex items-center gap-3">
                {user && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 font-medium hidden xl:inline">
                      Hello, <strong className="text-white">{user.firstName}</strong>
                    </span>
                    {user.role === 'ADMIN' && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-xs text-white/60 hover:text-white px-3 py-1.5 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer font-bold uppercase tracking-wide"
                >
                  Sign Out
                </button>
                <Link to="/profile" className="w-9 h-9 rounded-full border-2 border-blue-500/40 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg hover:border-blue-400 transition-all cursor-pointer text-white font-bold text-sm select-none">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-white/90 transition-all duration-200 shadow-lg cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className="lg:hidden text-white/80 hover:text-white cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4"
          >
            {activeLinks.map((link) => {
              const isActive = isAppView ? location.pathname === link.href : false
              return isAppView ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-semibold py-2.5 border-b border-white/5 text-sm ${
                    isActive ? 'text-blue-400' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/80 hover:text-white font-medium py-2 border-b border-white/5 text-sm"
                >
                  {link.label}
                </a>
              )
            })}
            
            <div className="flex gap-3 pt-2">
              {isAppView ? (
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false) }}
                  className="flex-1 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-semibold text-white cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMobileOpen(false) }}
                    className="flex-1 py-2.5 border border-white/20 rounded-full text-sm text-white cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setMobileOpen(false) }}
                    className="flex-1 py-2.5 bg-white text-black rounded-full text-sm font-semibold cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
