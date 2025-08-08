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
    accessLevel: ['admin.organizations.manage'],
  },
  {
    path: '/admin/users',
    titleKey: 'leftMenu.userManagement',
    icon: 'mdi-account-group',
    color: '#515757',
    accessLevel: ['admin.users.manage'],
  },
  {
    path: '/admin/vinculo-sections-users',
    titleKey: 'leftMenu.userLinks',
    icon: 'mdi-arrow-collapse',
    color: '#515757',
    accessLevel: ['admin.users.manage'],
  },
  {
    path: '/admin/permissions',
    titleKey: 'leftMenu.rolesAndPermissions',
    icon: 'mdi-shield-account',
    color: 'red',
    accessLevel: ['admin.roles.manage'],
  },
]

export const routePermissionsMap = routesConfig.reduce((acc, route) => {
  if (route.accessLevel) {
    acc[route.path] = route.accessLevel
  }
  return acc
}, {} as Record<string, string[]>)
