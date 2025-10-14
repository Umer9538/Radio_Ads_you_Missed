'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Check for success message from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const message = params.get('message')
    if (message) {
      setSuccessMessage(message)
      // Clear the message from URL
      window.history.replaceState({}, '', '/auth/signin')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { signIn } = await import('next-auth/react')

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        // Redirect to home or callback URL
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/'
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0f1e] flex items-center justify-center">
      {/* Animated background */}
      <FloatingParticles count={40} />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            📻
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">Welcome </span>
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-[#94a3b8]">
            Sign in to continue to Radio Ads You Missed
          </p>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassmorphicCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] text-sm"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-[#2a2f3e] bg-[#0a0f1e]"
                  />
                  <span className="text-[#94a3b8]">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[#00d4ff] hover:text-[#00ff88] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <MagneticButton
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </MagneticButton>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full px-6 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white hover:border-[#00d4ff] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </GlassmorphicCard>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-[#94a3b8]">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-[#00d4ff] hover:text-[#00ff88] font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
