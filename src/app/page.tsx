'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSearch, FiRadio, FiGift, FiTrendingUp, FiPlay } from 'react-icons/fi'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

interface Ad {
  id: string
  title: string
  description?: string | null
  brand: string
  duration: number
  airedAt: string
  thumbnailUrl?: string | null
  playCount: number
  station: {
    name: string
    frequency?: string | null
  }
  category: {
    name: string
    slug: string
  }
  offers: Array<{
    id: string
    title: string
    expiresAt?: string | null
  }>
}

export default function HomePage() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalAds: 0,
    totalStations: 0,
    activeOffers: 0
  })

  useEffect(() => {
    fetchAds()
    fetchStats()
  }, [])

  const fetchAds = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ads?limit=12&sortBy=date_desc')
      const data = await response.json()

      if (data.success) {
        setAds(data.data)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [adsRes, stationsRes] = await Promise.all([
        fetch('/api/ads?limit=1'),
        fetch('/api/stations')
      ])

      const adsData = await adsRes.json()
      const stationsData = await stationsRes.json()

      if (adsData.success && stationsData.success) {
        setStats({
          totalAds: adsData.data.length,
          totalStations: stationsData.data.length,
          activeOffers: adsData.data.filter((ad: Ad) => ad.offers && ad.offers.length > 0).length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <FloatingParticles count={60} />
      <MorphingBlob className="top-0 left-0" color="from-blue-500 to-cyan-500" size={600} />
      <MorphingBlob className="bottom-0 right-0" color="from-purple-500 to-pink-500" size={500} />
      <MorphingBlob className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" color="from-pink-500 to-orange-500" size={400} />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Radio Icon */}
            <motion.div
              className="text-9xl mb-8"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              📻
            </motion.div>

            {/* Hero Title */}
            <HolographicText as="h1" className="text-6xl md:text-7xl mb-6">
              Never Miss a Radio Ad
            </HolographicText>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto"
            >
              Search, replay, and claim exclusive offers from New Zealand radio advertisements
            </motion.p>

            {/* Revolutionary Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <GlassmorphicCard className="p-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search for ads, brands, or offers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                    />
                  </div>
                  <MagneticButton type="submit" className="px-8">
                    <FiSearch className="mr-2" />
                    Search
                  </MagneticButton>
                </div>
              </GlassmorphicCard>
            </motion.form>

            {/* Animated Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
              {[
                { icon: FiRadio, label: 'Radio Ads', value: stats.totalAds, color: 'from-blue-500 to-cyan-500', delay: 0.6 },
                { icon: FiTrendingUp, label: 'Radio Stations', value: stats.totalStations, color: 'from-purple-500 to-pink-500', delay: 0.7 },
                { icon: FiGift, label: 'Active Offers', value: stats.activeOffers, color: 'from-green-500 to-emerald-500', delay: 0.8 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                >
                  <GlassmorphicCard className="p-8 text-center group cursor-pointer">
                    <motion.div
                      className={`inline-block p-4 rounded-full bg-gradient-to-br ${stat.color} mb-4`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="text-3xl text-white" />
                    </motion.div>
                    <motion.div
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: 'spring', stiffness: 200 }}
                    >
                      {stat.value}+
                    </motion.div>
                    <div className="text-gray-300 text-lg">{stat.label}</div>
                  </GlassmorphicCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Featured Ads Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <HolographicText as="h2" className="text-4xl mb-2">
                  Latest Radio Ads
                </HolographicText>
                <p className="text-gray-300 text-lg">
                  Recently aired advertisements from NZ radio stations
                </p>
              </div>
              <Link href="/search">
                <MagneticButton>View All</MagneticButton>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassmorphicCard className="h-80 animate-pulse" />
                  </motion.div>
                ))}
              </div>
            ) : ads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ads.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={`/ads/${ad.id}`}>
                      <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 animate-gradient-xy">
                          {ad.thumbnailUrl ? (
                            <img
                              src={ad.thumbnailUrl}
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <motion.div
                                className="text-white text-6xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                              >
                                📻
                              </motion.div>
                            </div>
                          )}

                          {/* Play Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1 }}
                          >
                            <motion.div
                              className="p-4 rounded-full bg-white/20 backdrop-blur-xl"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiPlay className="text-white text-3xl" />
                            </motion.div>
                          </motion.div>

                          {/* Offers Badge */}
                          {ad.offers && ad.offers.length > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 px-3 py-1 bg-green-500 rounded-full text-white text-xs font-bold shadow-lg"
                            >
                              OFFER
                            </motion.div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2 text-xs text-gray-300">
                            <span>{ad.station.name}</span>
                            <span>{ad.category.name}</span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all">
                            {ad.title}
                          </h3>

                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                            {ad.description || 'No description available'}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span className="font-semibold">{ad.brand}</span>
                            <span>{ad.playCount} plays</span>
                          </div>
                        </div>
                      </GlassmorphicCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <GlassmorphicCard className="inline-block p-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl mb-6"
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No ads available yet
                  </h3>
                  <p className="text-gray-400">
                    Check back soon for new radio advertisements
                  </p>
                </GlassmorphicCard>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassmorphicCard className="p-12 text-center">
              <HolographicText as="h2" className="text-5xl mb-6">
                Start Exploring Radio Ads
              </HolographicText>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Search through our collection of radio advertisements and never miss a great deal
              </p>

              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/search">
                  <MagneticButton className="px-12 py-6">
                    <FiSearch className="mr-2 text-2xl" />
                    <span className="text-xl">Browse All Ads</span>
                  </MagneticButton>
                </Link>

                <Link href="/stations">
                  <MagneticButton className="px-12 py-6">
                    <FiRadio className="mr-2 text-2xl" />
                    <span className="text-xl">View Stations</span>
                  </MagneticButton>
                </Link>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassmorphicCard className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <HolographicText as="h3" className="text-2xl mb-4">
                    Radio Ads You Missed
                  </HolographicText>
                  <p className="text-gray-300 text-sm">
                    Your gateway to finding and replaying radio advertisements from New Zealand stations.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <Link href="/search" className="hover:text-white transition-colors">
                        Browse Ads
                      </Link>
                    </li>
                    <li>
                      <Link href="/stations" className="hover:text-white transition-colors">
                        Radio Stations
                      </Link>
                    </li>
                    <li>
                      <Link href="/categories" className="hover:text-white transition-colors">
                        Categories
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 text-lg">Account</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <Link href="/auth/signin" className="hover:text-white transition-colors">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="hover:text-white transition-colors">
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-white transition-colors">
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center text-gray-400">
                © 2025 Radio Ads You Missed. All rights reserved.
              </div>
            </GlassmorphicCard>
          </div>
        </footer>
      </div>
    </div>
  )
}
