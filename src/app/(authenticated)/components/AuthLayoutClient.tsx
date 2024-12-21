'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainSidebar from '@/components/layout/MainSidebar'
import { FullscreenManager } from '@/components/FullscreenManager'
import { useSettings } from '@/providers/SettingsProvider'
import ClientLayout from '@/components/layout/ClientLayout'

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { settings, isLoading, loadSettings } = useSettings()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.push('/login')
          return
        }
        
        await loadSettings()
      } catch (error) {
        console.error('Fehler bei der Authentifizierungsprüfung:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, loadSettings])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#141414]">
        <div className="text-[#C6A55C]">Lade Einstellungen...</div>
      </div>
    )
  }

  return (
    <ClientLayout>
      <div className="flex h-full">
        <MainSidebar />
        <main className="flex-1 overflow-auto pt-5 pb-5 pl-2.5 pr-0">
          <FullscreenManager />
          <div className="rounded-lg bg-[#141414] p-2.5">
            {children}
          </div>
        </main>
      </div>
    </ClientLayout>
  )
} 