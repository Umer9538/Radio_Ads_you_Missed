'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiShoppingBag, FiTruck, FiCoffee, FiFilm, FiTool,
  FiHome, FiHeart, FiCpu, FiMapPin, FiCalendar
} from 'react-icons/fi'
import Link from 'next/link'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <FloatingParticles count={50} />
      <MorphingBlob className="top-0 left-0" color="from-blue-500 to-cyan-500" size={600} />
      <MorphingBlob className="bottom-0 right-0" color="from-purple-500 to-pink-500" size={500} />
      <MorphingBlob className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" color="from-green-500 to-emerald-500" size={400} />

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
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            🏷️
          </motion.div>

          <HolographicText as="h1" className="text-6xl mb-4">
            Ad Categories
          </HolographicText>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
              >
                <GlassmorphicCard className="h-64 animate-pulse" />
              </motion.div>
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
                    <GlassmorphicCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 h-full">
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
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Action Button */}
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-purple-400 font-semibold"
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
                    </GlassmorphicCard>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <GlassmorphicCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiShoppingBag,
                  label: 'Total Categories',
                  value: categories.length,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: FiFilm,
                  label: 'Total Ads',
                  value: categories.reduce((sum, cat) => sum + (cat._count?.ads || 0), 0),
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: FiHeart,
                  label: 'Active Categories',
                  value: categories.filter(cat => cat.active).length,
                  color: 'from-green-500 to-emerald-500'
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
                  <motion.div
                    className={`inline-block p-4 rounded-full bg-gradient-to-br ${stat.color} mb-4`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="text-3xl text-white" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </GlassmorphicCard>
        </motion.div>

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
              Can't Find What You're Looking For?
            </HolographicText>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Try our advanced search to filter by keywords, stations, and date ranges
            </p>
            <Link href="/search">
              <MagneticButton className="px-12 py-6">
                <FiShoppingBag className="mr-2 text-2xl" />
                <span className="text-xl">Advanced Search</span>
              </MagneticButton>
            </Link>
          </GlassmorphicCard>
        </motion.div>
      </div>
    </div>
  )
}
