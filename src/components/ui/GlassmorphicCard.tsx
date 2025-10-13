'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { cn } from '@/utils/helpers'

interface GlassmorphicCardProps {
  children?: ReactNode
  className?: string
  glowColor?: string
  tiltIntensity?: number
}

export default function GlassmorphicCard({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.4)',
  tiltIntensity = 15
}: GlassmorphicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top
    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-3xl',
        'bg-white/10 backdrop-blur-xl',
        'border border-white/20',
        'shadow-2xl shadow-black/10',
        'transition-shadow duration-300',
        'hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]',
        className
      )}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Content with 3D depth */}
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10"
      >
        {children}
      </div>
    </motion.div>
  )
}
