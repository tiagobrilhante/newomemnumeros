<script lang="ts" setup>
  const { t } = useI18n()
  const {selectedSection, deleteSection, loading} = useSections()
  const {selectedMilitaryOrganization} = useMilitaryOrganizations()
  const emit = defineEmits(['change-state'])

  const { formProps } = defineProps<{
    formProps: {
      formType: string
      formTextButton: string
      formIcon: string
      btnIcon: string
    }
  }>()

  const handleCancel = () => {
    emit('change-state', 'list')
  }

  const handleDeleteSection = async (id: string) => {
    if (!id) {
      return
    }

    try {
      await deleteSection(id)
      handleCancel()
    } catch (error) {
      console.error('Erro no delete:', error)
    }
  }
</script>

<template>
  <div>
    <v-row>
      <v-col>
        <p class="mb-5">
          <v-icon color="yellow" class="mr-5" icon="mdi-alert"/>

        {{t('confirmDeleteSection')}} {{selectedSection?.acronym}} ({{selectedMilitaryOrganization?.acronym}})
        </p>

        <v-divider />
        <p class="my-5">{{ t('irreversibleAction') }}</p>
        <v-divider />
        <p class="my-5">
          {{ t('consequenceDeleteSection') }}
        </p>

      </v-col>
    </v-row>
    <!-- actions-->
    <v-row>
      <v-col class="text-right">
        <v-btn
          :loading
          :text="formProps.formTextButton"
          class="mr-4 px-5"
          color="error"
          :prepend-icon="formProps.btnIcon"
          rounded="xl"
          variant="elevated"
          @click="handleDeleteSection(selectedSection?.id)"
        />
        <v-btn
          :loading
          :text="t('cancel')"
          class="px-5"
          color="primary"
          prepend-icon="mdi-close"
          rounded="xl"
          variant="elevated"
          @click="handleCancel"

        />
      </v-col>
    </v-row>
  </div>
</template>
