<script lang="ts" setup>
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

