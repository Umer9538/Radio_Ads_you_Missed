'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import AdCardNew from '@/components/ads/AdCardNew'
import Pagination from '@/components/ui/Pagination'

function SearchContent() {
  const searchParams = useSearchParams()
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStation, setSelectedStation] = useState('All Stations')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<string[]>(['All'])
  const [stations, setStations] = useState<string[]>(['All Stations'])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    fetchCategories()
    fetchStations()
  }, [])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
    fetchAds(1)
  }, [searchQuery, selectedCategory, selectedStation])

  useEffect(() => {
    fetchAds(currentPage)
  }, [currentPage])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        const categoryNames = data.data.map((cat: any) => cat.name)
        setCategories(['All', ...categoryNames])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/stations')
      const data = await response.json()
      if (data.success) {
        const stationNames = data.data.map((station: any) => station.name)
        setStations(['All Stations', ...stationNames])
      }
    } catch (error) {
      console.error('Error fetching stations:', error)
    }
  }

  const fetchAds = async (page: number) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '20')
      if (searchQuery) params.append('query', searchQuery)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (selectedStation !== 'All Stations') params.append('station', selectedStation)

      const response = await fetch(`/api/ads?${params}`)
      const data = await response.json()

      if (data.success) {
        setAds(data.data)
        setTotalPages(data.pagination.totalPages)
        setTotalResults(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Find Radio Ads
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Search through thousands of New Zealand radio advertisements
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#00d4ff] text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for ads, brands, or offers..."
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[#1a1f2e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all text-lg"
            />
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="text-[#94a3b8]" />
            <span className="text-sm text-[#94a3b8]">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#00d4ff] text-[#0a0f1e]'
                    : 'bg-[#1a1f2e] text-[#94a3b8] border border-[#2a2f3e] hover:border-[#00d4ff]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Station Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-[#94a3b8]">Station:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stations.map((station) => (
              <motion.button
                key={station}
                onClick={() => setSelectedStation(station)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStation === station
                    ? 'bg-[#00ff88] text-[#0a0f1e]'
                    : 'bg-[#1a1f2e] text-[#94a3b8] border border-[#2a2f3e] hover:border-[#00ff88]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {station}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && totalResults > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-[#94a3b8]"
          >
            Found {totalResults} {totalResults === 1 ? 'ad' : 'ads'}
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {ads.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AdCardNew ad={ad} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && ads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] inline-block">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No ads found
              </h3>
              <p className="text-[#94a3b8]">
                Try adjusting your search or filters
              </p>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
