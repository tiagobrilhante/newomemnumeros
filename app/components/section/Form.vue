<script lang="ts" setup>
  import type { VForm } from 'vuetify/components'

  const { t } = useI18n()

  const { selectedMilitaryOrganization, loading: moLoading } = useMilitaryOrganizations()
  const { createSection, selectedSection, updateSection, loading: sectionsLoading, error } = useSections()
  const loading = computed(() => moLoading.value || sectionsLoading.value)
  const localErrors = ref<string[]>([])
  const id = ref<string | undefined | null>(null)
  const name = ref('')
  const acronym = ref('')
  const emit = defineEmits(['change-state'])
  const form = ref<VForm | null>(null)

  const handleCancel = () => {
    emit('change-state', 'list')
  }

  const requiredRule = [(v: string) => !!v || `${t('thisField')} ${t('isRequired')}`]

  const { formProps } = defineProps<{
    formProps: {
      formType: string
      formTextButton: string
      formIcon: string
      btnIcon: string
    }
  }>()

  if (formProps.formType === 'edit' && selectedSection && selectedSection.value) {
    id.value = selectedSection.value.id
    name.value = selectedSection.value.name
    acronym.value = selectedSection.value.acronym
  }

  const proceedToAction = async () => {
    localErrors.value = []

    const { valid } = (await form.value?.validate()) || { valid: false }
    if (!valid) {
      localErrors.value.push(t('validation.fillRequiredFields'))
      return
    }

    if (!selectedMilitaryOrganization.value || !selectedMilitaryOrganization.value.id) {
      localErrors.value.push(t('validation.noMilitaryOrganizationSelected'))
      return
    }

    if (name.value.trim().length < 3) {
      localErrors.value.push(t('name') + ' ' + t('mustContain')+ ' ' + t('atLeast') + ' 3 ' +t('characters'))
    }

    if (acronym.value.trim().length < 2) {
      localErrors.value.push(t('acronym') + ' ' + t('mustContain')+ ' ' + t('atLeast') + ' 2 ' +t('characters'))
    }

    if (localErrors.value.length > 0) {
      return
    }

    const formData = {
      name: name.value,
      acronym: acronym.value,
      militaryOrganizationId: selectedMilitaryOrganization.value.id,
    }

    try {
      if (formProps.formType === 'add') {
        await createSection(formData)
      } else {
        if (!id.value) {
          localErrors.value.push(t('validSectionRequiredToEdit'))
          return
        }
        await updateSection({
          id: id.value!,
          ...formData,
        })
      }

      handleCancel()
    } catch (error: any) {
      console.error('Erro no formulário de seção:', error)
      localErrors.value.push(error?.message || t('errors.genericError'))
    }
  }

</script>

<template>

  <v-form ref="form" lazy-validation @submit.prevent="proceedToAction">

    <!-- title info-->
    <v-row>
      <v-col cols="10"
      > {{ formProps.formTextButton }} {{ t('section') }} -
        <b>{{ t('mo') }}: {{ selectedMilitaryOrganization?.acronym }} </b>
      </v-col>
    </v-row>

    <!-- form inputs -->
    <v-row>
      <v-col>
        <!-- error messages-->
        <v-alert
          v-if="error || localErrors.length > 0"
          class="mb-5"
          closable
          rounded="xl"
          type="error"
        >
          <p class="pb-3 text-uppercase font-weight-bold">{{ t('error') }}</p>
          <ul>
            <li v-if="error">{{ error }}</li>
            <li v-for="localError in localErrors" :key="localError">{{ localError }}</li>
          </ul>
        </v-alert>

        <v-row>
          <v-col>
            <v-img
              :alt="selectedMilitaryOrganization?.logo === '/logos/default/default.png' ? 'Sem Logo cadastrado' : `Logo ${selectedMilitaryOrganization?.acronym}`"
              :src="selectedMilitaryOrganization?.logo"
              width="60%"
              class="ma-auto"

            />
          </v-col>
          <v-col cols="9">

            <!-- name -->
            <v-text-field
              id="name"
              v-model="name"
              :label="t('sectionFullName')"
              :placeholder="t('sectionFullName')"
              :rules="requiredRule"
              class="mb-5"
              density="compact"
              required
              rounded="xl"
              variant="outlined"
            />

            <!-- acronym -->
            <v-text-field
              id="acronym"
              v-model="acronym"
              :label="t('acronym')"
              :placeholder="t('acronym')"
              :rules="requiredRule"
              density="compact"
              required
              rounded="xl"
              variant="outlined"
            />

          </v-col>
        </v-row>


      </v-col>
    </v-row>

    <v-spacer />

    <!-- actions-->
    <v-row>
      <v-col class="text-right">
        <v-btn
          :loading
          :text="formProps.formTextButton"
          class="mr-4 px-5"
          color="primary"
          :prepend-icon="formProps.btnIcon"
          rounded="xl"
          type="submit"
          variant="tonal"
        />
        <v-btn
          :loading
          :text="t('cancel')"
          class="px-5"
          color="secondary"
          prepend-icon="mdi-close"
          rounded="xl"
          variant="tonal"
          @click="handleCancel"

        />
      </v-col>
    </v-row>

  </v-form>

</template>

<style scoped>
  ul {
    list-style-type: disc !important;
    padding-left: 20px !important;
  }

  li {
    margin-bottom: 5px !important;
  }
</style>
