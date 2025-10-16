'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiTrendingUp, FiUsers, FiPlay, FiGift, FiDownload,
  FiCalendar, FiBarChart2, FiPieChart, FiLogOut
} from 'react-icons/fi'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Link from 'next/link'

const COLORS = ['#00d4ff', '#ff1b6b', '#00ff88', '#ff6b00', '#8b5cf6', '#ec4899']

export default function AnalyticsDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [groupBy, setGroupBy] = useState('day')

  const [overviewStats, setOverviewStats] = useState<any>(null)
  const [trends, setTrends] = useState<any>(null)
  const [engagement, setEngagement] = useState<any>(null)
  const [topAds, setTopAds] = useState<any[]>([])
  const [conversions, setConversions] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/auth/signin?callbackUrl=/admin/analytics')
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/dashboard')
      } else {
        fetchAnalytics()
      }
    }
  }, [status, session, router, dateRange, groupBy])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))

      const dateParams = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`

      const [statsRes, trendsRes, engagementRes, topAdsRes, conversionsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/analytics/trends?${dateParams}&groupBy=${groupBy}`),
        fetch(`/api/admin/analytics/engagement?${dateParams}`),
        fetch(`/api/admin/analytics/top-ads?${dateParams}&limit=10`),
        fetch(`/api/admin/analytics/conversions?${dateParams}`),
      ])

      const [statsData, trendsData, engagementData, topAdsData, conversionsData] = await Promise.all([
        statsRes.json(),
        trendsRes.json(),
        engagementRes.json(),
        topAdsRes.json(),
        conversionsRes.json(),
      ])

      if (statsData.success) setOverviewStats(statsData.data)
      if (trendsData.success) setTrends(trendsData.data)
      if (engagementData.success) setEngagement(engagementData.data)
      if (topAdsData.success) setTopAds(topAdsData.data)
      if (conversionsData.success) setConversions(conversionsData.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string, format: string) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(dateRange))

    const url = `/api/admin/analytics/export?type=${type}&format=${format}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`

    if (format === 'csv') {
      window.open(url, '_blank')
    } else {
      const response = await fetch(url)
      const data = await response.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Analytics{' '}
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-[#94a3b8]">Comprehensive insights and metrics</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg border border-[#2a2f3e] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all"
                >
                  Back to Admin
                </motion.button>
              </Link>
              <motion.button
                onClick={() => signOut({ callbackUrl: '/admin/auth/signin' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <FiLogOut />
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-[#94a3b8] mb-2 block">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:outline-none focus:border-[#00d4ff]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-[#94a3b8] mb-2 block">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e] text-white focus:outline-none focus:border-[#00d4ff]"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <div className="flex-1 flex items-end">
              <div className="relative group w-full">
                <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <FiDownload />
                  Export Data
                </button>
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('plays', 'csv')}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2f3e] rounded-t-lg"
                  >
                    Plays (CSV)
                  </button>
                  <button
                    onClick={() => handleExport('users', 'csv')}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2f3e]"
                  >
                    Users (CSV)
                  </button>
                  <button
                    onClick={() => handleExport('claims', 'csv')}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2f3e]"
                  >
                    Claims (CSV)
                  </button>
                  <button
                    onClick={() => handleExport('ads', 'csv')}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2f3e] rounded-b-lg"
                  >
                    Ads (CSV)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        {overviewStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { label: 'Total Users', value: overviewStats.totalUsers, icon: FiUsers, color: '#00d4ff', growth: trends?.users?.growth },
              { label: 'Total Plays', value: overviewStats.totalPlays, icon: FiPlay, color: '#ff1b6b', growth: trends?.plays?.growth },
              { label: 'Total Ads', value: overviewStats.totalAds, icon: FiBarChart2, color: '#00ff88', growth: null },
              { label: 'Total Claims', value: overviewStats.totalClaims, icon: FiGift, color: '#ff6b00', growth: trends?.claims?.growth },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="text-2xl" style={{ color: stat.color }} />
                  </div>
                  {stat.growth !== null && stat.growth !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.growth >= 0 ? 'text-[#00ff88]' : 'text-[#ff1b6b]'}`}>
                      <FiTrendingUp className={stat.growth < 0 ? 'rotate-180' : ''} />
                      {Math.abs(stat.growth).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-[#94a3b8] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Trends Chart */}
        {trends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FiBarChart2 className="text-[#00d4ff]" />
              Activity Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.plays.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  name="Plays"
                  dot={{ fill: '#00d4ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Engagement Metrics */}
        {engagement && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* By Station */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FiPieChart className="text-[#00d4ff]" />
                Engagement by Station
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagement.byStation.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ station, plays }) => `${station}: ${plays}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="plays"
                  >
                    {engagement.byStation.slice(0, 6).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* By Category */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FiPieChart className="text-[#00ff88]" />
                Engagement by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagement.byCategory.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="plays" fill="#00ff88" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Top Ads */}
        {topAds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e] mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Top Performing Ads</h2>
            <div className="space-y-4">
              {topAds.slice(0, 5).map((item, index) => (
                <div
                  key={item.ad.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e]"
                >
                  <div className="text-2xl font-bold text-[#00d4ff]">#{index + 1}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.ad.title}</h3>
                    <p className="text-sm text-[#94a3b8]">
                      {item.ad.brand} • {item.ad.station}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{item.metrics.plays}</div>
                    <div className="text-sm text-[#94a3b8]">plays</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#00ff88]">
                      {item.metrics.completionRate}%
                    </div>
                    <div className="text-sm text-[#94a3b8]">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conversion Metrics */}
        {conversions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 border border-[#2a2f3e]"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Offer Conversion Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e]">
                <div className="text-3xl font-bold text-[#00d4ff] mb-1">
                  {conversions.overall.conversionRate}%
                </div>
                <div className="text-[#94a3b8]">Overall Conversion Rate</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e]">
                <div className="text-3xl font-bold text-[#ff1b6b] mb-1">
                  {conversions.overall.totalClaims.toLocaleString()}
                </div>
                <div className="text-[#94a3b8]">Total Claims</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e]">
                <div className="text-3xl font-bold text-[#00ff88] mb-1">
                  {conversions.overall.activeOffers}
                </div>
                <div className="text-[#94a3b8]">Active Offers</div>
              </div>
            </div>
            <div className="space-y-3">
              {conversions.byOffer.slice(0, 5).map((item: any) => (
                <div
                  key={item.offer.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0a0f1e] border border-[#2a2f3e]"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.offer.title}</h3>
                    <p className="text-sm text-[#94a3b8]">{item.ad.brand} • {item.ad.title}</p>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-lg font-bold text-white">{item.metrics.claims}</div>
                    <div className="text-sm text-[#94a3b8]">claims</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#00ff88]">
                      {item.metrics.conversionRate}%
                    </div>
                    <div className="text-sm text-[#94a3b8]">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
