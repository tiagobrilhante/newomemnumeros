export const PERMISSION_CATEGORIES = [
  {
    module: 'Admin',
    module_alias: 'admin',
    module_color: 'yellow',
    permissions: [
      {
        slug: 'mo.admin',
        category: 'system',
        description: 'Permite as opções administrativas para um administrador de nível Organização Militar'
      },
      {
        slug: 'system.admin',
        category: 'system',
        description: 'Super usuário - Administrador Global do Sistema'
      },
      {
        slug: 'militaryOrganization.management',
        category: 'militaryOrganization',
        description: 'Permite a gerência de Organizações Militares'
      },
      {
        slug: 'linkUser.management',
        category: 'linkUser',
        description: 'Permite vincular usuários a uma seção'
      },
      {
        slug: 'reports.generate',
        category: 'reports',
        description: 'Permite gerar relatórios administrativos'
      },
      {
        slug: 'reports.export',
        category: 'reports',
        description: 'Permite exportar relatórios administrativos'
      },
      {
        slug: 'sections.management',
        category: 'sections',
        description: 'Permite a gerência de Seções'
      },
      {
        slug: 'users.management',
        category: 'users',
        description: 'Permite a gerência de Usuários'
      },
      {
        slug: 'roles.management',
        category: 'roles',
        description: 'Permite a gerência de papéis e permissões'
      },
    ]
  },
  {
    module: 'Numbers',
    module_alias: 'number',
    module_color: 'blue',
    permissions: [
      {
        slug: 'number.create.category',
        category: 'number',
        description: 'Permite a Criação de Categorias no OM em números'
      },
      {
        slug: 'linkUser.management',
        category: 'linkUser',
        description: 'Permite vincular usuários a uma seção'
      },
      {
        slug: 'reports.generate',
        category: 'reports',
        description: 'Permite gerar relatórios administrativos'
      },
      {
        slug: 'reports.export',
        category: 'reports',
        description: 'Permite exportar relatórios administrativos'
      },
      {
        slug: 'sections.management',
        category: 'sections',
        description: 'Permite a gerência de Seções'
      },
      {
        slug: 'users.management',
        category: 'users',
        description: 'Permite a gerência de Usuários'
      },
      {
        slug: 'roles.management',
        category: 'roles',
        description: 'Permite a gerência de papéis e permissões'
      },
    ]
  },
]
