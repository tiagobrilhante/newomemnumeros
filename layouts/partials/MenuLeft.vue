<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useAuthUserStore } from '~/stores/auth.store'
  import { useDisplay } from 'vuetify'

  const authStore = useAuthUserStore()
  const loadingItem = ref<string | null>(null)
  const { mobile } = useDisplay()

  // Estado para controlar se o menu está colapsado
  const isCollapsed = ref(false)

  // Função para alternar entre colapsado/expandido
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  interface MenuItem {
    title: string
    path: string
    icon: string
    color: string
    accessLevel?: string[]
    requiresAuth?: boolean
  }

  const menuItems: MenuItem[] = [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi-home',
      color: 'secondary',
      requiresAuth: true,
    },
    {
      title: 'Organizações Militares',
      path: '/admin/military-organizations',
      icon: 'mdi-domain',
      color: 'blue',
      accessLevel: ['militaryOrganizations.read'],
    },
    {
      title: 'Seções',
      path: '/admin/sections',
      icon: 'mdi-lan',
      color: 'blue',
      accessLevel: ['sections.read', 'sections.create', 'sections.update', 'sections.delete'],
    },
    {
      title: 'Usuários Cadastrados',
      path: '/admin/users',
      icon: 'mdi-account-group',
      color: 'blue',
      accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
    },
    {
      title: 'Vínculos de Usuários',
      path: '/admin/vinculo-sections-users',
      icon: 'mdi-arrow-collapse',
      color: 'blue',
      accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
    },
    {
      title: 'Permissões',
      path: '/admin/permissions',
      icon: 'mdi-shield-account',
      color: 'blue',
      accessLevel: ['roles.read', 'roles.create', 'roles.update', 'roles.delete'],
    },
  ]

  const filteredMenuItems = computed(() => {
    return menuItems.filter(item => hasPermission(item))
  })

  const handleNavigation = async (path: string, title: string) => {
    loadingItem.value = title
    await navigateTo(path)
    loadingItem.value = null
  }

  const hasPermission = (menuItem: MenuItem): boolean => {
    if (!menuItem) return false

    const user = authStore.user
    if (!user) return false
    if (menuItem.requiresAuth && !menuItem.accessLevel) {
      return true
    }
    if (!menuItem.accessLevel || menuItem.accessLevel.length === 0) {
      return true
    }
    const userPermissions = user.role?.permissions || []

    if (userPermissions.includes('system.admin')) {
      return true
    }
    return menuItem.accessLevel.some(permission =>
      userPermissions.includes(permission)
    )
  }

</script>

<template>
  <v-navigation-drawer
    :permanent="!mobile"
    :temporary="mobile"
    :rail="isCollapsed && !mobile"
    :rail-width="72"
    class="menu-left"
    width="280"
    elevation="2"
  >
    <!-- Header do menu -->
    <v-list-item
      class="mx-2 my-2 cursor-pointer"
      :prepend-icon="isCollapsed ? 'mdi-menu' : 'mdi-menu-open'"
      :title="isCollapsed ? '' : 'Menu Principal'"
      @click="toggleCollapse"
    />

    <v-divider />

    <!-- Lista de itens do menu -->
    <v-list density="compact" nav>
      <template v-for="item in filteredMenuItems" :key="item.title">
        <v-tooltip :text="item.title" location="end" :disabled="!isCollapsed">
          <template #activator="{ props }">
            <v-list-item
              :prepend-icon="item.icon"
              :title="isCollapsed ? '' : item.title"
              class="mx-2 mb-1"
              density="compact"
              rounded="xl"
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
                  size="20"
                />
              </template>
            </v-list-item>
          </template>
        </v-tooltip>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.menu-left {
  border-right: thin solid rgba(255, 255, 255, 0.12);
  z-index: 1005 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>

