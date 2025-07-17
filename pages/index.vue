<script lang="ts" setup>
  import { ref } from 'vue'
  import Login from '~/components/auth/Login.vue'
  import { useAuthUserStore } from '~/stores/auth.store'

  definePageMeta({
    layout: 'login-page',
  })

  const authStore = useAuthUserStore()
  const loading = ref(true)

  // Verificação imediata de cookies antes da renderização
  const authTokenCookie = useCookie('auth-token')
  const authCookie = useCookie('auth')

  // Se tem ambos os cookies, redirecionar imediatamente
  if (authTokenCookie.value && authCookie.value) {
    navigateTo('/home', { replace: true })
  } 
  // Se está autenticado na store, redirecionar
  else if (authStore.isAuthenticated) {
    navigateTo('/home', { replace: true })
  }
  // Caso contrário, tentar inicializar auth de forma assíncrona
  else {
    nextTick(async () => {
      try {
        const isInitialized = await authStore.initializeAuth()
        
        if (isInitialized) {
          await navigateTo('/home', { replace: true })
          return
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        loading.value = false
      }
    })
  }
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="loading" class="text-center">
        <v-progress-circular color="primary" indeterminate />
      </v-col>
      <v-col v-else>
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>
