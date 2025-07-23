<script lang="ts" setup>
  import type { VForm } from 'vuetify/components'

  const { login } = useAuth()
  const localePath = useLocalePath()

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
        await navigateTo(localePath('/home'), { replace: true })
      } else {
        apiError.value = $t('errorInvalidEmailOrPassword')
      }

    } catch (err) {
      // TODO - improve the error handlers
      apiError.value = $t('errorUnexpected')
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <v-container fluid>

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
          :title="$t('signIn')"
          class="card-container-login"
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
                    :label="$t('emailLabel')"
                    :placeholder="$t('emailPlaceholder')"
                    :rules="emailRules"
                    density="compact"
                    prepend-icon="mdi-at"
                    required
                    rounded="xl"
                    type="email"
                    variant="solo-inverted"
                  />
                </v-col>

                <!--password-->
                <v-col cols="12">
                  <v-text-field
                    id="password"
                    v-model="password"
                    :label="$t('passwordLabel')"
                    :placeholder="$t('passwordPlaceholder')"
                    :rules="passwordRules"
                    density="compact"
                    prepend-icon="mdi-form-textbox-password"
                    required
                    rounded="xl"
                    type="password"
                    variant="solo-inverted"
                  />
                </v-col>


                <!-- errors messages from API -->
                <v-col v-if="apiError" cols="12">
                  <v-alert class="mb-4" density="compact" type="error">
                    {{ apiError }}
                  </v-alert>
                </v-col>

                <!--login button-->
                <v-col cols="6" offset="6">
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

                <v-col cols="12" class="text-center">
                  <v-btn :text="$t('noAccountSignUp')" size="small" :to="localePath('/register')" variant="text" />
                </v-col>


              </v-row>


            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .card-container-login {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #222222;
    border: 10px double #222222;
    outline: 3px solid #222222;
  }

  .borda-branca {
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }
</style>
