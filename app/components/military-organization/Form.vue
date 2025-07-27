<script lang="ts" setup>
    import InputImage from '~/components/utils/InputImage.vue'
  const {createMilitaryOrganization, updateMilitaryOrganization, militaryOrganizations, loading} = useMilitaryOrganizations()


  const isFather = ref(false)
  const id = ref(0)
  const name = ref('')
  const color = ref('')
  const acronym = ref('')
  const changeLogo = ref(false)
  const openDialogDeleteLogo = ref(false)
  const logo = ref('')
  const logoBase = ref('')
  const logoToSend = ref<string | null>(null)
  const error = ref<{
    msgError: string
    active: boolean
    arrayOfErrors: string[]
  }>({
    msgError: '',
    active: false,
    arrayOfErrors: [],
  })
  const { cardProps } = defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
    }
  }>()

  const selectedMilitaryOrganization = ref<string | null>(null)

  const adminMilitaryOrganizationStore = useMilitaryOrganizationStore()

  const isComponentVisible = ref(false)


  watch(
    () => adminMilitaryOrganizationStore.selectedMilitaryOrganization,
    (newVal) => {
      if (newVal) {
        isComponentVisible.value = true
        id.value = newVal.id
        name.value = newVal.name
        acronym.value = newVal.acronym
        logo.value = newVal.logo
        color.value = newVal.color
        selectedMilitaryOrganization.value = newVal.militaryOrganizationId
        isFather.value = !newVal.militaryOrganizationId
      }
    },
    { immediate: true }
  )

  if (cardProps.modalType !== 'Edição') {
    changeLogo.value = false
  }

  if (cardProps.modalType === 'Edição') {
    changeLogo.value = false
    logoBase.value = logo.value
  }


  const filteredMilitaryOrganizations = computed(() => {
    return militaryOrganizations.value.filter((org: militaryOrganization) => org.id !== id.value)
  })

  const proceedAction = async () => {

    if (!name.value || !acronym.value) {
      const specifiedErrors = []

      if (!name.value) {
        specifiedErrors.push('Por favor, preencha o nome da Organização Militar.')
      }

      if (!acronym.value) {
        specifiedErrors.push('Por favor, preencha a sigla da Organização Militar.')
      }

      if (!isFather.value && !selectedMilitaryOrganization.value) {
        specifiedErrors.push('Por favor, selecione a OM pai.')
      }

      // TODO eu posso criar um componente para exibir os erros
      error.value.active = true
      error.value.msgError = 'Por favor, preencha todos os campos corretamente.'
      error.value.arrayOfErrors = specifiedErrors
      return
    }

    try {
      if (isFather.value) {
        selectedMilitaryOrganization.value = null
      }

      if (cardProps.modalType === 'Cadastro') {
        await createMilitaryOrganization({
          name: name.value.trim(),
          acronym: acronym.value.trim(),
          color: color.value.trim(),
          militaryOrganizationId: selectedMilitaryOrganization.value ?? null,
          logo: logo.value ?? null,
        })
      } else {
        logoToSend.value = logo.value
        if (!changeLogo.value) {
          logoToSend.value = null
        }

        await updateMilitaryOrganization({
          id: id.value,
          name: name.value.trim(),
          acronym: acronym.value.trim(),
          color: color.value.trim(),
          militaryOrganizationId: selectedMilitaryOrganization.value || null,
          logo: changeLogo.value ? (logoToSend.value ?? undefined) : undefined,
        })

        // TODO criar modulo para abstrair a chamada pura nos componentes

      }

      emit('close-dialog')
    } catch (error) {
      console.error('Error ao realizar a operação:', error)
    } finally {
      console.log('teste')
    }
  }

  const emit = defineEmits(['close-dialog'])

  const inputProps = reactive({
    label: 'Selecione o distintivo da Om',
  })

  const resetError = () => {
    error.value.msgError = ''
    error.value.active = false
    error.value.arrayOfErrors = []
  }

  const handleImage = (image: string) => {
    logo.value = image
  }

  const closeChangeLogo = () => {
    changeLogo.value = false
    logo.value = logoBase.value
  }

  // corrigir
  const deleteMilitaryOrganizationLogo = async (id: number) => {
    try {
      await adminMilitaryOrganizationStore.deleteMilitaryOrganizationLogo(id)

      openDialogDeleteLogo.value = false

      logo.value = '/logos/default/default.png'
    } catch (error) {
      console.error('Error ao realizar a operação:', error)
    } finally {
      console.log('teste')
    }
  }
</script>

