<script lang="ts" setup>
  import type { rank } from '~/types/core/user'
  import { rankService } from '~/services/rank.service'


  definePageMeta({
    layout: 'login-page',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/home',
    },
    pageTransition: {
      name: 'slide-left',
      mode: 'out-in',
    },
  })

  const loading = ref(false)
  const ranks = ref<rank[]>([])

  const newUserData = reactive({
    name: '',
    serviceName: '',
    selectedRank: '',
    cpfValue: '',
    password: '',
    passwordConfirm: '',
    email: '',
  })

  const error = reactive({
    msgError: [] as string[],
    active: false,
  })

  const resetError = () => {
    error.msgError = []
    error.active = false
  }

  ranks.value = (await rankService.findAll())

  const processRegister = () => {
    console.log('teste')
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
    <!-- todo tenho que implementar as regras de validação do vuetify-->
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

            <v-form @submit.prevent="processRegister">

              <!-- TODO Show api errors if exist - need refactor-->
              <v-alert
                v-if="error.active"
                class="mb-5"
                closable
                theme="dark"
                type="error"
                @click:close="resetError"
              >
                Alguns Erros foram encontrados:
                <ul>
                  <li v-for="errorDescription in error.msgError" :key="errorDescription">
                    {{ errorDescription }}
                  </li>
                </ul>
              </v-alert>

              <!-- rank and serviceName-->
              <v-row dense>

                <!-- rank -->
                <v-col>
                  <v-select
                    v-model="newUserData.selectedRank"
                    :items="ranks"
                    :label="$t('rankLabel')"
                    :placeholder="$t('rankPlaceholder')"
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
                    v-model="newUserData.cpfValue"
                    v-mask-cpf
                    :label="$t('cpfLabel')"
                    :placeholder="$t('cpfPlaceholder')"
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
                  <v-btn size="small" variant="text" to="/" :text="$t('haveAccountSignIn')" />
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
</style>
