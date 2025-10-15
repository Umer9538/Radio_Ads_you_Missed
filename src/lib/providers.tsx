'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import ToastProvider from '@/components/providers/ToastProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - increased for better performance
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  )

  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes instead of constantly
      refetchOnWindowFocus={false} // Don't refetch on window focus
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
