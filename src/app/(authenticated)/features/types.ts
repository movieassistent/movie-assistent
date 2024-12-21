import { AppIdeaStatus, Priority } from '@prisma/client'

export interface ColumnConfig {
  id: string
  title: string
  status: AppIdeaStatus
}

export interface PriorityConfig {
  value: Priority
  label: string
  color: string
}

export interface FeatureBoardSettings {
  columns: ColumnConfig[]
  priorities: PriorityConfig[]
  maxVisibleColumns: number
  currentPage: number
}

export const defaultPriorityConfigs: PriorityConfig[] = [
  { value: 'URGENT', label: 'Dringend', color: '#ef4444' },
  { value: 'HIGH', label: 'Hoch', color: '#f97316' },
  { value: 'MEDIUM', label: 'Mittel', color: '#eab308' },
  { value: 'LOW', label: 'Niedrig', color: '#22c55e' },
  { value: 'DONE', label: 'Erledigt', color: '#3b82f6' }
]

export const defaultColumnConfigs: ColumnConfig[] = [
  { id: 'open', title: 'Offen', status: 'OPEN' },
  { id: 'in-progress', title: 'In Bearbeitung', status: 'IN_PROGRESS' },
  { id: 'implemented', title: 'Implementiert', status: 'IMPLEMENTED' },
  { id: 'rejected', title: 'Abgelehnt', status: 'REJECTED' }
]

export const defaultBoardSettings: FeatureBoardSettings = {
  columns: defaultColumnConfigs,
  priorities: defaultPriorityConfigs,
  maxVisibleColumns: 5,
  currentPage: 0
} 