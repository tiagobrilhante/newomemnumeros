<script lang="ts" setup>
  import { rankService } from '~/services/rank.service'
  import { militaryOrganizationService } from '~/services/militaryOrganizationsService'
  import type { rank } from '~/types/core/user'
  import type { militaryOrganization } from '~/types/core/organization'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import { cpf } from 'cpf-cnpj-validator'

  // Removido emit - componente agora é responsável pela navegação

  const authUserStore = useAuthUserStore()
  const loading = ref(false)
  const email = ref('')
  const name = ref('')
  const serviceName = ref('')
  const cpfValue = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const isRegistering = ref(false)
  const ranks = ref<rank[]>([])
  const militaryOrganizations = ref<militaryOrganization[]>([])
  const selectedRank = ref<number | null>(null)
  const selectedMilitaryOrganization = ref<number | null>(null)

  watch(isRegistering, async (newValue) => {
    if (newValue) {
      ranks.value = (await rankService.findAll()) as rank[]
      militaryOrganizations.value =
        (await militaryOrganizationService.findAll()) as militaryOrganization[]
    } else {
      ranks.value = []
      militaryOrganizations.value = []
      selectedRank.value = null
      selectedMilitaryOrganization.value = null
    }
  })

  const error = reactive({
    msgError: [] as string[],
    active: false,
  })

  const resetError = () => {
    error.msgError = []
    error.active = false
  }

  const processAuth = async () => {
    resetError()
    loading.value = true

    try {
      // TODO fazzer a validação de todos os campos
      if (isRegistering.value) {
        const arrayOfErrors: string[] = []

        if (!name.value) {
          arrayOfErrors.push('O campo "Nome Completo" é obrigatório.')
        }

        if (!serviceName.value) {
          arrayOfErrors.push('O campo "Nome de Guerra" é obrigatório.')
        }

        if (!selectedRank.value) {
          arrayOfErrors.push('O campo "Posto/Graduação" é obrigatório.')
        }

        if (!selectedMilitaryOrganization.value) {
          arrayOfErrors.push('O campo "Om" é obrigatório.')
        }

        if (!email.value) {
          arrayOfErrors.push('O campo "Email" é obrigatório.')
        }

        if (!password.value) {
          arrayOfErrors.push('O campo "Senha" é obrigatório.')
        } else if (password.value.length < 6) {
          arrayOfErrors.push('A senha deve ter no mínimo 6 caracteres.')
        }

        if (password.value !== passwordConfirm.value) {
          arrayOfErrors.push('"Senha" e "Confirme a Senha" deve apresentar o mesmo conteúdo.')
        }

        if (!cpfValue.value) {
          arrayOfErrors.push('O campo "CPF" é obrigatório.')
        }

        if (cpfValue.value && !cpf.isValid(cpfValue.value.trim())) {
          arrayOfErrors.push('O CPF informado não é válido.')
        }

        if (arrayOfErrors.length > 0) {
          error.active = true
          error.msgError = arrayOfErrors
          return
        }

        // Cadastro
        const registerResult = await authUserStore.register({
          email: email.value.trim(),
          password: password.value.trim(),
          name: name.value.trim(),
          serviceName: serviceName.value.trim(),
          cpf: cpfValue.value.trim(),
          rankId: selectedRank.value as number,
          militaryOrganizationId: selectedMilitaryOrganization.value as number,
        })

        if (registerResult && registerResult.success) {
          toast('Cadastro efetuado com sucesso', {
            theme: 'dark',
            type: 'success',
            dangerouslyHTMLString: true,
          })

          // Login após cadastro bem-sucedido
          const loginResult = await authUserStore.login(email.value.trim(), password.value.trim())

          if (loginResult && loginResult.success) {
            // Separar o redirecionamento do bloco try/catch
            loading.value = false

            // Usar nextTick para garantir que o estado foi atualizado
            await nextTick()
            
            // Navegar para home após login bem-sucedido no cadastro
            await navigateTo('/home', { replace: true })
            return
          }
        } else {
          error.active = true
          error.msgError.push('Erro ao cadastrar. E-mail pode já estar em uso.')
        }
      } else {
        // Login
        if (!email.value || !password.value) {
          error.active = true
          error.msgError.push('Por favor, preencha todos os campos corretamente.')
          loading.value = false
          return
        }
        const loginResult = await authUserStore.login(email.value.trim(), password.value.trim())

        if (loginResult && loginResult.success) {
          error.active = false
          loading.value = false

          // Usar nextTick para garantir que o estado foi atualizado
          await nextTick()
          
          // Navegar para home após login bem-sucedido
          await navigateTo('/home', { replace: true })
          return
        } else {
          error.active = true
          error.msgError.push('E-mail ou senha inválidos. Tente novamente.')
        }
      }
    } catch (err) {
      console.error('[Login.vue] Erro ao processar autenticação:', err)
      error.active = true

      if (isRegistering.value) {
        error.msgError.push('Erro ao cadastrar. E-mail pode já estar em uso.')
      } else {
        error.msgError.push('E-mail ou senha inválidos. Tente novamente.')
      }
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-card class="pa-5 text-center borda-branca" elevation="12" rounded="xl">
          <h1>{{ isRegistering ? 'Cadastro' : 'Login' }}</h1>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="isRegistering ? '8' : '6'" :offset="isRegistering ? '2' : '3'">
        <v-card
          :class="isRegistering ? 'card-container-register' : 'card-container-login'"
          :theme="isRegistering ? 'dark' : 'light'"
          class="pa-5"
          elevation="12"
          rounded="xl"
        >
          <v-form @submit.prevent="processAuth">
            <v-icon icon="mdi-account" />
            <span>{{ isRegistering ? 'Cadastre-se' : 'Entre com sua conta' }}</span>
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
            <v-row v-if="isRegistering">
              <!-- Campo de nome -->
              <v-col>
                <v-text-field
                  id="name"
                  v-model="name"
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
                  v-model="serviceName"
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
              <v-col v-if="isRegistering">
                <v-select
                  v-model="selectedRank"
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
                <div v-if="ranks === null || (ranks.length === 0 && isRegistering)">
                  <p>Nenhum posto/graduação disponível para seleção no momento.</p>
                </div>
              </v-col>
              <v-col>
                <!-- Campo de e-mail -->
                <v-text-field
                  id="email"
                  v-model="email"
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
            <v-row v-if="isRegistering">
              <v-col>
                <!--suppress VueUnrecognizedDirective -->
                <v-text-field
                  id="cpf"
                  v-model="cpfValue"
                  v-mask-cpf
                  density="compact"
                  label="CPF"
                  placeholder="CPF"
                  prepend-icon="mdi-text-account"
                  required
                  variant="solo-inverted"
                />
              </v-col>
              <v-col>
                <!-- Select de Om -->
                <v-select
                  v-model="selectedMilitaryOrganization"
                  :items="militaryOrganizations"
                  density="compact"
                  item-title="acronym"
                  item-value="id"
                  label="OM"
                  placeholder="Selecione sua OM"
                  prepend-icon="mdi-castle"
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
                  v-model="password"
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
              <v-col v-if="isRegistering">
                <v-text-field
                  id="passwordConfirm"
                  v-model="passwordConfirm"
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
                  {{ loading ? 'Carregando...' : isRegistering ? 'Cadastrar' : 'Entrar' }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- Alternar entre Login e Cadastro -->
            <v-row class="mb-4">
              <v-col class="text-center">
                <v-btn variant="plain" @click="isRegistering = !isRegistering">
                  {{
                    isRegistering
                      ? 'Já tem uma conta? Faça login'
                      : 'Não tem uma conta? Cadastre-se'
                  }}
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
  .card-container-login {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #222222;
    border: 10px double #222222;
    outline: 3px solid #222222;
    padding: 10px;
  }

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
