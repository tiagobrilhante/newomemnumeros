<script lang="ts" setup>
  import NavBar from '~/layouts/partials/NavBar.vue'
  import MenuLeft from '~/layouts/partials/MenuLeft.vue'
  import Footer from '~/layouts/partials/Footer.vue'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: appName || 'Default Title',
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
    ],
  })

</script>

<template>
  <v-app theme="dark">
    <NavBar />

    <MenuLeft />
    
    <v-main class="main-content">
      <slot />
    </v-main>
    <Footer />
  </v-app>
</template>

<style scoped>
  .main-content {
    padding-top: 64px;
    padding-bottom: 48px;
    min-height: calc(100vh - 112px);
    transition: margin-left 0.2s ease-in-out;
  }
</style>
