<script lang="ts" setup>
  import type { VForm } from 'vuetify/components'

  const { t } = useI18n()

  const {
    createMilitaryOrganization,
    updateMilitaryOrganization,
    deleteMilitaryOrganizationLogo,
    militaryOrganizations,
    selectedMilitaryOrganization,
    loading,
  } = useMilitaryOrganizations()

  const { cardProps } = defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      modalIcon: string
      btnIcon: string
    }
  }>()

  const emit = defineEmits(['close-dialog'])

  const isFather = ref(false)
  const id = ref<string | undefined | null>(null)
  const father = ref<string | undefined>(undefined)
  const name = ref('')
  const color = ref<string | undefined>(undefined)
  const acronym = ref('')
  const changeLogo = ref(false)
  const openDialogDeleteLogo = ref(false)
  const logo = ref('')
  const logoBase = ref('')
  const form = ref<VForm | null>(null)
  const inputProps = reactive({
    label: t('selectMOBadge'),
  })

  const error = ref<{
    msgError: string
    active: boolean
    arrayOfErrors: string[]
  }>({
    msgError: '',
    active: false,
    arrayOfErrors: [],
  })

  // form validations
  const requiredRule = [(v: string) => !!v || `${t('thisField')} ${t('isRequired')}`]

  if (cardProps.modalType === 'edit' && selectedMilitaryOrganization.value) {
    changeLogo.value = false
    id.value = selectedMilitaryOrganization.value?.id
    logoBase.value = selectedMilitaryOrganization.value?.logo ?? '/logos/default/default.png'
    logo.value = selectedMilitaryOrganization.value?.logo ?? '/logos/default/default.png'
    name.value = selectedMilitaryOrganization.value?.name ?? ''
    color.value = selectedMilitaryOrganization.value?.color ?? ''
    acronym.value = selectedMilitaryOrganization.value?.acronym ?? ''
    father.value = selectedMilitaryOrganization.value?.militaryOrganizationId ?? ''

    if (!father.value && !selectedMilitaryOrganization.value?.parentOrganization) {
      isFather.value = true
    }
  }

  // Watch for changes in isFather checkbox to clear father selection
  watch(isFather, (newValue) => {
    if (newValue) {
      father.value = ''
    }
  })

  const filteredMilitaryOrganizations = computed(() => {
    if (!id.value) return militaryOrganizations.value
    return militaryOrganizations.value.filter((mo: militaryOrganization) => mo.id !== id.value)
  })

  const prepareFormData = () => ({
    name: name.value.trim(),
    acronym: acronym.value.trim(),
    color: color.value?.trim() || getRandomColor(),
    militaryOrganizationId: isFather.value ? null : (father.value || null),
  })

  const prepareLogo = (): string | undefined => {
    if (cardProps.modalType === 'add') {
      return logo.value || undefined
    }

    return changeLogo.value ? (logo.value || undefined) : undefined
  }

  const proceedAction = async () => {
    const { valid } = (await form.value?.validate()) || { valid: false }
    if (!valid) return

    try {
      const formData = prepareFormData()
      const logoData = prepareLogo()

      if (cardProps.modalType === 'add') {
        await createMilitaryOrganization({ ...formData, logo: logoData })
      } else {
        await updateMilitaryOrganization({
          id: id.value || undefined,
          ...formData,
          logo: logoData,
        })
      }

      emit('close-dialog')
    } catch (error: any) {
      showError(
        t('errors.operationFailed') || 'Erro ao realizar operação',
        [error?.message || error?.toString() || 'Erro desconhecido'],
      )
    }
  }


  const resetError = () => {
    error.value.msgError = ''
    error.value.active = false
    error.value.arrayOfErrors = []
  }

  const showError = (message: string, details?: string[]) => {
    error.value.msgError = message
    error.value.arrayOfErrors = details || []
    error.value.active = true
  }

  const handleImage = (image: string) => {
    logo.value = image
  }

  const closeChangeLogo = () => {
    changeLogo.value = false
    logo.value = logoBase.value
  }

  const doDeleteMilitaryOrganizationLogo = async () => {
    const selectedOrg = selectedMilitaryOrganization.value
    if (!selectedOrg?.id) return

    try {
      await deleteMilitaryOrganizationLogo(selectedOrg.id)

      openDialogDeleteLogo.value = false
      logo.value = '/logos/default/default.png'
      logoBase.value = '/logos/default/default.png'
    } catch (error: any) {
      showError(
        t('errors.deleteLogoFailed') || 'Erro ao excluir logo',
        [error?.message || error?.toString() || 'Erro desconhecido'],
      )
    }
  }
</script>

<template>
  <v-card :loading class="white-thick-border" rounded="xl">
    <v-form ref="form" lazy-validation @submit.prevent="proceedAction">
      <!-- card title-->
      <v-card-title class="bg-surface-light pt-4">
        <v-row>
          <v-col cols="10"><v-icon class="mr-3 mt-0" size="small">{{cardProps.modalIcon}}</v-icon>{{ t(cardProps.modalType) }} {{ t('leftMenu.militaryOrganization') }}</v-col>
          <v-col class="text-right pr-2 pt-1" cols="2">
            <v-btn icon variant="text" size="small" @click="emit('close-dialog')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- card text-->
      <v-card-text>
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">

              <!--alert errors -->
              <v-alert
                v-if="error.active"
                class="mb-5"
                closable
                rounded="xl"
                type="error"
                @click:close="resetError"
              >
                <p class="pb-3">{{ error.msgError }}</p>
                <ul>
                  <li v-for="whatError in error.arrayOfErrors" :key="whatError">
                    {{ whatError }}
                  </li>
                </ul>
              </v-alert>

              <!-- inputs-->
              <v-row>

                <v-col cols="5">

                  <!-- badge actions-->
                  <v-container fluid class="mt-3">

                    <!-- show badge if edit -->
                    <v-row v-if="!changeLogo && cardProps.modalType === 'edit'" dense>
                      <v-col class="text-center" cols="12">
                        <v-img
