export type Theme = 'movie' | 'dark' | 'light' | 'gray'
export type StartPage = 'lastVisited' | 'dashboard'
export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom'

export interface UserSettings {
  theme: Theme
  sidebarPosition: SidebarPosition
  sidebarCollapsed: boolean
  startPage: StartPage
  defaultProjectId: string | null
  lastVisitedPath: string
  testMode: boolean
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'movie',
  sidebarPosition: 'left',
  sidebarCollapsed: false,
  startPage: 'dashboard',
  defaultProjectId: null,
  lastVisitedPath: '/dashboard',
  testMode: false
}