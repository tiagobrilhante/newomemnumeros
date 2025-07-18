<script lang="ts" setup>
  definePageMeta({
    layout: 'login-page',
  })

  const isLogin = ref(true)

</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <auth-login v-if="isLogin" />
        <auth-register v-else/>

        <!-- Alternar entre Login e Cadastro -->
        <v-card>
          <v-card-text>
            <v-row class="mb-4">
              <v-col class="text-center">
                <v-btn variant="plain" @click="isLogin = !isLogin">
                  {{
                    isLogin
                      ? 'Já tem uma conta? Faça login'
                      : 'Não tem uma conta? Cadastre-se'
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
