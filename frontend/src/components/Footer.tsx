import { Globe, MessageCircle, Camera, Play, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
  Product: ['Features', 'Destinations', 'Itinerary Builder', 'Budgeting', 'Community'],
  Company: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

const socials = [
  { icon: MessageCircle, href: '#' },
  { icon: Camera, href: '#' },
  { icon: Play, href: '#' },
  { icon: Code2, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/8 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Globe size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Voyara <span className="text-blue-400">Travels</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-5">
              The world's most intuitive travel planning platform. Plan, budget, and share adventures effortlessly.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 Voyara Travels. Built for Odoo Hackathon.
          </p>
          <p className="text-white/20 text-xs">
            Made with ♥ by Team Voyara Travels
          </p>
        </div>
      </div>
    </footer>
  )
}
