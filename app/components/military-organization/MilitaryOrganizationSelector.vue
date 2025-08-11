<script lang="ts" setup>
  import { retrieveMiniImage } from '#shared/utils'

  const { t } = useI18n()

  const {fetchMilitaryOrganizations, selectMilitaryOrganization, clearSelection ,selectedMilitaryOrganization, militaryOrganizations, loading} = useMilitaryOrganizations()

  const militaryOrganizationStore = useMilitaryOrganizationStore()
  const listOfMilitaryOrganizations = ref<militaryOrganization[]>([])

  const setSelectedMilitaryOrganization = (militaryOrganization: militaryOrganization) => {
   selectMilitaryOrganization(militaryOrganization)
  }

  onMounted(async () => {
    await fetchMilitaryOrganizations()
    listOfMilitaryOrganizations.value = militaryOrganizationStore.militaryOrganizations ?? []
  })
</script>
<template>
  <v-card class="border border-solid border-opacity-100 pa-4" rounded="xl">
    <v-row dense>
      <v-col align-self="center" v-show="!selectedMilitaryOrganization">

        <v-autocomplete
          v-if="militaryOrganizations"
          :loading
          :model-value="selectedMilitaryOrganization"
          :items="militaryOrganizations || []"
          density="compact"
          hide-details
          item-title="acronym"
          item-value="id"
          :label="t('leftMenu.militaryOrganization')"
          :placeholder="t('selectMilitaryOrganization')"
          required
          rounded="xl"
          variant="outlined"
          return-object
          @update:model-value="setSelectedMilitaryOrganization"
        />
      </v-col>
      <v-col v-if="!selectedMilitaryOrganization" class="align-content-center">
        <h3 class="pl-5">{{t('selectMilitaryOrganization')}}</h3>
      </v-col>
      <v-col v-else class="align-content-center">
        <h2 class="d-inline-block">{{selectedMilitaryOrganization.name}} - {{selectedMilitaryOrganization.acronym}}</h2> <v-icon-btn size="small" class="ml-10 mb-1" variant="outlined" icon="mdi-refresh-circle" @click="clearSelection" color="white"/>
      </v-col>
      <v-col v-if="selectedMilitaryOrganization && selectedMilitaryOrganization.logo" class="text-right pt-0 pb-0 align-content-center mb-0" cols="2">
        <nuxt-img
          :src="retrieveMiniImage(selectedMilitaryOrganization.logo)"
          width="30"
        />

      </v-col>
    </v-row>
  </v-card>
</template>
