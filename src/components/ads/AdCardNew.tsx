'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiPlay, FiHeart, FiMapPin, FiClock, FiRadio } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { showToast, TOAST_MESSAGES } from '@/utils/toast'

interface AdCardProps {
  ad: {
    id: string
    title: string
    description?: string | null
    brand: string
    duration: number
    category: {
      name: string
      slug: string
    }
    station: {
      name: string
      frequency?: string | null
      location?: string
    }
    offers?: Array<{
      id: string
      title: string
      expiryDate?: Date | null
    }>
    airDate: Date
    playCount?: number
  }
}

export default function AdCardNew({ ad }: AdCardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

  // Generate random waveform heights for visualization
  const waveformBars = Array.from({ length: 8 }, () => Math.random() * 60 + 20)

  // Check favorite status on mount
  useEffect(() => {
    if (status === 'authenticated') {
      checkFavoriteStatus()
    }
  }, [status, ad.id])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/${ad.id}`)
      const data = await response.json()
      if (data.success) {
        setIsFavorite(data.data.isFavorited)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      showToast.error('Please sign in to save favorites')
      router.push(`/auth/signin?callbackUrl=${window.location.pathname}`)
      return
    }

    if (isFavoriteLoading) return

    try {
      setIsFavoriteLoading(true)

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${ad.id}`, {
          method: 'DELETE',
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(false)
          showToast.success(TOAST_MESSAGES.FAVORITE_REMOVED)
        } else {
          showToast.error(data.error || 'Failed to remove from favorites')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adId: ad.id }),
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(true)
          showToast.success(TOAST_MESSAGES.FAVORITE_ADDED)
        } else {
          showToast.error(data.error || 'Failed to add to favorites')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      showToast.error(TOAST_MESSAGES.GENERIC_ERROR)
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else {
      return `${minutes}m ago`
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const hasVoucher = ad.offers && ad.offers.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all group"
    >
      <div className="flex gap-4">
        {/* Play Button & Waveform */}
        <div className="flex items-center gap-3">
          {/* Play Button */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00d4ff]/20 border-2 border-[#00d4ff] flex items-center justify-center hover:bg-[#00d4ff]/30 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiPlay className="text-[#00d4ff] ml-0.5" size={20} />
          </motion.button>

          {/* Waveform Visualization */}
          <div className="flex items-center gap-0.5 h-12">
            {waveformBars.map((height, index) => (
              <motion.div
                key={index}
                className="w-1 bg-[#00d4ff] rounded-full"
                style={{ height: `${height}%` }}
                animate={isPlaying ? {
                  height: [`${height}%`, `${Math.random() * 60 + 20}%`, `${height}%`]
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isPlaying ? Infinity : 0,
                  delay: index * 0.05
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <Link href={`/ads/${ad.id}`}>
                <h3 className="text-lg font-bold text-white hover:text-[#00d4ff] transition-colors line-clamp-1">
                  {ad.title}
                </h3>
              </Link>
            </div>

            <motion.button
              onClick={toggleFavorite}
              disabled={isFavoriteLoading}
              className="flex-shrink-0 disabled:opacity-50"
              whileHover={{ scale: isFavoriteLoading ? 1 : 1.1 }}
              whileTap={{ scale: isFavoriteLoading ? 1 : 0.9 }}
            >
              <FiHeart
                className={`${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-[#94a3b8]'
                } transition-colors`}
                size={20}
              />
            </motion.button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Category Badge */}
            <span className="px-2.5 py-0.5 bg-[#0a0f1e] rounded text-xs font-medium text-[#94a3b8]">
              {ad.category.name}
            </span>

            {/* Voucher Badge */}
            {hasVoucher && (
              <span className="px-2.5 py-0.5 bg-[#00ff88]/20 border border-[#00ff88] rounded-full text-xs font-semibold text-[#00ff88]">
                Voucher Available
              </span>
            )}
          </div>

          {/* Description */}
          {ad.description && (
            <p className="text-sm text-[#94a3b8] mb-3 line-clamp-2">
              {ad.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b] mb-3">
            <span className="flex items-center gap-1">
              <FiRadio size={14} />
              {ad.station.name}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {formatTimeAgo(ad.airDate)} • {formatDuration(ad.duration)}
            </span>
            {ad.station.location && (
              <span className="flex items-center gap-1">
                <FiMapPin size={14} />
                {ad.station.location}
              </span>
            )}
          </div>

          {/* View Details Button */}
          <Link href={`/ads/${ad.id}`}>
            <motion.button
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold text-sm hover:opacity-90 transition-all inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
