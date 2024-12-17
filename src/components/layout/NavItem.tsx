import Link from 'next/link'
import { SidebarPosition } from '@/types/sidebar'

export interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface NavItemProps {
  item: NavItem
  isCollapsed: boolean
  isActive: boolean
  position: SidebarPosition
}

const getTooltipPosition = (position: SidebarPosition) => {
  switch (position) {
    case 'rechts':
      return 'right-full mr-5'
    case 'oben':
      return 'top-[52px] left-1/2 -translate-x-1/2'
    case 'unten':
      return 'bottom-[52px] left-1/2 -translate-x-1/2'
    default:
      return 'left-full ml-5'
  }
}

export function NavItem({ item, isCollapsed, isActive, position }: NavItemProps) {
  const activeGradient = `bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E]`

  return (
    <Link
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