'use client'

import { useSettings } from '@/providers/SettingsProvider'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { settings } = useSettings()

  if (!settings) {
    return <div>Lade Einstellungen...</div>
  }

  const sidebarWidth = settings.sidebarCollapsed ? 60 : 192
  const containerStyle = {
    width: settings.sidebarPosition === 'links' || settings.sidebarPosition === 'rechts' 
      ? `calc(100% - ${sidebarWidth + 10}px)`
      : '100%',
    marginLeft: settings.sidebarPosition === 'links' ? `${sidebarWidth}px` : undefined,
    marginRight: settings.sidebarPosition === 'rechts' ? `${sidebarWidth}px` : undefined,
    marginTop: settings.sidebarPosition === 'oben' ? '52px' : undefined,
    marginBottom: settings.sidebarPosition === 'unten' ? '52px' : undefined,
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingTop: settings.sidebarPosition === 'oben' || settings.sidebarPosition === 'unten' ? '10px' : '0'
  }

  return (
    <div className="min-h-screen flex">
      <main style={containerStyle}>
        {children}
      </main>
    </div>
  )
} 