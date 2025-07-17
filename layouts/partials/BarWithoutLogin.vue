<script lang="ts" setup>
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
</script>

<template>
  <v-app-bar :elevation="10">
    <template #prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="$vuetify" />
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ appName }}</v-app-bar-title>
    </template>
  </v-app-bar>
</template>
