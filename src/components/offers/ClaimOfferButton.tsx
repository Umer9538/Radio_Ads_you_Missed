'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiGift, FiCheck, FiLoader } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ClaimOfferButtonProps {
  offerId: string
  offerTitle: string
  isClaimed?: boolean
  onClaimSuccess?: () => void
  className?: string
}

export default function ClaimOfferButton({
  offerId,
  offerTitle,
  isClaimed = false,
  onClaimSuccess,
  className = ''
}: ClaimOfferButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(isClaimed)
  const [error, setError] = useState('')

  const handleClaim = async () => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${window.location.pathname}`)
      return
    }

    if (claiming || claimed) return

    try {
      setClaiming(true)
      setError('')

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offerId }),
      })

      const data = await response.json()

      if (data.success) {
        setClaimed(true)
        onClaimSuccess?.()
      } else {
        setError(data.error || 'Failed to claim offer')
      }
    } catch (err) {
      console.error('Error claiming offer:', err)
      setError('Failed to claim offer. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  if (claimed) {
    return (
      <motion.button
        className={`px-6 py-3 rounded-xl bg-[#00ff88]/20 border-2 border-[#00ff88] text-[#00ff88] font-bold flex items-center justify-center gap-2 ${className}`}
        disabled
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <FiCheck size={20} />
        Claimed
      </motion.button>
    )
  }

  return (
    <div className="w-full">
      <motion.button
        onClick={handleClaim}
        disabled={claiming}
        className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        whileHover={{ scale: claiming ? 1 : 1.02 }}
        whileTap={{ scale: claiming ? 1 : 0.98 }}
      >
        {claiming ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FiLoader size={20} />
            </motion.div>
            Claiming...
          </>
        ) : (
          <>
            <FiGift size={20} />
            Claim Offer
          </>
        )}
      </motion.button>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
