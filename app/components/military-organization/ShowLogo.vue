<script lang="ts" setup>
  const { selectedMilitaryOrganization } = useMilitaryOrganizations()

  defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      showCancelBtn: boolean
    }
  }>()

  const emit = defineEmits(['close-dialog'])

</script>
<template>
  <v-card
    class="rounded-xl"
    prepend-icon="mdi-image"
    title="Escudo da Organização Militar"
  >
    <v-card-text>
      <v-row>
        <v-col align-self="center" class="text-center">
          <v-img v-if="selectedMilitaryOrganization" :src="selectedMilitaryOrganization.logo" alt="Logo" class="mx-auto"
                 max-width="300px" />

        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="cardProps.showCancelBtn">
      <v-btn
        :text="cardProps.modalTextButton"
        color="secondary"
        rounded="xl"
        variant="tonal"
        @click="emit('close-dialog')"
      />
    </v-card-actions>
  </v-card>
</template>


