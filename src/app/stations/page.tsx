'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiRadio, FiMapPin, FiExternalLink, FiPlay } from 'react-icons/fi'
import Link from 'next/link'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

interface Station {
  id: string
  name: string
  frequency?: string
  location: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  active: boolean
  _count?: {
    ads: number
  }
}

export default function StationsPage() {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  useEffect(() => {
    fetchStations()
  }, [selectedLocation])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedLocation !== 'all') {
        params.append('location', selectedLocation)
      }

      const response = await fetch(`/api/stations?${params}`)
      const data = await response.json()

      if (data.success) {
        setStations(data.data)
      }
    } catch (error) {
      console.error('Error fetching stations:', error)
    } finally {
      setLoading(false)
    }
  }

  const locations = Array.from(new Set(stations.map(s => s.location)))

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
          className="text-center mb-12"
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            📻
          </motion.div>

          <HolographicText as="h1" className="text-6xl mb-4">
            Radio Stations
          </HolographicText>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore New Zealand's top radio stations and discover their latest advertisements
          </p>
        </motion.div>

        {/* Location Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassmorphicCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white font-semibold">Filter by Location:</span>
              <button
                onClick={() => setSelectedLocation('all')}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedLocation === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All Locations
              </button>
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedLocation === location
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Stations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 h-full">
                  {/* Station Header */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 animate-gradient-xy flex items-center justify-center">
                    {station.logoUrl ? (
                      <img
                        src={station.logoUrl}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <motion.div
                        className="text-white text-8xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        📻
                      </motion.div>
                    )}

                    {/* Frequency Badge */}
                    {station.frequency && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-xl rounded-full text-white font-bold text-sm"
                      >
                        {station.frequency}
                      </motion.div>
                    )}
                  </div>

                  {/* Station Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all">
                      {station.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300 mb-3">
                      <FiMapPin className="text-purple-400" />
                      <span>{station.location}</span>
                    </div>

                    {/* Description */}
                    {station.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {station.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <FiPlay className="text-green-400" />
                        <span className="text-white font-semibold">
                          {station._count?.ads || 0} ads
                        </span>
                      </div>
                      {station.active && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link href={`/search?station=${station.id}`} className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          View Ads
                        </motion.button>
                      </Link>

                      {station.websiteUrl && (
                        <motion.a
                          href={station.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          <FiExternalLink className="text-xl" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stations.length === 0 && (
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
                📻
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No stations found
              </h3>
              <p className="text-gray-400">
                Try adjusting your filters
              </p>
            </GlassmorphicCard>
          </motion.div>
        )}

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
              Discover Amazing Offers
            </HolographicText>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse ads from your favorite stations and never miss a great deal
            </p>
            <Link href="/search">
              <MagneticButton className="px-12 py-6">
                <FiRadio className="mr-2 text-2xl" />
                <span className="text-xl">Browse All Ads</span>
              </MagneticButton>
            </Link>
          </GlassmorphicCard>
        </motion.div>
      </div>
    </div>
  )
}
