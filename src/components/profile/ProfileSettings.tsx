'use client'

import { useState } from 'react'
import { useSettings } from '@/providers/SettingsProvider'

interface ProfileSettingsProps {
  initialSettings: any
  user: any
}

export default function ProfileSettings({ initialSettings, user }: ProfileSettingsProps) {
  const { settings, updateSettings } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  const handleStartPageChange = async (value: 'dashboard' | 'lastVisited') => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startPage: value }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
      
      await updateSettings({ startPage: value })
    } catch (error) {
      console.error('Failed to update start page:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSidebarPositionChange = async (value: 'left' | 'right' | 'top' | 'bottom') => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sidebarPosition: value }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
      
      await updateSettings({ sidebarPosition: value })
    } catch (error) {
      console.error('Failed to update sidebar position:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestModeChange = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testMode: !settings.testMode }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
      
      await updateSettings({ testMode: !settings.testMode })
    } catch (error) {
      console.error('Failed to update test mode:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-[#C6A55C]">Profil Einstellungen</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Allgemein</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Startseite
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleStartPageChange('dashboard')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.startPage === 'dashboard'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleStartPageChange('lastVisited')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.startPage === 'lastVisited'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Letzte Seite
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sidebar Position
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSidebarPositionChange('left')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.sidebarPosition === 'left'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Links
                </button>
                <button
                  onClick={() => handleSidebarPositionChange('right')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.sidebarPosition === 'right'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Rechts
                </button>
                <button
                  onClick={() => handleSidebarPositionChange('top')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.sidebarPosition === 'top'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Oben
                </button>
                <button
                  onClick={() => handleSidebarPositionChange('bottom')}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.sidebarPosition === 'bottom'
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Unten
                </button>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Admin Einstellungen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Test Modus
                </label>
                <button
                  onClick={handleTestModeChange}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.testMode
                      ? 'bg-[#C6A55C] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {settings.testMode ? 'Aktiviert' : 'Deaktiviert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
