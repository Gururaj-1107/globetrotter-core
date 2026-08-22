import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Globe size={28} className="text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight">
            Your Next Adventure{' '}
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h2>

          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of travelers already planning smarter with GlobeTrotter. Free to start, forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl text-base hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95"
            >
              Start Planning for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl text-base hover:border-white/50 hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </button>
          </div>

          <p className="text-white/30 text-sm mt-6">
            No credit card required · Takes 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  )
}
