<script lang="ts" setup>
  import type { VForm } from 'vuetify/components'

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
    }
  }>()

  const adminMilitaryOrganizationStore = useMilitaryOrganizationStore()
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
    label: $t('selectMOBadge'),
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
  const requiredRule = [(v: string) => !!v || `${$t('thisField')} ${$t('isRequired')}`]

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

  const filteredMilitaryOrganizations = computed(() => {
    if (!id.value) return militaryOrganizations.value
    return militaryOrganizations.value.filter((mo: militaryOrganization) => mo.id !== id.value)
  })

  const prepareFormData = () => ({
    name: name.value.trim(),
    acronym: acronym.value.trim(),
    color: color.value?.trim() || getRandomColor(),
    militaryOrganizationId: father.value || null,
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
          logo: logoData
        })
      }

      emit('close-dialog')
    } catch (error: any) {
      showError(
        $t('errors.operationFailed') || 'Erro ao realizar operação',
        [error?.message || error?.toString() || 'Erro desconhecido']
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
        $t('errors.deleteLogoFailed') || 'Erro ao excluir logo',
        [error?.message || error?.toString() || 'Erro desconhecido']
      )
    }
  }
</script>

<template>
  <v-card rounded="xl">
    <v-form ref="form" lazy-validation @submit.prevent="proceedAction">
      <!-- card title-->
      <v-card-title>
        <v-row>
          <v-col cols="10">{{ $t(cardProps.modalType) }} {{ $t('leftMenu.militaryOrganization') }}</v-col>
          <v-col class="text-right pr-0 pt-0" cols="2">
            <v-btn icon variant="plain" @click="emit('close-dialog')">
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
              <!-- Error Alert TODO revisar -->
              <v-alert
                v-if="error.active"
                class="mb-5"
                closable
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

              <v-row>

                <!--color-->
                <v-col cols="4">
                  <h4>{{ $t('moColorSelect') }}</h4>
                  <v-color-picker
                    v-model="color"
                    hide-inputs
                    mode="hex"
                    rounded="l"
                    show-swatches
                    width="auto"
                  />
                </v-col>

                <!-- inputs-->
                <v-col cols="8">
                  <v-checkbox v-model="isFather" :label="$t('isParentMilitaryOrganization')" hide-details />

                  <!-- MO Selector-->
                  <v-select
                    v-if="!isFather"
                    id="selectedMilitaryOrganization"
                    v-model="father"
                    :items="filteredMilitaryOrganizations"
                    :label="$t('parentMilitaryOrganization')"
                    :placeholder="$t('selectParentMilitaryOrganization')"
                    class="mb-3"
                    density="compact"
                    item-title="acronym"
                    item-value="id"
                    variant="outlined"
                  />

                  <!-- Name - full -->
                  <v-text-field
                    id="name"
                    v-model="name"
                    :label="$t('fullNameMO')"
                    :placeholder="$t('MOName')"
                    :rules="requiredRule"
                    class="mb-3"
                    density="compact"
                    required
                    variant="outlined"
                    @input="resetError"
                  />

                  <!-- acronym -->
                  <v-text-field
                    id="acronym"
                    v-model="acronym"
                    :label="$t('acronym')"
                    :placeholder="$t('acronym')"
                    :rules="requiredRule"
                    class="mb-3"
                    density="compact"
                    required
                    variant="outlined"
                    @input="resetError"
                  />

                  <!-- badge actions-->
                  <v-container fluid>

                    <!-- show badge if edit -->
                    <v-row v-if="!changeLogo && cardProps.modalType === 'edit'">
                      <v-col class="text-center" cols="12">
                        <v-img :src="logo || '/logos/default/default.png'" alt="image" class="rounded-xl mx-auto"
                               width="200" />
                      </v-col>
                    </v-row>

                    <!-- actions on edit-->
                    <v-row v-if="!changeLogo && cardProps.modalType === 'edit'" no-gutters>
                      <v-col class="text-center">
                        <!-- change-->
                        <v-btn
                          :text="$t('changeBadge')"
                          color="primary"
                          rounded="xl"
                          size="small"
                          variant="outlined"
                          @click="changeLogo = true"
                        >
                        </v-btn>

                        <!-- delete-->
                        <v-tooltip :text="$t('deleteBadge')" location="top">
                          <template v-slot:activator="{ props }">
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
                      block
                      rounded="xl"
                      class="mt-2"
                      color="warning"
                      size="small"
                      @click="closeChangeLogo"
                      :text="$t('cancelBadgeChange')"
                    />

                  </v-container>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- actions-->
      <v-card-actions>
        <v-spacer />

        <!-- submit-->
        <v-btn
          :text="cardProps.modalTextButton"
          color="primary"
          rounded="xl"
          type="submit"
          variant="tonal"
        />

        <!-- cancel-->
        <v-btn
          :text="$t('cancel')"
          color="secondary"
          rounded="xl"
          variant="tonal"
          @click="emit('close-dialog')"
        />
      </v-card-actions>

    </v-form>
  </v-card>

  <!-- dialog for logo exclusion-->
  <v-dialog
    v-if="openDialogDeleteLogo && adminMilitaryOrganizationStore.selectedMilitaryOrganization"
    v-model="openDialogDeleteLogo"
    max-width="30%"
    persistent
  >
    <v-card
      :title="$t('deleteMOLogo')"
      class="rounded-xl"
      prepend-icon="mdi-alert"
    >
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col class="text-justify">
              <p>
                {{ $t('confirmDeleteMilitaryLogo') }}<br>
                <b>{{ $t('leftMenu.militaryOrganization') }}: </b> {{ adminMilitaryOrganizationStore.selectedMilitaryOrganization.name }}
              </p>
              <br>
              <hr>
              <br>
              <p>{{ $t('irreversibleAction') }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer />
        <v-btn
          v-if="adminMilitaryOrganizationStore.selectedMilitaryOrganization"
          :loading="loading"
          :text="$t('delete')"
          color="error"
          prepend-icon="mdi-alert"
          rounded="xl"
          variant="elevated"
          @click="doDeleteMilitaryOrganizationLogo()"
        />
        <v-btn
          :text="$t('cancel')"
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
