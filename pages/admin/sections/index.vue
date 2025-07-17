<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import type { VDataTable, VSelect } from 'vuetify/components'
  import { useSectionStore } from '~/stores/section.store'
  import { useMilitaryOrganizationStore } from '~/stores/military-organization.store'
  import Form from '~/components/section/Form.vue'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import { retrieveMilitaryOrganizationAcronym } from '~/utils/retrieve-military-organization-acronym'

  useHead({
    title: 'Gerenciamento de Seções',
  })

  const adminSectionStore = useSectionStore()
  const militaryOrganizationStore = useMilitaryOrganizationStore()
  const selectedMilitaryOrganization = ref<number | null>(null)
  const titleVariables = {
    title: 'Gerenciamento de Seções',
    icon: 'mdi-lan',
  }

  const dialog = ref(false)
  const loadingBtn = ref(false)

  const CARD_PROPS = reactive<{
    modalType: string
    modalTextButton: string
    selectedMilitaryOrganizationId: number | null
  }>({
    modalType: '',
    modalTextButton: '',
    selectedMilitaryOrganizationId: null,
  })

  const openModal = async (type: string, id?: number) => {
    CARD_PROPS.modalType = type
    dialog.value = true
    if (type === 'Cadastro') {
      CARD_PROPS.modalTextButton = 'Cadastrar'
      CARD_PROPS.selectedMilitaryOrganizationId = selectedMilitaryOrganization.value ?? null
      adminSectionStore.clearSelectedSection()
    } else if (type === 'Edição') {
      CARD_PROPS.modalTextButton = 'Editar'
      CARD_PROPS.selectedMilitaryOrganizationId = selectedMilitaryOrganization.value ?? null
      if (id !== undefined) {
        await adminSectionStore.findSection(id)
        const selectedSection = adminSectionStore.selectedSection
        if (selectedSection) {
          adminSectionStore.setSelectedSection(selectedSection)
        }
      }
    } else {
      if (!id) return
      CARD_PROPS.modalTextButton = 'Excluir'
      await adminSectionStore.findSection(id)
      const selectedSection = adminSectionStore.selectedSection
      if (selectedSection) {
        adminSectionStore.setSelectedSection(selectedSection)
      }
    }
  }

  const deleteSection = async (id: number) => {
    loadingBtn.value = true
    await adminSectionStore
      .deleteSection(id)
      .then(() => {
        toast('Seção excluída com Sucesso!', {
          theme: 'dark',
          type: 'success',
          dangerouslyHTMLString: true,
        })
      })
      .finally(() => {
        loadingBtn.value = false
        dialog.value = false
      })
  }

  onMounted(() => {
    // adminSectionStore.fetchSectionsByMilitaryOrganizationId(selectedMilitaryOrganization.value)
    militaryOrganizationStore.fetchMilitaryOrganizations()
  })

  const getSectionsByOmId = async () => {
    if (selectedMilitaryOrganization.value) {
      await adminSectionStore.fetchSectionsByMilitaryOrganizationId(
        Number(selectedMilitaryOrganization.value)
      )
    }
  }

  const closeDialog = () => {
    adminSectionStore.clearSelectedSection()
    dialog.value = false
  }

  const headers: VDataTable['$props']['headers'] = [
    { title: 'Nome', key: 'name' },
    { title: 'Sigla', key: 'acronym' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseTitle :title-variables="titleVariables" />

        <v-card class="pb-0 mb-4 border border-solid border-opacity-100" rounded="xl">
          <v-container class="pb-0" fluid>
            <v-row>
              <v-col class="align-content-center">
                <v-select
                  v-if="militaryOrganizationStore.militaryOrganizations"
                  v-model="selectedMilitaryOrganization"
                  :items="militaryOrganizationStore.militaryOrganizations"
                  class="pt-1"
                  density="compact"
                  item-title="acronym"
                  item-value="id"
                  label="Organização Militar"
                  placeholder="Selecione a organização Militar"
                  required
                  rounded="xl"
                  variant="outlined"
                  @update:model-value="getSectionsByOmId"
                />
              </v-col>
              <v-col class="align-content-center">
                <h3 class="pb-4">Selecione a OM</h3>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card
          v-if="selectedMilitaryOrganization"
          class="border border-solid border-opacity-100"
          rounded="xl"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span
              >Seções Cadastradas -
              {{
                retrieveMilitaryOrganizationAcronym(
                  selectedMilitaryOrganization,
                  militaryOrganizationStore.militaryOrganizations
                )
              }}</span
            >
            <v-btn
              :loading="adminSectionStore.loading"
              color="primary"
              prepend-icon="mdi-plus-circle"
              rounded="xl"
              size="small"
              text="Criar Seção"
              @click="openModal('Cadastro')"
            />
          </v-card-title>

          <v-card-text>
            <v-alert v-if="adminSectionStore.error" class="mb-4 text-center" type="error">
              {{ adminSectionStore.error }}
            </v-alert>

            <v-data-table
              v-else
              :headers="headers"
              :items="adminSectionStore.sections"
              :loading="adminSectionStore.loading"
              density="compact"
              item-value="id"
            >
              <template #[`item.actions`]="{ item }">
                <v-btn
                  class="mr-3"
                  color="primary"
                  prepend-icon="mdi-account-edit"
                  rounded="xl"
                  size="x-small"
                  text="Editar"
                  variant="outlined"
                  @click="openModal('Edição', item.id)"
                >
                  <template #prepend>
                    <v-icon class="pt-1" />
                  </template>
                </v-btn>

                <v-btn
                  color="error"
                  prepend-icon="mdi-delete"
                  rounded="xl"
                  size="x-small"
                  variant="outlined"
                  @click="openModal('Exclusão', item.id)"
                >
                  <template #prepend>
                    <v-icon class="pt-1" />
                  </template>
                  Excluir
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="30%" persistent>
      <Form
        v-if="CARD_PROPS.modalType === 'Cadastro' || CARD_PROPS.modalType === 'Edição'"
        :card-props="CARD_PROPS"
        @close-dialog="closeDialog"
      />

      <!-- exclui seção -->
      <v-card
        v-else-if="CARD_PROPS.modalType === 'Exclusão' && adminSectionStore.selectedSection"
        :title="CARD_PROPS.modalType + ' de Seção'"
        class="rounded-xl"
        prepend-icon="mdi-alert"
      >
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col class="text-justify">
                <p>
                  Você tem certeza que deseja excluir a Organização Militar:
                  <b> {{ adminSectionStore.selectedSection.name }}?</b>
                </p>
                <br >
                <hr >
                <br >
                <p>Essa ação é irreversível.</p>

                <br >
                <hr >
                <br >
                <p>As contas vinculadas a essa Seção, deixarão de ter acesso ao sistema.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            v-if="adminSectionStore.selectedSection?.id !== undefined"
            :loading="loadingBtn"
            :text="CARD_PROPS.modalTextButton"
            color="error"
            prepend-icon="mdi-alert"
            rounded="xl"
            variant="elevated"
            @click="deleteSection(adminSectionStore.selectedSection.id!)"
          />
          <v-btn
            class="mr-8"
            color="secondary"
            rounded="xl"
            text="Cancelar"
            variant="tonal"
            @click="closeDialog"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
