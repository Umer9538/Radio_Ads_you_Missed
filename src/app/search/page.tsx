'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import Input from '@/components/ui/Input'
import MagneticButton from '@/components/ui/MagneticButton'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [view, setView] = useState<'grid' | 'masonry'>('masonry')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    station: '',
    category: '',
    hasOffer: false,
  })

  useEffect(() => {
    fetchAds()
  }, [searchQuery, filters])

  const fetchAds = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('query', searchQuery)
      if (filters.station) params.append('stationId', filters.station)
      if (filters.category) params.append('categoryId', filters.category)
      if (filters.hasOffer) params.append('hasOffer', 'true')

      const response = await fetch(`/api/ads?${params}`)
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <FloatingParticles count={30} />
      <MorphingBlob className="top-0 left-0" color="from-blue-500 to-cyan-500" />
      <MorphingBlob className="bottom-0 right-0" color="from-purple-500 to-pink-500" size={500} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with holographic title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <HolographicText as="h1" className="text-6xl mb-4">
            Discover Radio Ads
          </HolographicText>
          <p className="text-xl text-gray-300">
            Search through thousands of NZ radio advertisements
          </p>
        </motion.div>

        {/* Revolutionary Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <GlassmorphicCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for ads, brands, or offers..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <MagneticButton
                onClick={() => setShowFilters(!showFilters)}
                className="px-6"
              >
                <FiFilter className="text-xl" />
                Filters
              </MagneticButton>

              <div className="flex gap-2 bg-white/10 rounded-2xl p-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    view === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setView('masonry')}
                  className={`p-3 rounded-xl transition-all ${
                    view === 'masonry'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        Station
                      </label>
                      <select
                        value={filters.station}
                        onChange={(e) =>
                          setFilters({ ...filters, station: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">All Stations</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">All Categories</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.hasOffer}
                          onChange={(e) =>
                            setFilters({ ...filters, hasOffer: e.target.checked })
                          }
                          className="w-5 h-5 rounded border-2 border-white/20"
                        />
                        <span className="text-white">Active Offers Only</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassmorphicCard>
        </motion.div>

        {/* Results */}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                view === 'masonry'
                  ? 'columns-1 md:columns-2 lg:columns-3 gap-6'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {ads.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="break-inside-avoid mb-6"
                >
                  <Link href={`/ads/${ad.id}`}>
                    <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                      {/* Image/Thumbnail */}
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
                          {ad.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>{ad.brand}</span>
                          <span>{ad.playCount} plays</span>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && ads.length === 0 && (
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
                No ads found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </GlassmorphicCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
