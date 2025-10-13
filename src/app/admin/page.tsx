'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiUsers, FiRadio, FiPlayCircle, FiGift, FiTrendingUp,
  FiPlus, FiEdit, FiTrash2, FiEye
} from 'react-icons/fi'
import Link from 'next/link'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

interface AdminStats {
  totalUsers: number
  totalAds: number
  totalStations: number
  totalOffers: number
  totalPlays: number
  totalClaims: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAds: 0,
    totalStations: 0,
    totalOffers: 0,
    totalPlays: 0,
    totalClaims: 0
  })
  const [recentAds, setRecentAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch various data
      const [adsRes, stationsRes] = await Promise.all([
        fetch('/api/ads?limit=10'),
        fetch('/api/stations')
      ])

      const adsData = await adsRes.json()
      const stationsData = await stationsRes.json()

      if (adsData.success) {
        setRecentAds(adsData.data)

        // Calculate stats
        const totalPlays = adsData.data.reduce((sum: number, ad: any) => sum + ad.playCount, 0)
        const totalOffers = adsData.data.reduce((sum: number, ad: any) => sum + (ad.offers?.length || 0), 0)

        setStats({
          totalUsers: 2, // From seed data
          totalAds: adsData.data.length,
          totalStations: stationsData.success ? stationsData.data.length : 0,
          totalOffers,
          totalPlays,
          totalClaims: 0 // Would come from claims API
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      icon: FiPlayCircle,
      label: 'Total Ads',
      value: stats.totalAds,
      color: 'from-purple-500 to-pink-500',
      change: '+8%'
    },
    {
      icon: FiRadio,
      label: 'Radio Stations',
      value: stats.totalStations,
      color: 'from-green-500 to-emerald-500',
      change: '+2%'
    },
    {
      icon: FiGift,
      label: 'Active Offers',
      value: stats.totalOffers,
      color: 'from-orange-500 to-red-500',
      change: '+15%'
    },
    {
      icon: FiTrendingUp,
      label: 'Total Plays',
      value: stats.totalPlays,
      color: 'from-indigo-500 to-purple-500',
      change: '+25%'
    },
    {
      icon: FiGift,
      label: 'Offers Claimed',
      value: stats.totalClaims,
      color: 'from-pink-500 to-rose-500',
      change: '+18%'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <FloatingParticles count={50} />
      <MorphingBlob className="top-0 right-0" color="from-blue-500 to-cyan-500" size={600} />
      <MorphingBlob className="bottom-0 left-0" color="from-purple-500 to-pink-500" size={500} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <HolographicText as="h1" className="text-5xl mb-2">
                Admin Dashboard
              </HolographicText>
              <p className="text-xl text-gray-300">
                Manage your radio ads platform
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin/ads/new">
                <MagneticButton>
                  <FiPlus className="mr-2" />
                  Add New Ad
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="text-2xl text-white" />
                  </motion.div>
                  <span className="text-green-400 text-sm font-semibold">
                    {stat.change}
                  </span>
                </div>

                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-300">{stat.label}</div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <GlassmorphicCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/admin/ads">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Manage Ads
                </motion.button>
              </Link>

              <Link href="/admin/stations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  Manage Stations
                </motion.button>
              </Link>

              <Link href="/admin/users">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  Manage Users
                </motion.button>
              </Link>

              <Link href="/admin/offers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                >
                  Manage Offers
                </motion.button>
              </Link>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Recent Ads Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <HolographicText as="h2" className="text-3xl">
              Recent Advertisements
            </HolographicText>
          </div>

          <GlassmorphicCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-300 font-semibold">Title</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Brand</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Station</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Plays</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                    <th className="text-right p-4 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : recentAds.length > 0 ? (
                    recentAds.map((ad, index) => (
                      <motion.tr
                        key={ad.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-white font-medium">{ad.title}</td>
                        <td className="p-4 text-gray-300">{ad.brand}</td>
                        <td className="p-4 text-gray-300">{ad.station.name}</td>
                        <td className="p-4 text-gray-300">{ad.playCount}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            ad.status === 'PUBLISHED'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/ads/${ad.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              >
                                <FiEye />
                              </motion.button>
                            </Link>
                            <Link href={`/admin/ads/${ad.id}/edit`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                              >
                                <FiEdit />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No ads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassmorphicCard>
        </motion.div>
      </div>
    </div>
  )
}
