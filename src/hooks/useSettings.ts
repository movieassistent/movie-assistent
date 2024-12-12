'use client'

import { useState, useEffect } from 'react'

interface Settings {
  theme?: 'dark' | 'light' | 'system'
  sidebarPosition?: 'left' | 'right'
  startPage?: 'dashboard' | 'projects' | 'calendar'
  testMode?: boolean
  notifications?: {
    email: boolean
    push: boolean
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    sidebarPosition: 'left',
    startPage: 'dashboard',
    testMode: false,
    notifications: {
      email: false,
      push: false
    }
  })

  useEffect(() => {
    // Lade die Einstellungen beim ersten Render
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Fehler beim Laden der Einstellungen:', error)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = async (newSettings: Settings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        setSettings(newSettings)
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Einstellungen:', error)
    }
  }

  return { settings, updateSettings }
}
