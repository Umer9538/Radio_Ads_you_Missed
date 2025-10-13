// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Audio
export const SUPPORTED_AUDIO_FORMATS = ['.mp3', '.aac', '.wav']
export const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const AUDIO_BITRATE = 128 // kbps

// Search
export const SEARCH_DEBOUNCE_MS = 300
export const MAX_SEARCH_RESULTS = 100

// Cache TTL (in seconds)
export const CACHE_TTL = {
  ADS: 300, // 5 minutes
  STATIONS: 3600, // 1 hour
  CATEGORIES: 3600, // 1 hour
  USER_PROFILE: 600, // 10 minutes
}

// Categories (default)
export const DEFAULT_CATEGORIES = [
  { name: 'Retail', slug: 'retail' },
  { name: 'Automotive', slug: 'automotive' },
  { name: 'Food & Beverage', slug: 'food-beverage' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Services', slug: 'services' },
  { name: 'Real Estate', slug: 'real-estate' },
  { name: 'Health & Beauty', slug: 'health-beauty' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Travel & Tourism', slug: 'travel-tourism' },
  { name: 'Events', slug: 'events' },
]

// New Zealand Radio Stations (default)
export const DEFAULT_STATIONS = [
  { name: 'ZM', frequency: '91.0 FM', location: 'Auckland' },
  { name: 'The Rock', frequency: '93.4 FM', location: 'Auckland' },
  { name: 'The Edge', frequency: '94.2 FM', location: 'Auckland' },
  { name: 'Newstalk ZB', frequency: '89.4 FM', location: 'Auckland' },
  { name: 'The Breeze', frequency: '98.4 FM', location: 'Auckland' },
  { name: 'Radio Hauraki', frequency: '99.0 FM', location: 'Auckland' },
  { name: 'More FM', frequency: '91.8 FM', location: 'Auckland' },
  { name: 'Coast', frequency: '105.4 FM', location: 'Auckland' },
]

// Routes
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  STATIONS: '/stations',
  CATEGORIES: '/categories',
  AD_DETAIL: (id: string) => `/ads/${id}`,
  STATION_DETAIL: (id: string) => `/stations/${id}`,
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  FAVORITES: '/dashboard/favorites',
  CLAIMED_OFFERS: '/dashboard/claimed',
  ALERTS: '/dashboard/alerts',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ADS: '/admin/ads',
  ADMIN_STATIONS: '/admin/stations',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
}
