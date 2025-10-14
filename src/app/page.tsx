'use client'

import { useState, memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiSearch, FiPlay, FiGift, FiUsers, FiTrendingUp,
  FiRadio, FiZap
} from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'

// Memoize heavy components
const StatCard = memo(({ stat, index }: any) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
      {stat.value}
    </div>
    <div className="text-sm text-[#94a3b8]">{stat.label}</div>
  </div>
))
StatCard.displayName = 'StatCard'

const FeatureCard = memo(({ feature, index }: any) => {
  const Icon = feature.icon
  return (
    <div
      className="bg-[#1a1f2e] rounded-2xl p-8 border-2 hover:scale-105 transition-all cursor-pointer"
      style={{ borderColor: feature.color + '40' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: feature.color + '20' }}
      >
        <Icon className="text-3xl" style={{ color: feature.color }} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-[#94a3b8] mb-6">{feature.description}</p>
      <ul className="space-y-2 mb-6">
        {feature.benefits.map((benefit: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm text-[#94a3b8]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill={feature.color + '20'} />
              <path d="M5 8l2 2 4-4" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
      <Link href={feature.ctaLink}>
        <button
          className="w-full py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:opacity-80"
          style={{ borderColor: feature.color, color: feature.color }}
        >
          {feature.cta} →
        </button>
      </Link>
    </div>
  )
})
FeatureCard.displayName = 'FeatureCard'

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
      benefits: ['Search recent ads', 'Claim vouchers', 'Save favorites'],
      cta: 'Find that ad you just heard',
      ctaLink: '/search'
    },
    {
      title: 'For Advertisers',
      description: 'Turn missed ads into captured sales. Upload ads and deliver vouchers directly.',
      icon: FiTrendingUp,
      color: '#00ff88',
      benefits: ['Upload ad content', 'Deliver vouchers', 'View analytics'],
      cta: 'Turn missed ads into sales',
      ctaLink: '/for-advertisers'
    },
    {
      title: 'For Stations',
      description: 'Upsell your advertisers with zero effort. Earn margin on premium features.',
      icon: FiRadio,
      color: '#ff1b6b',
      benefits: ['Sync ad schedules', 'Earn commission', 'Zero effort setup'],
      cta: 'Upsell with zero effort',
      ctaLink: '/for-stations'
    },
    {
      title: 'For Agencies',
      description: 'Offer clients a radio + digital package. Manage multiple advertisers seamlessly.',
      icon: FiZap,
      color: '#8b5cf6',
      benefits: ['Manage clients', 'Earn margin', 'Digital + Radio'],
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

      {/* Hero Section - Simplified */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Simple background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/90 to-[#0a0f1e]" />

        {/* Reduced glows - only 2 instead of 4 */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e] border border-[#00d4ff]/30 mb-8">
              <FiZap className="text-[#00d4ff]" />
              <span className="text-sm text-[#94a3b8]">Never Miss Another Offer</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Find That Ad You{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                Just Heard
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12">
              Search, replay, and claim offers from radio ads you partially heard. Never miss out on a great deal again.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/search">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 animate-ambulance">
                  <FiSearch />
                  Start searching now
                </button>
              </Link>

              <button className="px-8 py-4 rounded-full border-2 border-[#00d4ff] text-[#00d4ff] font-semibold text-lg hover:bg-[#00d4ff]/10 transition-all flex items-center gap-2">
                <FiPlay />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Try It Now Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0f1e] to-[#1a1f2e]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Search through thousands of recent radio ads from New Zealand stations
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
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
                <Link href="/search">
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0f1e] font-bold hover:opacity-90 transition-all"
                  >
                    Find Ads
                  </button>
                </Link>
              </div>
            </form>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['Last Hour', 'Auckland', 'Retail', 'With Vouchers'].map((filter, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-[#0a0f1e] border border-[#2a2f3e] rounded-full text-sm text-[#94a3b8] hover:border-[#00d4ff] hover:text-white transition-all"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built For Everyone Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built For Everyone
            </h2>
            <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
              Whether you're a listener, advertiser, radio station, or agency - we have solutions tailored for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${item.color}40, ${item.color}10)` }}
                  >
                    <Icon className="text-4xl" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-[#94a3b8]">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1a1f2e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li><Link href="/search" className="hover:text-white transition-colors">Find Ads</Link></li>
                <li><Link href="/stations" className="hover:text-white transition-colors">Radio Stations</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li><Link href="/for-advertisers" className="hover:text-white transition-colors">For Advertisers</Link></li>
                <li><Link href="/for-stations" className="hover:text-white transition-colors">For Stations</Link></li>
                <li><Link href="/for-agencies" className="hover:text-white transition-colors">For Agencies</Link></li>
              </ul>
            </div>

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
