<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import WelcomeMessage from '~/layouts/partials/WelcomeMessage.vue'
  import { retrieveMilitaryOrganizationLogo } from '~/utils/retrieve-military-organization-logo'

  // Força verificação de autenticação sempre que acessar esta página
  definePageMeta({
    middleware: 'auth-required'
  })

  const { currentUser } = useUserData()

  const DASHBOARD_MENU_ITEM = {
    title: 'Página Inicial',
    icon: 'mdi-home',
    haveSpaceForComponent: true,
    components: [WelcomeMessage],
    componentPosition: ['right'] as ['right'],
  }
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseTitle :title-variables="DASHBOARD_MENU_ITEM" />

        <v-container fluid>
          <v-row>
            <v-col class="container">

              {{currentUser}}
<!--              <nuxt-img
              :src="`${retrieveMilitaryOrganizationLogo(
                  currentUser.militaryOrganization.id,
                  'big',
                  [currentUser.militaryOrganization]
                )}`"
                width="400"
              />-->
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .container {
    /* Configura a imagem como background */
    min-height: 50vh; /* Ocupa toda a altura da tela */
    max-height: 100vh; /* Ocupa toda a altura da tela */
    display: flex;
    justify-content: center; /* Centraliza o conteúdo horizontalmente */
    align-items: center; /* Centraliza o conteúdo verticalmente */
  }
</style>
