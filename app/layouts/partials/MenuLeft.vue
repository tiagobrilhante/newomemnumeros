<script lang="ts" setup>
  import { computed, ref, watch, onMounted, nextTick } from 'vue'
  import { useNavigationStore } from '~/stores/navigation.store'
  import { useDisplay } from 'vuetify'
  import { routesConfig } from '~/config/routes'

  const { t } = useI18n()

  const navigationStore = useNavigationStore()
  const { hasPermission } = usePermissions()
  const localePath = useLocalePath()
  const route = useRoute()
  const loadingItem = ref<string | null>(null)
  const { mobile } = useDisplay()

  const isItemActive = (itemPath: string) => {
    const currentPath = route.path
    const localizedItemPath = localePath(itemPath)
    return currentPath === localizedItemPath
  }

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

  // Expor isMenuReady para o layout parent
  defineExpose({
    isMenuReady
  })

  const toggleCollapse = () => {
    navigationStore.toggleCollapsedMenu()
  }

  const filteredMenuItems = computed(() => {
    return routesConfig.filter(item => hasPermission(item))
  })

  const handleNavigation = async (path: string, titleKey: string) => {
    loadingItem.value = titleKey
    await navigateTo(localePath(path))
    loadingItem.value = null
  }

</script>

<template>
  <v-navigation-drawer
    v-if="isMenuReady"
    :permanent="true"
    :rail="navigationStore.isMenuCollapsed || mobile"
    :rail-width="72"
    class="menu-left grey-thick-border-right"
    width="280"
    elevation="2"
  >
    <!-- Menu Header -->
    <v-list-item
      class="mx-2 my-2 cursor-pointer"
      :prepend-icon="(navigationStore.isMenuCollapsed || mobile) ? 'mdi-menu' : 'mdi-menu-open'"
      :title="(navigationStore.isMenuCollapsed || mobile) ? '' : t('leftMenu.mainMenu')"
      @click="toggleCollapse"
      rounded="xl"
    />

    <v-divider />

    <!-- menu items list -->
    <v-list density="compact" nav>
      <template v-for="item in filteredMenuItems" :key="item.titleKey">
        <v-tooltip :text="t(item.titleKey)" location="end" :disabled="!(navigationStore.isMenuCollapsed || mobile)">
          <template #activator="{ props }">
            <v-list-item
              :prepend-icon="item.icon"
              :title="(navigationStore.isMenuCollapsed || mobile) ? '' : t(item.titleKey)"
              class="mx-2 mb-1"
              density="compact"
              rounded="xl"
              :active="isItemActive(item.path)"
              :color="isItemActive(item.path) ? 'primary' : undefined"
              v-bind="props"
              @click="handleNavigation(item.path, item.titleKey)"
            >
              <template #prepend>
                <v-icon
                  v-if="loadingItem !== item.titleKey"
                  :color="isItemActive(item.path) ? 'primary' : item.color"
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
  z-index: 1005 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>

