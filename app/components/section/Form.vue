<script lang="ts" setup>
  import { useSectionStore } from '~/stores/section.store'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import type { section, createdSection, updatedSection, militaryOrganization } from '~/types/core/organization'
  import { sectionsService } from '~/services/sectionsService'
  import { militaryOrganizationService } from '~/services/militaryOrganization.service'
  import { retrieveMilitaryOrganizationAcronym } from '~/utils/retrieve-military-organization-acronym'

  const loading = ref(false)
  const id = ref<number | null>(null)
  const name = ref('')
  const acronym = ref('')
  const error = ref<{
    msgError: string
    active: boolean
    arrayOfErrors: string[]
  }>({
    msgError: '',
    active: false,
    arrayOfErrors: [],
  })

  const sections = ref<section[]>([])
  const militaryOrganizations = ref<militaryOrganization[]>([])

  militaryOrganizations.value =
    (await militaryOrganizationService.findAll()) as militaryOrganization[]

  const adminSectionStore = useSectionStore()

  const isComponentVisible = ref(false)

  sections.value = (await sectionsService.findAll()) as section[]

  watch(
    () => adminSectionStore.selectedSection,
    (newVal) => {
      if (newVal) {
        isComponentVisible.value = true
        id.value = newVal.id ?? null
        name.value = newVal.name
        acronym.value = newVal.acronym
      }
    },
    { immediate: true }
  )

  const proceedAction = async () => {
    loading.value = true

    if (!name.value || !acronym.value) {
      const specifiedErrors = []

      if (!name.value) {
        specifiedErrors.push('Por favor, preencha o nome da Seção.')
      }

      if (!acronym.value) {
        specifiedErrors.push('Por favor, preencha a sigla da Seção.')
      }

      // TODO eu posso criar um componente para exibir os erros
      error.value.active = true
      error.value.msgError = 'Por favor, preencha todos os campos corretamente.'
      error.value.arrayOfErrors = specifiedErrors
      loading.value = false
      return
    }

    try {
      if (cardProps.modalType === 'Cadastro') {
        const newSection: createdSection = {
          name: name.value.trim(),
          acronym: acronym.value.trim(),
          militaryOrganizationId: selectedMilitaryOrganization!,
        }
        await adminSectionStore.addSection(newSection)

        toast('Seção cadastrada com sucesso!', {
          theme: 'dark',
          type: 'success',
          dangerouslyHTMLString: true,
        })
      } else {
        const updatedSection: updatedSection = {
          id: id.value!,
          name: name.value.trim(),
          acronym: acronym.value.trim(),
          militaryOrganizationId: selectedMilitaryOrganization!,
        }
        await adminSectionStore.updateSection(updatedSection)

        toast('Seção alterada com sucesso!', {
          theme: 'dark',
          type: 'success',
          dangerouslyHTMLString: true,
        })
      }

      emit('close-dialog')
    } catch (error) {
      console.error('Error ao realizar a operação:', error)
      toast('Houve um erro ao processar a operação! <br>' + error, {
        theme: 'dark',
        type: 'error',
        dangerouslyHTMLString: true,
      })
    } finally {
      loading.value = false
    }
  }

  const emit = defineEmits(['close-dialog'])

  const { cardProps } = defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      selectedMilitaryOrganizationId: number | null
    }
  }>()

  const resetError = () => {
    error.value.msgError = ''
    error.value.active = false
    error.value.arrayOfErrors = []
  }

  const selectedMilitaryOrganization = cardProps.selectedMilitaryOrganizationId
</script>

<template>
  <v-card>
    <v-form @submit.prevent="proceedAction">
      <v-card-title>
        <v-row>
          <v-col cols="10"
            >{{ cardProps.modalType }} de Seção <br >
            <b>OM: </b>
            <span v-if="cardProps.selectedMilitaryOrganizationId"
              >{{
                retrieveMilitaryOrganizationAcronym(
                  cardProps.selectedMilitaryOrganizationId,
                  militaryOrganizations
                )
              }}
            </span>
          </v-col>
          <v-col class="text-right pr-0 pt-0" cols="2">
            <v-btn icon variant="plain" @click="emit('close-dialog')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col>
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

              <!-- Campo de nome -->
              <v-text-field
                id="name"
                v-model="name"
                density="compact"
                label="Nome da Seção (completo)"
                placeholder="Nome da Seção"
                required
                variant="outlined"
                @input="resetError"
              />

              <!-- Campo Sigla -->
              <v-text-field
                id="acronym"
                v-model="acronym"
                density="compact"
                label="Sigla da Seção"
                placeholder="Sigla"
                required
                variant="outlined"
                @input="resetError"
              />
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
