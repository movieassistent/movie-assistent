'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import TestModeToggle from './TestModeToggle'
import SidebarPositionSelect from './SidebarPositionSelect'
import StartSettings from './StartSettings'

export default function ProfileContent({ initialSettings }: { initialSettings: any }) {
  const { data: session } = useSession()
  const [settings, setSettings] = useState(initialSettings)
  const [theme, setTheme] = useState('movie') // movie, dark, light, gray

  const handleSettingsUpdate = async (newSettings: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      setSettings(newSettings)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gold-500">Profileinstellungen</h1>
        <p className="text-gray-400">Verwalten Sie Ihre persönlichen Einstellungen und Präferenzen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persönliche Informationen */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gold-500 flex items-center gap-2">
            <span className="material-icons">person</span>
            Persönliche Informationen
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-gray-400">Name</label>
              <p className="text-white">{session?.user?.name || 'SuperAdmin'}</p>
            </div>
            <div>
              <label className="text-gray-400">Email</label>
              <p className="text-white">{session?.user?.email}</p>
            </div>
            <div>
              <label className="text-gray-400">Rolle</label>
              <p className="text-white">Superadmin</p>
            </div>
          </div>
        </div>

        {/* Anzeige */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gold-500 flex items-center gap-2">
            <span className="material-icons">display_settings</span>
            Anzeige
          </h2>
          
          <div className="mt-4 space-y-6">
            <div>
              <label className="text-gray-400 block mb-2">Sidebar-Position</label>
              <SidebarPositionSelect
                value={settings.sidebarPosition}
                onChange={(position) => handleSettingsUpdate({ ...settings, sidebarPosition: position })}
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('movie')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                    theme === 'movie' ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-700/50 text-gray-400'
                  } hover:bg-gold-500/10 transition-colors`}
                >
                  <span className="material-icons">movie</span>
                  Movie
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-700/50 text-gray-400'
                  } hover:bg-gold-500/10 transition-colors`}
                >
                  <span className="material-icons">dark_mode</span>
                  Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                    theme === 'light' ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-700/50 text-gray-400'
                  } hover:bg-gold-500/10 transition-colors`}
                >
                  <span className="material-icons">light_mode</span>
                  Light
                </button>
                <button
                  onClick={() => setTheme('gray')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                    theme === 'gray' ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-700/50 text-gray-400'
                  } hover:bg-gold-500/10 transition-colors`}
                >
                  <span className="material-icons">format_color_reset</span>
                  Gray
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entwickleroptionen */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gold-500 flex items-center gap-2">
            <span className="material-icons">code</span>
            Entwickleroptionen
          </h2>
          <div className="mt-4">
            <TestModeToggle
              value={settings.testMode}
              onChange={(enabled) => handleSettingsUpdate({ ...settings, testMode: enabled })}
            />
          </div>
        </div>

        {/* Start */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gold-500 flex items-center gap-2">
            <span className="material-icons">play_arrow</span>
            Start
          </h2>
          <div className="mt-4">
            <StartSettings
              value={settings.startPage}
              onChange={(page) => handleSettingsUpdate({ ...settings, startPage: page })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}