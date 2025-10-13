'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface HolographicTextProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function HolographicText({ children, className, as = 'h1' }: HolographicTextProps) {
  const Component = motion[as]

  return (
    <Component
      className={cn(
        'relative inline-block font-bold',
        'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500',
        'bg-clip-text text-transparent',
        'animate-gradient-x',
        className
      )}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {/* Glow effect */}
      <motion.span
        className="absolute inset-0 blur-2xl opacity-50"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.span>

      {/* Main text */}
      <span className="relative z-10">{children}</span>

      {/* Shimmer effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </Component>
  )
}
