'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiShield, FiMail, FiLock, FiUser, FiKey } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      if (!formData.adminSecretKey) {
        toast.error('Admin secret key is required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create admin account')
      }

      toast.success('Admin account created successfully!')
      toast.success('Please sign in to continue')

      // Redirect to admin signin
      setTimeout(() => {
        router.push('/admin/auth/signin')
      }, 1500)
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create admin account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] mb-4"
            >
              <FiShield className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Registration
            </h1>
            <p className="text-[#94a3b8]">
              Create your admin account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                First Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Last Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Admin Secret Key */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Admin Secret Key *
              </label>
              <div className="relative">
                <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="password"
                  name="adminSecretKey"
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  placeholder="Enter admin or super admin secret key"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#94a3b8] focus:border-[#00d4ff] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#94a3b8]">
                  • <span className="text-[#00d4ff] font-semibold">Super Admin Key</span>: Creates SUPER_ADMIN (can manage all admins)
                </p>
                <p className="text-xs text-[#94a3b8]">
                  • <span className="text-[#00ff88] font-semibold">Admin Key</span>: Creates ADMIN (standard admin access)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`
                w-full py-3 rounded-xl font-bold text-white
                ${loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88] hover:shadow-lg hover:shadow-[#00d4ff]/50'
                }
                transition-all
              `}
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#94a3b8]">
              Already have an admin account?{' '}
              <Link
                href="/admin/auth/signin"
                className="text-[#00d4ff] hover:text-[#00ff88] font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1f2e]/50 border border-[#2a2f3e]">
            <FiShield className="text-[#00ff88]" />
            <span className="text-sm text-[#94a3b8]">
              Secure admin registration with secret key validation
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
