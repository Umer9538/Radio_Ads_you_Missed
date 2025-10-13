'use client'

import { motion } from 'framer-motion'

interface MorphingBlobProps {
  color?: string
  size?: number
  className?: string
}

export default function MorphingBlob({
  color = 'from-blue-500 to-purple-600',
  size = 400,
  className = ''
}: MorphingBlobProps) {
  return (
    <motion.div
      className={`absolute blur-3xl opacity-30 bg-gradient-to-br ${color} ${className}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        borderRadius: [
          '60% 40% 30% 70%/60% 30% 70% 40%',
          '30% 60% 70% 40%/50% 60% 30% 60%',
          '70% 30% 50% 50%/30% 30% 70% 70%',
          '60% 40% 30% 70%/60% 30% 70% 40%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.1, 0.9, 1.05, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
