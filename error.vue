<script setup lang="ts">
  import type { NuxtError } from '#app'

  const props = defineProps<{
    error: NuxtError
  }>()

  const errorConfig = computed(() => {
    const { statusCode } = props.error

    switch (statusCode) {
      case 403:
        return {
          icon: 'mdi-shield-lock',
          color: 'warning',
          title: 'Acesso Negado',
          message: 'Você não tem permissão para acessar esta página. Entre em contato com o administrador se acredita que isso é um erro.'
        }
      case 404:
        return {
          icon: 'mdi-compass-off',
          color: 'info',
          title: 'Página Não Encontrada',
          message: 'A página que você está procurando não existe ou foi movida para outro local.'
        }
      case 500:
        return {
          icon: 'mdi-server-network-off',
          color: 'error',
          title: 'Erro Interno do Servidor',
          message: 'Ops! Algo deu errado em nossos servidores. Tente novamente em alguns instantes.'
        }
      default:
        return {
          icon: 'mdi-alert-circle',
          color: 'error',
          title: 'Erro Inesperado',
          message: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
        }
    }
  })

  const isDev = import.meta.dev

  const goHome = () => {
    clearError({ redirect: '/home' })
  }

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      goHome()
    }
  }

  useHead({
    title: `Erro ${props.error.statusCode} - ${errorConfig.value.title}`
  })
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="mx-auto" elevation="8" rounded="xl">
              <v-card-text class="text-center pa-8">
                <!-- Error Icon -->
                <v-icon
                  :color="errorConfig.color"
                  size="80"
                  class="mb-4"
                >
                  {{ errorConfig.icon }}
                </v-icon>

                <!-- Error code -->
                <h1 class="text-h3 font-weight-bold mb-2" :class="`text-${errorConfig.color}`">
                  {{ error.statusCode }}
                </h1>

                <!-- Error title -->
                <h2 class="text-h5 mb-4">
                  {{ errorConfig.title }}
                </h2>

                <!-- Error message -->
                <p class="text-body-1 mb-6 text-medium-emphasis">
                  {{ errorConfig.message }}
                </p>

                <!-- Actions buttons -->
                <v-row>

                  <!-- go to home-->
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      size="large"
                      rounded="xl"
                      block
                      prepend-icon="mdi-home"
                      @click="goHome"
                    >
                      {{ $t('goToHome') }}
                    </v-btn>

                  </v-col>

                  <!--go Back-->
                  <v-col cols="12">
                    <v-btn
                      block
                      color="surface-variant"
                      variant="outlined"
                      size="large"
                      rounded="xl"
                      prepend-icon="mdi-arrow-left"
                      @click="goBack"
                    >
                      {{ $t('goBack') }}
                    </v-btn>
                  </v-col>

                </v-row>

                <!-- Informações técnicas (apenas em desenvolvimento) -->
                <v-expansion-panels
                  v-if="isDev && error.stack"
                  class="mt-6"
                  variant="accordion"
                >
                  <v-expansion-panel
                    title="Detalhes técnicos"
                    text-color="error"
                  >
                    <v-expansion-panel-text>
                      <pre class="text-caption text-left overflow-auto">{{ error.stack }}</pre>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
