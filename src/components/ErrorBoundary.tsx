'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} reset={this.reset} />
      }

      return <DefaultErrorFallback error={this.state.error!} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#ff1b6b]/50 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ff1b6b]/20 flex items-center justify-center"
          >
            <FiAlertTriangle className="text-[#ff1b6b] text-4xl" />
          </motion.div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-[#94a3b8] mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if
            the problem persists.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-left">
              <p className="text-xs font-mono text-red-400 break-all">{error.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={reset}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCw />
              Try Again
            </motion.button>
            <motion.button
              onClick={() => (window.location.href = '/')}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-[#94a3b8] text-[#94a3b8] font-semibold hover:bg-[#94a3b8]/10 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ErrorBoundary
