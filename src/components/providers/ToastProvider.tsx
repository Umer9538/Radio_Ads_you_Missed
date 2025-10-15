'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#1a1f2e',
          color: '#fff',
          border: '1px solid #2a2f3e',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        },
        // Success style
        success: {
          duration: 3000,
          style: {
            background: '#1a1f2e',
            border: '1px solid #00ff88',
            color: '#fff',
          },
          iconTheme: {
            primary: '#00ff88',
            secondary: '#1a1f2e',
          },
        },
        // Error style
        error: {
          duration: 5000,
          style: {
            background: '#1a1f2e',
            border: '1px solid #ff1b6b',
            color: '#fff',
          },
          iconTheme: {
            primary: '#ff1b6b',
            secondary: '#1a1f2e',
          },
        },
        // Loading style
        loading: {
          style: {
            background: '#1a1f2e',
            border: '1px solid #00d4ff',
            color: '#fff',
          },
          iconTheme: {
            primary: '#00d4ff',
            secondary: '#1a1f2e',
          },
        },
      }}
    />
  )
}
