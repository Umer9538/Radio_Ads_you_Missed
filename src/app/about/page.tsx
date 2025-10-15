'use client'

import { motion } from 'framer-motion'
import { FiRadio, FiHeart, FiZap, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi'
import Link from 'next/link'

export default function AboutPage() {
  const features = [
    {
      icon: FiRadio,
      title: 'Never Miss an Ad',
      description: 'Access thousands of radio advertisements from your favorite stations, anytime',
      color: '#00d4ff'
    },
    {
      icon: FiHeart,
      title: 'Save Your Favorites',
      description: 'Bookmark ads you love and build your personal collection of offers',
      color: '#ff1b6b'
    },
    {
      icon: FiZap,
      title: 'Instant Playback',
      description: 'Listen to ads instantly with our high-quality audio player',
      color: '#00ff88'
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description: 'Join thousands of users discovering great deals through radio ads',
      color: '#8b5cf6'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Radio Ads', color: '#00d4ff' },
    { value: '100+', label: 'Stations', color: '#ff1b6b' },
    { value: '10K+', label: 'Active Users', color: '#00ff88' },
    { value: '98%', label: 'Satisfaction', color: '#ff6b00' }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: 'Former radio executive with 15 years of experience',
      color: '#00d4ff'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      description: 'Tech innovator passionate about audio technology',
      color: '#ff1b6b'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      description: 'UX expert dedicated to creating seamless experiences',
      color: '#00ff88'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#ff1b6b] to-[#00ff88] bg-clip-text text-transparent">
              Radio Ads
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how people discover and engage with radio advertisements
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-12 border border-[#2a2f3e]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
                <FiAward className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Our Story</h2>
            </div>
            <div className="space-y-6 text-lg text-[#94a3b8] leading-relaxed">
              <p>
                Founded in 2024, Radio Ads You Missed was born from a simple observation: people often
                hear interesting offers on the radio but forget the details by the time they get home.
                We knew there had to be a better way.
              </p>
              <p>
                Our platform bridges the gap between traditional radio advertising and modern digital
                convenience. Whether you're commuting, working out, or relaxing at home, you can now
                access any radio ad you've heard—or discover new ones—with just a few clicks.
              </p>
              <p>
                Today, we work with over 100 radio stations across the country, cataloging thousands
                of advertisements and helping listeners like you never miss out on great deals and
                valuable information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] text-center hover:border-[#00d4ff]/50 transition-all"
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[#94a3b8] font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all group"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="text-3xl" style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#94a3b8] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] text-center hover:border-[#00d4ff]/50 transition-all"
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}80)` }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <div
                  className="text-lg font-semibold mb-4"
                  style={{ color: member.color }}
                >
                  {member.role}
                </div>
                <p className="text-[#94a3b8]">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
            Join thousands of users who never miss a great deal
          </p>
          <Link href="/auth/signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg"
            >
              Sign Up Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
