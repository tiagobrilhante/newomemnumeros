<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'

  useHead({
    title: 'Gerenciamento de Vínculo de Usuário',
  })

  const titleVariables = {
    title: 'Gerenciamento de Vínculo de Usuário',
    icon: 'mdi-arrow-collapse',
  }
</script>

<template>
  <v-container fluid>
    <BaseTitle :title-variables="titleVariables" />
  </v-container>
</template>
