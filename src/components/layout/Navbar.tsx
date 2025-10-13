'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiSearch, FiRadio, FiGrid, FiHeart,
  FiUser, FiMenu, FiX, FiLogIn
} from 'react-icons/fi'
import SignOutButton from '@/components/auth/SignOutButton'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/search', label: 'Search', icon: FiSearch },
    { href: '/stations', label: 'Stations', icon: FiRadio },
    { href: '/categories', label: 'Categories', icon: FiGrid },
  ]

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHeart },
    { href: '/profile', label: 'Profile', icon: FiUser },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="text-3xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              📻
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Radio Ads
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(link.href)
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              <>
                {userLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link key={link.href} href={link.href}>
                      <motion.div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          isActive(link.href)
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon />
                        <span className="hidden lg:inline">{link.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
                <SignOutButton variant="icon" />
              </>
            ) : (
              <Link href="/auth/signin">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogIn />
                  <span>Sign In</span>
                </motion.div>
              </Link>
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
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(link.href)
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon />
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}

              {session && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  {userLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                        <motion.div
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive(link.href)
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon />
                          <span>{link.label}</span>
                        </motion.div>
                      </Link>
                    )
                  })}
                  <div className="pt-2">
                    <SignOutButton variant="text" className="w-full px-4 py-3" />
                  </div>
                </>
              )}

              {!session && status !== 'loading' && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white"
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiLogIn />
                      <span>Sign In</span>
                    </motion.div>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
