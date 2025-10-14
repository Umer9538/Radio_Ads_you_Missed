'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiHeart, FiClock, FiSearch, FiGift, FiUser, FiRadio,
  FiGrid, FiArrowRight
} from 'react-icons/fi'
import Link from 'next/link'
import AdCardNew from '@/components/ads/AdCardNew'

interface DashboardStats {
  favoritesCount: number
  playHistoryCount: number
  claimedOffersCount: number
  searchCount: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    playHistoryCount: 0,
    claimedOffersCount: 0,
    searchCount: 0
  })
  const [recentAds, setRecentAds] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // For now, use mock data since user auth isn't fully configured
      // In production, this would fetch real user data from API

      // Mock stats
      setStats({
        favoritesCount: 12,
        playHistoryCount: 45,
        claimedOffersCount: 8,
        searchCount: 23
      })

      // Fetch recent ads
      const response = await fetch('/api/ads?limit=6')
      const data = await response.json()
      if (data.success) {
        setRecentAds(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: FiHeart,
      label: 'Favorites',
      value: stats.favoritesCount,
      color: '#ff1b6b',
      link: '/dashboard/favorites'
    },
    {
      icon: FiClock,
      label: 'Play History',
      value: stats.playHistoryCount,
      color: '#00d4ff',
      link: '/dashboard/history'
    },
    {
      icon: FiGift,
      label: 'Claimed Offers',
      value: stats.claimedOffersCount,
      color: '#00ff88',
      link: '/dashboard/offers'
    },
    {
      icon: FiSearch,
      label: 'Searches',
      value: stats.searchCount,
      color: '#8b5cf6',
      link: '/dashboard/searches'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 relative overflow-hidden">
      {/* Background gradient - matches hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Large atmospheric glows - matching hero section with prominent red/pink */}
      <div className="absolute top-0 right-1/4 w-[900px] h-[900px] bg-[#ff1b6b]/40 rounded-full blur-[200px]" />
      <div className="absolute top-1/3 right-1/3 w-[700px] h-[700px] bg-[#ff4d8f]/35 rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-[#00ff88]/10 rounded-full blur-[180px]" />

      {/* Radio Tower Silhouette - Subtle like hero section */}
      <div className="absolute inset-0 flex items-end justify-center md:justify-end pointer-events-none opacity-25">
        <svg
          width="800"
          height="900"
          viewBox="0 0 800 900"
          fill="none"
          className="absolute bottom-0 right-0 md:right-20"
          style={{ filter: 'drop-shadow(0 0 80px rgba(255, 27, 107, 0.8)) drop-shadow(0 0 120px rgba(255, 77, 143, 0.6))' }}
        >
          {/* Strong red glow around tower top */}
          <circle cx="400" cy="100" r="130" fill="#ff1b6b" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="140" r="180" fill="#ff4d8f" opacity="0.1">
            <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Main Tower Structure - Larger lattice design */}
          <g opacity="0.8">
            {/* Left side of tower */}
            <line x1="320" y1="100" x2="360" y2="850" stroke="url(#towerGradient2)" strokeWidth="6" />
            <line x1="480" y1="100" x2="440" y2="850" stroke="url(#towerGradient2)" strokeWidth="6" />

            {/* Horizontal beams - creating lattice structure */}
            {[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800].map((y, i) => {
              const leftX = 320 + (40 / 750) * (y - 100)
              const rightX = 480 - (40 / 750) * (y - 100)
              const beamWidth = rightX - leftX
              return (
                <g key={i}>
                  <line
                    x1={leftX}
                    y1={y}
                    x2={rightX}
                    y2={y}
                    stroke="url(#towerGradient2)"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  {/* Diagonal cross beams */}
                  {i % 2 === 0 && (
                    <>
                      <line
                        x1={leftX}
                        y1={y}
                        x2={rightX}
                        y2={y + 50}
                        stroke="url(#towerGradient2)"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                      <line
                        x1={rightX}
                        y1={y}
                        x2={leftX}
                        y2={y + 50}
                        stroke="url(#towerGradient2)"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    </>
                  )}
                </g>
              )
            })}
          </g>

          {/* Antenna Mast on top */}
          <line x1="400" y1="20" x2="400" y2="100" stroke="url(#towerGradient2)" strokeWidth="4" opacity="0.9" />

          {/* Red blinking light at top */}
          <circle cx="400" cy="20" r="8" fill="#ff1b6b" opacity="0.9">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="20" r="16" fill="#ff1b6b" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="16;24;16" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Signal waves emanating from top */}
          <g opacity="0.6">
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx="400"
                cy="60"
                r="30"
                stroke="#00d4ff"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="30;80;120"
                  dur="4s"
                  begin={`${i * 1.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.3;0"
                  dur="4s"
                  begin={`${i * 1.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* Platform at various heights */}
          <rect x="350" y="400" width="100" height="4" fill="url(#towerGradient2)" opacity="0.7" />
          <rect x="355" y="650" width="90" height="4" fill="url(#towerGradient2)" opacity="0.7" />

          <defs>
            <linearGradient id="towerGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff1b6b" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#ff4d8f" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#ff6b00" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#00d4ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground atmospheric effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d4ff]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00ff88]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Your Dashboard
              </h1>
              <p className="text-lg text-[#94a3b8]">
                Welcome back! Here's your activity overview
              </p>
            </div>

            <Link href="/profile">
              <motion.button
                className="p-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiUser className="text-2xl" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon className="text-2xl" style={{ color: stat.color }} />
                    </div>
                  </div>

                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[#94a3b8]">{stat.label}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <FiSearch />
                  Search Ads
                </motion.button>
              </Link>

              <Link href="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl border-2 border-[#00d4ff] text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FiGrid />
                  Browse Categories
                </motion.button>
              </Link>

              <Link href="/stations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl border-2 border-[#00ff88] text-[#00ff88] font-semibold hover:bg-[#00ff88]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FiRadio />
                  View Stations
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Recently Played
            </h2>
            <Link href="/dashboard/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-[#00d4ff] hover:text-[#00ff88] font-semibold flex items-center gap-2 transition-colors"
              >
                View All
                <FiArrowRight />
              </motion.button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] h-32 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentAds.slice(0, 4).map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AdCardNew ad={ad} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover More{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                Offers
              </span>
            </h2>
            <p className="text-lg text-[#94a3b8] mb-8 max-w-2xl mx-auto">
              Browse through thousands of radio ads and never miss a great deal
            </p>
            <Link href="/search">
              <motion.button
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSearch className="text-xl" />
                Explore All Ads
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
