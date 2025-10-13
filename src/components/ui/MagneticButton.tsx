'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { cn } from '@/utils/helpers'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  magneticStrength?: number
}

export default function MagneticButton({
  children,
  className,
  onClick,
  magneticStrength = 0.3
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX * magneticStrength)
    y.set(distanceY * magneticStrength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        'relative px-8 py-4 rounded-full',
        'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
        'text-white font-bold text-lg',
        'shadow-2xl shadow-purple-500/50',
        'transition-all duration-300',
        'hover:shadow-purple-500/80 hover:scale-105',
        'active:scale-95',
        'overflow-hidden group',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
            'linear-gradient(90deg, #ec4899, #3b82f6, #8b5cf6)',
            'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
