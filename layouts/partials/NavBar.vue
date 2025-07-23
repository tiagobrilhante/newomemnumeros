<script lang="ts" setup>
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
  const { setLocale } = useI18n()
  const { brazilFlag, usFlag } = useIcons()


  import { storeToRefs } from 'pinia'
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const authStore = useAuthUserStore()
  const { user: currentUser } = storeToRefs(authStore)


</script>

<template>
  <v-app-bar app :elevation="10" class="navbar-top">
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
        @click="setLocale('pt-BR')"
      />

      <v-btn
        rounded
        variant="text"
        :icon="usFlag"
        @click="setLocale('en-US')"
      />

      <UserCard v-if="currentUser" />

    </template>
  </v-app-bar>
</template>


<style scoped>
  .navbar-top {
    z-index: 1015 !important;
  }
</style>


