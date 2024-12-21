'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AppIdeaStatus, Priority } from '@prisma/client'
import { Plus, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FeatureBoardSettings, defaultBoardSettings } from './types'
import SettingsModal from './components/SettingsModal'

interface AppIdea {
  id: string
  title: string
  description: string
  status: AppIdeaStatus
  priority: Priority
  createdAt: Date
  updatedAt: Date
  implementedAt: Date | null
  order?: number
}

interface FeatureFormData {
  title: string
  description: string
  status: AppIdeaStatus
  priority: Priority
}

const initialFormData: FeatureFormData = {
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM'
}

interface SortableFeatureCardProps {
  feature: AppIdea
  onEdit: (feature: AppIdea) => void
  settings: FeatureBoardSettings
}

function SortableFeatureCard({ feature, onEdit, settings }: SortableFeatureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityConfig = (priority: Priority) => {
    return settings.priorities.find(p => p.value === priority) || settings.priorities[0]
  }

  const getStatusColor = (status: AppIdeaStatus) => {
    switch (status) {
      case 'IMPLEMENTED': return 'bg-green-500'
      case 'IN_PROGRESS': return 'bg-blue-500'
      case 'OPEN': return 'bg-yellow-500'
      case 'REJECTED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const priorityConfig = getPriorityConfig(feature.priority)

  const getTextColorClass = (hexColor: string) => {
    const colorMap: Record<string, string> = {
      '#ef4444': 'text-red-500',
      '#f97316': 'text-orange-500',
      '#eab308': 'text-yellow-500',
      '#22c55e': 'text-green-500',
      '#3b82f6': 'text-blue-500',
      '#8b5cf6': 'text-violet-500',
      '#ec4899': 'text-pink-500',
      '#6b7280': 'text-gray-500'
    }
    return colorMap[hexColor] || 'text-gray-500'
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-[#1A1A1A] rounded-lg shadow-lg p-6 border border-[#C6A55C]/20 
        hover:border-[#C6A55C] hover:shadow-[#C6A55C]/20 hover:shadow-lg
        transition-all duration-200 cursor-grab active:cursor-grabbing
        transform hover:scale-[1.02]"
      onDoubleClick={() => onEdit(feature)}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-[#C6A55C]">{feature.title}</h2>
      </div>
      
      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(feature.status)} inline-block mb-4`}>
        {feature.status}
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3">{feature.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className={`font-medium ${getTextColorClass(priorityConfig.color)}`}>
          {priorityConfig.label}
        </span>
        <span className="text-gray-400">
          {feature.implementedAt 
            ? `Implementiert: ${new Date(feature.implementedAt).toLocaleDateString()}`
            : `Erstellt: ${new Date(feature.createdAt).toLocaleDateString()}`
          }
        </span>
      </div>
    </div>
  )
}

interface StatusColumnProps {
  column: { id: string; title: string; status: AppIdeaStatus }
  features: AppIdea[]
  onEdit: (feature: AppIdea) => void
  settings: FeatureBoardSettings
}

function StatusColumn({ column, features, onEdit, settings }: StatusColumnProps) {
  const filteredFeatures = features.filter(f => f.status === column.status)
  console.log(`Column ${column.title}:`, filteredFeatures)

  return (
    <div className="w-[300px] flex-shrink-0">
      <h3 className="text-lg font-semibold text-[#C6A55C] mb-4">{column.title}</h3>
      <div className="space-y-4">
        <SortableContext
          items={filteredFeatures.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredFeatures.map((feature) => (
            <SortableFeatureCard
              key={feature.id}
              feature={feature}
              onEdit={onEdit}
              settings={settings}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export default function FeaturesPage() {
  const { data: session } = useSession()
  const [features, setFeatures] = useState<AppIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [formData, setFormData] = useState<FeatureFormData>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [settings, setSettings] = useState<FeatureBoardSettings>(defaultBoardSettings)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadFeatures()
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('featureBoardSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/features')
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded features:', data)
        setFeatures(data)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/features/${editingId}` : '/api/features'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadFeatures()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadFeatures()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleEdit = (feature: AppIdea) => {
    setFormData({
      title: feature.title,
      description: feature.description,
      status: feature.status,
      priority: feature.priority
    })
    setEditingId(feature.id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData(initialFormData)
    setEditingId(null)
  }

  const handleSaveSettings = (newSettings: FeatureBoardSettings) => {
    setSettings(newSettings)
    localStorage.setItem('featureBoardSettings', JSON.stringify(newSettings))
    setIsSettingsOpen(false)
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!active || !over) return

    const activeFeature = features.find(f => f.id === active.id)
    const overFeature = features.find(f => f.id === over.id)

    if (!activeFeature) return

    // Finde die Zielspalte basierend auf der Position
    const dropColumn = visibleColumns.find(col => {
      const columnElement = document.querySelector(`[data-column-id="${col.id}"]`)
      if (!columnElement) return false
      const rect = columnElement.getBoundingClientRect()
      return event.activatorEvent.clientX >= rect.left && event.activatorEvent.clientX <= rect.right
    })

    if (dropColumn) {
      // Update Status wenn die Spalte sich geändert hat
      const newStatus = dropColumn.status
      if (activeFeature.status !== newStatus) {
        try {
          const response = await fetch(`/api/features/${activeFeature.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...activeFeature,
              status: newStatus
            })
          })

          if (response.ok) {
            setFeatures(features.map(f => 
              f.id === activeFeature.id 
                ? { ...f, status: newStatus }
                : f
            ))
          }
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Status:', error)
        }
      }
    }

    // Reihenfolge aktualisieren
    if (active.id !== over.id) {
      setFeatures((features) => {
        const oldIndex = features.findIndex((f) => f.id === active.id)
        const newIndex = features.findIndex((f) => f.id === over.id)
        
        const newFeatures = arrayMove(features, oldIndex, newIndex)
        
        // Update order on the server
        fetch('/api/features/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            featureId: active.id,
            newIndex,
          }),
        }).catch(console.error)

        return newFeatures
      })
    }
  }

  const handleNextPage = () => {
    const maxPage = Math.ceil(settings.columns.length / settings.maxVisibleColumns) - 1
    setSettings(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, maxPage)
    }))
  }

  const handlePrevPage = () => {
    setSettings(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 0)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#C6A55C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const startIdx = settings.currentPage * settings.maxVisibleColumns
  const visibleColumns = settings.columns.slice(startIdx, startIdx + settings.maxVisibleColumns)
  const hasNextPage = startIdx + settings.maxVisibleColumns < settings.columns.length
  const hasPrevPage = settings.currentPage > 0
  const showNavigation = settings.columns.length > settings.maxVisibleColumns

  // Debug-Ausgabe vor dem Rendern
  console.log('Current features:', features)
  console.log('Visible columns:', visibleColumns)
  console.log('Settings:', settings)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#C6A55C]">Feature-Übersicht</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 mr-2" />
            Einstellungen
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 mr-2" />
            Neues Feature
          </button>
        </div>
      </div>

      {/* Column Navigation - only show if needed */}
      {showNavigation && (
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className="p-2 text-[#C6A55C] hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center text-sm text-gray-400">
            Seite {settings.currentPage + 1} von {Math.ceil(settings.columns.length / settings.maxVisibleColumns)}
          </div>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="p-2 text-[#C6A55C] hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Feature Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {visibleColumns.map((column) => (
            <div key={column.id} data-column-id={column.id}>
              <StatusColumn
                column={column}
                features={features}
                onEdit={handleEdit}
                settings={settings}
              />
            </div>
          ))}
        </div>
      </DndContext>

      {/* Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-md border border-[#C6A55C]/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#C6A55C]">
                {editingId ? 'Feature bearbeiten' : 'Neues Feature'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/5 rounded"
              >
                <X className="w-5 h-5 text-[#C6A55C]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AppIdeaStatus })}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                  >
                    {settings.columns.map(column => (
                      <option key={column.id} value={column.status}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#C6A55C] mb-1">
                    Priorität
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                  >
                    {settings.priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Möchten Sie dieses Feature wirklich löschen?')) {
                        handleDelete(editingId)
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Löschen
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  )
} 