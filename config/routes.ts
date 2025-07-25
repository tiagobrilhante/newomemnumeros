export interface RouteConfig {
  path: string
  titleKey: string
  icon: string
  color: string
  accessLevel?: string[]
  requiresAuth?: boolean
}

export const routesConfig: RouteConfig[] = [
  {
    path: '/home',
    titleKey: 'leftMenu.home',
    icon: 'mdi-home',
    color: 'secondary',
    requiresAuth: true,
  },
  {
    path: '/admin/military-organizations',
    titleKey: 'leftMenu.militaryOrganization',
    icon: 'mdi-domain',
    color: '#515757',
    accessLevel: ['militaryOrganization.read'],
  },
  {
    path: '/admin/sections',
    titleKey: 'leftMenu.sections',
    icon: 'mdi-lan',
    color: '#515757',
    accessLevel: ['sections.read', 'sections.create', 'sections.update', 'sections.delete'],
  },
  {
    path: '/admin/users',
    titleKey: 'leftMenu.userManagement',
    icon: 'mdi-account-group',
    color: '#515757',
    accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
  },
  {
    path: '/admin/vinculo-sections-users',
    titleKey: 'leftMenu.userLinks',
    icon: 'mdi-arrow-collapse',
    color: '#515757',
    accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
  },
  {
    path: '/admin/permissions',
    titleKey: 'leftMenu.rolesAndPermissions',
    icon: 'mdi-shield-account',
    color: 'red',
    accessLevel: ['roles.read', 'roles.create', 'roles.update', 'roles.delete'],
  },
]

export const routePermissionsMap = routesConfig.reduce((acc, route) => {
  if (route.accessLevel) {
    acc[route.path] = route.accessLevel
  }
  return acc
}, {} as Record<string, string[]>)
