'use client'

import { useUpdateLastVisited } from '@/hooks/useUpdateLastVisited'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useUpdateLastVisited()
  return <>{children}</>
} 