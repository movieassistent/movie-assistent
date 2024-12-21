import { useState } from 'react'
import { X } from 'lucide-react'

interface NewIdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    priority: number
    visibility: 'PUBLIC' | 'PRIVATE'
    category?: string
  }) => void
}

export default function NewIdeaModal({ isOpen, onClose, onSubmit }: NewIdeaModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 3,
    visibility: 'PUBLIC' as const,
    category: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      priority: 3,
      visibility: 'PUBLIC',
      category: ''
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-4 border border-[#C6A55C]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#C6A55C]">Neue Entwicklungsidee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#C6A55C] mb-1">
              Titel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#C6A55C] mb-1">
              Beschreibung
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] min-h-[150px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#C6A55C] mb-1">
              Priorität
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-gray-400 w-8 text-center">{formData.priority}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#C6A55C] mb-1">
              Sichtbarkeit
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' }))}
              className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
            >
              <option value="PUBLIC">Öffentlich</option>
              <option value="PRIVATE">Privat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#C6A55C] mb-1">
              Kategorie (optional)
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 