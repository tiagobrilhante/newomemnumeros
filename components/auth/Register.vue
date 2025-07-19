<script lang="ts" setup>
  import type { rank } from '~/types/core/user'
  import { rankService } from '~/services/rank.service'
  import SwitchAuthRegister from '~/components/auth/SwitchAuthRegister.vue'



  interface Props {
    modelValue?: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()


  const loading = ref(false)
  const ranks = ref<rank[]>([])

  const newUserData = reactive({
    name: '',
    serviceName: '',
    selectedRank: '',
    cpfValue: '',
    password: '',
    passwordConfirm: '',
    email: ''
  })

  // Computed para o isLogin local
  const isLogin = computed({
    get: () => props.modelValue ?? true,
    set: (value) => emit('update:modelValue', value)
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

  const processRegister = () =>{
    console.log('teste')
  }

</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-card class="pa-5 text-center borda-branca" elevation="12" rounded="xl">
          <h1>Cadastro</h1>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" offset="2">
        <v-card
          class="card-container-register pa-5"
          elevation="12"
          rounded="xl"
          theme="dark"
        >
          <v-form @submit.prevent="processRegister">
            <v-icon icon="mdi-account" />
            <span>Cadastre-se</span>
            <br><br>

            <!-- Exibe mensagem de erro, se houver -->
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

            <!-- nome e nome de guerra-->
            <v-row>
              <!-- Campo de nome -->
              <v-col>
                <v-text-field
                  id="name"
                  v-model="newUserData.name"
                  density="compact"
                  label="Nome Completo"
                  placeholder="Nome Completo"
                  prepend-icon="mdi-text-account"
                  required
                  variant="solo-inverted"
                />
              </v-col>
              <!-- Campo de nome de guerra -->
              <v-col>
                <v-text-field
                  id="serviceName"
                  v-model="newUserData.serviceName"
                  density="compact"
                  label="Nome de Guerra"
                  placeholder="Nome de Guerra"
                  prepend-icon="mdi-text-account"
                  required
                  variant="solo-inverted"
                />
              </v-col>
            </v-row>

            <!-- PG e email-->
            <v-row>
              <!-- Select de Ranks -->
              <v-col>
                <v-select
                  v-model="newUserData.selectedRank"
                  :items="ranks"
                  density="compact"
                  item-title="name"
                  item-value="id"
                  label="Posto/Graduação"
                  placeholder="Selecione seu posto/graduação"
                  prepend-icon="mdi-medal"
                  required
                  variant="solo-inverted"
                />
                <div v-if="ranks === null || (ranks.length === 0)">
                  <p>Nenhum posto/graduação disponível para seleção no momento.</p>
                </div>
              </v-col>
              <v-col>
                <!-- Campo de e-mail -->
                <v-text-field
                  id="email"
                  v-model="newUserData.email"
                  density="compact"
                  label="E-mail"
                  placeholder="Seu e-mail"
                  prepend-icon="mdi-at"
                  required
                  type="email"
                  variant="solo-inverted"
                />
              </v-col>
            </v-row>

            <!--cpf e om-->
            <v-row>
              <v-col>
                <!--suppress VueUnrecognizedDirective -->
                <v-text-field
                  id="cpf"
                  v-model="newUserData.cpfValue"
                  v-mask-cpf
                  density="compact"
                  label="CPF"
                  placeholder="CPF"
                  prepend-icon="mdi-text-account"
                  required
                  variant="solo-inverted"
                />
              </v-col>
            </v-row>

            <!-- senha e repita a senha-->
            <v-row>
              <!-- Campo de senha -->
              <v-col>
                <v-text-field
                  id="password"
                  v-model="newUserData.password"
                  density="compact"
                  label="Senha"
                  placeholder="Sua senha"
                  prepend-icon="mdi-form-textbox-password"
                  required
                  type="password"
                  variant="solo-inverted"
                />
              </v-col>
              <!-- confirme a senha -->
              <v-col>
                <v-text-field
                  id="passwordConfirm"
                  v-model="newUserData.passwordConfirm"
                  density="compact"
                  label="Confirme a senha"
                  placeholder="Confirme sua senha"
                  prepend-icon="mdi-form-textbox-password"
                  required
                  type="password"
                  variant="solo-inverted"
                />
              </v-col>
            </v-row>

            <!-- Botão de login/cadastro -->
            <v-row class="mb-4">

              <v-col>
                <AuthSwitchAuthRegister v-model="isLogin" />
              </v-col>
              <v-col>
                <v-btn
                  :disabled="loading"
                  :loading="loading"
                  block
                  color="primary"
                  elevation="12"
                  rounded="xl"
                  type="submit"
                  variant="elevated"
                >
                  {{ loading ? 'Carregando...' : 'Cadastrar' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
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