:src="logo || '/logos/default/default.png'" alt="image" class="rounded-xl mx-auto"
                               width="200" />
                      </v-col>
                    </v-row>

                    <!-- actions on edit-->
                    <v-row v-if="!changeLogo && cardProps.modalType === 'edit'" no-gutters>
                      <v-col class="text-center">
                        <!-- change-->
                        <v-btn
                          :text="t('changeBadge')"
                          color="primary"
                          rounded="xl"
                          size="small"
                          variant="outlined"
                          @click="changeLogo = true"
                        />

                        <!-- delete-->
                        <v-tooltip :text="t('deleteBadge')" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-if="logo !== '/logos/default/default.png'"
                              class="ml-2"
                              color="error"
                              icon="mdi-delete"
                              rounded="xl"
                              size="x-small"
                              v-bind="props"
                              variant="outlined"
                              @click="openDialogDeleteLogo = true"
                            />
                          </template>
                        </v-tooltip>
                      </v-col>
                    </v-row>

                    <!-- component for input images-->
                    <utils-input-image
                      v-if="cardProps.modalType !== 'edit' || changeLogo"
                      :input-props="inputProps"
                      @handle-image="handleImage"
                    />

                    <!-- cancel changes-->
                    <v-btn
                      v-if="cardProps.modalType === 'edit' && changeLogo"
                      :text="t('cancelBadgeChange')"
                      block
                      class="mt-2"
                      color="warning"
                      rounded="xl"
                      size="small"
                      @click="closeChangeLogo"
                    />

                  </v-container>

                </v-col>

                <v-col cols="7">
                  <v-checkbox v-model="isFather" :label="t('isParentMilitaryOrganization')" hide-details />

                  <!-- MO Selector-->
                  <v-select
                    v-if="!isFather"
                    id="selectedMilitaryOrganization"
                    v-model="father"
                    :items="filteredMilitaryOrganizations"
                    :label="t('parentMilitaryOrganization')"
                    :placeholder="t('selectParentMilitaryOrganization')"
                    class="mb-3"
                    density="compact"
                    item-title="acronym"
                    item-value="id"
                    rounded="xl"
                    variant="outlined"
                  />

                  <!-- Name - full -->
                  <v-text-field
                    id="name"
                    v-model="name"
                    :label="t('fullNameMO')"
                    :placeholder="t('MOName')"
                    :rules="requiredRule"
                    class="mb-3"
                    density="compact"
                    required
                    rounded="xl"
                    variant="outlined"
                    @input="resetError"
                  />

                  <!-- acronym -->
                  <v-text-field
                    id="acronym"
                    v-model="acronym"
                    :label="t('acronym')"
                    :placeholder="t('acronym')"
                    :rules="requiredRule"
                    class="mb-3"
                    density="compact"
                    required
                    rounded="xl"
                    variant="outlined"
                    @input="resetError"
                  />

                  <!--color-->
                  <span class="ml-5 text-caption">{{ t('moColorSelect') }}</span>
                  <v-color-picker
                    v-model="color"
                    class="grey-thick-border pa-3 mt-2"
                    height="auto"
                    hide-inputs
                    landscape
                    mode="hex"
                    rounded="xl"
                    show-swatches
                    width="auto"
                  />

                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- actions-->
      <v-card-actions class="bg-surface-light py-4 px-5">
        <v-spacer />

        <!-- submit-->
        <v-btn
          :text="cardProps.modalTextButton"
          color="primary"
          rounded="xl"
          type="submit"
          :prepend-icon="cardProps.btnIcon"
          class="mr-5 px-4"
          variant="elevated"
        />

        <!-- cancel-->
        <v-btn
          :text="t('cancel')"
          color="error"
          class="px-4"
          prepend-icon="mdi-cancel"
          rounded="xl"
          variant="elevated"
          @click="emit('close-dialog')"
        />
      </v-card-actions>

    </v-form>
  </v-card>

  <!-- dialog for logo exclusion-->
  <v-dialog
    v-if="openDialogDeleteLogo && selectedMilitaryOrganization"
    v-model="openDialogDeleteLogo"
    max-width="30%"
    persistent
  >
    <v-card
      :title="t('deleteMOLogo')"
      class="rounded-xl"
      prepend-icon="mdi-alert"
    >
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col class="text-justify">
              <p>
                {{ t('confirmDeleteMilitaryLogo') }}<br>
                <b>{{ t('leftMenu.militaryOrganization') }}: </b>
                {{ selectedMilitaryOrganization.name }}
              </p>
              <br>
              <hr>
              <br>
              <p>{{ t('irreversibleAction') }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer />
        <v-btn
          v-if="selectedMilitaryOrganization"
          :loading="loading"
          :text="t('delete')"
          color="error"
          prepend-icon="mdi-alert"
          rounded="xl"
          variant="elevated"
          @click="doDeleteMilitaryOrganizationLogo()"
        />
        <v-btn
          :text="t('cancel')"
          class="mr-8"
          color="secondary"
          rounded="xl"
          variant="tonal"
          @click="openDialogDeleteLogo = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

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
