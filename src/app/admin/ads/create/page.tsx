'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import FileUpload from '@/components/admin/FileUpload'
import toast from 'react-hot-toast'

interface Station {
  id: string
  name: string
  location: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function CreateAdPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [stations, setStations] = useState<Station[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [airDate, setAirDate] = useState('')
  const [stationId, setStationId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [adStatus, setAdStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/ads/create')
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchData()
      }
    }
  }, [status, session, router])

  const fetchData = async () => {
    try {
      const [stationsRes, categoriesRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/categories'),
      ])

      const stationsData = await stationsRes.json()
      const categoriesData = await categoriesRes.json()

      if (stationsData.success) {
        setStations(stationsData.data)
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load stations and categories')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!title || !brand || !audioUrl || !stationId || !categoryId || !duration || !airDate) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          brand,
          audioUrl,
          thumbnailUrl,
          duration,
          airDate,
          stationId,
          categoryId,
          status: adStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create ad')
      }

      toast.success('Advertisement created successfully!')
      router.push('/admin')
    } catch (error: any) {
      console.error('Error creating ad:', error)
      toast.error(error.message || 'Failed to create advertisement')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[#00d4ff] mb-4 hover:text-[#00ff88] transition-colors"
            >
              <FiArrowLeft />
              <span>Back to Admin Dashboard</span>
            </motion.button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Create New{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
              Advertisement
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8]">
            Upload audio and add advertisement details
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
              <h2 className="text-2xl font-bold text-white mb-6">Media Files</h2>

              {/* Audio Upload */}
              <FileUpload
                type="audio"
                label="Audio File *"
                onUploadSuccess={(url) => setAudioUrl(url)}
                onRemove={() => setAudioUrl('')}
                className="mb-6"
              />

              {/* Thumbnail Upload */}
              <FileUpload
                type="image"
                label="Thumbnail Image (Optional)"
                onUploadSuccess={(url) => setThumbnailUrl(url)}
                onRemove={() => setThumbnailUrl('')}
              />
            </div>

            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
              <h2 className="text-2xl font-bold text-white mb-6">Advertisement Details</h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ad title"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Enter brand name"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter ad description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Duration (seconds) *
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Air Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Air Date *
                  </label>
                  <input
                    type="date"
                    value={airDate}
                    onChange={(e) => setAirDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Station */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Radio Station *
                  </label>
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} - {station.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Status *
                  </label>
                  <select
                    value={adStatus}
                    onChange={(e) => setAdStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={loading || !audioUrl}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`
                  flex-1 px-8 py-4 rounded-xl font-bold text-white
                  flex items-center justify-center gap-2
                  ${loading || !audioUrl
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] hover:shadow-lg hover:shadow-[#00d4ff]/50'
                  }
                  transition-all
                `}
              >
                <FiSave />
                {loading ? 'Creating...' : 'Create Advertisement'}
              </motion.button>

              <Link href="/admin" className="flex-shrink-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold text-white bg-[#1a1f2e] border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all"
                >
                  Cancel
                </motion.button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
