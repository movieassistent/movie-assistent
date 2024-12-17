'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FolderOpen, Users, Calendar, Settings } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  genre: string
  startDate: string | null
  endDate: string | null
  owner: {
    name: string | null
    emails: { email: string }[]
  }
  members: Array<{
    id: string
    role: string
    user: {
      name: string | null
      emails: { email: string }[]
    }
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        }
      } catch (error) {
        console.error('Fehler beim Laden des Projekts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProject()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C6A55C]" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-[#C6A55C]">Projekt nicht gefunden</h1>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-[#C6A55C]">{project.title}</h1>
            <p className="text-gray-400 mt-2">{project.description}</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 rounded bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C]">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center text-[#C6A55C] mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Zeitraum</span>
            </div>
            <p className="text-gray-400 text-sm">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Nicht festgelegt'} 
              {' - '}
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Nicht festgelegt'}
            </p>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center text-[#C6A55C] mb-2">
              <FolderOpen className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <p className="text-gray-400 text-sm capitalize">{project.status}</p>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center text-[#C6A55C] mb-2">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Team</span>
            </div>
            <p className="text-gray-400 text-sm">{project.members.length} Mitglieder</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
        <h2 className="text-xl font-semibold text-[#C6A55C] mb-4">Team</h2>
        <div className="space-y-4">
          {/* Owner */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div>
              <p className="text-[#C6A55C]">{project.owner.name}</p>
              <p className="text-sm text-gray-400">{project.owner.emails[0]?.email}</p>
            </div>
            <span className="px-3 py-1 bg-[#C6A55C]/10 text-[#C6A55C] rounded text-sm">Owner</span>
          </div>
          
          {/* Members */}
          {project.members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-[#C6A55C]">{member.user.name}</p>
                <p className="text-sm text-gray-400">{member.user.emails[0]?.email}</p>
              </div>
              <span className="px-3 py-1 bg-[#C6A55C]/10 text-[#C6A55C] rounded text-sm capitalize">
                {member.role.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 