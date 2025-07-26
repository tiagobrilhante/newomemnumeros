<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import WelcomeMessage from '~/components/user/WelcomeMessage.vue'
  //import { retrieveMilitaryOrganizationLogo } from '~/utils/retrieve-military-organization-logo'
  import { useAuthUserStore } from '~/stores/auth.store'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: $t('leftMenu.home') + ' - ' + appName,
  })

  definePageMeta({
    auth: true
  })

  const authUserStore = useAuthUserStore();

  const DASHBOARD_MENU_ITEM = {
    title: $t('leftMenu.home'),
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

              {{authUserStore.user}}
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
