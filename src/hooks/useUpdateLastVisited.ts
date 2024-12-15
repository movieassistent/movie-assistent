'use client'

import { useEffect, useRef } from 'react'
import { useSettings } from '@/providers/SettingsProvider'
import { usePathname } from 'next/navigation'

export function useUpdateLastVisited() {
  const { updateSettings } = useSettings()
  const pathname = usePathname()
  const previousPathRef = useRef(pathname)

  useEffect(() => {
    const updateLastVisited = async () => {
      if (
        pathname !== previousPathRef.current && 
        pathname !== '/dashboard' &&
        pathname
      ) {
        try {
          await updateSettings({ lastVisitedPath: pathname })
          previousPathRef.current = pathname
        } catch (error) {
          // Stille Fehlerbehandlung
        }
      }
    }

    updateLastVisited()
  }, [pathname, updateSettings])
} 