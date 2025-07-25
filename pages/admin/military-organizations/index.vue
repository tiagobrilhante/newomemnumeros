<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import type { VDataTable } from 'vuetify/components'
  import Form from '~/components/military-organization/Form.vue'
  import { retrieveMiniImage } from '~/utils/retrieve-mini-image'


  useHead({
    title: 'Gerenciamento de Organizações Militares',
  })

  const {
    militaryOrganizations,
    selectedMilitaryOrganization,
    loading,
    error,
    fetchMilitaryOrganizations,
    deleteMilitaryOrganization: deleteMilitaryOrganizationComposable,
    findMilitaryOrganization,
    clearSelection,
  } = useMilitaryOrganizations()


  const titleVariables = {
    title: 'Gerenciamento de Organizações Militares',
    icon: 'mdi-domain',
  }

  const dialog = ref(false)
  const loadingBtn = ref(false)
  const logoToShow = ref<string | undefined>(undefined)

  const CARD_PROPS = reactive({
    modalType: '',
    modalTextButton: '',
  })


  const openModal = async (type: string, id?: string, logo?: string) => {
    CARD_PROPS.modalType = type
    dialog.value = true

    if (type === 'Cadastro') {
      CARD_PROPS.modalTextButton = 'Cadastrar'
      clearSelection()
    } else if (type === 'Edição') {
      CARD_PROPS.modalTextButton = 'Editar'
      if (id !== undefined) {
        try {
          await findMilitaryOrganization(id)
        } catch (error) {
          console.error('Error finding military organization:', error)
        }
      }
    } else if (type === 'Logo') {
      logoToShow.value = logo
    } else {
      // Exclusão
      if (!id) return
      CARD_PROPS.modalTextButton = 'Excluir'
      try {
        await findMilitaryOrganization(id)
      } catch (error) {
        console.error('Error finding military organization:', error)
      }
    }
  }


  const handleDeleteMilitaryOrganization = async (id: string) => {
    loadingBtn.value = true

    try {
      await deleteMilitaryOrganizationComposable(id.toString())
      dialog.value = false
    } catch (error) {
      console.error('Delete error handled by composable')
    } finally {
      loadingBtn.value = false
    }
  }

  const closeDialog = () => {
    clearSelection()
    logoToShow.value = undefined
    dialog.value = false
  }

  const headers: VDataTable['$props']['headers'] = [
    { title: 'Cor', key: 'color', sortable: false, align: 'center' },
    { title: 'Nome', key: 'name' },
    { title: 'Sigla', key: 'acronym' },
    { title: 'Logo', key: 'logo', sortable: false, align: 'center' },
    { title: 'Om Pai', key: 'parentOrganization' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]

  onMounted(() => {
    fetchMilitaryOrganizations()
  })
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseTitle :title-variables="titleVariables" />

        <v-card class="border border-solid border-opacity-100" rounded="xl">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Organizações Militares Cadastradas</span>
            <v-btn
              :loading="loading"
              color="primary"
              prepend-icon="mdi-plus-circle"
              rounded="xl"
              size="small"
              text="Criar Organização Militar"
              @click="openModal('Cadastro')"
            />
          </v-card-title>

          <v-card-text>
            <v-alert
              v-if="error"
              class="mb-4 text-center"
              type="error"
            >
              {{ error }}
            </v-alert>

            <v-data-table
              v-else
              :headers="headers"
              :items="militaryOrganizations"
              :loading="loading"
              density="compact"
              item-value="id"
            >
              <template #[`item.color`]="{ item }">
                <div
                  v-if="item.color"
                  :style="{ backgroundColor: item.color }"
                  class="color-circle"
                />
                <span v-else> - </span>
              </template>

              <template #[`item.parentOrganization`]="{ item }">
                <span v-if="item.parentOrganization">{{ item.parentOrganization?.acronym }}</span>
                <span v-else> É Om pai </span>
              </template>

              <template #[`item.logo`]="{ item }">
                <v-row class="d-flex justify-center align-center">
                  <v-col class="text-center">
                    <img
                      v-if="item.logo && item.logo === '/logos/default/default.png'"
                      alt="Sem logo cadastrado"
                      class="pt-2 cursor-pointer hover-effect"
                      src="/logos/default/default_mini.png"
                      @click="openModal('Logo', undefined, '/logos/default/default.png')"
                    >
                    <v-img
                      v-else
                      :alt="`Logo ${item.acronym}`"
                      :src="retrieveMiniImage(item.logo)"
                      class="pt-auto pb-auto d-flex justify-center align-center mx-auto cursor-pointer hover-effect"
                      height="auto"
                      width="auto"
                      @click="openModal('Logo', undefined, item.logo)"
                    />
                  </v-col>
                </v-row>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  class="mr-3"
                  color="primary"
                  prepend-icon="mdi-account-edit"
                  rounded="xl"
                  size="x-small"
                  variant="outlined"
                  @click="openModal('Edição', item.id)"
                >
                  <template #prepend>
                    <v-icon class="pt-1" />
                  </template>
                  Editar
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

    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :max-width="
        CARD_PROPS.modalType === 'Cadastro' || CARD_PROPS.modalType === 'Edição' ? '50%' : '30%'
      "
      persistent
    >
      <Form
        v-if="CARD_PROPS.modalType === 'Cadastro' || CARD_PROPS.modalType === 'Edição'"
        :card-props="CARD_PROPS"
        @close-dialog="closeDialog"
      />

      <v-card
        v-else-if="
          CARD_PROPS.modalType === 'Exclusão' &&
          selectedMilitaryOrganization
        "
        :title="CARD_PROPS.modalType + ' de Organização Militar'"
        class="rounded-xl"
        prepend-icon="mdi-alert"
      >
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col class="text-justify">
                <p>
                  Você tem certeza que deseja excluir a Organização Militar:
                  <b> {{ selectedMilitaryOrganization.name }}?</b>
                </p>
                <br>
                <hr>
                <br>
                <p>Essa ação é irreversível.</p>

                <br>
                <hr>
                <br>
                <p>
                  As contas vinculadas a essa Organização militar, deixarão de ter acesso ao
                  sistema.
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            v-if="selectedMilitaryOrganization"
            :loading="loadingBtn"
            :text="CARD_PROPS.modalTextButton"
            color="error"
            prepend-icon="mdi-alert"
            rounded="xl"
            variant="elevated"
            @click="
              handleDeleteMilitaryOrganization(
                selectedMilitaryOrganization.id
              )
            "
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

      <v-card
        v-else
        class="rounded-xl"
        prepend-icon="mdi-image"
        title="Escudo da Organização Militar"
      >
        <v-card-text>
          <v-row>
            <v-col align-self="center" class="text-center">
              <img v-if="logoToShow" :src="logoToShow" alt="Logo">
              <span v-else> Sem logo cadastrado </span>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
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
<style scoped>
  .color-circle {
    margin-top: 5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    border-color: white;
    display: inline-block;
  }
</style>
