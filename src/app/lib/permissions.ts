export const PERMISSIONS = {
  // Project-level permissions
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_EDIT: 'PROJECT_EDIT',
  PROJECT_DELETE: 'PROJECT_DELETE',
  
  // Member management
  MEMBER_INVITE: 'MEMBER_INVITE',
  MEMBER_REMOVE: 'MEMBER_REMOVE',
  
  // Department-specific
  DEPARTMENT_MANAGE: 'DEPARTMENT_MANAGE',
  
  // Content permissions
  SCRIPT_EDIT: 'SCRIPT_EDIT',
  SCHEDULE_MANAGE: 'SCHEDULE_MANAGE',
  CALENDAR_EDIT: 'CALENDAR_EDIT',
} as const

export type Permission = keyof typeof PERMISSIONS

export const ROLE_PERMISSIONS: Record<ProjectRole, Permission[]> = {
  ADMIN: Object.values(PERMISSIONS),
  HOD: [
    PERMISSIONS.MEMBER_INVITE,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.SCRIPT_EDIT,
    PERMISSIONS.SCHEDULE_MANAGE,
    PERMISSIONS.CALENDAR_EDIT,
  ],
  MEMBER: [
    PERMISSIONS.SCRIPT_EDIT,
    PERMISSIONS.CALENDAR_EDIT,
  ],
  VIEWER: [],
}

export async function hasPermission(
  userId: string, 
  projectId: string, 
  permission: Permission
): Promise<boolean> {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    include: {
      permissions: true,
      user: true,
    },
  })

  if (!member) return false
  
  // SUPERADMIN has all permissions
  if (member.user.role === 'SUPERADMIN') return true
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[member.role]
  if (rolePermissions.includes(permission)) return true
  
  // Check explicit permissions
  return member.permissions.some(p => p.permission === permission)
} 