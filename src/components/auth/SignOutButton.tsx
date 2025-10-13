'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiLogOut } from 'react-icons/fi'

interface SignOutButtonProps {
  variant?: 'default' | 'icon' | 'text'
  className?: string
  redirect?: string
}

export default function SignOutButton({
  variant = 'default',
  className = '',
  redirect = '/auth/signin'
}: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
      callbackUrl: redirect
    })
    router.push(redirect)
    router.refresh()
  }

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleSignOut}
        className={`p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Sign Out"
      >
        <FiLogOut className="text-xl" />
      </motion.button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleSignOut}
        className={`flex items-center gap-2 text-gray-300 hover:text-white transition-all ${className}`}
      >
        <FiLogOut />
        <span>Sign Out</span>
      </button>
    )
  }

  return (
    <motion.button
      onClick={handleSignOut}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiLogOut />
      <span>Sign Out</span>
    </motion.button>
  )
}
