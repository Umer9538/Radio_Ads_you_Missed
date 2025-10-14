'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiTrendingUp, FiUpload, FiGift, FiBarChart2, FiUsers, FiTarget, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'

export default function ForAdvertisersPage() {
  const features = [
    {
      icon: FiUpload,
      title: 'Upload Ad Content',
      description: 'Easily upload your radio ad recordings and metadata to make them searchable.',
      color: '#00d4ff'
    },
    {
      icon: FiGift,
      title: 'Deliver Vouchers',
      description: 'Attach digital vouchers and offers directly to your ads for instant redemption.',
      color: '#00ff88'
    },
    {
      icon: FiBarChart2,
      title: 'Track Performance',
      description: 'View detailed analytics on ad plays, searches, and voucher redemptions.',
      color: '#ff1b6b'
    },
    {
      icon: FiTarget,
      title: 'Capture Missed Sales',
      description: 'Turn listeners who missed your ad into customers by making it searchable.',
      color: '#8b5cf6'
    }
  ]

  const benefits = [
    'Extend the reach of your radio campaigns beyond air time',
    'Connect with listeners who heard your ad but couldn\'t act immediately',
    'Track real-time engagement and ROI on your radio advertising',
    'Deliver time-sensitive offers directly to interested customers',
    'No technical integration required - upload and go',
    'Pay only for engaged listeners who claim your offers'
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Upload Your Ads',
      description: 'Upload audio files and add details like brand, offer, and expiry dates.'
    },
    {
      step: '2',
      title: 'Add Vouchers',
      description: 'Attach digital vouchers, discount codes, or contact information.'
    },
    {
      step: '3',
      title: 'Go Live',
      description: 'Your ads become instantly searchable by listeners across New Zealand.'
    },
    {
      step: '4',
      title: 'Track Results',
      description: 'Monitor searches, plays, and voucher redemptions in real-time.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/80 to-[#0a0f1e]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00ff88]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/15 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e] border border-[#00ff88]/30 mb-8"
            >
              <FiTrendingUp className="text-[#00ff88]" />
              <span className="text-sm text-[#94a3b8]">For Advertisers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Turn Missed Ads Into{' '}
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                Captured Sales
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12"
            >
              Make your radio ads searchable and replayable. Deliver vouchers directly to listeners who want to act on your offers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup">
                <motion.button
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0f1e] font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowRight />
                  Get Started
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 rounded-full border-2 border-[#00ff88] text-[#00ff88] font-semibold text-lg hover:bg-[#00ff88]/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Sales
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for Advertisers
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Everything you need to maximize your radio advertising ROI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#00ff88] transition-all"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.color + '20' }}
                  >
                    <Icon className="text-3xl" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[#94a3b8]">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Advertisers Love Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-[#1a1f2e] rounded-xl p-6 border border-[#2a2f3e]"
              >
                <FiCheckCircle className="text-[#00ff88] text-2xl flex-shrink-0 mt-1" />
                <p className="text-[#94a3b8]">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Get started in minutes, no technical expertise required
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-2xl font-bold text-[#0a0f1e] mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#94a3b8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-3xl p-12 border border-[#00ff88]/20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8">
              Join hundreds of advertisers already maximizing their radio ROI
            </p>
            <Link href="/auth/signup">
              <motion.button
                className="px-10 py-5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0f1e] font-bold text-xl hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
