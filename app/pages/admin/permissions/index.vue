<!--suppress JSUnusedGlobalSymbols -->
<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'


  const { t } = useI18n()
  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME
  const {selectedMilitaryOrganization} = useMilitaryOrganizations()

  useHead({
    title: t('militaryOrganizationsManagement') + ' - ' + appName,
  })
  const titleVariables = {
    title: t('permission.managePermissions'),
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
        <permissions-role-management v-if="selectedMilitaryOrganization"/>
      </v-col>
    </v-row>
  </v-container>
</template>
