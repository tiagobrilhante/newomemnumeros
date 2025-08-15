<script lang="ts" setup>
  const { t } = useI18n()
  const { user } = useAuth()
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
</script>
<template>
  <h3 v-if="user" class="text-right mr-5 mt-1">
    {{ user.rank.acronym }} {{ user.serviceName }}, {{ t('welcomeMessage') }}
    {{ appName }}
  </h3>
</template>