<template>
  <v-card rounded="xl">
    <v-form @submit.prevent="proceedAction">
      <v-card-title>
        <v-row>
          <v-col cols="10">{{ $t(cardProps.modalType) }}  {{$t('leftMenu.militaryOrganization') }} </v-col>
          <v-col class="text-right pr-0 pt-0" cols="2">
            <v-btn icon variant="plain" @click="emit('close-dialog')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <!-- Exibe mensagem de erro, se houver -->
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
                <v-col cols="4">
                  <!--cor-->
                  <h4>Selecione a cor da OM</h4>
                  <v-color-picker
                    v-model="color"
                    hide-inputs
                    mode="hex"
                    rounded="l"
                    show-swatches
                    width="auto"
                  />
                </v-col>
                <v-col cols="8">
                  <v-checkbox v-model="isFather" hide-details label="é Om pai" />

                  <!-- Select de Om -->
                  <v-select
                    v-if="!isFather"
                    id="selectedMilitaryOrganization"
                    v-model="selectedMilitaryOrganization"
                    :items="filteredMilitaryOrganizations"
                    density="compact"
                    item-title="acronym"
                    item-value="id"
                    label="OM pai"
                    placeholder="Selecione a om pai"
                    variant="outlined"
                  />

                  <!-- Campo de nome -->
                  <v-text-field
                    id="name"
                    v-model="name"
                    density="compact"
                    label="Nome da Organização Militar (completo)"
                    placeholder="Nome da Om"
                    required
                    variant="outlined"
                    @input="resetError"
                  />

                  <!-- Campo Sigla -->
                  <v-text-field
                    id="acronym"
                    v-model="acronym"
                    density="compact"
                    label="Sigla da Om"
                    placeholder="Sigla"
                    required
                    variant="outlined"
                    @input="resetError"
                  />

                  <!--TODO tenho que fazer o logo-->
                  <!--  <nuxt-img alt="image" height="200" src="/logos/default/default.png" width="200" />-->

                  <v-container fluid>
                    <v-row v-if="!changeLogo && cardProps.modalType === 'Edição'">
                      <v-col class="text-center" cols="12">
                        <nuxt-img :src="logo" alt="image" class="rounded-xl" width="200" />
                      </v-col>
                    </v-row>

                    <v-row v-if="!changeLogo && cardProps.modalType === 'Edição'" no-gutters>
                      <v-col class="text-center">
                        <v-btn
                          color="primary"
                          rounded="xl"
                          size="small"
                          variant="outlined"
                          @click="changeLogo = true"
                          >Alterar Escudo
                        </v-btn>
                        <v-btn
                          v-if="logo !== '/logos/default/default.png'"
                          class="ml-2"
                          color="error"
                          rounded="xl"
                          size="small"
                          variant="outlined"
                          @click="openDialogDeleteLogo = true"
                        >
                          <template #default>
                            <v-icon>mdi-delete</v-icon>
                          </template>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <InputImage
                      v-if="cardProps.modalType !== 'Edição' || changeLogo"
                      :input-props="inputProps"
                      @handle-image="handleImage"
                    />
                    <!-- cancela a alteração do escudo-->
                    <v-btn
                      v-if="cardProps.modalType === 'Edição' && changeLogo"
                      block
                      class="mt-2"
                      color="warning"
                      size="small"
                      @click="closeChangeLogo"
                      >Cancelar Alteração do Escudo da OM
                    </v-btn>
                  </v-container>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :text="cardProps.modalTextButton"
          color="primary"
          rounded="xl"
          type="submit"
          variant="tonal"
        />
        <v-btn
          color="secondary"
          rounded="xl"
          text="Cancelar"
          variant="tonal"
          @click="emit('close-dialog')"
        />
      </v-card-actions>
    </v-form>
  </v-card>

  <v-dialog
    v-if="openDialogDeleteLogo && adminMilitaryOrganizationStore.selectedMilitaryOrganization"
    v-model="openDialogDeleteLogo"
    max-width="30%"
    persistent
  >
    <v-card
      class="rounded-xl"
      prepend-icon="mdi-alert"
      title="Exclusão de logo de Organização Militar"
    >
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col class="text-justify">
              <p>
                Você tem certeza que deseja excluir o logo da Organização Militar:
                <b> {{ adminMilitaryOrganizationStore.selectedMilitaryOrganization.name }}?</b>
              </p>
              <br >
              <hr >
              <br >
              <p>Essa ação é irreversível.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer />
        <v-btn
          v-if="adminMilitaryOrganizationStore.selectedMilitaryOrganization"
          :loading="loading"
          color="error"
          prepend-icon="mdi-alert"
          rounded="xl"
          text="Excluir"
          variant="elevated"
          @click="
            deleteMilitaryOrganizationLogo(
              adminMilitaryOrganizationStore.selectedMilitaryOrganization.id
            )
          "
        />
        <v-btn
          class="mr-8"
          color="secondary"
          rounded="xl"
          text="Cancelar"
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
