'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiTag, FiLogOut
} from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  _count?: {
    ads: number
  }
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/auth/signin?callbackUrl=/admin/categories')
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchCategories()
      }
    }
  }, [status, session, router])

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
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || ''
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: ''
    })
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'

      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${editingCategory ? 'update' : 'create'} category`)
      }

      toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully!`)
      handleCloseModal()
      fetchCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error(error.message || `Failed to ${editingCategory ? 'update' : 'create'} category`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete category')
      }

      toast.success('Category deleted successfully!')
      fetchCategories()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error(error.message || 'Failed to delete category')
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
                <FiGrid className="text-[#00ff88]" />
                Manage{' '}
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  Categories
                </span>
              </h1>
              <p className="text-[#94a3b8]">Add, edit, and manage ad categories</p>
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
            Add New Category
          </motion.button>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] hover:border-[#00ff88]/50 transition-all"
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="p-4 rounded-xl bg-[#00ff88]/20 mb-3">
                  <FiTag className="text-3xl text-[#00ff88]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-[#94a3b8] mb-2">/{category.slug}</p>
                {category.description && (
                  <p className="text-xs text-[#94a3b8] line-clamp-2">{category.description}</p>
                )}
              </div>

              {category._count && (
                <p className="text-sm text-center text-[#94a3b8] mb-4">
                  {category._count.ads} ads
                </p>
              )}

              <div className="flex gap-2 pt-4 border-t border-[#2a2f3e]">
                <motion.button
                  onClick={() => handleOpenModal(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <FiEdit2 />
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <FiTrash2 />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">No categories found. Create your first category!</p>
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
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Retail & Shopping"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., retail-shopping"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-[#94a3b8] mt-1">
                    URL-friendly version (lowercase, hyphens only)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Icon (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 🛍️ or icon URL"
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
                    {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
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
