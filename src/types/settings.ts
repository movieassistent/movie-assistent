export interface UserSettings {
  sidebarPosition: 'oben' | 'unten' | 'links' | 'rechts'
  sidebarCollapsed: boolean
  startPage: 'dashboard' | 'lastVisited' | 'specific'
  lastVisitedPath: string
  theme: 'light' | 'dark'
  language: 'de' | 'en'
  displayMode: 'fullscreen' | 'window'
  initialized: boolean
}