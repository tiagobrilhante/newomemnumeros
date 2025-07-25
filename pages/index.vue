<script lang="ts" setup>
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: appName,
  })

  definePageMeta({
    layout: 'guest-layout',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/home',
    },
    pageTransition: {
      name: 'slide-right',
      mode: 'out-in',
    },
  })
</script>
<template>
  <auth-login />
</template>

