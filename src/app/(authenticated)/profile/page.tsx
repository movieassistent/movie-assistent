'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSettings } from '@/providers/SettingsProvider'
import { useRouter } from 'next/navigation'
import { mainNavItems } from '@/components/layout/MainSidebar'
import { ExternalLink, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'

interface ApiKey {
  id: string
  provider: string
  key: string
  isActive: boolean
  balance?: number | null
  lastUsed?: Date | null
  createdAt: Date
  updatedAt: Date
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const { settings, updateSettings } = useSettings()
  const router = useRouter()
  const [projects, setProjects] = useState<Array<{ id: string, name: string }>>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKey, setNewKey] = useState({ provider: 'openai', key: '' })
  const [loading, setLoading] = useState(true)

  const providerLinks = {
    openai: 'https://platform.openai.com/api-keys',
    anthropic: 'https://console.anthropic.com/account/keys'
  }

  // Lade Projekte und API Keys beim ersten Render
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, apiKeysResponse] = await Promise.all([
          fetch('/api/projects'),
          session?.user?.role === 'SUPERADMIN' ? fetch('/api/user/api-keys') : null
        ])

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }

        if (apiKeysResponse?.ok) {
          const apiKeysData = await apiKeysResponse.json()
          setApiKeys(apiKeysData)
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [session?.user?.role])

  // Füge neuen useEffect für automatische Abfrage hinzu
  useEffect(() => {
    if (session?.user?.role === 'SUPERADMIN') {
      // Initial balance check
      fetch('/api/user/api-keys/balance')

      // Set up hourly balance check
      const interval = setInterval(() => {
        fetch('/api/user/api-keys/balance')
      }, 60 * 60 * 1000) // 1 hour in milliseconds

      return () => clearInterval(interval)
    }
  }, [session?.user?.role])

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

  // API Key Management Functions
  const addApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey)
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys(prev => [...prev, data])
        setNewKey({ provider: 'openai', key: '' })
      }
    } catch (error) {
      console.error('Error adding API key:', error)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen API-Schlüssel löschen möchten?')) return

    try {
      const response = await fetch(`/api/user/api-keys/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== id))
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#C6A55C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Erste Spalte - Profil & Menü */}
        <div className="space-y-8">
          {/* Profil Container */}
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
                <label className="block text-sm font-medium text-[#C6A55C]">Passwort ��ndern</label>
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

        {/* Zweite Spalte - Startseite, Startprojekt & API Keys */}
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

          {/* API Key Management Container (nur für Superadmin) */}
          {session?.user?.role === 'SUPERADMIN' && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
              <h2 className="text-xl font-semibold text-[#C6A55C] mb-6">API-Schlüssel Verwaltung</h2>
              <p className="text-gray-400 mb-4">Kontostände werden stündlich automatisch aktualisiert</p>

              {/* API Keys List */}
              <div className="space-y-4 mb-8">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-4 bg-[#111111] rounded-lg border border-[#C6A55C]/20">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#C6A55C]">{key.provider}</span>
                        <a
                          href={providerLinks[key.provider as keyof typeof providerLinks]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="mt-1 font-mono text-sm break-all">
                        {showKeys[key.id] ? key.key : '•'.repeat(Math.min(key.key.length, 35))}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {key.lastUsed && (
                          <span>Zuletzt verwendet: {new Date(key.lastUsed).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 min-w-[150px]">
                      <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#C6A55C]/20">
                        <div className="text-sm text-gray-400">Kontostand</div>
                        <div className="text-lg font-medium text-[#C6A55C]">
                          {key.balance !== null 
                            ? `${key.provider === 'openai' ? '$' : '€'}${key.balance?.toFixed(2)}`
                            : '---'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title={showKeys[key.id] ? "Schlüssel verbergen" : "Schlüssel anzeigen"}
                        >
                          {showKeys[key.id] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteApiKey(key.id)}
                          className="p-2 text-red-500 hover:text-red-400 transition-colors"
                          title="Schlüssel löschen"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New API Key Form */}
              <form onSubmit={addApiKey} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                      Provider
                    </label>
                    <select
                      value={newKey.provider}
                      onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                      API-Schlüssel
                    </label>
                    <input
                      type="text"
                      value={newKey.key}
                      onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                      placeholder={newKey.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <a
                      href={providerLinks[newKey.provider as keyof typeof providerLinks]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      API-Schlüssel erwerben
                    </a>
                    <a
                      href={newKey.provider === 'openai' ? 'https://platform.openai.com/account/usage' : 'https://console.anthropic.com/account/billing'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Kontostand prüfen
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Hinzufügen
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}