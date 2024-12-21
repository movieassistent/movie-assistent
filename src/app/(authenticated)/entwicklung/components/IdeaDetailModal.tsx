import { useState, useEffect } from 'react'
import { X, Trash2, Plus, Check, RefreshCw, Copy, MessageSquare } from 'lucide-react'
import { AppIdeaStatus } from '@prisma/client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ConfirmationModal from '@/components/ConfirmationModal'
import SubtaskModal from './SubtaskModal'
import AIGenerationModal from './AIGenerationModal'

interface Subtask {
  id: string
  title: string
  description?: string | null
  aiPrompt?: string | null
  completed: boolean
  order: number
  isAiGenerated: boolean
  createdAt: Date
  updatedAt: Date
}

interface IdeaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  idea: {
    id: string
    title: string
    description: string
    status: AppIdeaStatus
    priority: number
    visibility: 'PUBLIC' | 'PRIVATE'
    category?: string
    createdAt: Date
    updatedAt: Date
    implementedAt: Date | null
    createdById: string
    aiTasks: string[]
    progress: number
    subtasks: Subtask[]
  } | null
  onUpdate: (id: string, data: any, keepModalOpen: boolean) => void
  onDelete: (id: string) => void
  isEditable: boolean
  onGenerateSubtasks?: (id: string) => Promise<void>
}

