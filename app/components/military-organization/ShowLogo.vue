<script lang="ts" setup>
  const { t } = useI18n()
  const { selectedMilitaryOrganization, loading } = useMilitaryOrganizations()

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

</script>
<template>
  <v-card
    :loading class="white-thick-border" rounded="xl"
  >

    <v-card-title class="bg-surface-light pt-4 grey-thick-border-bottom">
      <v-row>
        <v-col cols="10">
          <v-icon class="mr-3 mt-0" color="yellow" size="small">{{ cardProps.modalIcon }}</v-icon>
          {{ t('militaryOrganizationBadge') }}
        </v-col>
        <v-col class="text-right pr-2 pt-1" cols="2" v-if="cardProps.showCancelBtn">
          <v-btn icon size="small" variant="text" @click="emit('close-dialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col align-self="center" class="text-center">
          <v-img v-if="selectedMilitaryOrganization" :src="selectedMilitaryOrganization.logo" alt="Logo" class="mx-auto"
                 max-width="300px" />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="cardProps.showCancelBtn" class="bg-surface-light py-4 px-5 grey-thick-border-top">
      <v-btn
        :text="cardProps.modalTextButton"
        class="px-4"
        color="primary"
        prepend-icon="mdi-close"
        rounded="xl"
        variant="elevated"
        @click="emit('close-dialog')"
      />
    </v-card-actions>
  </v-card>
</template>


