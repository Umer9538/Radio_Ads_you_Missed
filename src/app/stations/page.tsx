'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiRadio, FiMapPin, FiExternalLink, FiPlay } from 'react-icons/fi'
import Link from 'next/link'

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
    <div className="min-h-screen bg-[#0a0f1e] pt-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Radio{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
              Stations
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Explore New Zealand's top radio stations and discover their latest advertisements
          </p>
        </motion.div>

        {/* Location Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white font-semibold">Filter by Location:</span>
              <button
                onClick={() => setSelectedLocation('all')}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedLocation === 'all'
                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white'
                    : 'bg-[#0a0f1e] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff] border border-[#2a2f3e]'
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
                      ? 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white'
                      : 'bg-[#0a0f1e] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff] border border-[#2a2f3e]'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
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
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] h-80 animate-pulse"
              />
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
                <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] group cursor-pointer overflow-hidden hover:scale-105 hover:border-[#00d4ff]/50 transition-all duration-300 h-full">
                  {/* Station Header */}
                  <div className="relative h-48 bg-gradient-to-br from-[#00d4ff] via-[#ff1b6b] to-[#ff6b00] animate-gradient-xy flex items-center justify-center">
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
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00d4ff] group-hover:to-[#00ff88] transition-all">
                      {station.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                      <FiMapPin className="text-[#00d4ff]" />
                      <span>{station.location}</span>
                    </div>

                    {/* Description */}
                    {station.description && (
                      <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">
                        {station.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2a2f3e]">
                      <div className="flex items-center gap-2">
                        <FiPlay className="text-[#00ff88]" />
                        <span className="text-white font-semibold">
                          {station._count?.ads || 0} ads
                        </span>
                      </div>
                      {station.active && (
                        <span className="px-3 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs font-bold">
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
                          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold hover:shadow-lg transition-all"
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
                          className="p-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white hover:border-[#00d4ff] transition-all"
                        >
                          <FiExternalLink className="text-xl" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] inline-block">
              <div className="text-8xl mb-6">📻</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No stations found
              </h3>
              <p className="text-[#94a3b8]">
                Try adjusting your filters
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover Amazing Offers
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
              Browse ads from your favorite stations and never miss a great deal
            </p>
            <Link href="/search">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg inline-flex items-center gap-3"
              >
                <FiRadio className="text-xl" />
                Browse All Ads
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