function SortableSubtask({ subtask, index, onToggle, onDelete, onDoubleClick }: {
  subtask: Subtask
  index: number
  onToggle: (e: React.MouseEvent, index: number) => void
  onDelete: (id: string) => void
  onDoubleClick: (subtask: Subtask) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: subtask.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-lg border ${
        subtask.completed ? 'border-green-500/20 bg-green-500/5' : 'border-[#C6A55C]/20'
      }`}
      onClick={e => e.stopPropagation()}
      onDoubleClick={() => onDoubleClick(subtask)}
    >
      <div className="flex items-start space-x-3">
        <button
          type="button"
          onClick={(e) => onToggle(e, index)}
          className={`mt-1 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            subtask.completed ? 'bg-green-500 border-green-500' : 'border-[#C6A55C]'
          }`}
        >
          {subtask.completed && <Check className="w-3 h-3 text-white" />}
        </button>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-400' : ''}`}>
              {subtask.title}
            </span>
            <div className="flex items-center space-x-2 ml-4">
              {subtask.isAiGenerated && (
                <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full">
                  KI
                </span>
              )}
              <button
                onClick={() => onDelete(subtask.id)}
                className="p-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {subtask.description && (
            <p className="text-sm text-gray-400 mt-2">
              {subtask.description}
            </p>
          )}

          {subtask.aiPrompt && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-400">KI-Prompt</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(subtask.aiPrompt || '')
                    alert('Prompt in die Zwischenablage kopiert!')
                  }}
                  className="p-1 text-[#C6A55C] hover:text-[#85754E] transition-colors"
                  title="Prompt kopieren"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-400 bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                {subtask.aiPrompt}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IdeaDetailModal({
  isOpen,
  onClose,
  idea,
  onUpdate,
  onDelete,
  isEditable,
  onGenerateSubtasks
}: IdeaDetailModalProps) {
  const [formData, setFormData] = useState(idea || {
    title: '',
    description: '',
    status: 'SUBMITTED' as AppIdeaStatus,
    priority: 3,
    visibility: 'PUBLIC' as const,
    category: ''
  })
  const [newSubtask, setNewSubtask] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showDeleteSubtaskConfirmation, setShowDeleteSubtaskConfirmation] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editableTitle, setEditableTitle] = useState('')
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null)
  const [showAIGenerationModal, setShowAIGenerationModal] = useState(false)
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (idea) {
      setFormData(idea)
      setEditableTitle(idea.title)
    }
  }, [idea])

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isOpen) {
        const modalContent = document.querySelector('.modal-content')
        if (modalContent) {
          modalContent.scrollTop += e.deltaY
        }
        e.preventDefault()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('wheel', handleScroll, { passive: false })
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('wheel', handleScroll)
    }
  }, [isOpen])

  if (!isOpen || !idea) return null

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'from-red-500 via-red-500 to-red-500'
    if (progress < 70) return 'from-yellow-500 via-yellow-500 to-yellow-500'
    return 'from-green-500 via-green-500 to-green-500'
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!active || !over || active.id === over.id) return

    const oldIndex = idea!.subtasks.findIndex(task => task.id === active.id)
    const newIndex = idea!.subtasks.findIndex(task => task.id === over.id)

    const updatedSubtasks = arrayMove(idea!.subtasks, oldIndex, newIndex)
    
    onUpdate(idea!.id, {
      ...idea,
      subtasks: updatedSubtasks.map((task, index) => ({
        ...task,
        order: index
      }))
    }, true)
  }

  const handleToggleSubtask = async (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!idea) return

    const updatedSubtasks = idea.subtasks.map((task, i) => {
      if (i === index) {
        return {
          ...task,
          completed: !task.completed
        }
      }
      return task
    }).sort((a, b) => {
      // Sortiere abgehakte Unterpunkte nach unten
      if (a.completed === b.completed) return a.order - b.order
      return a.completed ? 1 : -1
    })

    try {
      const response = await fetch(`/api/development/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          status: idea.status,
          priority: idea.priority,
          visibility: idea.visibility,
          category: idea.category,
          subtasks: updatedSubtasks.map((task, idx) => ({
            ...task,
            order: idx
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Unterpunkts')
      }

      const updatedIdea = await response.json()
      setFormData(updatedIdea)
      onUpdate(idea.id, updatedIdea, true)
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(idea.id, formData)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirmed = () => {
    onDelete(idea!.id)
    onClose()
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !idea) return

    const currentSubtasks = idea.subtasks || []
    const updatedSubtasks = [
      ...currentSubtasks,
      {
        title: newSubtask,
        completed: false,
        order: currentSubtasks.length
      }
    ]

    onUpdate(idea.id, {
      ...formData,
      subtasks: updatedSubtasks
    })

    setNewSubtask('')
  }

  const handleGenerateSubtasks = async () => {
    if (!idea || !onGenerateSubtasks) return
    setShowAIGenerationModal(true)
    setIsGenerating(true)
    try {
      const response = await onGenerateSubtasks(idea.id)
      // Hier nehmen wir an, dass die Antwort die generierten Unterpunkte enthält
      setGeneratedSubtasks(response || [])
    } catch (error) {
      console.error('Fehler beim Generieren der Unterpunkte:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAIGenerationComplete = async () => {
    if (!idea) return
    // Lade die aktuelle Idee neu
    try {
      const response = await fetch(`/api/development/${idea.id}`)
      if (!response.ok) throw new Error('Fehler beim Laden der Idee')
      const updatedIdea = await response.json()
      setFormData(updatedIdea)
      onUpdate(idea.id, updatedIdea, true)
    } catch (error) {
      console.error('Fehler beim Neuladen der Idee:', error)
    }
  }

  const handleDeleteSubtask = async (subtaskId: string) => {
    setShowDeleteSubtaskConfirmation(subtaskId)
  }

  const handleDeleteSubtaskConfirmed = async () => {
    if (!idea || !showDeleteSubtaskConfirmation) return
    
    const updatedSubtasks = idea.subtasks.filter(task => task.id !== showDeleteSubtaskConfirmation)
    
    try {
      const response = await fetch(`/api/development/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subtasks: updatedSubtasks.map((task, idx) => ({
            ...task,
            order: idx
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Unterpunkts')
      }

      const updatedIdea = await response.json()
      setFormData(updatedIdea)
      onUpdate(idea.id, updatedIdea, true)
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  const handleTitleSubmit = async () => {
    if (!idea) return
    
    const updatedData = {
      ...formData,
      title: editableTitle
    }
    
    try {
      const response = await fetch(`/api/development/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Titels')
      }

      const updatedIdea = await response.json()
      setFormData(updatedIdea)
      onUpdate(idea.id, updatedIdea, true)
    } catch (error) {
      console.error('Fehler:', error)
    } finally {
      setIsEditingTitle(false)
    }
  }

  const handleSubtaskDoubleClick = (subtask: Subtask) => {
    if (!subtask) return
    setSelectedSubtask(subtask)
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
            handleClose(e)
          }
        }}
      >
        <div 
          className="modal-content bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-4 border border-[#C6A55C]/20 max-h-[90vh] overflow-y-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleTitleSubmit()
                    }
                  }}
                  className="text-2xl font-bold text-[#C6A55C] bg-transparent focus:outline-none w-full border-b border-[#C6A55C]/20 pb-1"
                  autoFocus
                />
              ) : (
                <h2 
                  className="text-2xl font-bold text-[#C6A55C] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setEditableTitle(formData.title)
                    setIsEditingTitle(true)
                  }}
                >
                  {formData.title}
                </h2>
              )}
              <div className="flex items-center space-x-4">
                {isEditable && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              <div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] min-h-[150px]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#C6A55C] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AppIdeaStatus }))}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                  >
                    <option value="SUBMITTED">Eingereicht</option>
                    <option value="ACCEPTED">Akzeptiert</option>
                    <option value="IN_PROGRESS">In Bearbeitung</option>
                    <option value="DONE">Erledigt</option>
                    <option value="REJECTED">Abgelehnt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#C6A55C] mb-2">Priorität</label>
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
                  <label className="block text-sm font-medium text-[#C6A55C] mb-2">Sichtbarkeit</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' }))}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                  >
                    <option value="PUBLIC">Öffentlich</option>
                    <option value="PRIVATE">Privat</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
                >
                  Speichern
                </button>
              </div>
            </div>
          </form>

          {/* Subtasks section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-[#C6A55C]">Unterpunkte</label>
              {onGenerateSubtasks && (
                <button
                  type="button"
                  onClick={handleGenerateSubtasks}
                  disabled={isGenerating}
                  className="flex items-center px-3 py-1 text-sm text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  KI-Vorschläge
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {idea.subtasks && idea.subtasks.length > 0 && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Gesamtfortschritt</span>
                  <span>{Math.round((idea.subtasks.filter(t => t.completed).length / idea.subtasks.length) * 100)}% ({idea.subtasks.filter(t => t.completed).length}/{idea.subtasks.length})</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
                  {Array.from({ length: idea.subtasks.length }).map((_, index) => {
                    const progress = Math.round((idea.subtasks.filter(t => t.completed).length / idea.subtasks.length) * 100)
                    return (
                      <div
                        key={index}
                        className={`h-full flex-1 ${
                          index < idea.subtasks.filter(t => t.completed).length
                            ? `bg-gradient-to-r ${getProgressColor(progress)}`
                            : 'bg-gray-700'
                        } ${index > 0 ? 'border-l border-[#1A1A1A]' : ''}`}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={idea?.subtasks || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 mb-4">
                  {(idea?.subtasks || []).map((subtask, index) => (
                    <SortableSubtask
                      key={subtask.id}
                      subtask={subtask}
                      index={index}
                      onToggle={handleToggleSubtask}
                      onDelete={handleDeleteSubtask}
                      onDoubleClick={handleSubtaskDoubleClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Neuer Unterpunkt..."
                className="flex-1 px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirmed}
        title="Idee löschen"
        message="Sind Sie sicher, dass Sie diese Idee löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
      />

      <ConfirmationModal
        isOpen={!!showDeleteSubtaskConfirmation}
        onClose={() => setShowDeleteSubtaskConfirmation(null)}
        onConfirm={handleDeleteSubtaskConfirmed}
        title="Unterpunkt löschen"
        message="Sind Sie sicher, dass Sie diesen Unterpunkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
      />

      <SubtaskModal
        isOpen={!!selectedSubtask}
        onClose={() => setSelectedSubtask(null)}
        subtask={selectedSubtask!}
        onUpdate={async (id, data) => {
          if (!idea || !selectedSubtask) return
          const updatedSubtasks = idea.subtasks.map(task =>
            task.id === id ? { ...task, ...data } : task
          )
          await onUpdate(idea.id, { ...formData, subtasks: updatedSubtasks }, true)
          setSelectedSubtask(null)
        }}
        onDelete={handleDeleteSubtask}
      />

      <AIGenerationModal
        isOpen={showAIGenerationModal}
        onClose={() => setShowAIGenerationModal(false)}
        title={idea?.title || ''}
        onComplete={handleAIGenerationComplete}
        generatedSubtasks={generatedSubtasks}
      />
    </>
  )
} 