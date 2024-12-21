'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { AppIdeaStatus } from '@prisma/client'
import { FeatureBoardSettings, ColumnConfig, PriorityConfig } from '../types'
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

interface SettingsModalProps {
  settings: FeatureBoardSettings
  onClose: () => void
  onSave: (settings: FeatureBoardSettings) => void
}

interface SortableColumnInputProps {
  column: ColumnConfig
  onTitleChange: (title: string) => void
  onRemove: () => void
}

function SortableColumnInput({ column, onTitleChange, onRemove }: SortableColumnInputProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center space-x-4 cursor-grab active:cursor-grabbing"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={column.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C] pr-10"
        />
        <button
          onClick={onRemove}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  )
}

const PREDEFINED_COLORS = [
  { value: '#ef4444', label: 'Rot' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Gelb' },
  { value: '#22c55e', label: 'Grün' },
  { value: '#3b82f6', label: 'Blau' },
  { value: '#8b5cf6', label: 'Violett' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#6b7280', label: 'Grau' }
]

function ColorPicker({ value, onChange }: { value: string, onChange: (color: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded border border-[#C6A55C]/20 overflow-hidden"
        style={{ backgroundColor: value }}
      />
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 p-2 bg-[#1A1A1A] border border-[#C6A55C]/20 rounded-lg shadow-lg grid grid-cols-4 gap-2 z-50">
          {PREDEFINED_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                onChange(color.value)
                setIsOpen(false)
              }}
              className="w-8 h-8 rounded border border-[#C6A55C]/20 overflow-hidden hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SettingsModal({ settings, onClose, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<FeatureBoardSettings>({ ...settings })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleColumnTitleChange = (index: number, title: string) => {
    const newColumns = [...localSettings.columns]
    newColumns[index] = { ...newColumns[index], title }
    setLocalSettings({ ...localSettings, columns: newColumns })
  }

  const handlePriorityChange = (index: number, field: keyof PriorityConfig, value: string) => {
    const newPriorities = [...localSettings.priorities]
    newPriorities[index] = { ...newPriorities[index], [field]: value }
    setLocalSettings({ ...localSettings, priorities: newPriorities })
  }

  const handleAddColumn = () => {
    const newColumn: ColumnConfig = {
      id: `column-${Date.now()}`,
      title: 'Neue Spalte',
      status: 'OPEN'
    }
    setLocalSettings({
      ...localSettings,
      columns: [...localSettings.columns, newColumn]
    })
  }

  const handleRemoveColumn = (index: number) => {
    const newColumns = localSettings.columns.filter((_, i) => i !== index)
    setLocalSettings({ ...localSettings, columns: newColumns })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localSettings.columns.findIndex(col => col.id === active.id)
      const newIndex = localSettings.columns.findIndex(col => col.id === over.id)

      setLocalSettings({
        ...localSettings,
        columns: arrayMove(localSettings.columns, oldIndex, newIndex)
      })
    }
  }

  const handleMaxColumnsChange = (value: string) => {
    const maxColumns = Math.max(1, Math.min(parseInt(value) || 1, localSettings.columns.length))
    setLocalSettings({ ...localSettings, maxVisibleColumns: maxColumns })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl border border-[#C6A55C]/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#C6A55C]">Features Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded"
          >
            <X className="w-5 h-5 text-[#C6A55C]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Spalten-Einstellungen */}
          <div>
            <h3 className="text-lg font-semibold text-[#C6A55C] mb-4">Spalten</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localSettings.columns.map(col => col.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {localSettings.columns.map((column, index) => (
                    <SortableColumnInput
                      key={column.id}
                      column={column}
                      onTitleChange={(title) => handleColumnTitleChange(index, title)}
                      onRemove={() => handleRemoveColumn(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <button
              onClick={handleAddColumn}
              className="mt-4 flex items-center px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Spalte
            </button>
          </div>

          {/* Prioritäten-Einstellungen */}
          <div>
            <h3 className="text-lg font-semibold text-[#C6A55C] mb-4">Prioritäten</h3>
            <div className="space-y-4">
              {localSettings.priorities.map((priority, index) => (
                <div key={priority.value} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={priority.label}
                      onChange={(e) => handlePriorityChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
                    />
                  </div>
                  <ColorPicker
                    value={priority.color}
                    onChange={(color) => handlePriorityChange(index, 'color', color)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Anzahl sichtbarer Spalten */}
          <div>
            <h3 className="text-lg font-semibold text-[#C6A55C] mb-4">Layout</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-300">Maximale Anzahl sichtbarer Spalten:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={localSettings.maxVisibleColumns}
                onChange={(e) => handleMaxColumnsChange(e.target.value)}
                className="w-20 px-3 py-2 bg-[#111111] border border-[#C6A55C]/20 rounded-lg focus:outline-none focus:border-[#C6A55C]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#C6A55C] hover:bg-white/5 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={() => onSave(localSettings)}
            className="px-4 py-2 bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
} 