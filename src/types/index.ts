// Re-export Prisma types
export * from '@/generated/prisma'

// Custom types
export interface SearchFilters {
  query?: string
  stationIds?: string[]
  categoryIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  brands?: string[]
  tags?: string[]
  hasActiveOffer?: boolean
  sortBy?: 'relevance' | 'date_desc' | 'date_asc' | 'popularity'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentAdId: string | null
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
}

export interface AnalyticsEvent {
  eventType: 'play' | 'pause' | 'complete' | 'skip' | 'seek' | 'claim_offer'
  adId: string
  timestamp: Date
  metadata?: Record<string, any>
}
