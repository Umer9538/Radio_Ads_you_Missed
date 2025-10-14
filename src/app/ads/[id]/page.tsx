'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiClock,
  FiMapPin,
  FiRadio,
  FiTag,
  FiHeart,
  FiShare2,
  FiCalendar,
  FiTrendingUp,
  FiGift,
  FiChevronLeft
} from 'react-icons/fi'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Link from 'next/link'

interface Ad {
  id: string
  title: string
  description: string
  brand: string
  product: string
  audioUrl: string
  thumbnailUrl?: string
  duration: number
  playCount: number
  createdAt: string
  airedAt: string
  tags: string[]
  station: {
    id: string
    name: string
    location: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  offers?: Array<{
    id: string
    title: string
    description: string
    code?: string
    discountAmount?: number
    originalPrice?: number
    expiresAt?: string
    claimCount: number
  }>
}

export default function AdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ad, setAd] = useState<Ad | null>(null)
  const [relatedAds, setRelatedAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [playCount, setPlayCount] = useState(0)

  useEffect(() => {
    fetchAdDetails()
  }, [params.id])

  const fetchAdDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ads/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setAd(data.data)
        setPlayCount(data.data.playCount)
        // Fetch related ads
        fetchRelatedAds(data.data.category.id, data.data.id)
      }
    } catch (error) {
      console.error('Error fetching ad:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedAds = async (categoryId: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/ads?categoryId=${categoryId}&limit=4`)
      const data = await response.json()
      if (data.success) {
        setRelatedAds(data.data.filter((a: Ad) => a.id !== excludeId))
      }
    } catch (error) {
      console.error('Error fetching related ads:', error)
    }
  }

  const handlePlay = async () => {
    try {
      await fetch(`/api/ads/${params.id}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: ad?.duration || 0 })
      })
      setPlayCount(prev => prev + 1)
    } catch (error) {
      console.error('Error tracking play:', error)
    }
  }

  const handleClaimOffer = async (offerId: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/claim`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        // Refresh ad data to update claim count
        fetchAdDetails()
      }
    } catch (error) {
      console.error('Error claiming offer:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: ad?.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0a0f1e] flex items-center justify-center">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/15 rounded-full blur-[120px]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl"
        >
          📻
        </motion.div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0a0f1e] flex items-center justify-center">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/15 rounded-full blur-[120px]" />
        <GlassmorphicCard className="p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ad Not Found</h2>
          <p className="text-gray-400 mb-6">The ad you're looking for doesn't exist.</p>
          <Link href="/search">
            <MagneticButton>Back to Search</MagneticButton>
          </Link>
        </GlassmorphicCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0f1e]">
      {/* Simplified background - only 2 glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/15 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <FiChevronLeft />
            <span>Back</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3D Flippable Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                style={{
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                  height: '500px'
                }}
              >
                {/* Front of card */}
                <motion.div
                  style={{
                    backfaceVisibility: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <GlassmorphicCard className="h-full overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative h-80 bg-gradient-to-br from-[#00d4ff] via-[#ff1b6b] to-[#ff6b00] animate-gradient-xy">
                      {ad.thumbnailUrl ? (
                        <img
                          src={ad.thumbnailUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <motion.div
                            className="text-white text-9xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          >
                            📻
                          </motion.div>
                        </div>
                      )}

                      {/* Floating Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                          onClick={() => setIsFavorited(!isFavorited)}
                          className="p-3 rounded-full bg-black/30 backdrop-blur-xl text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiHeart className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
                        </motion.button>

                        <motion.button
                          onClick={handleShare}
                          className="p-3 rounded-full bg-black/30 backdrop-blur-xl text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiShare2 />
                        </motion.button>
                      </div>

                      {/* Offers Badge */}
                      {ad.offers && ad.offers.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 left-4 px-4 py-2 bg-[#00ff88] rounded-full text-[#0a0f1e] font-bold shadow-lg flex items-center gap-2"
                        >
                          <FiGift />
                          <span>{ad.offers.length} {ad.offers.length === 1 ? 'Offer' : 'Offers'}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <FiRadio />
                          <span>{ad.station.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMapPin />
                          <span>{ad.station.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiTag />
                          <span>{ad.category.name}</span>
                        </div>
                      </div>

                      <HolographicText as="h1" className="text-4xl mb-4">
                        {ad.title}
                      </HolographicText>

                      <p className="text-gray-300 text-lg mb-4">
                        {ad.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                          <FiClock />
                          <span>{Math.floor(ad.duration / 60)}:{(ad.duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiTrendingUp />
                          <span>{playCount} plays</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          <span>{new Date(ad.airedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {ad.tags && ad.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ad.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </GlassmorphicCard>
                </motion.div>

                {/* Back of card */}
                <motion.div
                  style={{
                    backfaceVisibility: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    rotateY: 180
                  }}
                >
                  <GlassmorphicCard className="h-full p-8">
                    <HolographicText as="h2" className="text-3xl mb-6">
                      Additional Details
                    </HolographicText>

                    <div className="space-y-6 text-white">
                      <div>
                        <h3 className="text-lg font-bold mb-2">Brand</h3>
                        <p className="text-gray-300">{ad.brand}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2">Product</h3>
                        <p className="text-gray-300">{ad.product}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2">First Aired</h3>
                        <p className="text-gray-300">
                          {new Date(ad.airedAt).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2">Station Details</h3>
                        <p className="text-gray-300">
                          {ad.station.name} - {ad.station.location}
                        </p>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </motion.div>

              {/* Flip Button */}
              <motion.div className="flex justify-center mt-6">
                <MagneticButton onClick={() => setIsFlipped(!isFlipped)}>
                  {isFlipped ? 'Show Front' : 'Show Details'}
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Audio Player */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AudioPlayer
                audioUrl={ad.audioUrl}
                title={`${ad.brand} - ${ad.title}`}
                onPlay={handlePlay}
              />
            </motion.div>

            {/* Offers */}
            {ad.offers && ad.offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <HolographicText as="h2" className="text-3xl mb-6">
                  Available Offers
                </HolographicText>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ad.offers.map((offer, index) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <GlassmorphicCard className="p-6 group cursor-pointer hover:scale-105 transition-transform duration-300">
                        {/* Offer Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0f1e] text-sm font-bold"
                            animate={{
                              boxShadow: [
                                '0 0 20px rgba(0, 255, 136, 0.3)',
                                '0 0 40px rgba(0, 255, 136, 0.6)',
                                '0 0 20px rgba(0, 255, 136, 0.3)',
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <FiGift className="inline mr-1" />
                            OFFER
                          </motion.div>

                          {offer.expiresAt && (
                            <span className="text-xs text-gray-400">
                              Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00ff88] group-hover:to-[#00d4ff] transition-all">
                          {offer.title}
                        </h3>

                        <p className="text-gray-300 mb-4">{offer.description}</p>

                        {/* Pricing */}
                        {offer.discountAmount && (
                          <div className="mb-4">
                            <span className="text-2xl font-bold text-[#00ff88]">
                              {offer.discountAmount}% OFF
                            </span>
                            {offer.originalPrice && (
                              <div className="text-sm text-gray-400">
                                <span className="line-through">${offer.originalPrice}</span>
                                <span className="ml-2 text-[#00ff88] font-bold">
                                  ${(offer.originalPrice * (1 - offer.discountAmount / 100)).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Promo Code */}
                        {offer.code && (
                          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs text-gray-400">Promo Code:</span>
                            <div className="text-lg font-mono font-bold text-[#00d4ff]">
                              {offer.code}
                            </div>
                          </div>
                        )}

                        {/* Claim Stats */}
                        <div className="text-sm text-gray-400 mb-4">
                          {offer.claimCount} people claimed this offer
                        </div>

                        {/* Claim Button */}
                        <MagneticButton
                          onClick={() => handleClaimOffer(offer.id)}
                          className="w-full"
                        >
                          Claim Offer
                        </MagneticButton>
                      </GlassmorphicCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Ads */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HolographicText as="h2" className="text-2xl mb-6">
                Related Ads
              </HolographicText>

              <div className="space-y-4">
                {relatedAds.map((relatedAd, index) => (
                  <motion.div
                    key={relatedAd.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={`/ads/${relatedAd.id}`}>
                      <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                        {/* Thumbnail */}
                        <div className="relative h-32 bg-gradient-to-br from-[#00d4ff] via-[#ff1b6b] to-[#ff6b00] animate-gradient-xy">
                          {relatedAd.thumbnailUrl ? (
                            <img
                              src={relatedAd.thumbnailUrl}
                              alt={relatedAd.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-5xl">📻</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff1b6b] group-hover:to-[#00d4ff] transition-all">
                            {relatedAd.title}
                          </h3>
                          <p className="text-sm text-gray-400">{relatedAd.brand}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>{relatedAd.station.name}</span>
                            <span>{relatedAd.playCount} plays</span>
                          </div>
                        </div>
                      </GlassmorphicCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
