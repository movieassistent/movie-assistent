'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SettingsProvider, useSettings } from '@/providers/SettingsProvider'
import MainSidebar from '@/components/layout/MainSidebar'
import { usePathname } from 'next/navigation'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#141414] flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#C6A55C] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#C6A55C] text-lg">Wird geladen...</p>
      </div>
    </div>
  )
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { settings, isLoading, loadSettings } = useSettings()
  const settingsLoaded = useRef(false)
  const initialRedirectDone = useRef(false)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [showContent, setShowContent] = useState(false)
  const previousPathRef = useRef(pathname)

  // F5 Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault()
        router.refresh()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [router])

  // Initialisierung der Settings
  useEffect(() => {
    const initSettings = async () => {
      if (session?.user?.email && !settingsLoaded.current) {
        settingsLoaded.current = true
        
        // 1. Lade die Einstellungen
        const loadedSettings = await loadSettings()
        
        // 2. Aktiviere Vollbildmodus wenn eingestellt
        if (loadedSettings?.displayMode === 'fullscreen') {
          try {
            await document.documentElement.requestFullscreen()
          } catch (error) {
            // Stille Fehlerbehandlung
          }
        }

        // 3. Führe Redirect durch wenn nötig
        if (pathname === '/dashboard' && !initialRedirectDone.current) {
          initialRedirectDone.current = true
          
          let targetPath = '/dashboard'
          
          if (loadedSettings?.startPage === '') {
            if (loadedSettings?.lastVisitedPath && loadedSettings?.lastVisitedPath !== '/dashboard') {
              targetPath = loadedSettings.lastVisitedPath
            }
          } else if (loadedSettings?.startPage && loadedSettings?.startPage !== '/dashboard') {
            targetPath = loadedSettings.startPage
          }

          if (targetPath !== '/dashboard') {
            await router.push(targetPath)
          }
        }

        // 4. Zeige den Content erst, wenn alles initialisiert ist
        setShowContent(true)
      }
    }
    initSettings()
  }, [session, loadSettings, pathname, router])

  useEffect(() => {
    const updateLastVisited = async () => {
      if (pathname !== previousPathRef.current) {
        try {
          const response = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastVisitedPath: pathname })
          })

          if (response.ok) {
            previousPathRef.current = pathname
          }
        } catch (error) {
          // Stille Fehlerbehandlung
        }
      }
    }
    updateLastVisited()
  }, [pathname])

  // Zeige Ladebildschirm bis alles bereit ist
  if (isLoading || !settings || !showContent) {
    return <LoadingScreen />
  }

  const mainStyle = {
    marginLeft: settings.sidebarPosition === 'links' ? (settings.sidebarCollapsed ? '60px' : '192px') : '0',
    marginRight: settings.sidebarPosition === 'rechts' ? (settings.sidebarCollapsed ? '60px' : '192px') : '0',
    marginTop: settings.sidebarPosition === 'oben' ? '52px' : '0',
    marginBottom: settings.sidebarPosition === 'unten' ? '52px' : '0',
    transition: 'all 250ms ease-in-out',
    padding: '2rem'
  }

  return (
    <>
      <MainSidebar />
      <div style={mainStyle}>
        {children}
      </div>
    </>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'authenticated') {
    return (
      <SettingsProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </SettingsProvider>
    )
  }

  return null
}
