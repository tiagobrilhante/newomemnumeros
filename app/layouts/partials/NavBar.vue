<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
  const authStore = useAuthUserStore()
  const { user: currentUser, isLoggingOut } = storeToRefs(authStore)
</script>

<template>
  <v-app-bar :elevation="10" app class="navbar-top grey-thick-border-bottom">
    <template #prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="mdi-alpha-n-circle-outline" />
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ appName }}</v-app-bar-title>
    </template>

    <template #append>
      <LanguageSelector />
      <UserCard v-if="currentUser || isLoggingOut" />
    </template>
  </v-app-bar>
</template>

<style scoped>
  .navbar-top {
    z-index: 1015 !important;
  }
</style>


