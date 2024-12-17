'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Lightbulb, Check, X, Clock } from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'REJECTED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  implementedAt: string | null
}

export default function IdeasPage() {
  const { data: session } = useSession()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false)
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  })

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const response = await fetch('/api/ideas')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Ideen:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea)
      })
      if (response.ok) {
        setShowNewIdeaForm(false)
        setNewIdea({ title: '', description: '', priority: 'MEDIUM' })
        loadIdeas()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Idee:', error)
    }
  }

  const getStatusIcon = (status: Idea['status']) => {
    switch (status) {
      case 'IMPLEMENTED':
        return <Check className="w-5 h-5 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'REJECTED':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <Lightbulb className="w-5 h-5 text-[#C6A55C]" />
    }
  }

  if (session?.user?.role !== 'SUPERADMIN') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-[#C6A55C]">Keine Berechtigung</h1>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#C6A55C]">Ideen & Verbesserungen</h1>
        <button
          onClick={() => setShowNewIdeaForm(true)}
          className="flex items-center px-4 py-2 bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Neue Idee
        </button>
      </div>

      {showNewIdeaForm && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Titel
              </label>
              <input
                type="text"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Beschreibung
              </label>
              <textarea
                value={newIdea.description}
                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                Priorität
              </label>
              <select
                value={newIdea.priority}
                onChange={(e) => setNewIdea({ ...newIdea, priority: e.target.value })}
                className="w-full bg-black/20 border border-[#C6A55C]/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="LOW">Niedrig</option>
                <option value="MEDIUM">Mittel</option>
                <option value="HIGH">Hoch</option>
                <option value="URGENT">Dringend</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowNewIdeaForm(false)}
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

      <div className="grid grid-cols-1 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(idea.status)}
                  <h3 className="text-xl font-semibold text-[#C6A55C]">
                    {idea.title}
                  </h3>
                </div>
                <p className="mt-2 text-gray-400">{idea.description}</p>
              </div>
              <span className={`
                px-3 py-1 rounded-full text-sm
                ${idea.priority === 'URGENT' ? 'bg-red-500/10 text-red-500' :
                  idea.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                  idea.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-green-500/10 text-green-500'}
              `}>
                {idea.priority}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>
                Erstellt am {new Date(idea.createdAt).toLocaleDateString()}
              </span>
              {idea.implementedAt && (
                <span className="text-green-500">
                  Umgesetzt am {new Date(idea.implementedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 