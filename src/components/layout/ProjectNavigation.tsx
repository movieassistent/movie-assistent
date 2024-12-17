'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Settings, FileText, Calendar, 
  MessageSquare, Film, Clapperboard
} from 'lucide-react'

interface ProjectRole {
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'MEMBER' | 'VIEWER'
}

const roleBasedNavItems = {
  OWNER: [
    { name: 'Übersicht', href: '/overview', icon: <Film /> },
    { name: 'Team', href: '/team', icon: <Users /> },
    { name: 'Drehbuch', href: '/script', icon: <FileText /> },
    { name: 'Drehplan', href: '/schedule', icon: <Calendar /> },
    { name: 'Szenen', href: '/scenes', icon: <Clapperboard /> },
    { name: 'Kommunikation', href: '/communication', icon: <MessageSquare /> },
    { name: 'Einstellungen', href: '/settings', icon: <Settings /> }
  ],
  ADMIN: [
    { name: 'Übersicht', href: '/overview', icon: <Film /> },
    { name: 'Team', href: '/team', icon: <Users /> },
    { name: 'Drehbuch', href: '/script', icon: <FileText /> },
    { name: 'Drehplan', href: '/schedule', icon: <Calendar /> },
    { name: 'Szenen', href: '/scenes', icon: <Clapperboard /> },
    { name: 'Kommunikation', href: '/communication', icon: <MessageSquare /> }
  ],
  EDITOR: [
    { name: 'Übersicht', href: '/overview', icon: <Film /> },
    { name: 'Drehbuch', href: '/script', icon: <FileText /> },
    { name: 'Drehplan', href: '/schedule', icon: <Calendar /> },
    { name: 'Szenen', href: '/scenes', icon: <Clapperboard /> },
    { name: 'Kommunikation', href: '/communication', icon: <MessageSquare /> }
  ],
  MEMBER: [
    { name: 'Übersicht', href: '/overview', icon: <Film /> },
    { name: 'Drehplan', href: '/schedule', icon: <Calendar /> },
    { name: 'Szenen', href: '/scenes', icon: <Clapperboard /> },
    { name: 'Kommunikation', href: '/communication', icon: <MessageSquare /> }
  ],
  VIEWER: [
    { name: 'Übersicht', href: '/overview', icon: <Film /> },
    { name: 'Drehplan', href: '/schedule', icon: <Calendar /> }
  ]
}

export default function ProjectNavigation() {
  const params = useParams()
  const [userRole, setUserRole] = useState<ProjectRole['role']>('VIEWER')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjectRole = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setUserRole(data.userRole)
        }
      } catch (error) {
        console.error('Fehler beim Laden der Projektrolle:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProjectRole()
  }, [params.id])

  if (isLoading) return null

  const navItems = roleBasedNavItems[userRole] || roleBasedNavItems.VIEWER

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={`/projects/${params.id}${item.href}`}
          className="flex items-center px-3 py-2 text-[#C6A55C] hover:bg-[#C6A55C]/10 rounded-lg transition-colors"
        >
          <span className="w-5 h-5 mr-3">{item.icon}</span>
          {item.name}
        </Link>
      ))}
    </nav>
  )
} 