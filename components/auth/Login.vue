<script lang="ts" setup>
  const { login } = useAuth()
  import type { VForm } from 'vuetify/components'

  const email = ref('')
  const password = ref('')
  const loading = ref(false)

  const form = ref<VForm | null>(null)
  const apiError = ref<string | null>(null)

  const emailRules = [
    (v: string) => !!v || $t('emailField') + ' ' + $t('isRequired'),
    (v: string) => /.+@.+\..+/.test(v) || $t('emailField') + ' ' + $t('mustBeValid'),
  ]

  const passwordRules = [
    (v: string) => !!v || $t('passwordField') + ' ' + $t('isRequired'),
    (v: string) => (v && v.length >= 6) || $t('passwordField') + ' ' + $t('mustContain') + ' 6 ' + $t('characters'),
  ]

  const processAuth = async () => {
    apiError.value = null
    loading.value = true

    try {
      const validationResult = await form.value?.validate()

      if (!validationResult?.valid) {
        loading.value = false
        return
      }

      const loginResult = await login({
        email: email.value.trim(),
        password: password.value.trim(),
      })

      if (loginResult.success) {
        await navigateTo('/home', { replace: true })
      } else {
        apiError.value = $t('errorInvalidEmailOrPassword')
      }

    } catch (err) {
      // TODO - improve the error handlers
      console.error('[Login.vue]: ' + $t('errorUnexpected'), err)
      apiError.value = $t('errorUnexpected')
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <v-container>

    <!-- head card-->
    <v-row>
      <v-col cols="4" offset="4">
        <v-card class="text-center borda-branca" elevation="12" rounded="xl">
          <h2>{{ $t('login') }}</h2>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" offset="4">
        <v-card
          class="card-container-login"
          :title="$t('signIn')"
          elevation="12"
          prepend-icon="mdi-account"
          rounded="xl"
          theme="light"
        >
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent="processAuth">
              <!-- e-mail and password fields -->
              <v-row dense>

                <!--email-->
                <v-col cols="12">
                  <v-text-field
                    id="email"
                    v-model="email"
                    :label="$t('labelEmailInput')"
                    :placeholder="$t('placeholderEmailInput')"
                    :rules="emailRules"
                    density="compact"
                    prepend-icon="mdi-at"
                    required
                    type="email"
                    rounded="xl"
                    variant="solo-inverted"
                  />
                </v-col>

                <!--password-->
                <v-col cols="12">
                  <v-text-field
                    id="password"
                    v-model="password"
                    :label="$t('labelPasswordInput')"
                    :placeholder="$t('placeholderPasswordInput')"
                    :rules="passwordRules"
                    density="compact"
                    rounded="xl"
                    prepend-icon="mdi-form-textbox-password"
                    required
                    type="password"
                    variant="solo-inverted"
                  />
                </v-col>

              </v-row>

              <!-- errors messages from API -->
              <v-alert v-if="apiError" class="mb-4" density="compact" type="error">
                {{ apiError }}
              </v-alert>

              <!-- Botão de login -->
              <v-row dense>
                <v-col cols="4" offset="8">
                  <v-btn
                    :disabled="loading"
                    :loading="loading"
                    :text="loading ? $t('loading') : $t('login')"
                    block
                    color="primary"
                    elevation="12"
                    prepend-icon="mdi-login"
                    rounded="xl"
                    size="small"
                    type="submit"
                    variant="elevated"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
