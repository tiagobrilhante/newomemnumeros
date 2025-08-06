<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'

  useHead({
    title: 'Gerenciamento de Usuários',
  })

  const titleVariables = {
    title: 'Gerenciamento de Usuários',
    icon: 'mdi-account-group',
  }
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseTitle :title-variables="titleVariables" />
      </v-col>
    </v-row>
  </v-container>
</template>
