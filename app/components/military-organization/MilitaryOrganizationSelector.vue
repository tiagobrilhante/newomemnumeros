<script lang="ts" setup>
  import { retrieveMiniImage } from '#shared/utils'

  const {fetchMilitaryOrganizations, selectMilitaryOrganization, clearSelection ,selectedMilitaryOrganization, militaryOrganizations} = useMilitaryOrganizations()

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
          v-model="selectedMilitaryOrganization"
          :items="militaryOrganizations"
          density="compact"
          hide-details
          item-title="acronym"
          item-value="id"
          label="Organização Militar"
          placeholder="Selecione a organização Militar"
          required
          rounded="xl"
          variant="outlined"
          return-object
          @update:model-value="setSelectedMilitaryOrganization"
        />
      </v-col>
      <v-col v-if="!selectedMilitaryOrganization">
        <h3>Selecione a OM</h3>
      </v-col>
      <v-col v-else  align-self="center" class="pt-0 pb-0 my-auto align-content-center">
        <h2 class="my-auto d-inline-block">{{selectedMilitaryOrganization.name}} - {{selectedMilitaryOrganization.acronym}}</h2> <v-icon-btn size="small" class="ml-10" variant="outlined" icon="mdi-refresh-circle" @click="clearSelection" color="white"/>
      </v-col>
      <v-col v-if="selectedMilitaryOrganization && selectedMilitaryOrganization.logo" class="text-right pt-0 pb-0" cols="2">
        <nuxt-img
          :src="retrieveMiniImage(selectedMilitaryOrganization.logo)"
          width="30"
        />

      </v-col>
    </v-row>
  </v-card>
</template>
