'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiShield, FiMail, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

function AdminSigninForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error || 'Invalid email or password')
        setLoading(false)
        return
      }

      if (result?.ok) {
        // Check if user is admin
        const response = await fetch('/api/user/profile')
        const data = await response.json()

        if (data.success && (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN')) {
          toast.success('Welcome back, Admin!')
          router.push(callbackUrl)
        } else {
          // Not an admin, sign them out
          toast.error('Access denied. Admin privileges required.')
          await fetch('/api/auth/signout', { method: 'POST' })
          setLoading(false)
        }
      }
    } catch (error: any) {
      console.error('Signin error:', error)
      toast.error('An error occurred during sign in')
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
              Admin Portal
            </h1>
            <p className="text-[#94a3b8]">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
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
                Password
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
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#00d4ff] hover:text-[#00ff88] transition-colors"
              >
                Forgot password?
              </Link>
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
              {loading ? 'Signing In...' : 'Sign In to Admin Portal'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2f3e]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1f2e] text-[#94a3b8]">or</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-[#94a3b8]">
              Need an admin account?{' '}
              <Link
                href="/admin/auth/signup"
                className="text-[#00d4ff] hover:text-[#00ff88] font-semibold transition-colors"
              >
                Register Here
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
              Admin access only - Unauthorized access is prohibited
            </span>
          </div>
        </motion.div>

        {/* Regular User Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-[#94a3b8]">
            Regular user?{' '}
            <Link
              href="/auth/signin"
              className="text-[#00d4ff] hover:text-[#00ff88] transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminSigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
      </div>
    }>
      <AdminSigninForm />
    </Suspense>
  )
}
