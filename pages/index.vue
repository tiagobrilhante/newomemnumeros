<script lang="ts" setup>
  definePageMeta({
    layout: 'login-page',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/home',
    },
  })

  const isLogin = ref(true)

</script>
<template>

  <auth-login v-if="isLogin" />
  <auth-register v-else />

  <v-container>
    <v-row>
      <v-col :cols="isLogin
                        ? '4'
                        : '8'" :offset="isLogin
                        ? '4'
                        : '2'">
        <v-card
          :class=" isLogin
                        ? 'card-container-login'
                        : 'card-container-register'"
          elevation="12"
          rounded="xl"
          theme="light"
        >
          <v-card-text class="text-center">
            <v-btn variant="text" @click="isLogin = !isLogin">
              {{
                isLogin
                  ? $t('noAccountSignUp')
                  : $t('haveAccountSignIn')
              }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>


</template>


<style scoped>
  :deep(.card-container-login) {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #222222;
    border: 10px double #222222;
    outline: 3px solid #222222;
  }

  :deep(.card-container-register) {
    background: rgba(64, 70, 62, 0.87);
    color: white;
    box-shadow: 0 4px 8px rgb(255, 255, 255);
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }

  :deep(.borda-branca) {
    border: 10px double #ffffff;
    outline: 3px solid #ffffff;
    padding: 10px;
  }
</style>
