'use client'

import { useEffect, useRef } from 'react'
import { useSettings } from '@/providers/SettingsProvider'
import { usePathname } from 'next/navigation'

export function useUpdateLastVisited() {
  const { updateSettings } = useSettings()
  const pathname = usePathname()
  const previousPathRef = useRef(pathname)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    const updateLastVisited = async () => {
      if (
        !isUpdatingRef.current &&
        pathname !== previousPathRef.current && 
        pathname !== '/dashboard' &&
        pathname
      ) {
        try {
          isUpdatingRef.current = true
          await updateSettings({ lastVisitedPath: pathname })
          previousPathRef.current = pathname
        } catch (error) {
          console.error('Fehler beim Aktualisieren des letzten Besuchs:', error)
        } finally {
          isUpdatingRef.current = false
        }
      }
    }

    updateLastVisited()
  }, [pathname])
} 