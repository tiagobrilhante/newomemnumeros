<script lang="ts" setup>
  const useAuthStore = useAuthUserStore()
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
</script>
<template>
  <h3 v-if="useAuthStore.user" class="text-right mr-5">
    {{ useAuthStore.user.rank.acronym }} {{ useAuthStore.user.serviceName }}, {{$t('welcomeMessage')}}
    {{ appName }}
  </h3>
</template>
