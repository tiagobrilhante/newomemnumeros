<!--suppress JSUnusedGlobalSymbols -->
<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'



  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: $t('militaryOrganizationsManagement') + ' - ' + appName,
  })
  const titleVariables = {
    title: 'Gerenciamento de Funções e Permissões',
    icon: 'mdi-shield-account',
  }
</script>

<template>
  <v-container fluid>
    <!-- base title-->
    <v-row>
      <v-col>
        <BaseTitle :title-variables="titleVariables" />
        <military-organization-selector/>

      </v-col>
    </v-row>
  </v-container>
</template>
