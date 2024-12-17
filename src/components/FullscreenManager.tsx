'use client'

import { useEffect } from 'react'
import { useSettings } from '@/providers/SettingsProvider'

export function FullscreenManager() {
  const { settings } = useSettings()

  // Verhindere Fullscreen-Exit bei F5 oder CTRL+R
  useEffect(() => {
    if (!settings) return

    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.key === 'F5' || (e.key === 'r' && e.ctrlKey)) && settings.displayMode === 'fullscreen') {
        // Verhindere Standard-Reload
        e.preventDefault()
        e.stopPropagation()

        // Speichere die aktuelle URL
        const currentUrl = window.location.href
        
        // Warte kurz und aktiviere dann Fullscreen wieder
        setTimeout(async () => {
          try {
            await document.documentElement.requestFullscreen()
            // Navigiere zur gespeicherten URL
            window.location.href = currentUrl
          } catch (error) {
            console.error('Fehler beim Aktivieren des Vollbildmodus:', error)
          }
        }, 50)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [settings])

  return null
}