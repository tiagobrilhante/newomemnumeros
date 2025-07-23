<script lang="ts" setup>
  import { computed, ref, watch, onMounted, nextTick } from 'vue'
  import { useAuthUserStore } from '~/stores/auth.store'
  import { useNavigationStore } from '~/stores/navigation.store'
  import { useDisplay } from 'vuetify'

  const authStore = useAuthUserStore()
  const navigationStore = useNavigationStore()
  const loadingItem = ref<string | null>(null)
  const { mobile } = useDisplay()

  const isMenuReady = ref(false)
  const storeHydrated = ref(false)

  onMounted(async () => {
    await nextTick()
    storeHydrated.value = true
  })


  watch(storeHydrated, (hydrated) => {
    if (hydrated) {
      isMenuReady.value = true
    }
  }, { immediate: true })

  const toggleCollapse = () => {
    navigationStore.toggleCollapsedMenu()
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
      color: '#515757',
      accessLevel: ['militaryOrganizations.read'],
    },
    {
      title: 'Seções',
      path: '/admin/sections',
      icon: 'mdi-lan',
      color: '#515757',
      accessLevel: ['sections.read', 'sections.create', 'sections.update', 'sections.delete'],
    },
    {
      title: 'Usuários Cadastrados',
      path: '/admin/users',
      icon: 'mdi-account-group',
      color: '#515757',
      accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
    },
    {
      title: 'Vínculos de Usuários',
      path: '/admin/vinculo-sections-users',
      icon: 'mdi-arrow-collapse',
      color: '#515757',
      accessLevel: ['users.create', 'users.read', 'users.update', 'users.delete'],
    },
    {
      title: 'Permissões',
      path: '/admin/permissions',
      icon: 'mdi-shield-account',
      color: 'red',
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
    v-if="isMenuReady"
    :permanent="true"
    :rail="navigationStore.isMenuCollapsed || mobile"
    :rail-width="72"
    class="menu-left"
    width="280"
    elevation="2"
  >
    <!-- Menu Header -->
    <v-list-item
      class="mx-2 my-2 cursor-pointer"
      :prepend-icon="(navigationStore.isMenuCollapsed || mobile) ? 'mdi-menu' : 'mdi-menu-open'"
      :title="(navigationStore.isMenuCollapsed || mobile) ? '' : 'Menu Principal'"
      @click="toggleCollapse"
    />

    <v-divider />

    <!-- menu items list -->
    <v-list density="compact" nav>
      <template v-for="item in filteredMenuItems" :key="item.title">
        <v-tooltip :text="item.title" location="end" :disabled="!(navigationStore.isMenuCollapsed || mobile)">
          <template #activator="{ props }">
            <v-list-item
              :prepend-icon="item.icon"
              :title="(navigationStore.isMenuCollapsed || mobile) ? '' : item.title"
              class="mx-2 mb-1"
              density="compact"
              rounded="xl"
              :active="navigationStore.atualPath === item.path"
              :color="navigationStore.atualPath === item.path ? 'primary' : undefined"
              v-bind="props"
              @click="handleNavigation(item.path, item.title)"
            >
              <template #prepend>
                <v-icon
                  v-if="loadingItem !== item.title"
                  :color="navigationStore.atualPath === item.path ? 'primary' : item.color"
                >
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

