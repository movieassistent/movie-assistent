'use client'

import { useSettings } from '@/providers/SettingsProvider'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { settings } = useSettings()

  const mainClassName = `
    flex-1 
    ${settings.sidebarPosition === 'oben' ? 'mt-[52px]' : ''}
    ${settings.sidebarPosition === 'unten' ? 'mb-[52px]' : ''}
    ${settings.sidebarPosition === 'links' ? `ml-[${settings.sidebarCollapsed ? '60px' : '192px'}]` : ''}
    ${settings.sidebarPosition === 'rechts' ? `mr-[${settings.sidebarCollapsed ? '60px' : '192px'}]` : ''}
  `

  return (
    <div className="min-h-screen flex">
      <main className={mainClassName}>
        {children}
      </main>
    </div>
  )
} 