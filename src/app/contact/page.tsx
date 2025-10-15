'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { showToast } from '@/utils/toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        showToast.success('Message sent successfully! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        showToast.error(data.error || 'Failed to send message')
      }
    } catch (err) {
      showToast.error('An error occurred while sending your message')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Get in{' '}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#00d4ff]/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#00d4ff]/20 flex items-center justify-center mb-6">
              <FiMail className="text-3xl text-[#00d4ff]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
            <p className="text-[#94a3b8] mb-4">
              Send us an email anytime
            </p>
            <a
              href="mailto:support@radioads.com"
              className="text-[#00d4ff] hover:text-[#00ff88] transition-colors font-semibold"
            >
              support@radioads.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#00ff88]/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#00ff88]/20 flex items-center justify-center mb-6">
              <FiPhone className="text-3xl text-[#00ff88]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
            <p className="text-[#94a3b8] mb-4">
              Mon-Fri from 9am to 6pm
            </p>
            <a
              href="tel:+1234567890"
              className="text-[#00ff88] hover:text-[#00d4ff] transition-colors font-semibold"
            >
              +1 (234) 567-890
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e] hover:border-[#ff1b6b]/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#ff1b6b]/20 flex items-center justify-center mb-6">
              <FiMapPin className="text-3xl text-[#ff1b6b]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Visit Us</h3>
            <p className="text-[#94a3b8] mb-4">
              Come say hello
            </p>
            <p className="text-white font-semibold">
              123 Radio Street<br />
              New York, NY 10001
            </p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-12 border border-[#2a2f3e]">
            <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
