'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface Settings {
  startPage: 'dashboard' | 'lastVisited'
  sidebarPosition: 'left' | 'right' | 'top' | 'bottom'
  sidebarCollapsed: boolean
  testMode: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

const defaultSettings: Settings = {
  startPage: 'dashboard',
  sidebarPosition: 'left',
  sidebarCollapsed: false,
  testMode: false,
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    // Lade die Einstellungen beim ersten Rendern
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings({ ...defaultSettings, ...data })
      })
      .catch((error) => {
        console.error('Failed to load settings:', error)
      })
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)