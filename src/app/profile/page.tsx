'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Settings {
  theme?: 'movie assistent' | 'hell' | 'dunkel' | 'individuell'
  sidebarPosition?: 'oben' | 'rechts' | 'unten' | 'links'
  startPage?: 'last' | 'dashboard'
  notifications?: {
    email: boolean
    push: boolean
  }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Settings>({
    theme: 'movie assistent',
    sidebarPosition: 'links',
    startPage: 'dashboard',
    notifications: {
      email: false,
      push: false
    }
  })

  useEffect(() => {
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

    if (session) {
      loadSettings()
    }
  }, [session])

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Einstellungen')
      }
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  if (!session) {
    return null
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E]">
        Profil Einstellungen
      </h1>
      <p className="text-gray-400 mt-1">
        Verwalten Sie hier Ihre persönlichen Einstellungen und Informationen.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Persönliche Informationen */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-4">
          <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Persönliche Informationen</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                placeholder="Ihr Name"
                className="w-full p-2 rounded bg-[#C6A55C]/10 border border-[#C6A55C]/20 text-white focus:outline-none focus:border-[#C6A55C]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">E-Mail</label>
              <input
                type="email"
                value={session.user?.email || ''}
                disabled
                className="w-full p-2 rounded bg-[#C6A55C]/10 border border-[#C6A55C]/20 text-white/50"
              />
            </div>
          </div>
        </div>

        {/* App Einstellungen */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-4">
          <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">App Einstellungen</h2>
          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'movie assistent', label: 'movie assistent' },
                  { id: 'hell', label: 'hell' },
                  { id: 'dunkel', label: 'dunkel' },
                  { id: 'individuell', label: 'individuell' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleChange('theme', theme.id)}
                    className={`p-2 rounded border ${
                      settings.theme === theme.id
                        ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black border-[#C6A55C]'
                        : 'bg-[#C6A55C]/10 text-white border-[#C6A55C]/20 hover:border-[#C6A55C]/40'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Position */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sidebar Position</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChange('sidebarPosition', 'oben')}
                  className={`p-2 rounded border col-span-2 ${
                    settings.sidebarPosition === 'oben'
                      ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black border-[#C6A55C]'
                      : 'bg-[#C6A55C]/10 text-white border-[#C6A55C]/20 hover:border-[#C6A55C]/40'
                  }`}
                >
                  oben
                </button>
                {['links', 'rechts'].map((position) => (
                  <button
                    key={position}
                    onClick={() => handleChange('sidebarPosition', position)}
                    className={`p-2 rounded border ${
                      settings.sidebarPosition === position
                        ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black border-[#C6A55C]'
                        : 'bg-[#C6A55C]/10 text-white border-[#C6A55C]/20 hover:border-[#C6A55C]/40'
                    }`}
                  >
                    {position}
                  </button>
                ))}
                <button
                  onClick={() => handleChange('sidebarPosition', 'unten')}
                  className={`p-2 rounded border col-span-2 ${
                    settings.sidebarPosition === 'unten'
                      ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black border-[#C6A55C]'
                      : 'bg-[#C6A55C]/10 text-white border-[#C6A55C]/20 hover:border-[#C6A55C]/40'
                  }`}
                >
                  unten
                </button>
              </div>
            </div>

            {/* Startseite */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Startseite</label>
              <div className="grid grid-cols-2 gap-2">
                {['last', 'dashboard'].map((page) => (
                  <button
                    key={page}
                    onClick={() => handleChange('startPage', page)}
                    className={`p-2 rounded border ${
                      settings.startPage === page
                        ? 'bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black border-[#C6A55C]'
                        : 'bg-[#C6A55C]/10 text-white border-[#C6A55C]/20 hover:border-[#C6A55C]/40'
                    }`}
                  >
                    {page === 'last' ? 'Letzte Seite' : 'Dashboard'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benachrichtigungen */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-4">
          <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Benachrichtigungen</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings.notifications?.email}
                onChange={(e) => handleChange('notifications', { ...settings.notifications, email: e.target.checked })}
                className="form-checkbox text-[#C6A55C] rounded bg-[#C6A55C]/10 border-[#C6A55C]/20" 
              />
              <span className="text-gray-400">E-Mail-Benachrichtigungen</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings.notifications?.push}
                onChange={(e) => handleChange('notifications', { ...settings.notifications, push: e.target.checked })}
                className="form-checkbox text-[#C6A55C] rounded bg-[#C6A55C]/10 border-[#C6A55C]/20" 
              />
              <span className="text-gray-400">Push-Benachrichtigungen</span>
            </label>
          </div>
        </div>

        {/* Passwort ändern */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-4">
          <h2 className="text-xl font-semibold text-[#C6A55C] mb-2">Passwort ändern</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Aktuelles Passwort</label>
              <input
                type="password"
                className="w-full p-2 rounded bg-[#C6A55C]/10 border border-[#C6A55C]/20 text-white focus:outline-none focus:border-[#C6A55C]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Neues Passwort</label>
              <input
                type="password"
                className="w-full p-2 rounded bg-[#C6A55C]/10 border border-[#C6A55C]/20 text-white focus:outline-none focus:border-[#C6A55C]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Passwort bestätigen</label>
              <input
                type="password"
                className="w-full p-2 rounded bg-[#C6A55C]/10 border border-[#C6A55C]/20 text-white focus:outline-none focus:border-[#C6A55C]/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Speichern Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black font-medium hover:opacity-90 transition-opacity"
        >
          Speichern
        </button>
      </div>
    </>
  )
}