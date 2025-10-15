'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { showToast } from '@/utils/toast'

export default function ResendVerificationPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleResend = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setSent(true)
        showToast.success('Verification email sent successfully!')
      } else {
        showToast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      showToast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Dashboard Link */}
        <Link href="/dashboard">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f2e] rounded-2xl p-8 md:p-10 border border-[#2a2f3e]"
        >
          {!sent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                  <FiMail className="text-[#00d4ff] text-3xl" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
                <p className="text-[#94a3b8]">
                  Click the button below to receive a verification email at{' '}
                  <span className="text-[#00d4ff] font-semibold">
                    {session?.user?.email}
                  </span>
                </p>
              </div>

              <motion.button
                onClick={handleResend}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiMail />
                    Send Verification Email
                  </>
                )}
              </motion.button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center"
                >
                  <FiMail className="text-[#00ff88] text-4xl" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
                <p className="text-[#94a3b8] mb-2">
                  We've sent a verification link to:
                </p>
                <p className="text-[#00d4ff] font-semibold mb-6">
                  {session?.user?.email}
                </p>

                <div className="p-4 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-left mb-6">
                  <p className="text-sm text-[#94a3b8] mb-2">
                    <span className="text-white font-semibold">Didn't receive the email?</span>
                  </p>
                  <ul className="text-sm text-[#94a3b8] space-y-1 list-disc list-inside">
                    <li>Check your spam or junk folder</li>
                    <li>Wait a few minutes and check again</li>
                    <li>Make sure your email address is correct</li>
                  </ul>
                </div>

                <motion.button
                  onClick={() => setSent(false)}
                  className="text-[#00d4ff] hover:text-[#00ff88] transition-colors font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send again
                </motion.button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[#64748b] text-sm">
              Already verified?{' '}
              <Link
                href="/dashboard"
                className="text-[#00d4ff] hover:text-[#00ff88] transition-colors font-semibold"
              >
                Go to Dashboard
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
