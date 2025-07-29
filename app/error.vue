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
          color: 'warning'
        }
      case 404:
        return {
          icon: 'mdi-compass-off',
          color: 'info'
        }
      case 500:
        return {
          icon: 'mdi-server-network-off',
          color: 'error'
        }
      default:
        return {
          icon: 'mdi-alert-circle',
          color: 'error'
        }
    }
  })

  const errorTitle = computed(() => {
    return props.error.statusMessage || $t(`errors.status${props.error.statusCode}Title`) || $t('errors.genericTitle')
  })

  const errorMessage = computed(() => {
    return props.error.message || $t(`errors.status${props.error.statusCode}Message`) || $t('errors.genericMessage')
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
    title: `Erro ${props.error.statusCode} - ${errorTitle.value}`
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
                  {{ errorTitle }}
                </h2>

                <!-- Error message -->
                <p class="text-body-1 mb-6 text-medium-emphasis">
                  {{ errorMessage }}
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
                      :text="$t('goToHome')"
                    />

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
                      :text="$t('goBack')"
                    />
                  </v-col>

                </v-row>

                <!-- Tech Details (only in dev) -->
                <v-expansion-panels
                  v-if="isDev && error.stack"
                  class="mt-6"
                  variant="accordion"
                >
                  <v-expansion-panel
                    :title="$t('errors.technicalDetails')"
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
