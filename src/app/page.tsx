'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiSearch, FiPlay, FiGift, FiUsers, FiTrendingUp,
  FiRadio, FiActivity, FiZap
} from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/search')
    }
  }

  const stats = [
    { value: '50K+', label: 'Ads Found', color: '#00d4ff' },
    { value: '24/7', label: 'Monitoring', color: '#00ff88' },
    { value: '15', label: 'Radio Stations', color: '#ff1b6b' },
    { value: 'Free', label: 'For Users', color: '#8b5cf6' }
  ]

  const features = [
    {
      title: 'For Listeners',
      description: 'Never miss an offer again. Search, replay, and claim vouchers from ads you heard.',
      icon: FiUsers,
      color: '#00d4ff',
      benefits: [
        'Search recent ads',
        'Claim vouchers',
        'Save favorites'
      ],
      cta: 'Find that ad you just heard',
      ctaLink: '/search'
    },
    {
      title: 'For Advertisers',
      description: 'Turn missed ads into captured sales. Upload ads and deliver vouchers directly.',
      icon: FiTrendingUp,
      color: '#00ff88',
      benefits: [
        'Upload ad content',
        'Deliver vouchers',
        'View analytics'
      ],
      cta: 'Turn missed ads into sales',
      ctaLink: '/for-advertisers'
    },
    {
      title: 'For Stations',
      description: 'Upsell your advertisers with zero effort. Earn margin on premium features.',
      icon: FiRadio,
      color: '#ff1b6b',
      benefits: [
        'Sync ad schedules',
        'Earn commission',
        'Zero effort setup'
      ],
      cta: 'Upsell with zero effort',
      ctaLink: '/for-stations'
    },
    {
      title: 'For Agencies',
      description: 'Offer clients a radio + digital package. Manage multiple advertisers seamlessly.',
      icon: FiZap,
      color: '#8b5cf6',
      benefits: [
        'Manage clients',
        'Earn margin',
        'Digital + Radio'
      ],
      cta: 'Radio + digital package',
      ctaLink: '/for-agencies'
    }
  ]

  const howItWorks = [
    {
      step: '1',
      icon: FiSearch,
      title: 'Search',
      description: 'Type keywords, brand names, or describe what you remember from the ad',
      color: '#00d4ff'
    },
    {
      step: '2',
      icon: FiPlay,
      title: 'Listen',
      description: "Play the ad snippet to confirm it's the one you heard on the radio",
      color: '#8b5cf6'
    },
    {
      step: '3',
      icon: FiGift,
      title: 'Claim',
      description: "Get the advertiser's contact info and claim any available vouchers or offers",
      color: '#ff1b6b'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/80 to-[#0a0f1e]" />

        {/* Large atmospheric glows - darker and more subtle */}
        <div className="absolute top-0 right-1/4 w-[900px] h-[900px] bg-[#ff1b6b]/20 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/3 w-[700px] h-[700px] bg-[#ff4d8f]/18 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-[#00ff88]/6 rounded-full blur-[180px]" />

        {/* Radio Tower Silhouette - Centered and darker */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-30">
          <svg
            width="900"
            height="1000"
            viewBox="0 0 900 1000"
            fill="none"
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ filter: 'drop-shadow(0 0 60px rgba(255, 27, 107, 0.5)) drop-shadow(0 0 100px rgba(255, 77, 143, 0.4))' }}
          >
            {/* Strong red glow around tower top */}
            <circle cx="450" cy="100" r="150" fill="#ff1b6b" opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="450" cy="150" r="200" fill="#ff4d8f" opacity="0.1">
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* Main Tower Structure - Detailed lattice */}
            <g opacity="0.9">
              {/* Tower sides */}
              <line x1="380" y1="100" x2="420" y2="950" stroke="url(#heroTowerGradient)" strokeWidth="8" />
              <line x1="520" y1="100" x2="480" y2="950" stroke="url(#heroTowerGradient)" strokeWidth="8" />

              {/* Horizontal and diagonal beams - detailed lattice */}
              {[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900].map((y, i) => {
                const leftX = 380 + (40 / 850) * (y - 100)
                const rightX = 520 - (40 / 850) * (y - 100)
                return (
                  <g key={i}>
                    <line
                      x1={leftX}
                      y1={y}
                      x2={rightX}
                      y2={y}
                      stroke="url(#heroTowerGradient)"
                      strokeWidth="4"
                      opacity="0.7"
                    />
                    {/* X-pattern cross beams */}
                    {i % 2 === 0 && (
                      <>
                        <line
                          x1={leftX}
                          y1={y}
                          x2={rightX}
                          y2={y + 50}
                          stroke="url(#heroTowerGradient)"
                          strokeWidth="2.5"
                          opacity="0.5"
                        />
                        <line
                          x1={rightX}
                          y1={y}
                          x2={leftX}
                          y2={y + 50}
                          stroke="url(#heroTowerGradient)"
                          strokeWidth="2.5"
                          opacity="0.5"
                        />
                      </>
                    )}
                  </g>
                )
              })}
            </g>

            {/* Antenna Mast */}
            <line x1="450" y1="20" x2="450" y2="100" stroke="url(#heroTowerGradient)" strokeWidth="5" opacity="0.95" />

            {/* Blinking red light */}
            <circle cx="450" cy="20" r="10" fill="#ff1b6b" opacity="0.95">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="450" cy="20" r="20" fill="#ff1b6b" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="20;30;20" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Signal waves */}
            <g opacity="0.7">
              {[0, 1, 2, 3].map((i) => (
                <circle
                  key={i}
                  cx="450"
                  cy="60"
                  r="35"
                  stroke="#00d4ff"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="35;90;140"
                    dur="4s"
                    begin={`${i * 1}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0.3;0"
                    dur="4s"
                    begin={`${i * 1}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>

            {/* Platform details */}
            <rect x="410" y="450" width="80" height="5" fill="url(#heroTowerGradient)" opacity="0.8" />
            <rect x="415" y="700" width="70" height="5" fill="url(#heroTowerGradient)" opacity="0.8" />

            <defs>
              <linearGradient id="heroTowerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff1b6b" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#ff4d8f" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#ff6b00" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#00d4ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Additional foreground atmospheric glow */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d4ff]/15 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e] border border-[#00d4ff]/30 mb-8"
            >
              <FiZap className="text-[#00d4ff]" />
              <span className="text-sm text-[#94a3b8]">Never Miss Another Offer</span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Find That Ad You{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                Just Heard
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12"
            >
              Search, replay, and claim offers from radio ads you partially heard. Never miss out on a great deal again.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/search">
                <motion.button
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 animate-ambulance"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSearch />
                  Start searching now
                </motion.button>
              </Link>

              <motion.button
                className="px-8 py-4 rounded-full border-2 border-[#00d4ff] text-[#00d4ff] font-semibold text-lg hover:bg-[#00d4ff]/10 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlay />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#94a3b8]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Try It Now Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0f1e] to-[#1a1f2e]/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Search through thousands of recent radio ads from New Zealand stations
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]"
          >
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xl" />
                  <input
                    type="text"
                    placeholder="Search for ads by brand, product, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0f1e] border border-[#2a2f3e] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                </div>
                <button
                  type="button"
                  className="p-4 bg-[#0a0f1e] border border-[#2a2f3e] rounded-xl hover:border-[#00d4ff] transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 5h16M2 10h16M2 15h16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <Link href="/search">
                  <motion.button
                    type="submit"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0f1e] font-bold hover:opacity-90 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Find Ads
                  </motion.button>
                </Link>
              </div>
            </form>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['Last Hour', 'Auckland', 'Retail', 'With Vouchers'].map((filter, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="px-4 py-2 bg-[#0a0f1e] border border-[#2a2f3e] rounded-full text-sm text-[#94a3b8] hover:border-[#00d4ff] hover:text-white transition-all"
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Built For Everyone Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built For Everyone
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              Whether you're a listener, advertiser, radio station, or agency - we have solutions tailored for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-8 border-2 hover:scale-105 transition-all cursor-pointer group"
                  style={{ borderColor: feature.color + '40' }}
                  whileHover={{ borderColor: feature.color }}
                >
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.color + '20' }}
                  >
                    <Icon className="text-3xl" style={{ color: feature.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[#94a3b8] mb-6">{feature.description}</p>

                  {/* Benefits */}
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill={feature.color + '20'} />
                          <path d="M5 8l2 2 4-4" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={feature.ctaLink}>
                    <motion.button
                      className="w-full py-3 rounded-xl border-2 font-semibold text-sm transition-all"
                      style={{
                        borderColor: feature.color,
                        color: feature.color
                      }}
                      whileHover={{ backgroundColor: feature.color + '10' }}
                    >
                      {feature.cta} →
                    </motion.button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  {/* Icon Circle */}
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}10)`
                    }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="text-4xl" style={{ color: item.color }} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>

                  {/* Description */}
                  <p className="text-[#94a3b8]">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1a1f2e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-bold text-white">Radio Ads</span>
                <span className="text-xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  You Missed
                </span>
              </div>
              <p className="text-sm text-[#94a3b8]">
                Never miss a radio promotion again
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li><Link href="/search" className="hover:text-white transition-colors">Find Ads</Link></li>
                <li><Link href="/stations" className="hover:text-white transition-colors">Radio Stations</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li><Link href="/for-advertisers" className="hover:text-white transition-colors">For Advertisers</Link></li>
                <li><Link href="/for-stations" className="hover:text-white transition-colors">For Stations</Link></li>
                <li><Link href="/for-agencies" className="hover:text-white transition-colors">For Agencies</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1a1f2e] pt-8 text-center text-sm text-[#64748b]">
            © 2025 Radio Ads You Missed. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
