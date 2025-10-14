'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiRadio, FiDollarSign, FiZap, FiTrendingUp, FiUsers, FiSettings, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'

export default function ForStationsPage() {
  const features = [
    {
      icon: FiZap,
      title: 'Zero Effort Setup',
      description: 'Automatic sync with your ad scheduling system. No technical work required.',
      color: '#00d4ff'
    },
    {
      icon: FiDollarSign,
      title: 'Earn Commission',
      description: 'Earn margin on premium features sold to your advertisers.',
      color: '#00ff88'
    },
    {
      icon: FiTrendingUp,
      title: 'Upsell Advertisers',
      description: 'Offer added value to advertisers without any extra work on your end.',
      color: '#ff1b6b'
    },
    {
      icon: FiUsers,
      title: 'Increase Engagement',
      description: 'Give listeners a reason to search for and replay ads from your station.',
      color: '#8b5cf6'
    }
  ]

  const benefits = [
    'Automatic synchronization with your ad scheduling system',
    'Zero technical integration - we handle everything',
    'Earn commission on every premium feature sold',
    'Upsell existing advertisers with added value services',
    'Increase advertiser retention with better ROI',
    'Strengthen your station\'s digital presence',
    'White-label option available for your brand'
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Connect Your System',
      description: 'We sync with your ad scheduling system automatically.'
    },
    {
      step: '2',
      title: 'Ads Go Live',
      description: 'Your advertisers\' ads become searchable instantly.'
    },
    {
      step: '3',
      title: 'Upsell Features',
      description: 'Offer premium features to advertisers and earn commission.'
    },
    {
      step: '4',
      title: 'Earn Revenue',
      description: 'Get paid for every feature your advertisers use.'
    }
  ]

  const pricingTiers = [
    {
      name: 'Revenue Share',
      description: 'Earn commission on features sold to your advertisers',
      features: [
        '10-20% commission on all revenue',
        'No upfront costs',
        'Automatic billing',
        'Monthly payouts'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'White Label',
      description: 'Offer the service under your own brand',
      features: [
        'Full white-label solution',
        'Your branding throughout',
        'Custom domain',
        'Priority support',
        'Higher commission rates'
      ],
      cta: 'Contact Sales',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/80 to-[#0a0f1e]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/15 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e] border border-[#ff1b6b]/30 mb-8"
            >
              <FiRadio className="text-[#ff1b6b]" />
              <span className="text-sm text-[#94a3b8]">For Radio Stations</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Upsell Advertisers With{' '}
              <span className="bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] bg-clip-text text-transparent">
                Zero Effort
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12"
            >
              Earn margin on premium features for your advertisers. Automatic sync with your ad scheduling system means no technical work for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowRight />
                  Partner With Us
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 rounded-full border-2 border-[#ff1b6b] text-[#ff1b6b] font-semibold text-lg hover:bg-[#ff1b6b]/10 transition-all"
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
              Built for Radio Stations
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Everything you need to monetize your advertiser relationships
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
                  className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#ff1b6b] transition-all"
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
              Why Partner With Us
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
                <FiCheckCircle className="text-[#ff1b6b] text-2xl flex-shrink-0 mt-1" />
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
              Simple integration, immediate revenue
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1f2e]/30 to-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Partnership Models
            </h2>
            <p className="text-lg text-[#94a3b8]">
              Choose the model that works best for your station
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[#1a1f2e] rounded-3xl p-8 border-2 ${
                  tier.popular ? 'border-[#ff1b6b]' : 'border-[#2a2f3e]'
                } relative`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] rounded-full text-white text-sm font-bold">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-[#94a3b8] mb-8">{tier.description}</p>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FiCheckCircle className="text-[#ff1b6b] text-xl flex-shrink-0 mt-0.5" />
                      <span className="text-[#94a3b8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <motion.button
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white'
                        : 'border-2 border-[#ff1b6b] text-[#ff1b6b] hover:bg-[#ff1b6b]/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.cta}
                  </motion.button>
                </Link>
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
            className="bg-gradient-to-r from-[#ff1b6b]/10 to-[#ff6b00]/10 rounded-3xl p-12 border border-[#ff1b6b]/20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Partner?
            </h2>
            <p className="text-xl text-[#94a3b8] mb-8">
              Join leading radio stations already earning with our platform
            </p>
            <Link href="/contact">
              <motion.button
                className="px-10 py-5 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-xl hover:opacity-90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
