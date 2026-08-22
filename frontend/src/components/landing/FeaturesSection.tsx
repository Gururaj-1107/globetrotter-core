import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Map, LayoutList, Users, Wallet, Calendar, Share2 } from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Multi-City Planning',
    description: 'Build complex multi-stop itineraries across continents with intelligent date management.',
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
  },
  {
    icon: LayoutList,
    title: 'Itinerary Builder',
    description: 'Drag-and-drop daily schedules with curated activity suggestions for each destination.',
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
  },
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    description: 'Real-time budget breakdown by transport, stay, activities, and meals with visual charts.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    description: 'See all your trips on an interactive monthly calendar with multi-day range highlighting.',
    color: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: Users,
    title: 'Community Feed',
    description: 'Browse public itineraries from fellow travelers and copy any trip to your account instantly.',
    color: 'from-rose-500/20 to-rose-600/5',
    iconColor: 'text-rose-400',
  },
  {
    icon: Share2,
    title: 'Share & Inspire',
    description: 'Publish your itineraries and inspire thousands of travelers around the world.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'text-cyan-400',
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="explore" className="bg-[#0a0a0a] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 tracking-tight">
            Travel Smarter,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            GlobeTrotter gives your team every tool to plan, budget, and share epic adventures.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/8 backdrop-blur-sm hover:border-white/15 transition-all duration-300 cursor-default group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={20} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
