'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiUsers, FiRadio, FiPlayCircle, FiGift, FiTrendingUp,
  FiPlus, FiEdit, FiTrash2, FiEye, FiGrid, FiLogOut, FiBarChart2, FiList
} from 'react-icons/fi'
import Link from 'next/link'
import Pagination from '@/components/ui/Pagination'
import toast from 'react-hot-toast'

interface AdminStats {
  totalUsers: number
  totalAds: number
  totalStations: number
  totalOffers: number
  totalPlays: number
  totalClaims: number
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAds, setTotalAds] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/auth/signin?callbackUrl=/admin')
    } else if (status === 'authenticated') {
      // Check if user is admin
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchAdminData()
      }
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && (session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN')) {
      fetchAds(currentPage)
    }
  }, [currentPage])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch admin stats and ads
      const [statsRes, adsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/ads?page=${currentPage}&limit=10`)
      ])

      const statsData = await statsRes.json()
      const adsData = await adsRes.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      if (adsData.success) {
        setRecentAds(adsData.data)
        setTotalPages(adsData.pagination.totalPages)
        setTotalAds(adsData.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAds = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ads?page=${page}&limit=10`)
      const data = await response.json()

      if (data.success) {
        setRecentAds(data.data)
        setTotalPages(data.pagination.totalPages)
        setTotalAds(data.pagination.total)
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

  const handleDeleteAd = async (ad: any) => {
    if (!confirm(`Are you sure you want to delete "${ad.title}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/ads/${ad.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete ad')
      }

      toast.success('Ad deleted successfully!')
      fetchAds(currentPage)
    } catch (error: any) {
      console.error('Error deleting ad:', error)
      toast.error(error.message || 'Failed to delete ad')
    }
  }

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      color: '#00d4ff'
    },
    {
      icon: FiPlayCircle,
      label: 'Total Ads',
      value: stats.totalAds,
      color: '#ff1b6b'
    },
    {
      icon: FiRadio,
      label: 'Radio Stations',
      value: stats.totalStations,
      color: '#00ff88'
    },
    {
      icon: FiGift,
      label: 'Active Offers',
      value: stats.totalOffers,
      color: '#ff6b00'
    },
    {
      icon: FiTrendingUp,
      label: 'Total Plays',
      value: stats.totalPlays,
      color: '#8b5cf6'
    },
    {
      icon: FiGrid,
      label: 'Offers Claimed',
      value: stats.totalClaims,
      color: '#00d4ff'
    }
  ]

  if (status === 'loading' || loading) {
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Admin{' '}
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-[#94a3b8]">
                Manage your radio ads platform
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => signOut({ callbackUrl: '/admin/auth/signin' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border-2 border-red-500 text-red-500 font-bold hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <FiLogOut />
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="text-2xl" style={{ color: stat.color }} />
                </div>
              </div>

              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-[#94a3b8]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Admin Actions</h2>
              <Link href="/admin/ads/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white font-bold hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
                >
                  <FiPlus className="text-xl" />
                  Create New Ad
                </motion.button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/analytics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiBarChart2 />
                  Analytics Dashboard
                </motion.button>
              </Link>

              <Link href="/admin/users">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl border-2 border-[#8b5cf6] text-[#8b5cf6] font-semibold hover:bg-[#8b5cf6]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FiUsers />
                  Manage Users
                </motion.button>
              </Link>

              <Link href="/admin/stations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl border-2 border-[#00d4ff] text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FiRadio />
                  Manage Stations
                </motion.button>
              </Link>

              <Link href="/admin/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 rounded-xl border-2 border-[#00ff88] text-[#00ff88] font-semibold hover:bg-[#00ff88]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FiGrid />
                  Manage Categories
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Ads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              All Advertisements
            </h2>
            {!loading && totalAds > 0 && (
              <div className="text-[#94a3b8]">
                {totalAds} total ads • Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
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
                  {recentAds.length > 0 ? (
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
                              ? 'bg-[#00ff88]/20 text-[#00ff88]'
                              : 'bg-[#ff6b00]/20 text-[#ff6b00]'
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
                                className="p-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30"
                                title="View"
                              >
                                <FiEye />
                              </motion.button>
                            </Link>
                            <Link href={`/admin/ads/edit/${ad.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/30"
                                title="Edit"
                              >
                                <FiEdit />
                              </motion.button>
                            </Link>
                            <motion.button
                              onClick={() => handleDeleteAd(ad)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#94a3b8]">
                        No ads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
