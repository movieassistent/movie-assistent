'use client'

import React, { useState } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useSettings } from '@/providers/SettingsProvider'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { settings } = useSettings()
  const position = settings.sidebarPosition || 'links'

  const isHorizontal = position === 'oben' || position === 'unten'

  let mainClassName = 'flex-1 transition-all duration-500 ease-in-out'

  if (isHorizontal) {
    mainClassName += position === 'oben' ? ' mt-16' : ' mb-16'
  } else {
    const sidebarWidth = isSidebarCollapsed ? '60px' : '192px'
    mainClassName += position === 'links' ? ` ml-[${sidebarWidth}]` : ` mr-[${sidebarWidth}]`
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar onCollapse={setIsSidebarCollapsed} />
      <main className={mainClassName}>
        {children}
      </main>
    </div>
  )
}
