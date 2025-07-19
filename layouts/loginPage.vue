<script lang="ts" setup>
  import BarWithoutLogin from '~/layouts/partials/BarWithoutLogin.vue'
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
    <BarWithoutLogin />
    <v-main class="my-space">
      <v-container class="container login-background" fluid>
        <v-row no-gutters>
          <v-col>
            <v-container fluid>
              <v-row>
                <v-col>
                  <slot />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<style scoped>
  .container {
    /* Configura a imagem como background */
    min-height: 92vh; /* Ocupa toda a altura da tela */
    max-height: 10vh; /* Ocupa toda a altura da tela */
    display: flex;
    justify-content: center; /* Centraliza o conteúdo horizontalmente */
    align-items: center; /* Centraliza o conteúdo verticalmente */
  }

  .login-background {
    background-image: url('assets/bglogin.jpg');
    background-color: #222222;
    background-repeat: repeat;
    background-size: 1000px 1000px;



  }

  .my-space {
    padding-top: 64px;
  }
</style>
