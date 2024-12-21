import { useState, useEffect } from 'react'
import { X, Trash2, Plus, Check, RefreshCw } from 'lucide-react'
import ConfirmationModal from '@/components/ConfirmationModal'
import AIGenerationModal from './AIGenerationModal'

interface SubtaskModalProps {
  isOpen: boolean
  onClose: () => void
  subtask: {
    id: string
    title: string
    description?: string | null
    aiPrompt?: string | null
    completed: boolean
    order: number
    isAiGenerated: boolean
    children?: any[]
    progress: number
  }
  onUpdate: (id: string, data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onGenerateSubtasks?: (id: string) => Promise<void>
}

export default function SubtaskModal({
  isOpen,
  onClose,
  subtask,
  onUpdate,
  onDelete,
  onGenerateSubtasks
}: SubtaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    order: 0,
    isAiGenerated: false,
    children: [],
    progress: 0
  })
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIGenerationModal, setShowAIGenerationModal] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editableTitle, setEditableTitle] = useState('')

  useEffect(() => {
    if (subtask) {
      setFormData(subtask)
      setEditableTitle(subtask.title)
    }
  }, [subtask])

  if (!isOpen) return null
  if (!subtask) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(subtask.id, formData)
    onClose()
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirmed = async () => {
    await onDelete(subtask.id)
    onClose()
  }

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return

    const updatedChildren = [
      ...(formData.children || []),
      {
        title: newSubtask,
        completed: false,
        order: (formData.children || []).length,
        isAiGenerated: false
      }
    ]

    await onUpdate(subtask.id, {
      ...formData,
      children: updatedChildren
    })

    setNewSubtask('')
  }

  const handleGenerateSubtasks = async () => {
    if (!onGenerateSubtasks) return
    setShowAIGenerationModal(true)
    setIsGenerating(true)
    try {
      await onGenerateSubtasks(subtask.id)
    } catch (error) {
      console.error('Fehler beim Generieren der Unterpunkte:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTitleSubmit = async () => {
    if (!subtask) return
    
    const updatedData = {
      ...formData,
      title: editableTitle
    }
    
    await onUpdate(subtask.id, updatedData)
    setIsEditingTitle(false)
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
            onClose()
          }
        }}
      >
        <div 
          className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-4 border border-[#C6A55C]/20 max-h-[90vh] overflow-y-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
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
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschreibung..."
                  className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] min-h-[100px]"
                />
              </div>

              {/* Untergeordnete Unterpunkte */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-[#C6A55C]">Untergeordnete Unterpunkte</h3>
                  {onGenerateSubtasks && (
                    <button
                      type="button"
                      onClick={handleGenerateSubtasks}
                      disabled={isGenerating}
                      className="flex items-center px-3 py-1 text-sm text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      KI-Vorschläge
                    </button>
                  )}
                </div>

                {formData.children && formData.children.length > 0 && (
                  <div className="space-y-2">
                    {formData.children.map((child: any, index: number) => (
                      <div
                        key={child.id || index}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-[#C6A55C]/20"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const updatedChildren = formData.children.map((c: any, i: number) =>
                              i === index ? { ...c, completed: !c.completed } : c
                            )
                            setFormData(prev => ({ ...prev, children: updatedChildren }))
                          }}
                          className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            child.completed ? 'bg-green-500 border-green-500' : 'border-[#C6A55C]'
                          }`}
                        >
                          {child.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={child.completed ? 'line-through text-gray-400' : ''}>
                          {child.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

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
                  Speichern
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirmed}
        title="Unterpunkt löschen"
        message="Sind Sie sicher, dass Sie diesen Unterpunkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
      />

      <AIGenerationModal
        isOpen={showAIGenerationModal}
        onClose={() => setShowAIGenerationModal(false)}
        title={subtask?.title || ''}
      />
    </>
  )
} 