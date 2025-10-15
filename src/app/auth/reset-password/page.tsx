'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FiLock, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { showToast } from '@/utils/toast'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [email, setEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        showToast.error('Invalid reset link')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (data.success && data.valid) {
          setTokenValid(true)
          setEmail(data.email)
        } else {
          showToast.error(data.error || 'Invalid or expired reset link')
        }
      } catch (error) {
        showToast.error('Failed to verify reset link')
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      showToast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      showToast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResetSuccess(true)
        showToast.success('Password reset successful!')

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        showToast.error(data.error || 'Failed to reset password')
      }
    } catch (error) {
      showToast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Verifying token state
  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
          <p className="text-[#94a3b8]">Verifying reset link...</p>
        </motion.div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 md:p-10 border border-[#ff1b6b]/50 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ff1b6b]/20 flex items-center justify-center"
            >
              <FiAlertCircle className="text-[#ff1b6b] text-4xl" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-3">Invalid Reset Link</h2>
            <p className="text-[#94a3b8] mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <Link href="/auth/forgot-password">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg"
              >
                Request New Link
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 md:p-10 border border-[#00ff88]/50 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center"
            >
              <FiCheck className="text-[#00ff88] text-4xl" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-3">Password Reset Successful!</h2>
            <p className="text-[#94a3b8] mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>

            <p className="text-sm text-[#64748b]">
              Redirecting to sign in page...
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Sign In Link */}
        <Link href="/auth/signin">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <FiArrowLeft />
            <span>Back to Sign In</span>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f2e] rounded-2xl p-8 md:p-10 border border-[#2a2f3e]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
              <FiLock className="text-[#00d4ff] text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-[#94a3b8]">
              Enter a new password for <span className="text-[#00d4ff] font-semibold">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all disabled:opacity-50"
                placeholder="Enter new password"
              />
              <p className="text-xs text-[#64748b] mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all disabled:opacity-50"
                placeholder="Confirm new password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <FiLock />
                  Reset Password
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
