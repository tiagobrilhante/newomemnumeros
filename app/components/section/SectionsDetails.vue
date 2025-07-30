<script lang="ts" setup>
  const { selectedMilitaryOrganization, loading } = useMilitaryOrganizations()

  defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      modalIcon: string
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
          {{ $t('sectionsDetails') }}
        </v-col>
        <v-col v-if="cardProps.showCancelBtn" class="text-right pr-2 pt-1" cols="2">
          <v-btn icon size="small" variant="text" @click="emit('close-dialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pb-0 pt-0">
      <v-row dense>
        <v-col align-self="center" class="text-center">

          <template v-if="selectedMilitaryOrganization?.sections?.length">

          <v-card color="grey-darken-3" v-for="section in selectedMilitaryOrganization?.sections" class="my-3" density="compact">
            <v-card-text>
              <h3 class="mb-2">{{ section.name }} </h3>
              <v-divider/>
              <h4 class="mt-2">{{ section.acronym }}</h4>
            </v-card-text>
          </v-card>
          </template>
          <span v-else>{{ $t('noSectionsFound') }}</span>
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


