import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/landing/HeroSection'
import DestinationsSection from '../components/landing/DestinationsSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CommunitySection from '../components/landing/CommunitySection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="relative bg-black text-white">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <HowItWorksSection />
      <CommunitySection />
      <CTASection />
      <Footer />
    </div>
  )
}
