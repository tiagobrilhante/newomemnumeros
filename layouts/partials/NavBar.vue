<script lang="ts" setup>
  import { storeToRefs } from 'pinia'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  const authStore = useAuthUserStore()
  const { user: currentUser } = storeToRefs(authStore)
</script>

<template>
  <v-app-bar :elevation="10" app>
    <template #prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="$vuetify" />
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ appName }}</v-app-bar-title>
    </template>

    <template #append>
      <UserCard v-if="currentUser" />
    </template>
  </v-app-bar>
</template>
