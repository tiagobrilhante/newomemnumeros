<script lang="ts" setup>
  const { currentUser } = useUserData()
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
</script>
<template>
  <h3 v-if="currentUser" class="text-right mr-5">
    {{ currentUser.rank.acronym }} {{ currentUser.serviceName }}, seja bem-vindo ao
    {{ appName }}
  </h3>
</template>
