'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiZap, FiUsers, FiLayers, FiBarChart2, FiDollarSign, FiTrendingUp, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'

export default function ForAgenciesPage() {
  const features = [
    {
      icon: FiUsers,
      title: 'Multi-Client Management',
      description: 'Manage all your advertiser clients from a single dashboard.',
      color: '#00d4ff'
    },
    {
      icon: FiLayers,
      title: 'Radio + Digital',
      description: 'Offer clients a combined radio and digital advertising package.',
      color: '#00ff88'
    },
    {
      icon: FiDollarSign,
      title: 'Earn Margin',
      description: 'Mark up services and earn commission on all features sold.',
      color: '#ff1b6b'
    },
    {
      icon: FiBarChart2,
      title: 'Unified Reporting',
      description: 'Get consolidated analytics across all your clients in one place.',
      color: '#8b5cf6'
    }
  ]

  const benefits = [
    'Manage multiple advertiser accounts from one dashboard',
    'White-label option to offer services under your brand',
    'Earn agency margin on all features and services',
    'Provide clients with radio + digital integration',
    'Consolidated billing across all clients',
    'Dedicated account manager for your agency',
    'API access for custom integrations',
    'Priority support for you and your clients'
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Set Up Agency Account',
      description: 'Create your agency profile with custom branding and pricing.'
    },
    {
      step: '2',
      title: 'Add Clients',
      description: 'Onboard your advertiser clients with their campaigns.'
    },
    {
      step: '3',
      title: 'Upload Campaigns',
      description: 'Upload radio ads and digital assets for all your clients.'
    },
    {
      step: '4',
      title: 'Track & Bill',
      description: 'Monitor performance and bill clients with your markup.'
    }
  ]

  const useCases = [
    {
      title: 'Media Buying Agencies',
      description: 'Add digital extension to radio buys. Show clients comprehensive cross-channel performance.',
      icon: FiTrendingUp,
      color: '#00d4ff'
    },
    {
      title: 'Full-Service Agencies',
      description: 'Integrate radio campaign management into your existing service stack seamlessly.',
      icon: FiLayers,
      color: '#00ff88'
    },
    {
      title: 'Digital Agencies',
      description: 'Expand into radio advertising without building new infrastructure.',
      icon: FiZap,
      color: '#ff1b6b'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/80 to-[#0a0f1e]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/15 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e] border border-[#8b5cf6]/30 mb-8"
            >
              <FiZap className="text-[#8b5cf6]" />
              <span className="text-sm text-[#94a3b8]">For Agencies</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Radio + Digital{' '}
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#00d4ff] bg-clip-text text-transparent">
                All in One
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12"
            >
              Manage multiple clients with radio + digital campaigns. White-label solution with agency margin on all services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup">
                <motion.button
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#00d4ff] text-white font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowRight />
                  Get Started
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 rounded-full border-2 border-[#8b5cf6] text-[#8b5cf6] font-semibold text-lg hover:bg-[#8b5cf6]/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Demo
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
              Built for Agency Teams
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Everything you need to manage client campaigns at scale
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
                  className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#8b5cf6] transition-all"
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

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perfect For Every Agency Type
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: useCase.color + '20' }}
                  >
                    <Icon className="text-3xl" style={{ color: useCase.color }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                  <p className="text-[#94a3b8]">{useCase.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Agency Benefits
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
                <FiCheckCircle className="text-[#8b5cf6] text-2xl flex-shrink-0 mt-1" />
                <p className="text-[#94a3b8]">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
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
              Start managing client campaigns in minutes
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#00d4ff] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#94a3b8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1f2e] rounded-3xl p-12 border-2 border-[#8b5cf6]/30 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Agency Pricing
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8">
              Custom pricing based on your client volume and needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8b5cf6] mb-2">20-30%</div>
                <div className="text-sm text-[#94a3b8]">Agency Margin</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00d4ff] mb-2">Unlimited</div>
                <div className="text-sm text-[#94a3b8]">Client Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00ff88] mb-2">Custom</div>
                <div className="text-sm text-[#94a3b8]">White Label</div>
              </div>
            </div>

            <Link href="/contact">
              <motion.button
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#00d4ff] text-white font-bold text-lg hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales for Pricing
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#00d4ff]/10 rounded-3xl p-12 border border-[#8b5cf6]/20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Scale Your Agency?
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8">
              Join agencies managing millions in radio ad spend on our platform
            </p>
            <Link href="/auth/signup">
              <motion.button
                className="px-10 py-5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#00d4ff] text-white font-bold text-xl hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Managing Clients
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
