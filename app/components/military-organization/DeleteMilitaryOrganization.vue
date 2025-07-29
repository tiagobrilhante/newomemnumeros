<script lang="ts" setup>

  const {
    selectedMilitaryOrganization, loading,
    deleteMilitaryOrganization,
  } = useMilitaryOrganizations()

  defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      modalIcon: string
      btnIcon: string
      showCancelBtn: boolean
    }
  }>()

  const emit = defineEmits(['close-dialog'])

  const handleDeleteMilitaryOrganization = async (id: string) => {
    if (!id || !selectedMilitaryOrganization.value) return

    try {
      await deleteMilitaryOrganization(id)
      emit('close-dialog')
    } catch (error) {
      console.error('Delete error handled by composable')
    }
  }

</script>
<template>
  <v-card
    :loading class="white-thick-border" rounded="xl"
  >

    <v-card-title class="bg-surface-light pt-4 grey-thick-border-bottom">
      <v-row>
        <v-col cols="10"><v-icon color="yellow" class="mr-3 mt-0" size="small">{{cardProps.modalIcon}}</v-icon> {{ $t(cardProps.modalType) }} {{ $t('leftMenu.militaryOrganization') }}</v-col>
        <v-col class="text-right pr-2 pt-1" cols="2">
          <v-btn icon size="small" variant="text" @click="emit('close-dialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col class="text-justify">
            <p class="mb-5">
              {{ $t('confirmDeleteMilitaryOrganization') }}
              <b> {{ selectedMilitaryOrganization?.name }}?</b>
            </p>
            <v-divider />
            <p class="my-5">{{ $t('irreversibleAction') }}</p>
            <v-divider />
            <p class="my-5">
              {{ $t('consequenceDeleteMilitaryOrganization') }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="bg-surface-light py-4 px-5 grey-thick-border-top">
      <v-spacer />
      <v-btn
        v-if="selectedMilitaryOrganization"
        :loading="loading"
        :text="$t('delete')"
        class="mr-5 px-4"
        color="error"
        :prepend-icon="cardProps.btnIcon"
        rounded="xl"
        variant="elevated"
        @click="handleDeleteMilitaryOrganization(selectedMilitaryOrganization?.id || '')"
      />
      <v-btn
        :text="$t('cancel')"
        class="px-4"
        color="primary"
        prepend-icon="mdi-cancel"
        rounded="xl"
        variant="elevated"
        @click="emit('close-dialog')"
      />
    </v-card-actions>
  </v-card>
</template>
