'use client'

import { useState } from 'react'
import DashboardSidebar from '../dashboard/DashboardSidebar'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <DashboardSidebar onCollapse={setIsCollapsed} />
      <main 
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isCollapsed ? 'ml-[56px]' : 'ml-[188px]'
        } mr-0 mt-8`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
