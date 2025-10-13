'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiHeart, FiClock, FiSearch, FiBell, FiTrendingUp,
  FiGift, FiPlay, FiUser
} from 'react-icons/fi'
import Link from 'next/link'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

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
      color: 'from-red-500 to-pink-500',
      link: '/dashboard/favorites'
    },
    {
      icon: FiClock,
      label: 'Play History',
      value: stats.playHistoryCount,
      color: 'from-blue-500 to-cyan-500',
      link: '/dashboard/history'
    },
    {
      icon: FiGift,
      label: 'Claimed Offers',
      value: stats.claimedOffersCount,
      color: 'from-green-500 to-emerald-500',
      link: '/dashboard/offers'
    },
    {
      icon: FiSearch,
      label: 'Searches',
      value: stats.searchCount,
      color: 'from-purple-500 to-indigo-500',
      link: '/dashboard/searches'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <FloatingParticles count={50} />
      <MorphingBlob className="top-0 right-0" color="from-blue-500 to-cyan-500" size={600} />
      <MorphingBlob className="bottom-0 left-0" color="from-purple-500 to-pink-500" size={500} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <HolographicText as="h1" className="text-5xl mb-2">
                Your Dashboard
              </HolographicText>
              <p className="text-xl text-gray-300">
                Welcome back! Here's your activity overview
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/profile">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <FiUser className="text-2xl" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <GlassmorphicCard className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="text-2xl text-white" />
                    </motion.div>
                    <FiTrendingUp className="text-green-400 text-xl" />
                  </div>

                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-300">{stat.label}</div>
                </GlassmorphicCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <GlassmorphicCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FiSearch />
                  Search Ads
                </motion.button>
              </Link>

              <Link href="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FiGift />
                  Browse Categories
                </motion.button>
              </Link>

              <Link href="/stations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FiBell />
                  View Stations
                </motion.button>
              </Link>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <HolographicText as="h2" className="text-3xl">
              Recently Played
            </HolographicText>
            <Link href="/dashboard/history">
              <motion.button
                whileHover={{ x: 5 }}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2"
              >
                View All
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassmorphicCard className="h-64 animate-pulse" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={`/ads/${ad.id}`}>
                    <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                      {/* Thumbnail */}
                      <div className="relative h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 animate-gradient-xy">
                        {ad.thumbnailUrl ? (
                          <img
                            src={ad.thumbnailUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <motion.div
                              className="text-white text-5xl"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            >
                              📻
                            </motion.div>
                          </div>
                        )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiPlay className="text-white text-4xl" />
                        </div>

                        {ad.offers && ad.offers.length > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 rounded-full text-white text-xs font-bold">
                            OFFER
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all">
                          {ad.title}
                        </h3>
                        <p className="text-sm text-gray-400">{ad.brand}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>{ad.station.name}</span>
                          <span>{ad.playCount} plays</span>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <GlassmorphicCard className="p-12 text-center">
            <HolographicText as="h2" className="text-4xl mb-4">
              Discover More Offers
            </HolographicText>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse through thousands of radio ads and never miss a great deal
            </p>
            <Link href="/search">
              <MagneticButton className="px-12 py-6">
                <FiSearch className="mr-2 text-2xl" />
                <span className="text-xl">Explore All Ads</span>
              </MagneticButton>
            </Link>
          </GlassmorphicCard>
        </motion.div>
      </div>
    </div>
  )
}
