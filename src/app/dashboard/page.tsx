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
    <div className="min-h-screen bg-[#0a0f1e] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
