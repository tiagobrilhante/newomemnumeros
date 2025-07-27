<script setup lang="ts">

  const { selectedMilitaryOrganization, loading,
    deleteMilitaryOrganization} = useMilitaryOrganizations()

  defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      showCancelBtn: boolean
    }
  }>()

  const emit = defineEmits(['close-dialog'])

  const handleDeleteMilitaryOrganization = async (id: string) => {

    try {
      await deleteMilitaryOrganization(id.toString())
      emit('close-dialog')
    } catch (error) {
      console.error('Delete error handled by composable')
    }
  }

</script>
<template>
  <v-card
    :title="cardProps.modalType + ' de Organização Militar'"
    class="rounded-xl"
    prepend-icon="mdi-alert"
  >
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col class="text-justify">
            <p>
              Você tem certeza que deseja excluir a Organização Militar:
              <b> {{ selectedMilitaryOrganization?.name }}?</b>
            </p>
            <br>
            <hr>
            <br>
            <p>Essa ação é irreversível.</p>

            <br>
            <hr>
            <br>
            <p>
              As contas vinculadas a essa Organização militar, deixarão de ter acesso ao
              sistema.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pb-4">
      <v-spacer />
      <v-btn
        v-if="selectedMilitaryOrganization"
        :loading="loading"
        :text="cardProps.modalTextButton"
        color="error"
        prepend-icon="mdi-alert"
        rounded="xl"
        variant="elevated"
        @click="
              handleDeleteMilitaryOrganization(
                selectedMilitaryOrganization.id
              )
            "
      />
      <v-btn
        class="mr-8"
        color="secondary"
        rounded="xl"
        text="Cancelar"
        variant="tonal"
        @click="emit('close-dialog')"
      />
    </v-card-actions>
  </v-card>
</template>

