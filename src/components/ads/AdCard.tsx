'use client'

import Link from 'next/link'
import { formatRelativeTime, formatDuration } from '@/utils/helpers'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface AdCardProps {
  ad: {
    id: string
    title: string
    description?: string | null
    brand: string
    duration: number
    airDate: Date | string
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
      expiryDate?: Date | string | null
      discountPercent?: number | null
    }>
    _count?: {
      favorites: number
    }
  }
}

export default function AdCard({ ad }: AdCardProps) {
  const hasActiveOffer = ad.offers && ad.offers.length > 0

  return (
    <Card variant="elevated" className="overflow-hidden hover:scale-[1.02] transition-transform">
      <Link href={`/ads/${ad.id}`}>
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          {ad.thumbnailUrl ? (
            <img
              src={ad.thumbnailUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <svg
                  className="w-16 h-16 mx-auto mb-2 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <p className="text-sm font-medium">{ad.brand}</p>
              </div>
            </div>
          )}

          {/* Active Offer Badge */}
          {hasActiveOffer && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              OFFER
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(ad.duration)}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Station & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">
              {ad.station.name} {ad.station.frequency && `• ${ad.station.frequency}`}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">{ad.category.name}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {ad.title}
          </h3>

          {/* Brand */}
          <p className="text-sm text-blue-600 font-medium mb-2">{ad.brand}</p>

          {/* Description */}
          {ad.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {ad.description}
            </p>
          )}

          {/* Offer Preview */}
          {hasActiveOffer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-green-700">
                {ad.offers[0].title}
              </p>
              {ad.offers[0].discountPercent && (
                <p className="text-xs text-green-600 mt-0.5">
                  {ad.offers[0].discountPercent}% Off
                </p>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(ad.airDate)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {ad.playCount} plays
            </span>
          </div>
        </CardContent>
      </Link>

      {/* Play Button */}
      <div className="px-4 pb-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            // This will be handled by the audio player
            window.location.href = `/ads/${ad.id}`
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Play Ad
        </Button>
      </div>
    </Card>
  )
}
