'use client'

import { motion } from 'framer-motion'
import { FiShield, FiLock, FiEye, FiDatabase, FiUserCheck, FiAlertCircle } from 'react-icons/fi'

export default function PrivacyPage() {
  const sections = [
    {
      icon: FiDatabase,
      title: 'Information We Collect',
      color: '#00d4ff',
      content: [
        'Personal information you provide when creating an account (name, email, password)',
        'Usage data including pages visited, ads played, and search queries',
        'Device information such as browser type, IP address, and operating system',
        'Cookies and similar tracking technologies to enhance your experience'
      ]
    },
    {
      icon: FiLock,
      title: 'How We Use Your Information',
      color: '#ff1b6b',
      content: [
        'To provide and maintain our services',
        'To personalize your experience and show relevant advertisements',
        'To communicate with you about updates, offers, and support',
        'To analyze usage patterns and improve our platform',
        'To detect and prevent fraud or security issues'
      ]
    },
    {
      icon: FiShield,
      title: 'How We Protect Your Data',
      color: '#00ff88',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure password hashing using bcrypt with 12 rounds',
        'Regular security audits and vulnerability assessments',
        'Restricted access to personal data on a need-to-know basis',
        'Compliance with GDPR and other privacy regulations'
      ]
    },
    {
      icon: FiEye,
      title: 'Third-Party Sharing',
      color: '#8b5cf6',
      content: [
        'We do not sell your personal information to third parties',
        'Limited data sharing with trusted service providers (hosting, analytics)',
        'Anonymous usage statistics may be shared with radio station partners',
        'Legal requirements may necessitate disclosure to authorities',
        'You can opt out of analytics tracking in your account settings'
      ]
    },
    {
      icon: FiUserCheck,
      title: 'Your Rights',
      color: '#ff6b00',
      content: [
        'Access and download your personal data at any time',
        'Request correction of inaccurate information',
        'Delete your account and associated data',
        'Opt out of marketing communications',
        'Control cookie preferences through your browser settings'
      ]
    },
    {
      icon: FiAlertCircle,
      title: 'Data Retention',
      color: '#00d4ff',
      content: [
        'Account data is retained while your account is active',
        'Play history is kept for 2 years for analytics purposes',
        'Deleted accounts are permanently removed within 30 days',
        'Backups may retain data for up to 90 days',
        'Legal compliance may require longer retention periods'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e]/50 to-[#0a0f1e]" />

      {/* Atmospheric glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff1b6b]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
              <FiShield className="text-4xl text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Privacy{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-[#94a3b8] mt-4">
            Last Updated: January 14, 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <p className="text-lg text-[#94a3b8] leading-relaxed">
              At Radio Ads You Missed, we are committed to protecting your privacy and ensuring
              transparency about how we handle your data. This Privacy Policy explains our practices
              regarding the collection, use, and disclosure of information when you use our platform.
              By using our services, you agree to the terms outlined in this policy.
            </p>
          </div>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${section.color}20` }}
                >
                  <section.icon className="text-2xl" style={{ color: section.color }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-[#94a3b8]">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: section.color }}
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Cookies Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <h2 className="text-3xl font-bold text-white mb-6">Cookies & Tracking</h2>
            <div className="space-y-4 text-[#94a3b8] leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience,
                analyze site traffic, and personalize content. Cookies are small text files stored on
                your device that help us remember your preferences and understand how you use our platform.
              </p>
              <p>
                <span className="text-white font-semibold">Essential Cookies:</span> Required for basic
                site functionality, including authentication and security.
              </p>
              <p>
                <span className="text-white font-semibold">Analytics Cookies:</span> Help us understand
                how visitors interact with our website.
              </p>
              <p>
                <span className="text-white font-semibold">Preference Cookies:</span> Remember your
                settings and preferences for a personalized experience.
              </p>
              <p>
                You can control cookie settings through your browser preferences. Note that disabling
                certain cookies may affect site functionality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Children's Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <h2 className="text-3xl font-bold text-white mb-6">Children's Privacy</h2>
            <p className="text-[#94a3b8] leading-relaxed">
              Our services are not intended for children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and believe your child has provided us with personal information, please contact us
              immediately, and we will take steps to remove such information from our systems.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1a1f2e] rounded-2xl p-12 border border-[#2a2f3e] text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
            If you have any questions or concerns about our privacy practices, we're here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:privacy@radioads.com"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold hover:shadow-lg transition-shadow"
            >
              Email Privacy Team
            </a>
            <a
              href="/contact"
              className="px-8 py-3 rounded-full border-2 border-[#00d4ff] text-[#00d4ff] font-bold hover:bg-[#00d4ff]/10 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
