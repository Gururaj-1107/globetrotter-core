import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Star } from 'lucide-react'

const destinations = [
  {
    id: 1,
    city: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    rating: 4.9,
    trips: '2.3K trips',
    tag: 'Islands',
    tagColor: 'bg-blue-500/80',
  },
  {
    id: 2,
    city: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    rating: 4.8,
    trips: '3.1K trips',
    tag: 'Culture',
    tagColor: 'bg-rose-500/80',
  },
  {
    id: 3,
    city: 'Patagonia',
    country: 'Argentina',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    rating: 4.9,
    trips: '1.7K trips',
    tag: 'Adventure',
    tagColor: 'bg-emerald-500/80',
  },
  {
    id: 4,
    city: 'Marrakech',
    country: 'Morocco',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
    rating: 4.7,
    trips: '2.0K trips',
    tag: 'Culture',
    tagColor: 'bg-amber-500/80',
  },
  {
    id: 5,
    city: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80',
    rating: 4.8,
    trips: '2.8K trips',
    tag: 'Coastal',
    tagColor: 'bg-cyan-500/80',
  },
  {
    id: 6,
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.7,
    trips: '4.2K trips',
    tag: 'Tropical',
    tagColor: 'bg-green-500/80',
  },
]

export default function DestinationsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="bg-black py-28 px-6" id="destinations">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-2 block">
              Top Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Trending{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                This Season
              </span>
            </h2>
          </div>
          <button className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors group shrink-0">
            View all destinations
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHovered(dest.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                i === 0 || i === 3 ? 'aspect-[4/5]' : 'aspect-[4/4]'
              }`}
            >
              {/* Image */}
              <motion.img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover"
                animate={{ scale: hovered === dest.id ? 1.08 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top tag */}
              <div className="absolute top-4 left-4">
                <span className={`text-xs text-white font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${dest.tagColor}`}>
                  {dest.tag}
                </span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5 flex items-center gap-1">
                      <MapPin size={10} />
                      {dest.country}
                    </p>
                    <h3 className="text-white font-bold text-xl leading-tight">{dest.city}</h3>
                    <p className="text-white/50 text-xs mt-1">{dest.trips}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-semibold">{dest.rating}</span>
                  </div>
                </div>

                {/* Hover CTA */}
                <AnimatePresence>
                  {hovered === dest.id && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 w-full py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
                    >
                      Explore {dest.city}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
