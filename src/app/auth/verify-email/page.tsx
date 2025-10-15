'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { showToast } from '@/utils/toast'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link')
        setVerifying(false)
        return
      }

      try {
        // First check if token is valid
        const checkResponse = await fetch(`/api/auth/verify-email?token=${token}`)
        const checkData = await checkResponse.json()

        if (!checkData.valid) {
          setError(checkData.error || 'Invalid or expired verification link')
          setVerifying(false)
          return
        }

        setEmail(checkData.email)

        // Verify the email
        const verifyResponse = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const verifyData = await verifyResponse.json()

        if (verifyData.success) {
          setVerified(true)
          showToast.success('Email verified successfully!')

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 3000)
        } else {
          setError(verifyData.error || 'Failed to verify email')
          showToast.error(verifyData.error || 'Failed to verify email')
        }
      } catch (err) {
        setError('An error occurred while verifying your email')
        showToast.error('An error occurred while verifying your email')
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token, router])

  // Verifying state
  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-lg">Verifying your email...</p>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (verified) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

        {/* Atmospheric glows */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />

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

            <h2 className="text-2xl font-bold text-white mb-3">Email Verified!</h2>
            <p className="text-[#94a3b8] mb-2">
              Your email address has been successfully verified.
            </p>
            <p className="text-[#00d4ff] font-semibold mb-6">{email}</p>

            <p className="text-sm text-[#64748b] mb-6">
              You now have full access to all features.
            </p>

            <p className="text-xs text-[#64748b]">
              Redirecting to dashboard...
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />

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

          <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
          <p className="text-[#94a3b8] mb-6">
            {error || 'Unable to verify your email address.'}
          </p>

          <div className="space-y-3">
            <Link href="/auth/resend-verification">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg flex items-center justify-center gap-2"
              >
                <FiRefreshCw />
                Request New Link
              </motion.button>
            </Link>

            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl border-2 border-[#94a3b8] text-[#94a3b8] font-semibold"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
