'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type SidebarPosition = 'oben' | 'rechts' | 'unten' | 'links'

interface LayoutContextType {
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>('links')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.sidebarPosition) {
            setSidebarPosition(data.sidebarPosition)
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Layout-Einstellungen:', error)
      }
    }

    if (session) {
      loadSettings()
    }
  }, [session])

  return (
    <LayoutContext.Provider value={{ sidebarPosition, setSidebarPosition }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
