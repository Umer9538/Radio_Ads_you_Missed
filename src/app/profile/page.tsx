'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiUser, FiMail, FiLock, FiBell, FiActivity,
  FiEdit2, FiSave, FiCamera, FiShield, FiSettings
} from 'react-icons/fi'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'
import FloatingParticles from '@/components/effects/FloatingParticles'
import MorphingBlob from '@/components/ui/MorphingBlob'
import HolographicText from '@/components/ui/HolographicText'
import MagneticButton from '@/components/ui/MagneticButton'
import SignOutButton from '@/components/auth/SignOutButton'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  image?: string
  role: string
  createdAt: string
  lastLogin?: string
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@radioadsmissed.co.nz',
    role: 'USER',
    createdAt: new Date().toISOString(),
  })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newAdAlerts: true,
    offerExpirySoon: true,
    weeklyDigest: true,
    marketingEmails: false
  })

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'play',
      description: 'Played "McDonald\'s Summer Deal"',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'favorite',
      description: 'Added "Warehouse Sale" to favorites',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'claim',
      description: 'Claimed offer from "Pizza Hut"',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'search',
      description: 'Searched for "automotive deals"',
      timestamp: '2 days ago'
    }
  ])

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setLoading(false)
    }, 500)
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePreferenceChange = (key: string) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key as keyof typeof preferences]
    })
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setProfile({
        ...profile,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      })
      setIsEditing(false)
      setSaving(false)
    }, 1000)
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setSaving(false)
      alert('Password changed successfully')
    }, 1000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'activity', label: 'Activity', icon: FiActivity }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <FloatingParticles count={50} />
      <MorphingBlob className="top-0 right-0" color="from-blue-500 to-cyan-500" size={600} />
      <MorphingBlob className="bottom-0 left-0" color="from-purple-500 to-pink-500" size={500} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <HolographicText as="h1" className="text-5xl mb-2">
            Your Profile
          </HolographicText>
          <p className="text-xl text-gray-300">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassmorphicCard className="p-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  {profile.image ? (
                    <img src={profile.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    `${profile.firstName[0]}${profile.lastName[0]}`
                  )}
                </motion.div>
                <motion.button
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCamera />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-400 mb-2">{profile.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold">
                    {profile.role}
                  </span>
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  {profile.lastLogin && (
                    <span>Last login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassmorphicCard className="p-2">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <GlassmorphicCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                {!isEditing ? (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit2 />
                    Edit Profile
                  </motion.button>
                ) : null}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <MagneticButton onClick={handleSaveProfile} disabled={saving}>
                      <FiSave className="mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </MagneticButton>
                    <motion.button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          email: profile.email,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                      }}
                      className="px-8 py-4 rounded-full bg-gray-600 text-white font-bold hover:bg-gray-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </GlassmorphicCard>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <GlassmorphicCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <MagneticButton onClick={handleChangePassword} disabled={saving}>
                  <FiLock className="mr-2" />
                  {saving ? 'Updating...' : 'Update Password'}
                </MagneticButton>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-white mb-4">Two-Factor Authentication</h4>
                <p className="text-gray-400 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enable 2FA
                </motion.button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-white mb-4">Account Actions</h4>
                <p className="text-gray-400 mb-4">
                  Sign out from your account or manage your session.
                </p>
                <SignOutButton className="w-full sm:w-auto" />
              </div>
            </GlassmorphicCard>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <GlassmorphicCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Notification Preferences</h3>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in your browser' },
                  { key: 'newAdAlerts', label: 'New Ad Alerts', description: 'Get notified when new ads match your interests' },
                  { key: 'offerExpirySoon', label: 'Offer Expiry Alerts', description: 'Remind me when offers are about to expire' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of ads and offers' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and updates' }
                ].map((pref, index) => (
                  <motion.div
                    key={pref.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div>
                      <h4 className="text-white font-semibold mb-1">{pref.label}</h4>
                      <p className="text-sm text-gray-400">{pref.description}</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceChange(pref.key)}
                      className={`relative w-16 h-8 rounded-full transition-all ${
                        preferences[pref.key as keyof typeof preferences]
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                        animate={{
                          x: preferences[pref.key as keyof typeof preferences] ? 32 : 0
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicCard>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <GlassmorphicCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className={`p-3 rounded-full ${
                      activity.type === 'play' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'favorite' ? 'bg-red-500/20 text-red-400' :
                      activity.type === 'claim' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {activity.type === 'play' && <FiActivity />}
                      {activity.type === 'favorite' && <FiUser />}
                      {activity.type === 'claim' && <FiMail />}
                      {activity.type === 'search' && <FiBell />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicCard>
          )}
        </motion.div>
      </div>
    </div>
  )
}
