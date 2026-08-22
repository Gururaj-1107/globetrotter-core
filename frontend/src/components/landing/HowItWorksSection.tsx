import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, Map, Route, Sparkles } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds. Set up your travel profile with your preferences and wishlist destinations.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    step: '02',
    icon: Map,
    title: 'Plan Your Journey',
    description: 'Choose destinations, set dates, and let GlobeTrotter suggest activities tailored to your style.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    step: '03',
    icon: Route,
    title: 'Build Your Itinerary',
    description: 'Drag, drop, and organize activities day by day. Track your budget in real time as you build.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    step: '04',
    icon: Sparkles,
    title: 'Share & Inspire',
    description: 'Publish your itinerary to the community. Let others copy and adapt your adventure.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="bg-[#050505] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Four Steps to Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dream Trip
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            From idea to itinerary in minutes. GlobeTrotter handles the complexity so you can focus on the adventure.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative p-6 rounded-2xl border ${s.border} ${s.bg} group hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Step number */}
              <div className="text-6xl font-black text-white/5 absolute top-4 right-5 leading-none select-none">
                {s.step}
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mb-4 ${s.color}`}>
                <s.icon size={22} />
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>

              {/* Connector line (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-5 h-px bg-gradient-to-r from-white/20 to-transparent z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
