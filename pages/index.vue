<script lang="ts" setup>
  import { ref } from 'vue'
  import Login from '~/components/auth/Login.vue'
  import { useAuthUserStore } from '~/stores/auth.store'

  definePageMeta({
    layout: 'login-page',
  })

  const authStore = useAuthUserStore()
  const { initializeAuth } = useAuth()
  const loading = ref(true)

  // Apenas verificar auth se não estiver autenticado na store
  onMounted(async () => {
    try {
      // Se já está autenticado na store, redirecionar
      if (authStore.isAuthenticated) {
        await navigateTo('/home', { replace: true })
        return
      }

      // Tentar inicializar autenticação
      const isInitialized = await initializeAuth()
      
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
