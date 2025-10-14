'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiTrendingUp, FiRadio, FiUsers,
  FiMenu, FiX
} from 'react-icons/fi'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/search', label: 'Find Ads', icon: FiSearch },
    { href: '/for-advertisers', label: 'For Advertisers', icon: FiTrendingUp },
    { href: '/for-stations', label: 'For Stations', icon: FiRadio },
    { href: '/for-agencies', label: 'For Agencies', icon: FiUsers },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-[#1a1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Waveform Icon */}
            <div className="relative flex items-end gap-1 h-8">
              {/* Main waveform bars */}
              <div className="flex items-end gap-1">
                <div className="w-1.5 h-4 bg-[#00d4ff] rounded-full animate-wave-bar"></div>
                <div className="w-1.5 h-6 bg-[#00d4ff] rounded-full animate-wave-bar" style={{ animationDelay: '0.05s' }}></div>
                <div className="w-1.5 h-5 bg-[#00d4ff] rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-7 bg-[#00d4ff] rounded-full animate-wave-bar" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-5 bg-[#00d4ff] rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }}></div>
              </div>
              {/* Green signal waves - positioned at top right */}
              <div className="absolute -top-0.5 -right-3 flex items-end gap-0.5 h-4">
                <div className="w-0.5 h-2 bg-[#00ff88] rounded-full animate-wave-bar" style={{ animationDelay: '0.25s' }}></div>
                <div className="w-0.5 h-3 bg-[#00ff88] rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-0.5 h-2 bg-[#00ff88] rounded-full animate-wave-bar" style={{ animationDelay: '0.35s' }}></div>
              </div>
            </div>
            {/* Logo Text */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">Radio Ads</span>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                You Missed
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      isActive(link.href)
                        ? 'text-white'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.href === '/search' && <Icon className="text-[#00d4ff]" />}
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <motion.button
                  className="px-6 py-2 rounded-full text-[#00d4ff] border-2 border-[#00d4ff] font-semibold text-sm hover:bg-[#00d4ff]/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <motion.button
                    className="px-6 py-2 rounded-full text-[#00d4ff] border-2 border-[#00d4ff] font-semibold text-sm hover:bg-[#00d4ff]/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/signup">
                  <motion.button
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0f1e] font-bold text-sm hover:opacity-90 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0f1e] border-t border-[#1a1f2e]"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(link.href)
                          ? 'bg-[#1a1f2e] text-white'
                          : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]/50'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={link.href === '/search' ? 'text-[#00d4ff]' : ''} />
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}

              <div className="border-t border-[#1a1f2e] my-2" />

              {session ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <motion.button
                    className="w-full px-6 py-3 rounded-full text-[#00d4ff] border-2 border-[#00d4ff] font-semibold text-sm"
                    whileTap={{ scale: 0.95 }}
                  >
                    Dashboard
                  </motion.button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      className="w-full px-6 py-3 rounded-full text-[#00d4ff] border-2 border-[#00d4ff] font-semibold text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0f1e] font-bold text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
