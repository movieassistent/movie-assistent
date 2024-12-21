'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSettings } from '@/providers/SettingsProvider'
import { useSession } from 'next-auth/react'
import { 
  LayoutGrid, Film, Calendar, Users, FileText,
  Clock as ClockIcon, Bell, Settings, User,
  LogOut, ChevronLeft, Home, FolderOpen,
  Lightbulb
} from 'lucide-react'
import Clock from '../shared/Clock'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  role?: string
}

// Konstanten am Anfang der Datei definieren
const activeGradient = `bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E]`
const goldGradientText = `text-transparent bg-clip-text bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E] font-bold`

export const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { name: 'Projekte', href: '/projects', icon: <FolderOpen className="w-5 h-5" /> },
  { name: 'Kalender', href: '/calendar', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Cast & Crew', href: '/team', icon: <Users className="w-5 h-5" /> },
  { name: 'Drehbücher', href: '/scripts', icon: <FileText className="w-5 h-5" /> },
  { name: 'Zeitplan', href: '/schedule', icon: <ClockIcon className="w-5 h-5" /> },
  { name: 'Ankündigungen', href: '/announcements', icon: <Bell className="w-5 h-5" /> },
  { name: 'Entwicklung', href: '/entwicklung', icon: <Lightbulb className="w-5 h-5" /> },
  { name: 'Einstellungen', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
]

interface MainSidebarProps {
  // Falls Props benötigt werden
}

// Am Anfang der Datei die Position-Typen definieren
type SidebarPosition = 'oben' | 'unten' | 'links' | 'rechts'

const getTooltipPosition = (position: SidebarPosition) => {
  switch (position) {
    case 'rechts':
      return 'right-full mr-5' // Links vom Icon, 3px weiter weg
    case 'oben':
      return 'top-[52px] left-1/2 -translate-x-1/2' // 52px ist die Höhe der horizontalen Sidebar
    case 'unten':
      return 'bottom-[52px] left-1/2 -translate-x-1/2' // 52px ist die Höhe der horizontalen Sidebar
    default:
      return 'left-full ml-5' // Rechts vom Icon (für 'links'), 3px weiter weg
  }
}

const NavItem = ({ item, isCollapsed, isActive, position }: { 
  item: NavItem
  isCollapsed: boolean
  isActive: boolean
  position: SidebarPosition
}) => {
  return (
    <Link
      key={item.href}
      href={item.href}
      className={`
        group relative flex items-center h-[36px] rounded-lg
        ${isCollapsed ? 'justify-center' : ''} 
        ${isActive
          ? activeGradient + ' text-black'
          : 'text-[#C6A55C] hover:bg-white/5'
        } transition-colors mb-[5px]
      `}
    >
      <div className={`w-8 h-8 flex items-center justify-center ${!isCollapsed && 'pl-3'}`}>
        {item.icon}
      </div>
      {!isCollapsed && <span className="text-sm ml-3">{item.name}</span>}
      
      {/* Tooltip für collapsed Zustand */}
      {isCollapsed && (
        <div className={`
          absolute px-2 py-1 bg-[#1A1A1A] rounded-md
          border border-[#C6A55C]/20 text-[#C6A55C] text-sm whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500
          pointer-events-none z-50
          ${getTooltipPosition(position)}
        `}>
          {item.name}
        </div>
      )}
    </Link>
  )
}

export default function MainSidebar({}: MainSidebarProps) {
  const { data: session } = useSession()
  const { settings, updateSettings, isLoading } = useSettings()
  const pathname = usePathname()

  // Warte auf das Laden der Einstellungen
  if (isLoading) return null

  // Filtere die Navigation basierend auf der Rolle
  const filteredNavItems = mainNavItems.filter(item => 
    !item.role || item.role === session?.user?.role
  )

  const position = settings.sidebarPosition as SidebarPosition
  const isCollapsed = settings.sidebarCollapsed
  const isHorizontal = position === 'oben' || position === 'unten'
  const isVertical = position === 'links' || position === 'rechts'

  const handleToggleCollapse = async (): Promise<void> => {
    await updateSettings({ sidebarCollapsed: !isCollapsed })
  }

  const sidebarBackground = isHorizontal 
    ? 'bg-[#1A1A1A]'
    : 'bg-gradient-to-b from-[#1A1A1A] via-[#111111] to-[#1A1A1A]'

  const getAsideClasses = (): string => `
    fixed z-50 h-screen
    ${sidebarBackground}
    ${position === 'rechts' ? 'right-0' : 'left-0'}
    ${isCollapsed ? 'w-[60px]' : 'w-[192px]'}
    ${position === 'rechts' ? 'border-l' : 'border-r'}
    border-[#C6A55C]/20
    transition-all duration-[250ms] ease-in-out
  `

  const getChevronClasses = (): string => {
    if (isHorizontal) {
      return isCollapsed ? 'rotate-0' : '-rotate-180'
    }
    
    // Für vertikale Sidebar
    if (position === 'links') {
      return isCollapsed ? 'rotate-180' : ''
    }
    // Für rechte Sidebar
    return isCollapsed ? '' : 'rotate-180'
  }

  const handleSignOut = async (): Promise<void> => {
    await signOut({ callbackUrl: '/' })
  }

  if (isHorizontal) {
    return (
      <>
        <div className={`
          fixed z-50 w-full h-[52px]
          ${position === 'oben' ? 'top-0' : 'bottom-0'}
          bg-[#1A1A1A]
          ${position === 'oben' ? 'border-b' : 'border-t'}
          border-[#C6A55C]/20
        `}>
          <div className="h-[52px] px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/images/color_brand.svg"
                alt="movie assistent"
                width={154}
                height={40}
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation */}
            <div className={`
              flex items-center
              ${isCollapsed ? 'space-x-4' : 'space-x-8'}  // Halbierter Abstand im Collapsed-Zustand
            `}>
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center space-x-2 px-3 py-2 rounded-lg
                    ${pathname === item.href
                      ? activeGradient + ' text-black'
                      : 'text-[#C6A55C] hover:bg-white/5'
                    } transition-colors
                  `}
                >
                  <div className="text-inherit">{item.icon}</div>
                  {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  {isCollapsed && (
                    <div className={`
                      absolute px-2 py-1 bg-[#1A1A1A] rounded-md
                      border border-[#C6A55C]/20 text-[#C6A55C] text-sm whitespace-nowrap
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500
                      pointer-events-none z-50
                      ${getTooltipPosition(position)}
                    `}>
                      {item.name}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Rechte Seite: Uhr, Profil und Abmelden */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                {/* Collapse Button */}
                <button
                  onClick={handleToggleCollapse}
                  className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#C6A55C] flex items-center justify-center mr-8"
                >
                  <ChevronLeft 
                    className={`w-4 h-4 
                      text-[#C6A55C]
                      ${position === 'oben' || position === 'unten'
                        ? (isCollapsed ? '' : 'rotate-180')
                        : (isCollapsed ? 'rotate-180' : '')
                      }
                    `}
                  />
                </button>
                {/* Uhrzeit in Container mit fester Breite */}
                <div className="w-[70px] flex justify-center">
                  <Clock format="HH:mm" className={`text-xl ${goldGradientText}`} />
                </div>
              </div>
              <Link
                href="/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg
                  ${pathname === '/profile'
                    ? activeGradient + ' text-black'
                    : 'text-[#C6A55C] hover:bg-white/5'
                  } transition-colors`}
              >
                <User className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleSignOut} 
                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Vertikale Sidebar (links/rechts)
  return (
    <aside className={getAsideClasses()}>
      <div className="flex flex-col h-full w-full">
        {/* Header mit Logo und Uhr */}
        <div className="p-4">
          {!isCollapsed ? (
            <>
              <Image
                src="/images/color_logo.svg"
                alt="movie assistent"
                width={154}
                height={40}
                className="w-[154px] h-auto mb-4"
              />
              <div className="flex justify-center">
                <Clock format="HH:mm" className={`text-xl ${goldGradientText}`} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Clock isCollapsed className={`text-xl ${goldGradientText}`} />
            </div>
          )}
        </div>

        {/* Erste Trennlinie */}
        <div className="border-b border-[#C6A55C]/20" />

        {/* Navigation mit Tooltips */}
        <div className="flex-1 py-4 px-2">
          {filteredNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              isActive={pathname === item.href}
              position={position}
            />
          ))}
        </div>

        {/* Zweite Trennlinie - 10px über dem ersten Footer-Button */}
        <div className="border-b border-[#C6A55C]/20 mt-auto" style={{ marginBottom: '10px' }} />

        {/* Footer */}
        <div className="p-2">
          <div className="space-y-[5px]">
            <Link
              href="/profile"
              className={`group relative flex items-center h-[36px] rounded-lg
                ${isCollapsed ? 'justify-center' : ''} 
                ${pathname === '/profile'
                  ? activeGradient + ' text-black'
                  : 'text-[#C6A55C] hover:bg-white/5'
                } transition-colors`}
            >
              <div className={`w-8 h-8 flex items-center justify-center ${!isCollapsed && 'pl-3'}`}>
                <User className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="text-sm ml-3">Profil</span>}
              {isCollapsed && (
                <div className={`
                  absolute px-2 py-1 bg-[#1A1A1A] rounded-md
                  border border-[#C6A55C]/20 text-[#C6A55C] text-sm whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500
                  pointer-events-none z-50
                  ${getTooltipPosition(position)}
                `}>
                  Profil
                </div>
              )}
            </Link>
            
            <button
              onClick={handleSignOut}
              className={`group relative flex items-center h-[36px] rounded-lg w-full
                ${isCollapsed ? 'justify-center' : ''} 
                text-red-500 hover:bg-red-500/10 transition-colors`}
            >
              <div className={`w-8 h-8 flex items-center justify-center ${!isCollapsed && 'pl-3'}`}>
                <LogOut className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="text-sm ml-3">Abmelden</span>}
              {isCollapsed && (
                <div className={`
                  absolute px-2 py-1 bg-[#1A1A1A] rounded-md
                  border border-[#C6A55C]/20 text-red-500 text-sm whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500
                  pointer-events-none z-50
                  ${getTooltipPosition(position)}
                `}>
                  Abmelden
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Collapse Button */}
        {(position === 'links' || position === 'rechts') && (
          <button
            onClick={handleToggleCollapse}
            className={`
              absolute bg-[#1A1A1A] p-2 rounded-full border border-[#C6A55C]/20 hover:border-[#C6A55C]/40
              ${position === 'links' 
                ? 'right-0 translate-x-1/2' // Für linke Sidebar: Pfeil sitzt mittig auf der rechten Rahmenlinie
                : 'left-0 -translate-x-1/2'  // Für rechte Sidebar: Pfeil sitzt mittig auf der linken Rahmenlinie
              }
            `}
            style={{
              bottom: 'calc(2rem + 36px + 5px + 15px)',
            }}
          >
            <ChevronLeft 
              className={`w-4 h-4 text-[#C6A55C] ${getChevronClasses()}`}
            />
          </button>
        )}
      </div>
    </aside>
  )
}