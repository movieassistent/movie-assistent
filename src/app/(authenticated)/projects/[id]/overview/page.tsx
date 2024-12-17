'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Users, FileText, Film } from 'lucide-react'

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
  userRole: string
}

export default function ProjectOverviewPage() {
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
      {/* Projekt-Header */}
      <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
        <h1 className="text-2xl font-semibold text-[#C6A55C] mb-2">{project.title}</h1>
        <p className="text-gray-400">{project.description}</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className="text-[#C6A55C]">{project.genre}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 capitalize">{project.status}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <div className="flex items-center text-[#C6A55C] mb-4">
            <Calendar className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Zeitplan</h3>
          </div>
          <p className="text-gray-400">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Nicht festgelegt'} 
            {' - '}
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Nicht festgelegt'}
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <div className="flex items-center text-[#C6A55C] mb-4">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Team</h3>
          </div>
          <p className="text-gray-400">{project.members.length + 1} Mitglieder</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <div className="flex items-center text-[#C6A55C] mb-4">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Drehbuch</h3>
          </div>
          <p className="text-gray-400">Noch nicht hochgeladen</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <div className="flex items-center text-[#C6A55C] mb-4">
            <Film className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Szenen</h3>
          </div>
          <p className="text-gray-400">0 von 0 abgedreht</p>
        </div>
      </div>

      {/* Aktivitäten */}
      <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
        <h2 className="text-xl font-semibold text-[#C6A55C] mb-4">Letzte Aktivitäten</h2>
        <div className="text-gray-400 text-center py-8">
          Noch keine Aktivitäten vorhanden
        </div>
      </div>
    </div>
  )
} 