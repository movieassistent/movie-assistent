'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutGrid,
  Film,
  Calendar,
  Users,
  FileText,
  Clock as ClockIcon,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Clock from './Clock'
import { useSettings } from '@/providers/SettingsProvider'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  position?: 'left' | 'right';
  onCollapse?: (collapsed: boolean) => void;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
  { name: 'Projekte', href: '/dashboard/projects', icon: <Film className="w-5 h-5" /> },
  { name: 'Kalender', href: '/dashboard/calendar', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Cast & Crew', href: '/dashboard/team', icon: <Users className="w-5 h-5" /> },
  { name: 'Drehbücher', href: '/dashboard/scripts', icon: <FileText className="w-5 h-5" /> },
  { name: 'Zeitplan', href: '/dashboard/schedule', icon: <ClockIcon className="w-5 h-5" /> },
  { name: 'Ankündigungen', href: '/dashboard/announcements', icon: <Bell className="w-5 h-5" /> },
  { name: 'Einstellungen', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
]

const bottomNavItems: NavItem[] = [
  { name: 'Profil', href: '/profile', icon: <User className="w-5 h-5" /> },
]

export default function DashboardSidebar({ 
  position = 'left',
  onCollapse 
}: DashboardSidebarProps) {
  const { settings } = useSettings()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href
    return `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
      isActive ? 'text-[#C6A55C]' : 'text-gray-400 hover:text-[#C6A55C]'
    }`
  }

  const isHorizontal = settings.sidebarPosition === 'top' || settings.sidebarPosition === 'bottom'
  const positionProp = settings.sidebarPosition || position

  if (isHorizontal) {
    return (
      <aside className={`fixed ${positionProp}-0 left-0 right-0 h-16 bg-[#0A0A0A] border-${positionProp === 'top' ? 'b' : 't'} border-[#C6A55C]/20 z-50`}>
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[#C6A55C] text-xl font-bold">
              movie assistent
            </Link>
            <nav className="flex items-center gap-6">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} className={getLinkClasses(item.href)}>
                  {item.icon}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <Clock />
            <div className="flex items-center gap-4">
              <Link href="/profile" className={getLinkClasses('/profile')}>
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-[#C6A55C] transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`fixed ${positionProp}-0 top-0 h-screen 
      bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]
      [border-right:0.25px_solid_rgba(198,165,92,0.3)]
      flex flex-col transition-all duration-500 ease-in-out ${
      isCollapsed ? 'w-[60px]' : 'w-[192px]'
    }`}>
      <div className="flex flex-col">
        <div className="p-4 flex flex-col items-center">
          {!isCollapsed ? (
            <>
              <div className="w-full flex justify-center mb-4">
                <Image
                  src="/images/color_logo.svg"
                  alt="movie assistent"
                  width={154}
                  height={154}
                  className="w-[154px] h-auto"
                />
              </div>
              <Clock isVertical={true} isCollapsed={false} />
            </>
          ) : (
            <Clock isVertical={true} isCollapsed={true} />
          )}
        </div>
        <div className="h-3"></div>
        <div className="border-b border-[#C6A55C]/20"></div>
        <div className="h-6"></div>
      </div>

      <button
        onClick={handleCollapse}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-[#0A0A0A] border border-[#C6A55C]/20 text-gray-400 hover:text-[#C6A55C] transition-colors z-50"
      >
        {isCollapsed ? (
          positionProp === 'left' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
        ) : (
          positionProp === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <nav className="flex-1 overflow-y-auto relative">
        <div className="absolute w-full" style={{ height: mainNavItems.length * 41 + 'px' }}>
          {mainNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            const top = index * 41; // 36px height + 5px gap
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 mx-2 px-3 h-[36px] text-sm transition-colors rounded-lg absolute w-[calc(100%-16px)] ${
                  isActive 
                    ? 'text-[#1a1a1a] bg-gradient-to-r from-[#C6A55C] via-[#E9D5A0] to-[#C6A55C]' 
                    : 'hover:bg-white/5'
                }`}
                style={{ top: `${top}px` }}
              >
                <div className={`min-w-[20px] flex items-center justify-center ${
                  isActive 
                    ? 'text-[#1a1a1a]' 
                    : 'text-[#C6A55C]'
                }`}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: "w-5 h-5",
                    strokeWidth: 1.5
                  })}
                </div>
                {!isCollapsed && (
                  <span className={`${
                    isActive 
                      ? '' 
                      : 'text-transparent bg-[length:200%_200%] bg-clip-text bg-gradient-45 from-[#85754E] via-[#C6A55C] via-[#E5CF7E] via-[#C6A55C] to-[#85754E]'
                  }`}
                  style={{
                    backgroundPosition: isActive ? '0% 0%' : '100% 100%'
                  }}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#C6A55C]/20">
        <div className="py-4">
          {bottomNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 mx-2 px-3 h-[36px] text-sm transition-colors rounded-lg mb-1 ${
                  isActive 
                    ? 'text-[#1a1a1a] bg-gradient-to-r from-[#C6A55C] via-[#E9D5A0] to-[#C6A55C]' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`min-w-[20px] flex items-center justify-center ${
                  isActive 
                    ? 'text-[#1a1a1a]' 
                    : 'text-[#C6A55C]'
                }`}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: "w-5 h-5",
                    strokeWidth: 1.5
                  })}
                </div>
                {!isCollapsed && (
                  <span className={`${
                    isActive 
                      ? '' 
                      : 'text-transparent bg-[length:200%_200%] bg-clip-text bg-gradient-45 from-[#85754E] via-[#C6A55C] via-[#E5CF7E] via-[#C6A55C] to-[#85754E]'
                  }`}
                  style={{
                    backgroundPosition: isActive ? '0% 0%' : '100% 100%'
                  }}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mx-2 px-3 h-[36px] text-sm transition-colors rounded-lg w-[calc(100%-16px)] hover:bg-red-500/20 group"
          >
            <div className="min-w-[20px] flex items-center justify-center text-[#C6A55C] group-hover:text-red-500">
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
            </div>
            {!isCollapsed && (
              <span className="text-transparent bg-[length:200%_200%] bg-clip-text bg-gradient-45 from-[#85754E] via-[#C6A55C] via-[#E5CF7E] via-[#C6A55C] to-[#85754E] group-hover:text-red-500">
                Abmelden
              </span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-45 {
          background-image: linear-gradient(
            45deg,
            #85754E 0%,
            #C6A55C 20%,
            #E5CF7E 50%,
            #C6A55C 80%,
            #85754E 100%
          );
        }
      `}</style>
    </aside>
  )
}
