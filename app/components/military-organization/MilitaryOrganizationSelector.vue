<script lang="ts" setup>
  import { retrieveMiniImage } from '#shared/utils'

  const {fetchMilitaryOrganizations, selectMilitaryOrganization, selectedMilitaryOrganization, militaryOrganizations} = useMilitaryOrganizations()

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
    <v-row>
      <v-col align-self="center">

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
      <v-col align-self="center">
        <h3>Selecione a OM</h3>
      </v-col>
      <v-col v-if="selectedMilitaryOrganization && selectedMilitaryOrganization.logo" align-self="center" class="text-right" cols="2">

        <nuxt-img
          :src="retrieveMiniImage(selectedMilitaryOrganization.logo)"
          class="text-right pt-auto pb-auto my-auto align-content-center"
          width="35"
        />

      </v-col>
    </v-row>
  </v-card>
</template>
