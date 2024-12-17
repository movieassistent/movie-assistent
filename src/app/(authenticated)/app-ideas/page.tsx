'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Lightbulb, Check, X, Clock, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

interface Idea {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'REJECTED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  implementedAt: string | null
}

const statusOptions = [
  { value: 'OPEN', label: 'Offen', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'IN_PROGRESS', label: 'In Arbeit', icon: <Clock className="w-4 h-4" /> },
  { value: 'IMPLEMENTED', label: 'Implementiert', icon: <Check className="w-4 h-4" /> },
  { value: 'REJECTED', label: 'Abgelehnt', icon: <X className="w-4 h-4" /> }
]

export default function AppIdeasPage() {
  // ... bisheriger Code ...

  const updateIdeaStatus = async (ideaId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/app-ideas/${ideaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Status erfolgreich aktualisiert')
        loadIdeas() // Lade die Liste neu
      } else {
        toast.error('Fehler beim Aktualisieren des Status')
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
      toast.error('Fehler beim Aktualisieren des Status')
    }
  }

  return (
    <div className="space-y-8">
      {/* ... bisheriger Header und Form Code ... */}

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
              
              {/* Status Dropdown */}
              <div className="relative group">
                <button className={`
                  px-3 py-1 rounded-full text-sm flex items-center space-x-2
                  ${idea.status === 'IMPLEMENTED' ? 'bg-green-500/10 text-green-500' :
                    idea.status === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500' :
                    idea.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                    'bg-[#C6A55C]/10 text-[#C6A55C]'}
                `}>
                  <span>{statusOptions.find(s => s.value === idea.status)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#C6A55C]/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateIdeaStatus(idea.id, option.value)}
                      className="w-full px-4 py-2 flex items-center space-x-2 hover:bg-[#C6A55C]/10 text-[#C6A55C] first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ... Rest des Idea Cards ... */}
          </div>
        ))}
      </div>
    </div>
  )
} 