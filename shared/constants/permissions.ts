interface Permission {
  slug: string
  category: string
}

interface PermissionSubcategory {
  name: string
  permissions: Permission[]
}

interface PermissionModule {
  module: string
  module_alias: string
  module_color: string
  subcategories: PermissionSubcategory[]
}

export const PERMISSION_CATEGORIES: PermissionModule[] = [
  {
    module: 'Global Admin',
    module_alias: 'global',
    module_color: 'red',
    subcategories: [
      {
        name: 'system_access',
        permissions: [
          {
            slug: 'global.system.manage',
            category: 'system',
          },
          {
            slug: 'global.organization.manage',
            category: 'system',
          },
        ],
      },
    ],
  },

  {
    module: 'Admin',
    module_alias: 'admin',
    module_color: 'yellow',
    subcategories: [
      {
        name: 'resource_management',
        permissions: [
          {
            slug: 'admin.organizations.manage',
            category: 'organizations',
          },
          {
            slug: 'admin.sections.manage',
            category: 'sections',
          },
          {
            slug: 'admin.users.manage',
            category: 'users',
          },
          {
            slug: 'admin.roles.manage',
            category: 'roles',
          },
        ],
      },
      {
        name: 'operations',
        permissions: [
          {
            slug: 'admin.user_sections.manage',
            category: 'user_sections',
          },
        ],
      },
      {
        name: 'reporting',
        permissions: [
          {
            slug: 'admin.reports.generate',
            category: 'reports',
          },
          {
            slug: 'admin.reports.export',
            category: 'reports',
          },
        ],
      },
    ],
  },
  {
    module: 'numbers',
    module_alias: 'numbers',
    module_color: 'blue',
    subcategories: [
      {
        name: 'categories_management',
        permissions: [
          {
            slug: 'numbers.categories.create',
            category: 'categories',
          },
          {
            slug: 'numbers.categories.update',
            category: 'categories',
          },
          {
            slug: 'numbers.categories.delete',
            category: 'categories',
          },
          {
            slug: 'numbers.categories.deactivate',
            category: 'categories',
          },
        ],
      },
      {
        name: 'indicators_management',
        permissions: [
          {
            slug: 'numbers.indicators.create',
            category: 'indicators',
          },
          {
            slug: 'numbers.indicators.update',
            category: 'indicators',
          },
          {
            slug: 'numbers.indicators.delete',
            category: 'indicators',
          },
          {
            slug: 'numbers.indicators.deactivate',
            category: 'indicators',
          },
          {
            slug: 'numbers.indicators.launch',
            category: 'indicators',
          },
        ],
      },
    ],
  },
]
