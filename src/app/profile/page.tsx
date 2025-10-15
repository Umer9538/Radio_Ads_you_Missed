'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiUser, FiMail, FiLock, FiBell, FiActivity,
  FiEdit2, FiSave, FiCamera, FiShield, FiSettings,
  FiHeart, FiSearch, FiGift
} from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import { showToast, TOAST_MESSAGES } from '@/utils/toast'

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
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

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile')
    }
  }, [status, router])

  // Fetch user profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (data.success) {
        setProfile({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email,
          image: data.data.image,
          role: data.data.role,
          createdAt: data.data.createdAt,
        })

        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        showToast.error('Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showToast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

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
    try {
      setSaving(true)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProfile({
          ...profile,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
        })
        showToast.success(TOAST_MESSAGES.PROFILE_UPDATED)
        setIsEditing(false)
      } else {
        showToast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      showToast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        showToast.error('Passwords do not match')
        return
      }

      if (!formData.currentPassword) {
        showToast.error('Please enter your current password')
        return
      }

      if (formData.newPassword.length < 6) {
        showToast.error('New password must be at least 6 characters long')
        return
      }

      setSaving(true)

      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        showToast.success(TOAST_MESSAGES.PASSWORD_CHANGED)
      } else {
        showToast.error(data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      showToast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'activity', label: 'Activity', icon: FiActivity }
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] pt-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          📻
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Your Profile
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff1b6b] to-[#ff6b00] flex items-center justify-center text-white text-4xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  {profile.image ? (
                    <img src={profile.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.firstName && profile.lastName
                      ? `${profile.firstName[0]}${profile.lastName[0]}`
                      : profile.email[0].toUpperCase()
                  )}
                </motion.div>
                <motion.button
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#00d4ff] text-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCamera />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile.email}
                </h2>
                <p className="text-[#94a3b8] mb-2">{profile.email}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
                  <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">
                    {profile.role}
                  </span>
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  {profile.lastLogin && (
                    <span>Last login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="w-full sm:w-auto">
                <SignOutButton className="w-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-[#1a1f2e] rounded-2xl p-2 border border-[#2a2f3e]">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white shadow-lg'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#0a0f1e]'
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
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                {!isEditing ? (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all font-semibold"
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
                    <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiSave />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
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
                      className="px-8 py-4 rounded-full border-2 border-[#94a3b8] text-[#94a3b8] font-bold hover:bg-[#94a3b8]/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
              <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#94a3b8] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-[#2a2f3e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00d4ff] transition-all"
                    placeholder="Confirm new password"
                  />
                </div>

                <motion.button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLock />
                  {saving ? 'Updating...' : 'Update Password'}
                </motion.button>
              </div>

              <div className="mt-8 pt-8 border-t border-[#2a2f3e]">
                <h4 className="text-xl font-bold text-white mb-4">Two-Factor Authentication</h4>
                <p className="text-[#94a3b8] mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <motion.button
                  className="px-6 py-3 rounded-xl border-2 border-[#00d4ff] text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enable 2FA
                </motion.button>
              </div>

              <div className="mt-8 pt-8 border-t border-[#2a2f3e]">
                <h4 className="text-xl font-bold text-white mb-4">Account Actions</h4>
                <p className="text-[#94a3b8] mb-4">
                  Sign out from your account or manage your session.
                </p>
                <SignOutButton className="w-full sm:w-auto" />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
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
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0a0f1e] hover:bg-[#0a0f1e]/80 transition-all border border-[#2a2f3e]"
                  >
                    <div>
                      <h4 className="text-white font-semibold mb-1">{pref.label}</h4>
                      <p className="text-sm text-[#94a3b8]">{pref.description}</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceChange(pref.key)}
                      className={`relative w-16 h-8 rounded-full transition-all ${
                        preferences[pref.key as keyof typeof preferences]
                          ? 'bg-gradient-to-r from-[#00d4ff] to-[#00ff88]'
                          : 'bg-[#2a2f3e]'
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
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-[#2a2f3e]">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>

              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h4 className="text-xl font-bold text-white mb-2">No Recent Activity</h4>
                  <p className="text-[#94a3b8]">
                    Your activity will appear here once you start using the platform
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0f1e] hover:bg-[#0a0f1e]/80 transition-all border border-[#2a2f3e]"
                  >
                    <div className={`p-3 rounded-full ${
                      activity.type === 'play' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' :
                      activity.type === 'favorite' ? 'bg-[#ff1b6b]/20 text-[#ff1b6b]' :
                      activity.type === 'claim' ? 'bg-[#00ff88]/20 text-[#00ff88]' :
                      'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    }`}>
                      {activity.type === 'play' && <FiActivity />}
                      {activity.type === 'favorite' && <FiHeart />}
                      {activity.type === 'claim' && <FiGift />}
                      {activity.type === 'search' && <FiSearch />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.description}</p>
                      <p className="text-sm text-[#64748b]">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
