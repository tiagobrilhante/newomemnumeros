<script lang="ts" setup>
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
  const { setLocale } = useI18n()
  const { brazilFlag, usFlag } = useIcons()

</script>

<template>
  <v-app-bar :elevation="10">
    <template #prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="$vuetify" />
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ appName }}</v-app-bar-title>
    </template>

    <template #append>

      <v-btn
        rounded
        variant="text"
        :icon="brazilFlag"
        @click="setLocale('pt-br')"
      />

      <v-btn
        rounded
        variant="text"
        :icon="usFlag"
        @click="setLocale('en')"
      />

    </template>
  </v-app-bar>
</template>
