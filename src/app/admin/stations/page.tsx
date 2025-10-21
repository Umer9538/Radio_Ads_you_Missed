'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiRadio, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMapPin, FiLogOut
} from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Station {
  id: string
  name: string
  location: string
  frequency: string
  logo?: string
  website?: string
  _count?: {
    ads: number
  }
}

export default function AdminStationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    frequency: '',
    logo: '',
    website: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/auth/signin?callbackUrl=/admin/stations')
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchStations()
      }
    }
  }, [status, session, router])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stations')
      const data = await response.json()

      if (data.success) {
        setStations(data.data)
      }
    } catch (error) {
      console.error('Error fetching stations:', error)
      toast.error('Failed to load stations')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (station?: Station) => {
    if (station) {
      setEditingStation(station)
      setFormData({
        name: station.name,
        location: station.location,
        frequency: station.frequency,
        logo: station.logo || '',
        website: station.website || ''
      })
    } else {
      setEditingStation(null)
      setFormData({
        name: '',
        location: '',
        frequency: '',
        logo: '',
        website: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStation(null)
    setFormData({
      name: '',
      location: '',
      frequency: '',
      logo: '',
      website: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingStation
        ? `/api/admin/stations/${editingStation.id}`
        : '/api/admin/stations'

      const method = editingStation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${editingStation ? 'update' : 'create'} station`)
      }

      toast.success(`Station ${editingStation ? 'updated' : 'created'} successfully!`)
      handleCloseModal()
      fetchStations()
    } catch (error: any) {
      console.error('Error saving station:', error)
      toast.error(error.message || `Failed to ${editingStation ? 'update' : 'create'} station`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (station: Station) => {
    if (!confirm(`Are you sure you want to delete "${station.name}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/stations/${station.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete station')
      }

      toast.success('Station deleted successfully!')
      fetchStations()
    } catch (error: any) {
      console.error('Error deleting station:', error)
      toast.error(error.message || 'Failed to delete station')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FiRadio className="text-[#00d4ff]" />
                Manage{' '}
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  Stations
                </span>
              </h1>
              <p className="text-[#94a3b8]">Add, edit, and manage radio stations</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg border border-[#2a2f3e] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all"
                >
                  Back to Admin
                </motion.button>
              </Link>
              <motion.button
                onClick={() => signOut({ callbackUrl: '/admin/auth/signin' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <FiLogOut />
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => handleOpenModal()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white font-bold hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all flex items-center gap-2"
          >
            <FiPlus className="text-xl" />
            Add New Station
          </motion.button>
        </motion.div>

        {/* Stations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stations.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#00d4ff]/20">
                    <FiRadio className="text-2xl text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{station.name}</h3>
                    <p className="text-sm text-[#94a3b8]">{station.frequency}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <FiMapPin className="text-[#00ff88]" />
                  <span className="text-sm">{station.location}</span>
                </div>
                {station._count && (
                  <p className="text-sm text-[#94a3b8]">
                    {station._count.ads} ads
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#2a2f3e]">
                <motion.button
                  onClick={() => handleOpenModal(station)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <FiEdit2 />
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(station)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <FiTrash2 />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {stations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">No stations found. Create your first station!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingStation ? 'Edit Station' : 'Create New Station'}
                </h2>
                <motion.button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-[#2a2f3e] transition-colors"
                >
                  <FiX className="text-2xl text-[#94a3b8]" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Station Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., ZM 91.0 FM"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Auckland, New Zealand"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Frequency *
                  </label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., 91.0 FM"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                      loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] hover:shadow-lg hover:shadow-[#00d4ff]/50'
                    } transition-all`}
                  >
                    <FiSave />
                    {loading ? 'Saving...' : editingStation ? 'Update Station' : 'Create Station'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-[#2a2f3e] hover:bg-[#3a3f4e] transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
