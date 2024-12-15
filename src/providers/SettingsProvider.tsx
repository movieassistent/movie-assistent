'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { UserSettings } from '@/types/settings'

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>
  isLoading: boolean
  loadSettings: () => Promise<void>
}

const defaultSettings: UserSettings = {
  sidebarPosition: 'links',
  sidebarCollapsed: false,
  startPage: 'dashboard',
  lastVisitedPath: '/dashboard',
  theme: 'dark',
  language: 'de',
  initialized: false
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  const loadSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      console.log('Starte Settings-Abruf von API...')
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        console.log('Settings von API erhalten:', data)
        if (data) {
          setSettings({ ...data, initialized: true })
          return data
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      // Optimistisches Update
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })

      const data = await response.json()

      if (!response.ok) {
        // Rollback bei Fehler
        setSettings(settings)
        throw new Error(data.error || 'Fehler beim Speichern der Einstellungen')
      }

      // Aktualisiere mit den tatsächlichen Daten vom Server
      setSettings(data)
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Einstellungen:', error)
      // Rollback bei Fehler
      setSettings(settings)
      throw error
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading, loadSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}