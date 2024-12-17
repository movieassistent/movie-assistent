'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Lightbulb, Check, X, Clock, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUpdateLastVisited } from '@/hooks/useUpdateLastVisited'

interface Feature {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'REJECTED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  implementedAt: string | null
  createdBy: {
    name: string | null
    emails: { email: string }[]
  }
}

const statusOptions = [
  { value: 'OPEN', label: 'Offen', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'IN_PROGRESS', label: 'In Arbeit', icon: <Clock className="w-4 h-4" /> },
  { value: 'IMPLEMENTED', label: 'Implementiert', icon: <Check className="w-4 h-4" /> },
  { value: 'REJECTED', label: 'Abgelehnt', icon: <X className="w-4 h-4" /> }
]

export default function FeaturesPage() {
  useUpdateLastVisited()
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.role === 'SUPERADMIN'
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false)
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN'
  })
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/features')
      if (response.ok) {
        const data = await response.json()
        // Sortiere Features: Implementierte zuerst, dann nach Datum
        const sortedFeatures = data.sort((a: Feature, b: Feature) => {
          if (a.status === 'IMPLEMENTED' && b.status !== 'IMPLEMENTED') return -1
          if (a.status !== 'IMPLEMENTED' && b.status === 'IMPLEMENTED') return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setFeatures(sortedFeatures)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Features:', error)
      toast.error('Features konnten nicht geladen werden')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeature)
      })
      if (response.ok) {
        toast.success('Feature wurde erstellt')
        setShowNewFeatureForm(false)
        setNewFeature({ title: '', description: '', priority: 'MEDIUM', status: 'OPEN' })
        loadFeatures()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Features:', error)
      toast.error('Feature konnte nicht erstellt werden')
    }
  }

  const updateFeatureStatus = async (featureId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Status erfolgreich aktualisiert')
        loadFeatures()
      } else {
        toast.error('Status konnte nicht aktualisiert werden')
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
      toast.error('Status konnte nicht aktualisiert werden')
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFeature) return

    try {
      const response = await fetch(`/api/features/${editingFeature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFeature)
      })

      if (response.ok) {
        toast.success('Feature wurde aktualisiert')
        setEditingFeature(null)
        loadFeatures()
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Features:', error)
      toast.error('Feature konnte nicht aktualisiert werden')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C6A55C]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#C6A55C]">Features</h1>
          <p className="text-gray-400 mt-2">
            Alle Features und Verbesserungen der Movie Assistent App
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowNewFeatureForm(true)}
            className="flex items-center px-4 py-2 bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Neues Feature
          </button>
        )}
      </div>

      {isSuperAdmin && showNewFeatureForm && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Titel
              </label>
              <input
                type="text"
                value={newFeature.title}
                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Beschreibung
              </label>
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Priorität
              </label>
              <select
                value={newFeature.priority}
                onChange={(e) => setNewFeature({ ...newFeature, priority: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="LOW">Niedrig</option>
                <option value="MEDIUM">Mittel</option>
                <option value="HIGH">Hoch</option>
                <option value="URGENT">Dringend</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowNewFeatureForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] rounded-lg transition-colors"
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#C6A55C] line-clamp-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {feature.description}
                </p>
              </div>
              
              {isSuperAdmin && (
                <div className="relative group ml-2">
                  <button className={`
                    px-3 py-1 rounded-full text-sm flex items-center space-x-2
                    ${feature.status === 'IMPLEMENTED' ? 'bg-green-500/10 text-green-500' :
                      feature.status === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500' :
                      feature.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                      'bg-[#C6A55C]/10 text-[#C6A55C]'}
                  `}>
                    <span>{statusOptions.find(s => s.value === feature.status)?.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#C6A55C]/20 rounded-lg shadow-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFeatureStatus(feature.id, option.value)}
                        className="w-full px-4 py-2 flex items-center space-x-2 hover:bg-[#C6A55C]/10 text-[#C6A55C] first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between text-sm">
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${feature.priority === 'URGENT' ? 'bg-red-500/10 text-red-500' :
                  feature.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                  feature.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-green-500/10 text-green-500'}
              `}>
                {feature.priority}
              </span>
              <span className="text-gray-400 text-xs">
                {feature.implementedAt 
                  ? `Implementiert am ${new Date(feature.implementedAt).toLocaleDateString()}`
                  : `Erstellt am ${new Date(feature.createdAt).toLocaleDateString()}`}
              </span>
            </div>

            {isSuperAdmin && (
              <div className="mt-4 pt-4 border-t border-[#C6A55C]/20">
                <button
                  onClick={() => setEditingFeature(feature)}
                  className="w-full px-4 py-2 bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] rounded-lg transition-colors text-sm"
                >
                  Bearbeiten
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Noch keine Features vorhanden
        </div>
      )}

      {editingFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#C6A55C] mb-4">Feature bearbeiten</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={editingFeature.title}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                  className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                  Priorität
                </label>
                <select
                  value={editingFeature.priority}
                  onChange={(e) => setEditingFeature({ ...editingFeature, priority: e.target.value as Feature['priority'] })}
                  className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="LOW">Niedrig</option>
                  <option value="MEDIUM">Mittel</option>
                  <option value="HIGH">Hoch</option>
                  <option value="URGENT">Dringend</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] rounded-lg transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 