<script lang="ts" setup>
  import { rankService } from '~/services/rank.service'
  import { cpf } from 'cpf-cnpj-validator'
  import type { rank } from '~/types/rank'
  import type { VForm } from 'vuetify/components'
  import type { RegisterResponse } from '~/services/register.service'

  definePageMeta({
    layout: 'guest-layout',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/home',
    },
    pageTransition: {
      name: 'slide-left',
      mode: 'out-in',
    },
  })

  const { register, loading } = useRegister()
  const localePath = useLocalePath()
  const form = ref<VForm | null>(null)
  const apiResponse = ref<RegisterResponse | null>(null)

  const newUserData = reactive({
    name: '',
    serviceName: '',
    rankId: '',
    cpf: '',
    password: '',
    passwordConfirm: '',
    email: '',
  })

  const { data: ranks } = useAsyncData(
    'ranks', () => rankService.findAll(),
    {
      default: () => [] as rank[],
    },
  )

  const createRequiredRule = (fieldKey: string) => {
    return (v: string) => !!v || `${$t(fieldKey)} ${$t('isRequired')}`
  }

  const requiredRule = [ (v: string) => !!v || `${$t('thisField')} ${$t('isRequired')}` ]

  const emailRules = [
    createRequiredRule('emailField'),
    (v: string) => /.+@.+\..+/.test(v) || `${$t('emailField')} ${$t('mustBeValid')}`,
  ]

  const cpfRules = [
    createRequiredRule('cpfField'),
    (v: string) => cpf.isValid(v) ||  `${$t('cpfField')} ${$t('mustBeValid')}`,
  ]

  const passwordRules = [
    createRequiredRule('passwordField'),
    (v: string) => (v && v.length >= 6) || `${$t('passwordField')} ${$t('mustContain')} 6 ${$t('characters')}`,
  ]

  const passwordConfirmRules = [
    createRequiredRule('passwordConfirmationRequired'),
    (v: string) => v === newUserData.password || $t('passwordDoesNotMatch'),
  ]

  const processRegister = async () => {
    const { valid } = (await form.value?.validate()) || { valid: false }
    if (!valid) return

    apiResponse.value = null

    const payload = {
      name: newUserData.name,
      serviceName: newUserData.serviceName,
      rankId: newUserData.rankId,
      cpf: newUserData.cpf,
      email: newUserData.email,
      password: newUserData.password,
    }

    const result = await register(payload)

    if (result.success) {
     /* console.log('Usuário registrado com sucesso!')*/
      await navigateTo('/')
    } else {
      apiResponse.value = result
    }
  }

</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="8" offset="2">
        <v-card class="text-center borda-branca" elevation="12" rounded="xl">
          <h2>{{ $t('register') }}</h2>
        </v-card>
      </v-col>
    </v-row>

    <v-row>

      <v-col cols="8" offset="2">

        <v-card
          :title="$t('signUp')"
          class="card-container-register"
          elevation="12"
          prepend-icon="mdi-account"
          rounded="xl"
          theme="dark"
        >

          <v-card-text>

            <v-form ref="form" lazy-validation @submit.prevent="processRegister">

              <v-alert
                v-if="apiResponse && !apiResponse.success"
                class="mb-5"
                closable
                density="compact"
                type="error"
                @click:close="apiResponse = null"
              >
                {{ apiResponse.message }}
              </v-alert>

              <!-- rank and serviceName-->
              <v-row dense>

                <!-- rank -->
                <v-col>
                  <v-select
                    v-model="newUserData.rankId"
                    :items="ranks"
                    :label="$t('rankLabel')"
                    :placeholder="$t('rankPlaceholder')"
                    :rules="requiredRule"
                    density="compact"
                    item-title="name"
                    item-value="id"
                    prepend-icon="mdi-medal"
                    required
                    rounded="xl"
                    variant="solo-inverted"
                  />
                </v-col>

                <!-- serviceName -->
                <v-col>
                  <v-text-field
                    id="serviceName"
                    v-model="newUserData.serviceName"
                    :label="$t('serviceNameLabel')"
                    :placeholder="$t('serviceNamePlaceholder')"
                    :rules="requiredRule"
                    density="compact"
                    prepend-icon="mdi-text-account"
                    required
                    rounded="xl"
                    variant="solo-inverted"
                  />
                </v-col>
              </v-row>

              <!-- fullName -->
              <v-row dense>
                <v-col>
                  <v-text-field
                    id="name"
                    v-model="newUserData.name"
                    :label="$t('fullNameLabel')"
                    :placeholder="$t('fullNamePlaceholder')"
                    :rules="requiredRule"
                    density="compact"
                    prepend-icon="mdi-text-account"
                    required
                    rounded="xl"
                    variant="solo-inverted"
                  />
                </v-col>
              </v-row>

              <!-- CPF and e-mail-->
              <v-row dense>

                <!--cpf-->
                <v-col>
                  <!--suppress VueUnrecognizedDirective -->
                  <v-text-field
                    id="cpf"
                    v-model="newUserData.cpf"
                    v-mask-cpf
                    :label="$t('cpfLabel')"
                    :placeholder="$t('cpfPlaceholder')"
                    :rules="cpfRules"
                    density="compact"
                    prepend-icon="mdi-text-account"
                    required
                    rounded="xl"
                    variant="solo-inverted"
                  />
                </v-col>

                <!-- e-mail -->
                <v-col>
                  <v-text-field
                    id="email"
                    v-model="newUserData.email"
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
              </v-row>

              <!-- password and password confirmation-->
              <v-row dense>

                <!-- password -->
                <v-col>
                  <v-text-field
                    id="password"
                    v-model="newUserData.password"
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

                <!-- confirm your password -->
                <v-col>
                  <v-text-field
                    id="passwordConfirm"
                    v-model="newUserData.passwordConfirm"
                    :label="$t('passwordConfirmLabel')"
                    :placeholder="$t('passwordConfirmPlaceholder')"
                    :rules="passwordConfirmRules"
                    density="compact"
                    prepend-icon="mdi-form-textbox-password"
                    required
                    rounded="xl"
                    type="password"
                    variant="solo-inverted"
                  />
                </v-col>

              </v-row>

              <!-- Switch login / register and register button -->
              <v-row dense>

                <!--switch register/login-->
                <v-col>
                  <v-btn :text="$t('haveAccountSignIn')" :to="localePath('/')" size="small" variant="text" />
                </v-col>

                <!--register button-->
                <v-col>
                  <v-btn
                    :disabled="loading"
                    :loading="loading"
                    :text="loading ? $t('loading') : $t('registerAction')"
                    block
                    color="primary"
                    elevation="12"
                    prepend-icon="mdi-account-plus"
                    rounded="xl"
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

<style scoped>
  .card-container-register {
    background: rgba(64, 70, 62, 0.87);
    color: white;
    box-shadow: 0 4px 8px rgb(255, 255, 255);
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }

  .borda-branca {
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }

  /* noinspection CssUnusedSymbol */
  :deep(.v-input--error .v-messages__message) {
    color: #FFC107;
  }
</style>
