// noinspection JSUnusedGlobalSymbols

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module',
    '@vueuse/nuxt',
    '@prisma/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
  ],

  vuetify: {
    moduleOptions: {
      styles: true,
    },
    vuetifyOptions: {
      labComponents: true,
      theme: {
        defaultTheme: 'dark',
      },
      locale: {
        locale: 'pt',
        fallback: 'pt',
      },
      localeMessages: ['pt'],
    },
  },

  runtimeConfig: {
    public: {
      APP_NAME: process.env.NUXT_APP_NAME || '',
      APP_CREATOR: process.env.NUXT_APP_CREATOR || '',
    },
  },

  ssr: true,
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  vite: {
    // plugins: [],
    define: {
      'process.env.DEBUG': true,
    },
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },

  plugins: ['~/plugins/vue-mask.ts', '~/plugins/vue3-toastify.ts'],
})
