<script lang="ts" setup>
  import NavBar from '~/layouts/partials/NavBar.vue'
  import MenuLeft from '~/layouts/partials/MenuLeft.vue'
  import Footer from '~/layouts/partials/Footer.vue'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    htmlAttrs: {
      lang: 'pt-br',
    },
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

    <v-main class="my-space">
      <v-container class="pa-0 fill-height flex-fill" fluid>
        <v-row class="fill-height">
          <transition mode="out-in" name="fade">
            <v-col class="text-center bg-grey-darken-3 pa-0" cols="2">
              <MenuLeft />
            </v-col>
          </transition>
          <transition mode="out-in" name="fade">
            <v-col cols="10">
              <slot />
            </v-col>
          </transition>
        </v-row>
      </v-container>

    </v-main>
    <Footer />
  </v-app>
</template>

<style scoped>
  .my-space {
    padding-top: 64px;
  }
</style>
