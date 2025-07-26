<script lang="ts" setup>
  import { retrieveMilitaryOrganizationLogo } from '~/utils/retrieve-military-organization-logo'

  import { useMilitaryOrganizationStore } from '~/stores/military-organization.store'
  import type { militaryOrganization } from '~/types/core/organization'

  const militaryOrganizationStore = useMilitaryOrganizationStore()
  const selectedMilitaryOrganization = ref<number | null>(null)
  const listOfMilitaryOrganizations = ref<militaryOrganization[]>([])

  const setSelectedMilitaryOrganization = (militaryOrganizationId: number) => {
    selectedMilitaryOrganization.value = militaryOrganizationId

    const selectedMO = listOfMilitaryOrganizations.value.find(
      (militaryOrganization) => militaryOrganization.id === militaryOrganizationId
    )
    if (!selectedMO) return
    militaryOrganizationStore.setSelectedMilitaryOrganization(selectedMO)
  }

  const fetchMilitaryOrganizations = async () => {
    await militaryOrganizationStore.fetchMilitaryOrganizations()
    listOfMilitaryOrganizations.value = militaryOrganizationStore.militaryOrganizations ?? []
  }

  onMounted(() => {
    fetchMilitaryOrganizations()
  })
</script>
<template>
  <v-card class="border border-solid border-opacity-100 pa-4" rounded="xl">
    <v-row>
      <v-col align-self="center">
        <v-select
          v-if="militaryOrganizationStore.militaryOrganizations"
          v-model="selectedMilitaryOrganization"
          :items="militaryOrganizationStore.militaryOrganizations"
          density="compact"
          hide-details
          item-title="acronym"
          item-value="id"
          label="Organização Militar"
          placeholder="Selecione a organização Militar"
          required
          rounded="xl"
          variant="outlined"
          @update:model-value="setSelectedMilitaryOrganization"
        />
      </v-col>
      <v-col align-self="center">
        <h3>Selecione a OM</h3>
      </v-col>
      <v-col v-if="selectedMilitaryOrganization" align-self="center" class="text-right" cols="2">
        <nuxt-img
          :src="`${retrieveMilitaryOrganizationLogo(
            selectedMilitaryOrganization,
            'mini',
            militaryOrganizationStore.militaryOrganizations
          )}`"
          class="text-right pt-auto pb-auto my-auto align-content-center"
          width="35"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
