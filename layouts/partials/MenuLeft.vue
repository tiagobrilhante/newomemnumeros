<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useAuthUserStore } from '~/stores/auth.store'

  const authStore = useAuthUserStore()
  const loadingItem = ref<string | null>(null)

  interface MenuItem {
    title: string
    path: string
    icon: string
    group?: string
    color: string
    accessLevel?: string[]
    adminOnly?: boolean
  }

  interface groupModuleName {
    base: string
    name: string
    iconBase: string
  }



  const menuItems: MenuItem[] = [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi-home',
      color: 'secondary',
    },
    {
      title: 'Organizações Militares',
      path: '/admin/military-organizations',
      icon: 'mdi-domain',
      color: 'blue',
      adminOnly: false,
      accessLevel: [],
    },
    {
      title: 'Seções',
      path: '/admin/sections',
      icon: 'mdi-lan',
      color: 'blue',
      adminOnly: true,
      accessLevel: ['super_admin', 'super_admin_mo'],
    },
    {
      title: 'Usuários Cadastrados',
      path: '/admin/users',
      group: 'users',
      icon: 'mdi-account-group',
      color: 'blue',
      accessLevel: [
        'super_admin',
        'super_admin_mo',
        'link_user',
        'unlink_user',
        'delete_user',
        'view_users',
      ],
    },
    {
      title: 'Vínculos de Usuários',
      path: '/admin/vinculo-sections-users',
      icon: 'mdi-arrow-collapse',
      group: 'users',
      color: 'blue',
      accessLevel: [
        'super_admin',
        'super_admin_mo',
        'create_user_link',
        'transfer_user_link',
        'delete_user_link',
      ],
    },
    {
      title: 'Permissões',
      path: '/admin/permissions',
      icon: 'mdi-shield-account',
      color: 'blue',
      adminOnly: true,
      accessLevel: ['super_admin', 'super_admin_mo'],
    },
  ]

  const nonGroupedItems = computed(() => menuItems.filter((item) => !item.group))


  const handleNavigation = async (path: string, title: string) => {
    loadingItem.value = title
    await navigateTo(path)
    loadingItem.value = null
  }

  const hasPermission = (menuItem: MenuItem) => {
    if (!menuItem) return false

    const user = authStore.user

    const userPermissionKeys = (user?.permissionSetupUser || [])
      .flatMap((psu) => psu.permissionSetup?.permissions || [])
      .map((p) => p.permission)

    if (userPermissionKeys.includes('super_admin')) {
      return true
    }

    if (!Array.isArray(menuItem.accessLevel) || menuItem.accessLevel.length === 0) {
      return true
    }

    return menuItem.accessLevel.every((perm) => userPermissionKeys.includes(perm))
  }


</script>

<template>
  <v-container fluid>
    <v-row class="pl-3" no-gutters>
      <v-col align-self="center" class="text-center">
        <v-list class="text-left" density="compact" nav rounded="xl" slim>
          <v-list-subheader>Menu</v-list-subheader>

          <!-- Itens sem grupo -->
          <template v-for="item in nonGroupedItems" :key="item.title">
            <v-tooltip location="right">
              <template #activator="{ props }">
                <v-list-item
                  v-if="hasPermission(item)"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  class="pl-3"
                  density="compact"
                  v-bind="props"
                  @click="handleNavigation(item.path, item.title)"
                >
                  <template #prepend>
                    <v-icon v-if="loadingItem !== item.title" :color="item.color">
                      {{ item.icon }}
                    </v-icon>
                    <v-progress-circular
                      v-else
                      class="mr-2"
                      color="primary"
                      indeterminate
                      size="small"
                    />
                  </template>
                </v-list-item>
              </template>
              <span>{{ item.title }}</span>
              <!-- ou qualquer outra descrição -->
            </v-tooltip>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  :deep(.v-list-item__spacer) {
    padding: 0 !important;
    width: 0 !important; /* Caso ainda haja espaço */
  }

  :deep(.v-list-item__prepend) {
    margin-right: 8px !important; /* Ajuste conforme necessário */
  }

  :deep(.v-list-item__content) {
    padding-left: 0 !important;
  }
</style>
