export interface RouteConfig {
  path: string
  title: string
  icon: string
  color: string
  accessLevel?: string[]
  requiresAuth?: boolean
}

export const routesConfig: RouteConfig[] = [
  {
    path: '/home',
    title: 'Home',
    icon: 'mdi-home',
    color: 'secondary',
    requiresAuth: true,
  },
  {
    path: '/admin/military-organizations',
    title: 'Organizações Militares',
    icon: 'mdi-domain',
    color: '#515757',
    accessLevel: ['militaryOrganizations.read'],
  },
  {
    path: '/admin/sections',
    title: 'Seções',
    icon: 'mdi-lan',
    color: '#515757',
    accessLevel: ['sections.read', 'sections.create', 'sections.update', 'sections.delete'],
  },
  {
    path: '/admin/users',
    title: 'Usuários Cadastrados',
    icon: 'mdi-account-group',
    color: '#515757',
    accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
  },
  {
    path: '/admin/vinculo-sections-users',
    title: 'Vínculos de Usuários',
    icon: 'mdi-arrow-collapse',
    color: '#515757',
    accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
  },
  {
    path: '/admin/permissions',
    title: 'Permissões',
    icon: 'mdi-shield-account',
    color: 'red',
    accessLevel: ['roles.read', 'roles.create', 'roles.update', 'roles.delete'],
  },
]

// Cria um mapeamento de rotas para permissões para uso rápido
export const routePermissionsMap = routesConfig.reduce((acc, route) => {
  if (route.accessLevel) {
    acc[route.path] = route.accessLevel
  }
  return acc
}, {} as Record<string, string[]>)