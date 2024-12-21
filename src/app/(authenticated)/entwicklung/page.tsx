'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AppIdeaStatus } from '@prisma/client'
import { Plus, Settings, Filter, Grid, List, ChevronDown, X } from 'lucide-react'
import NewIdeaModal from './components/NewIdeaModal'
import IdeaDetailModal from './components/IdeaDetailModal'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  rectIntersection
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DevelopmentIdea {
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
  order: number
  subtasks: {
    id: string
    title: string
    description?: string | null
    aiPrompt?: string | null
    completed: boolean
    order: number
    isAiGenerated: boolean
    createdAt: Date
    updatedAt: Date
  }[]
}

interface FilterState {
  status: AppIdeaStatus | 'ALL'
  priority: number | null
  visibility: 'ALL' | 'PUBLIC' | 'PRIVATE'
  view: 'GRID' | 'LIST'
}

const initialFilter: FilterState = {
  status: 'ALL',
  priority: null,
  visibility: 'ALL',
  view: 'GRID'
}

function SortableIdeaCard({ idea, onClick, view, isDraggingStatus, setIdeas }: { 
  idea: DevelopmentIdea
  onClick: () => void
  view: 'GRID' | 'LIST'
  isDraggingStatus: string | null
  setIdeas: (ideas: DevelopmentIdea[]) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({ 
    id: idea.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    position: 'relative',
    zIndex: isDragging ? 50 : 1,
    height: '100%',
    userSelect: 'none'
  } as const

  const completedTasks = idea.subtasks?.filter(task => task.completed).length || 0
  const totalTasks = idea.subtasks?.length || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'from-red-500 via-red-500 to-red-500'
    if (progress < 70) return 'from-yellow-500 via-yellow-500 to-yellow-500'
    return 'from-green-500 via-green-500 to-green-500'
  }

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const updatedSubtasks = idea.subtasks.map(task => 
        task.id === subtaskId ? { ...task, completed: !completed } : task
      )

      const completedCount = updatedSubtasks.filter(task => task.completed).length
      const progress = Math.round((completedCount / updatedSubtasks.length) * 100)

      const response = await fetch(`/api/development/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...idea,
          subtasks: updatedSubtasks.map(task => ({
            title: task.title,
            description: task.description,
            aiPrompt: task.aiPrompt,
            completed: task.completed,
            order: task.order,
            isAiGenerated: task.isAiGenerated
          })),
          progress
        })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Unterpunkts')
      }

      // Aktualisiere die lokale State
      const updatedIdea = await response.json()
      setIdeas(prev => prev.map(i => i.id === idea.id ? updatedIdea : i))
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-[#1A1A1A] rounded-lg shadow-lg p-6 border border-[#C6A55C]/20 
        transition-colors duration-200
        ${!isDragging && 'hover:border-[#C6A55C] hover:shadow-[#C6A55C]/20 hover:shadow-lg'}
        ${over?.id === idea.id ? 'border-[#C6A55C] border-2 -translate-y-1' : ''}
        ${view === 'LIST' ? 'flex items-center justify-between' : ''}
      `}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div className="w-full space-y-4">
        <h2 className="text-xl font-semibold text-[#C6A55C] w-full">{idea.title}</h2>
        
        <p className="text-gray-300 whitespace-pre-wrap">{idea.description}</p>
        
        {totalTasks > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Fortschritt</span>
              <span>{progress}% ({completedTasks}/{totalTasks})</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
              {Array.from({ length: totalTasks }).map((_, index) => (
                <div
                  key={index}
                  className={`h-full flex-1 ${
                    index < completedTasks
                      ? `bg-gradient-to-r ${getProgressColor(progress)}`
                      : 'bg-gray-700'
                  } ${index > 0 ? 'border-l border-[#1A1A1A]' : ''}`}
                />
              ))}
            </div>
          </div>
        )}
        
        {idea.subtasks && idea.subtasks.length > 0 && (
          <div className="space-y-2">
            {idea.subtasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleSubtask(task.id, task.completed)}
                  className="w-4 h-4 rounded border-[#C6A55C]/20 text-[#C6A55C] focus:ring-[#C6A55C] cursor-pointer"
                />
                <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < idea.priority ? 'bg-[#C6A55C]' : 'bg-gray-600'}`}
              />
            ))}
          </div>

          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${idea.visibility === 'PRIVATE' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}
          `}>
            {idea.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat'}
          </span>

          <span className="text-gray-400 text-sm">
            {new Date(idea.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function EntwicklungPage() {
  const { data: session } = useSession()
  const [ideas, setIdeas] = useState<DevelopmentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const [filter, setFilter] = useState<FilterState>(initialFilter)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<DevelopmentIdea | null>(null)
  const [isDraggingStatus, setIsDraggingStatus] = useState<string | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeIdea, setActiveIdea] = useState<DevelopmentIdea | null>(null)

  useEffect(() => {
    loadIdeas()
    loadUserRole()
  }, [])

  const loadUserRole = async () => {
    try {
      const response = await fetch('/api/user/role')
      if (response.ok) {
        const { role } = await response.json()
        setUserRole(role)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerrolle:', error)
    }
  }

  const loadIdeas = async () => {
    try {
      const response = await fetch('/api/development')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      } else {
        const errorText = await response.text()
      }
    } catch (error) {
      console.error('Fehler beim Laden der Entwicklungsideen:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIdea = async (data: any) => {
    try {
      const response = await fetch('/api/development', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newIdea = await response.json()
        setIdeas(prev => [...prev, newIdea])
        setIsNewModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Fehler beim Erstellen der Idee')
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Idee:', error)
      alert('Fehler beim Erstellen der Idee')
    }
  }

  const handleUpdateIdea = async (id: string, data: any, keepModalOpen: boolean = false) => {
    try {
      const response = await fetch(`/api/development/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.text()

      let parsedData
      try {
        parsedData = responseData ? JSON.parse(responseData) : null
      } catch (e) {
        throw new Error('Ungültige Server-Antwort')
      }

      if (!response.ok) {
        throw new Error(parsedData?.error || 'Fehler beim Aktualisieren der Idee')
      }

      if (!parsedData) {
        throw new Error('Keine Daten vom Server erhalten')
      }

      // Aktualisiere die Idee in der lokalen Liste und behalte die Position bei
      setIdeas(prev => {
        const updatedIdeas = prev.map(idea => {
          if (idea.id === id) {
            const updatedIdea = {
              ...parsedData,
              order: idea.order // Behalte die ursprüngliche Reihenfolge bei
            }
            return updatedIdea
          }
          return idea
        })

        // Sortiere die Liste nach der gespeicherten Reihenfolge
        return updatedIdeas.sort((a, b) => a.order - b.order)
      })

      // Aktualisiere auch selectedIdea, wenn das Modal offen bleiben soll
      if (keepModalOpen) {
        setSelectedIdea(parsedData)
      }

      // Lade die Ideen neu, falls die Sortierung nicht korrekt ist
      await loadIdeas()

      // Schließe das Modal nur, wenn keepModalOpen nicht true ist
      if (!keepModalOpen) {
        setIsDetailModalOpen(false)
        setSelectedIdea(null)
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Idee:', error)
      alert(error instanceof Error ? error.message : 'Fehler beim Aktualisieren der Idee')
    }
  }

  const handleDeleteIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/development/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIdeas(prev => prev.filter(idea => idea.id !== id))
        setIsDetailModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Fehler beim Löschen der Idee')
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Idee:', error)
      alert('Fehler beim Löschen der Idee')
    }
  }

  // Filtere zuerst die Ideen
  const filteredIdeas = ideas.filter(idea => {
    if (filter.priority !== null && idea.priority !== filter.priority) return false
    if (filter.visibility !== 'ALL' && idea.visibility !== filter.visibility) return false
    return true
  })

  // Dann gruppiere die gefilterten Ideen nach Status
  const groupedIdeas = filteredIdeas.reduce((acc, idea) => {
    if (!acc[idea.status]) {
      acc[idea.status] = []
    }
    acc[idea.status].push(idea)
    return acc
  }, {} as Record<string, DevelopmentIdea[]>)

  // Sortiere die Status in der gewünschten Reihenfolge
  const statusOrder = ['IN_PROGRESS', 'ACCEPTED', 'SUBMITTED', 'DONE', 'REJECTED']
  const sortedGroupedIdeas = statusOrder
    .map(status => [status, groupedIdeas[status] || []])

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

  const handleDragStart = (event: DragStartEvent) => {
    const draggedIdea = ideas.find(idea => idea.id === event.active.id)
    if (draggedIdea) {
      setActiveId(draggedIdea.id)
      setActiveIdea(draggedIdea)
      setIsDraggingStatus(draggedIdea.status)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDraggingStatus(null)
    setActiveId(null)
    setActiveIdea(null)

    const { active, over } = event

    if (!active || !over || active.id === over.id) return

    const activeIdea = ideas.find(idea => idea.id === active.id)
    const overIdea = ideas.find(idea => idea.id === over.id)

    if (!activeIdea || !overIdea) return

    const oldIndex = ideas.findIndex(idea => idea.id === active.id)
    const newIndex = ideas.findIndex(idea => idea.id === over.id)

    // Aktualisiere zuerst die lokale State für sofortige UI-Reaktion
    if (activeIdea.status === overIdea.status) {
      // Wenn im gleichen Status, nur die Reihenfolge ändern
      setIdeas(prev => arrayMove(prev, oldIndex, newIndex))
    } else {
      // Wenn Status sich ändert
      setIdeas(prev => prev.map(idea => 
        idea.id === activeIdea.id 
          ? { ...idea, status: overIdea.status }
          : idea
      ))
    }

    // Dann aktualisiere den Server
    try {
      if (activeIdea.status === overIdea.status) {
        // Update Reihenfolge
        await fetch('/api/development/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ideaId: active.id,
            newIndex
          })
        })
      } else {
        // Update Status
        const statusResponse = await fetch(`/api/development/${activeIdea.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...activeIdea,
            status: overIdea.status
          })
        })

        if (!statusResponse.ok) {
          throw new Error('Fehler beim Aktualisieren des Status')
        }
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error)
      loadIdeas()
    }
  }

  const modifiers = {
    active: {
      scale: 1.02,
      boxShadow: '0 5px 15px rgba(198, 165, 92, 0.2)',
      zIndex: 50,
    }
  }

  const handleGenerateSubtasks = async (id: string) => {
    try {
      const response = await fetch(`/api/development/${id}/subtasks`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fehler beim Generieren der Unterpunkte')
      }

      // Lade die Ideen neu, um die generierten Unterpunkte zu erhalten
      await loadIdeas()
    } catch (error) {
      console.error('Fehler beim Generieren der Unterpunkte:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#C6A55C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#C6A55C]">Entwicklung</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter(prev => ({ ...prev, view: prev.view === 'GRID' ? 'LIST' : 'GRID' }))}
            className="flex items-center px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
          >
            {filter.view === 'GRID' ? (
              <List className="w-5 h-5" />
            ) : (
              <Grid className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 mr-2" />
            Neue Idee
          </button>
        </div>
      </div>

      {/* Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {sortedGroupedIdeas.map(([status, statusIdeas]) => (
            <div key={status} className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20">
              <div className="border-b border-[#C6A55C]/20 px-6 py-4">
                <h3 className="text-lg font-semibold text-[#C6A55C]">
                  {status === 'SUBMITTED' && 'Eingereicht'}
                  {status === 'ACCEPTED' && 'Akzeptiert'}
                  {status === 'IN_PROGRESS' && 'In Bearbeitung'}
                  {status === 'DONE' && 'Erledigt'}
                  {status === 'REJECTED' && 'Abgelehnt'}
                </h3>
              </div>
              <div className="p-6 bg-[#1F1F1F]">
                <SortableContext 
                  items={(statusIdeas as DevelopmentIdea[]).map(idea => idea.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className={`
                    ${filter.view === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
                    min-h-[200px]
                    ${(statusIdeas as DevelopmentIdea[]).length === 0 ? 'flex items-center justify-center border-2 border-dashed border-[#C6A55C]/20 rounded-lg' : ''}
                  `}>
                    {(statusIdeas as DevelopmentIdea[]).length === 0 ? (
                      <div className="text-gray-500 text-sm">
                        Ziehen Sie eine Karte hierher
                      </div>
                    ) : (
                      (statusIdeas as DevelopmentIdea[]).map((idea) => (
                        <SortableIdeaCard
                          key={idea.id}
                          idea={idea}
                          onClick={() => {
                            setSelectedIdea(idea)
                            setIsDetailModalOpen(true)
                          }}
                          view={filter.view}
                          isDraggingStatus={isDraggingStatus}
                          setIdeas={setIdeas}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId && activeIdea ? (
            <div className="opacity-100">
              <SortableIdeaCard
                idea={activeIdea}
                onClick={() => {}}
                view={filter.view}
                isDraggingStatus={null}
                setIdeas={setIdeas}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <NewIdeaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateIdea}
      />

      <IdeaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedIdea(null)
        }}
        idea={selectedIdea}
        onUpdate={handleUpdateIdea}
        onDelete={handleDeleteIdea}
        isEditable={
          selectedIdea?.createdById === session?.user?.id ||
          userRole === 'ADMIN' ||
          userRole === 'SUPERADMIN'
        }
        onGenerateSubtasks={handleGenerateSubtasks}
      />
    </div>
  )
} 