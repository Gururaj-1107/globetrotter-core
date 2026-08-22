import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, ChevronDown, MapPin, Star, Users } from 'lucide-react'

// Destination slides for the hero carousel
const heroSlides = [
  {
    id: 1,
    city: 'Santorini',
    country: 'Greece',
    tagline: 'Where Whitewashed Cliffs Meet Azure Waters',
    tags: ['Aegean Sea', 'Caldera Views', 'UNESCO Heritage'],
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85&auto=format',
    accent: '#3b82f6',
  },
  {
    id: 2,
    city: 'Kyoto',
    country: 'Japan',
    tagline: 'Ancient Temples, Falling Petals, Timeless Serenity',
    tags: ['Cherry Blossoms', 'Zen Gardens', 'Geisha Culture'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=85&auto=format',
    accent: '#f43f5e',
  },
  {
    id: 3,
    city: 'Patagonia',
    country: 'Argentina',
    tagline: 'At the Edge of the World, Adventure Awaits',
    tags: ['Torres del Paine', 'Glacier Trekking', 'Wild Wilderness'],
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=85&auto=format',
    accent: '#10b981',
  },
  {
    id: 4,
    city: 'Marrakech',
    country: 'Morocco',
    tagline: 'Lose Yourself in the Labyrinth of Colors',
    tags: ['Medina Markets', 'Sahara Gateway', 'Riad Architecture'],
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1920&q=85&auto=format',
    accent: '#f59e0b',
  },
]

// Floating stats
const stats = [
  { icon: MapPin, value: '200+', label: 'Destinations' },
  { icon: Users, value: '50K+', label: 'Travelers' },
  { icon: Star, value: '4.9', label: 'Rating' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // Auto-advance slides every 2 seconds
  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [currentSlide])

  // Subtle mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden flex flex-col"
    >
      {/* ── Background Image with Parallax ── */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.city}
              className="w-full h-full object-cover"
              style={{ transform: 'scale(1.1)' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Deep gradient overlay — bottom-up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        {/* Slight vignette */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
        }} />
      </motion.div>

      {/* ── Hero Content ── */}
      <motion.div
        className="relative z-10 flex flex-col h-full"
        style={{ y: textY, opacity }}
      >
        {/* Country label */}
        <div className="flex-1 flex flex-col justify-end pb-32 px-6 md:px-16 max-w-7xl mx-auto w-full">

          {/* Country pill */}
          <motion.div
            key={`country-${currentSlide}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <MapPin size={12} className="text-white/70" />
              <span className="text-xs text-white/80 font-medium tracking-widest uppercase">
                {slide.country}
              </span>
            </div>
          </motion.div>

          {/* Giant city name */}
          <div className="overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`city-${currentSlide}`}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(4rem,12vw,9rem)] font-black leading-none tracking-tighter text-shadow-hero uppercase"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {slide.city}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`tag-${currentSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="text-base md:text-lg text-white/75 max-w-xl mb-6 leading-relaxed"
            >
              {slide.tagline}
            </motion.p>
          </AnimatePresence>

          {/* Tag pills */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`pills-${currentSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {slide.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-white/80 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Search + CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            {/* Search Bar */}
            <div className="flex-1 max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-white/40 transition-all focus-within:border-white/50 focus-within:bg-white/15">
              <MapPin size={16} className="text-white/50 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go?"
                className="bg-transparent text-white placeholder-white/40 text-sm flex-1 outline-none"
              />
            </div>

            {/* Plan Trip CTA */}
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-2 bg-white text-black font-bold px-6 py-3.5 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Plan Your Trip
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Slide Indicators ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-500 rounded-full ${
              i === currentSlide
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ── Floating Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-0 right-0 z-20 hidden md:flex"
      >
        <div className="flex items-center gap-px m-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center px-6 py-4 ${
                i !== stats.length - 1 ? 'border-r border-white/10' : ''
              }`}
            >
              <Icon size={16} className="text-white/50 mb-1" />
              <span className="text-white font-bold text-lg leading-none">{value}</span>
              <span className="text-white/50 text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 md:left-16 md:translate-x-0 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
