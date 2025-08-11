<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import NavBar from '~/layouts/partials/NavBar.vue'
  import MenuLeft from '~/layouts/partials/MenuLeft.vue'
  import Footer from '~/layouts/partials/Footer.vue'

  const { t } = useI18n()

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  const menuLeftRef = ref<InstanceType<typeof MenuLeft> | null>(null)

  const isContentReady = computed(() => {
    return menuLeftRef.value?.isMenuReady || false
  })

  useLanguageManager()

  useHead({
    title: appName || 'Default Title',
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  })

</script>

<template>
  <v-app theme="dark">
    <KeepAlive>
      <NavBar />
    </KeepAlive>
    <KeepAlive>
      <MenuLeft ref="menuLeftRef" />
    </KeepAlive>
    <v-main class="main-content">
      <div v-show="!isContentReady" class="loading-container">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-body-1 mt-4">{{ t('loading') }}</p>
      </div>
      <div v-show="isContentReady">
        <nuxt-page />
      </div>
    </v-main>
    <KeepAlive>
      <Footer />
    </KeepAlive>
  </v-app>
</template>

<style scoped>
  .main-content {
    padding-top: 64px;
    padding-bottom: 48px;
    min-height: calc(100vh - 112px);
    transition: margin-left 0.2s ease-in-out;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 50vh;
  }
</style>
