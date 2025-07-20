<script lang="ts" setup>
  definePageMeta({
    layout: 'login-page',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/home',
    },
    transition: {
      name: 'slide-right',
      mode: 'out-in',
    },
  })
</script>
<template>
  <auth-login />
</template>

