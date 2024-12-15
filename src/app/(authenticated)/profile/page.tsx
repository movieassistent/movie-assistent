'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSettings } from '@/providers/SettingsProvider'
import { useRouter } from 'next/navigation'
import { mainNavItems } from '@/components/layout/MainSidebar'

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const { settings, updateSettings } = useSettings()
  const router = useRouter()
  const [projects, setProjects] = useState<Array<{ id: string, name: string }>>([])

  // Lade Projekte beim ersten Render
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Fehler beim Laden der Projekte:', error)
      }
    }
    loadProjects()
  }, [])

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await updateSession()
        // Zeige Erfolgsmeldung
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error)
    }
  }

  const handleSidebarPositionChange = async (position: 'oben' | 'unten' | 'links' | 'rechts') => {
    await updateSettings({ sidebarPosition: position })
  }

  const handleStartPageChange = async (type: string, path?: string) => {
    if (type === 'dashboard') {
      await updateSettings({ 
        startPage: '/dashboard'
      })
    } else if (type === 'specific' && path) {
      await updateSettings({ 
        startPage: path
      })
    } else if (type === 'lastVisited') {
      await updateSettings({ 
        startPage: ''
      })
    }
  }

  const handleStartProjectChange = async (type: string, projectId?: string) => {
    if (type === 'specificProject') {
      await updateSettings({ startProject: type, specificProjectId: projectId })
    } else {
      await updateSettings({ startProject: type, specificProjectId: null })
    }
  }

  const toggleFullscreen = useCallback(async () => {
    const newValue = !settings.fullscreenOnLogin
    await updateSettings({ fullscreenOnLogin: newValue })
  }, [settings.fullscreenOnLogin, updateSettings])

  const handleDisplayModeChange = async (mode: 'fullscreen' | 'window') => {
    await updateSettings({ displayMode: mode })
    if (mode === 'fullscreen') {
      try {
        await document.documentElement.requestFullscreen()
      } catch (error) {
        console.error('Fullscreen nicht möglich:', error)
      }
    } else if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }

  // Gemeinsame Button-Styles
  const buttonStyle = `
    py-2 px-4 rounded-lg border border-[#C6A55C]/20 transition-colors
    hover:border-[#C6A55C]/20 hover:bg-white/5
  `

  const selectedButtonStyle = `
    py-2 px-4 rounded-lg border border-[#C6A55C]/20
    bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black
  `

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {/* Erste Spalte - Profil */}
        <div>
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-6">Profil Einstellungen</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#C6A55C]">Passwort ändern</label>
                <input
                  type="password"
                  placeholder="Aktuelles Passwort"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
                />
                <input
                  type="password"
                  placeholder="Neues Passwort"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
                />
                <input
                  type="password"
                  placeholder="Passwort bestätigen"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
                />
              </div>
              
              <button
                type="submit"
                className={buttonStyle}
              >
                Profil aktualisieren
              </button>
            </form>
          </div>
        </div>

        {/* Zweite Spalte - Menü & Display */}
        <div className="space-y-8">
          {/* Menüposition Container */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Menüposition</h2>
            <p className="text-gray-400 mb-6">Wählen Sie eine Position für das Menü aus:</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleSidebarPositionChange('oben')}
                className={`
                  w-full
                  ${settings.sidebarPosition === 'oben' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Oben
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSidebarPositionChange('links')}
                  className={`
                    ${settings.sidebarPosition === 'links' ? selectedButtonStyle : buttonStyle}
                  `}
                >
                  Links
                </button>
                <button
                  onClick={() => handleSidebarPositionChange('rechts')}
                  className={`
                    ${settings.sidebarPosition === 'rechts' ? selectedButtonStyle : buttonStyle}
                  `}
                >
                  Rechts
                </button>
              </div>

              <button
                onClick={() => handleSidebarPositionChange('unten')}
                className={`
                  w-full
                  ${settings.sidebarPosition === 'unten' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Unten
              </button>
            </div>
          </div>

          {/* Display Container */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Anzeige</h2>
            <p className="text-gray-400 mb-6">Wählen Sie die Anzeige aus:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDisplayModeChange('fullscreen')}
                className={`
                  ${settings.displayMode === 'fullscreen' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Vollbild
              </button>
              <button
                onClick={() => handleDisplayModeChange('window')}
                className={`
                  ${settings.displayMode === 'window' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Fenstermodus
              </button>
            </div>
          </div>
        </div>

        {/* Dritte Spalte - Startseite & Startprojekt */}
        <div className="space-y-8">
          {/* Startseite Container */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Startseite</h2>
            <p className="text-gray-400 mb-6">Wählen Sie ihre Startseite aus:</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => handleStartPageChange('dashboard')}
                className={`
                  ${settings.startPage === '/dashboard' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleStartPageChange('lastVisited')}
                className={`
                  ${!settings.startPage || settings.startPage === '' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Letzte besuchte Seite
              </button>
            </div>
            <div className="mt-4">
              <select
                value={settings.startPage && settings.startPage !== '/dashboard' && settings.startPage !== '' ? settings.startPage : ''}
                onChange={(e) => handleStartPageChange('specific', e.target.value)}
                className={`
                  w-full h-[42px] px-3 rounded-md text-white
                  ${settings.startPage && settings.startPage !== '/dashboard' && settings.startPage !== '' 
                    ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black'
                    : 'bg-[#111111] border border-[#C6A55C]/20'
                  }
                `}
              >
                <option value="">Bestimmte Seite auswählen...</option>
                {mainNavItems
                  .filter(item => item.href !== '/dashboard')
                  .map(item => (
                    <option key={item.href} value={item.href}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Startprojekt Container */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Startprojekt</h2>
            <p className="text-gray-400 mb-6">Wählen Sie ihr Startprojekt aus:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStartProjectChange('lastProject')}
                className={`
                  ${settings.startProject === 'lastProject' ? selectedButtonStyle : buttonStyle}
                `}
              >
                Letztes geöffnetes Projekt
              </button>
              <select
                value={settings.startProject === 'specificProject' ? settings.specificProjectId : ''}
                onChange={(e) => handleStartProjectChange('specificProject', e.target.value)}
                className="px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-md text-white"
              >
                <option value="">Projekt auswählen...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weitere Einstellungen Container */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Weitere Einstellungen</h2>
            <p className="text-gray-400">Hier können weitere Einstellungen hinzugefügt werden.</p>
          </div>
        </div>
      </div>
    </div>
  )
}