import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Copy, Globe } from 'lucide-react'

const communityPosts = [
  {
    id: 1,
    author: 'Priya M.',
    avatar: 'https://i.pravatar.cc/40?img=47',
    title: '10 Days in Japan — Cherry Blossom Season',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    days: 10,
    likes: 342,
    copies: 89,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=75',
  },
  {
    id: 2,
    author: 'Carlos R.',
    avatar: 'https://i.pravatar.cc/40?img=12',
    title: 'Greek Islands Hopping Adventure',
    cities: ['Athens', 'Santorini', 'Mykonos'],
    days: 14,
    likes: 511,
    copies: 134,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=75',
  },
  {
    id: 3,
    author: 'Aisha K.',
    avatar: 'https://i.pravatar.cc/40?img=32',
    title: 'Morocco Desert & Medina Tour',
    cities: ['Casablanca', 'Marrakech', 'Merzouga'],
    days: 8,
    likes: 278,
    copies: 61,
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=500&q=75',
  },
]

export default function CommunitySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="community" className="bg-black py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3 block">
            Community
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Inspired by Real{' '}
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Travelers
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Browse community itineraries and copy any trip into your planner with one click.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {communityPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {post.cities.map((city) => (
                    <span key={city} className="text-[10px] bg-black/60 backdrop-blur-sm text-white/80 px-2 py-0.5 rounded-full border border-white/10">
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <img src={post.avatar} alt={post.author} className="w-7 h-7 rounded-full" />
                  <span className="text-white/60 text-xs">{post.author}</span>
                  <span className="ml-auto text-white/40 text-xs">{post.days} days</span>
                </div>

                <h3 className="text-white font-semibold text-sm mb-4 leading-snug">{post.title}</h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-white/50 text-xs">
                      <Heart size={12} className="text-rose-400" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-white/50 text-xs">
                      <Copy size={12} className="text-blue-400" /> {post.copies}
                    </span>
                  </div>
                  <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors">
                    <Copy size={10} /> Copy Trip
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
