<script lang="ts" setup>
  import 'vue3-toastify/dist/index.css'
  const { login } = useAuth()

  const loading = ref(false)
  const email = ref('')
  const password = ref('')

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

      // Login
      if (!email.value || !password.value) {
        error.active = true
        error.msgError.push('Por favor, preencha todos os campos corretamente.')
        loading.value = false
        return
      }
      const loginResult = await login({ email: email.value.trim(), password: password.value.trim() })

      if (loginResult.success) {
        error.active = false
        loading.value = false

        await nextTick()

        await navigateTo('/home', { replace: true })
        return
      } else {
        error.active = true
        error.msgError.push('E-mail ou senha inválidos. Tente novamente.')
      }

    } catch (err) {
      console.error('[Login.vue] Erro ao processar autenticação:', err)
      error.active = true


      error.msgError.push('E-mail ou senha inválidos. Tente novamente.')

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
          <h1>Login</h1>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" offset="3">
        <v-card
          class="card-container-login pa-5"
          elevation="12"
          rounded="xl"
          theme="light"
        >
          <v-form @submit.prevent="processAuth">
            <v-icon icon="mdi-account" />
            <span>Entre com sua conta</span>
            <br><br>


            <!-- email-->
            <v-row>
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
                  {{ loading ? 'Carregando...' : 'Entrar' }}
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

  .borda-branca {
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }
</style>
