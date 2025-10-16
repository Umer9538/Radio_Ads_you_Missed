'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiShield, FiLogOut
} from 'react-icons/fi'
import Link from 'next/link'
import Pagination from '@/components/ui/Pagination'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  emailVerified: Date | null
  createdAt: Date
  _count: {
    favorites: number
    playHistory: number
    claimedOffers: number
  }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN'>('USER')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/auth/signin?callbackUrl=/admin/users')
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchUsers()
      }
    }
  }, [status, session, router, currentPage, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (searchQuery) {
        queryParams.append('search', searchQuery)
      }

      if (roleFilter) {
        queryParams.append('role', roleFilter)
      }

      const response = await fetch(`/api/admin/users?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setTotalPages(data.pagination.totalPages)
        setTotalUsers(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchUsers()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user)
    setSelectedRole(user.role)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setSelectedRole('USER')
  }

  const handleUpdateRole = async () => {
    if (!editingUser) return

    try {
      setLoading(true)

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user role')
      }

      toast.success('User role updated successfully!')
      handleCloseEditModal()
      fetchUsers()
    } catch (error: any) {
      console.error('Error updating user role:', error)
      toast.error(error.message || 'Failed to update user role')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}? This cannot be undone and will delete all their data.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete user')
      }

      toast.success('User deleted successfully!')
      fetchUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || 'Failed to delete user')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-[#ff1b6b]/20 text-[#ff1b6b]'
      case 'ADMIN':
        return 'bg-[#00d4ff]/20 text-[#00d4ff]'
      default:
        return 'bg-[#00ff88]/20 text-[#00ff88]'
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
                <FiUsers className="text-[#00d4ff]" />
                Manage{' '}
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  Users
                </span>
              </h1>
              <p className="text-[#94a3b8]">View and manage user accounts</p>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by email or name..."
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  />
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xl" />
                </div>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
              >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white font-bold hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all flex items-center gap-2"
              >
                <FiSearch />
                Search
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              All Users
            </h2>
            {!loading && totalUsers > 0 && (
              <div className="text-[#94a3b8]">
                {totalUsers} total users • Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Name</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Role</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Verified</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Activity</th>
                    <th className="text-right p-4 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-white font-medium">{user.email}</td>
                        <td className="p-4 text-gray-300">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.lastName || '-'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getRoleBadgeColor(user.role)}`}>
                            {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? (
                              <FiShield className="text-xs" />
                            ) : null}
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.emailVerified ? (
                            <span className="text-[#00ff88] text-sm">✓ Verified</span>
                          ) : (
                            <span className="text-[#ff6b00] text-sm">Not verified</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-300 text-sm">
                          {user._count.favorites} favorites • {user._count.playHistory} plays
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              onClick={() => handleOpenEditModal(user)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30"
                              title="Edit Role"
                              disabled={user.id === session?.user?.id}
                            >
                              <FiEdit2 />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteUser(user)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete User"
                              disabled={user.id === session?.user?.id}
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
                        No users found
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

      {/* Edit Role Modal */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit User Role</h2>
                <motion.button
                  onClick={handleCloseEditModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-[#2a2f3e] transition-colors"
                >
                  <FiX className="text-2xl text-[#94a3b8]" />
                </motion.button>
              </div>

              <div className="mb-6">
                <p className="text-[#94a3b8] mb-2">User: {editingUser.email}</p>
                <p className="text-[#94a3b8] text-sm">
                  Current Role: <span className="text-white font-semibold">{editingUser.role}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Select New Role
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] cursor-pointer hover:border-[#00ff88] transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={selectedRole === 'USER'}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-4 h-4 text-[#00ff88]"
                    />
                    <div>
                      <div className="text-white font-semibold">User</div>
                      <div className="text-xs text-[#94a3b8]">Regular user access</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] cursor-pointer hover:border-[#00d4ff] transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={selectedRole === 'ADMIN'}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-4 h-4 text-[#00d4ff]"
                    />
                    <div>
                      <div className="text-white font-semibold">Admin</div>
                      <div className="text-xs text-[#94a3b8]">Can manage content and users</div>
                    </div>
                  </label>
                  {session?.user?.role === 'SUPER_ADMIN' && (
                    <label className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] cursor-pointer hover:border-[#ff1b6b] transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="SUPER_ADMIN"
                        checked={selectedRole === 'SUPER_ADMIN'}
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        className="w-4 h-4 text-[#ff1b6b]"
                      />
                      <div>
                        <div className="text-white font-semibold">Super Admin</div>
                        <div className="text-xs text-[#94a3b8]">Full system access</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={handleUpdateRole}
                  disabled={loading || selectedRole === editingUser.role}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                    loading || selectedRole === editingUser.role
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] hover:shadow-lg hover:shadow-[#00d4ff]/50'
                  } transition-all`}
                >
                  <FiSave />
                  {loading ? 'Updating...' : 'Update Role'}
                </motion.button>
                <motion.button
                  onClick={handleCloseEditModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-[#2a2f3e] hover:bg-[#3a3f4e] transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
