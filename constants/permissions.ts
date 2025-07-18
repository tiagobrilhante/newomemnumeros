export const PERMISSION_CATEGORIES = [
  {
    module: 'Usuários',
    module_alias: 'users',
    module_color: 'blue',
    permissions: [
      {
        name: 'Criar Usuário',
        alias: 'create_user',
        description: 'Permite criar novos usuários no sistema'
      },
      {
        name: 'Editar Usuário',
        alias: 'edit_user',
        description: 'Permite editar dados de usuários existentes'
      },
      {
        name: 'Excluir Usuário',
        alias: 'delete_user',
        description: 'Permite excluir usuários do sistema'
      },
      {
        name: 'Visualizar Usuários',
        alias: 'view_users',
        description: 'Permite visualizar lista de usuários'
      }
    ]
  },
  {
    module: 'Permissões',
    module_alias: 'permissions',
    module_color: 'green',
    permissions: [
      {
        name: 'Gerenciar Permissões',
        alias: 'manage_permissions',
        description: 'Permite gerenciar permissões do sistema'
      }
    ]
  },
  {
    module: 'Vínculos',
    module_alias: 'user_link',
    module_color: 'purple',
    permissions: [
      {
        name: 'Criar Vínculo',
        alias: 'create_user_link',
        description: 'Permite criar vínculos entre usuários e seções'
      }
    ]
  }
]