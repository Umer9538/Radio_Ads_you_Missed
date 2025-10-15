'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiShoppingBag, FiTruck, FiCoffee, FiFilm, FiTool,
  FiHome, FiHeart, FiCpu, FiMapPin, FiCalendar
} from 'react-icons/fi'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  active: boolean
  _count?: {
    ads: number
  }
}

const categoryIcons: Record<string, any> = {
  'retail': FiShoppingBag,
  'automotive': FiTruck,
  'food-beverage': FiCoffee,
  'entertainment': FiFilm,
  'services': FiTool,
  'real-estate': FiHome,
  'health-beauty': FiHeart,
  'technology': FiCpu,
  'travel-tourism': FiMapPin,
  'events': FiCalendar,
}

const categoryColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-cyan-500',
  'from-red-500 to-pink-500',
  'from-violet-500 to-purple-500',
]

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

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
            Ad{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Browse advertisements by category and find exactly what you're looking for
          </p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] h-64 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.slug] || FiShoppingBag
              const colorClass = categoryColors[index % categoryColors.length]

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/search?category=${category.id}`}>
                    <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] group cursor-pointer overflow-hidden hover:scale-105 hover:border-[#00d4ff]/50 transition-all duration-300 h-full">
                      {/* Category Icon Header */}
                      <div className={`relative h-40 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="text-white"
                        >
                          <Icon className="text-7xl" />
                        </motion.div>

                        {/* Ad Count Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full text-white font-bold text-sm"
                        >
                          {category._count?.ads || 0} ads
                        </motion.div>
                      </div>

                      {/* Category Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00d4ff] group-hover:to-[#00ff88] transition-all">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Action Button */}
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-[#00d4ff] font-semibold"
                        >
                          <span>Browse Ads</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiShoppingBag,
                  label: 'Total Categories',
                  value: categories.length,
                  color: '#00d4ff'
                },
                {
                  icon: FiFilm,
                  label: 'Total Ads',
                  value: categories.reduce((sum, cat) => sum + (cat._count?.ads || 0), 0),
                  color: '#ff1b6b'
                },
                {
                  icon: FiHeart,
                  label: 'Active Categories',
                  value: categories.filter(cat => cat.active).length,
                  color: '#00ff88'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="inline-block p-4 rounded-xl mb-4"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="text-3xl" style={{ color: stat.color }} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[#94a3b8]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
              Try our advanced search to filter by keywords, stations, and date ranges
            </p>
            <Link href="/search">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg inline-flex items-center gap-3"
              >
                <FiShoppingBag className="text-xl" />
                Advanced Search
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
