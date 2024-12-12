'use client'

import { useSettings } from '@/providers/SettingsProvider'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#141414]">
      <DashboardSidebar />
      <main className="transition-all duration-300 p-8" style={{ marginLeft: 'var(--sidebar-width, 240px)' }}>
        {children}
      </main>
    </div>
  )
}
