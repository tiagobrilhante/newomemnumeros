<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import { retrieveMiniImage } from '~/utils/retrieve-mini-image'
  import type { VDataTable } from 'vuetify/components'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: $t('militaryOrganizationsManagement') + ' - ' + appName,
  })

  definePageMeta({
    auth: true,
  })

  const {
    militaryOrganizations,
    selectedMilitaryOrganization,
    loading,
    error,
    selectMilitaryOrganization,
    fetchMilitaryOrganizations,
    clearSelection,
  } = useMilitaryOrganizations()

  const dialog = ref(false)
  const search = ref('')

  const CARD_PROPS = reactive({
    modalType: '',
    modalTextButton: '',
    modalIcon: '',
    btnIcon: '',
    showCancelBtn: true,
  })

  type ModalType = 'add' | 'edit' | 'delete' | 'logo'

  const openModal = async (type: ModalType, militaryOrganization?: militaryOrganization) => {
    CARD_PROPS.modalType = type
    CARD_PROPS.showCancelBtn = true
    if (militaryOrganization) selectMilitaryOrganization(militaryOrganization)

    switch (type) {
      case 'add':
        CARD_PROPS.modalTextButton = $t('save')
        CARD_PROPS.modalIcon = 'mdi-plus-circle'
        CARD_PROPS.btnIcon = 'mdi-content-save-check'
        clearSelection()
        break
      case 'edit':
        if (!militaryOrganization?.id) return
        CARD_PROPS.modalIcon = 'mdi-pencil-circle'
        CARD_PROPS.btnIcon = 'mdi-content-save-check'
        CARD_PROPS.modalTextButton = $t('update')
        break
      case 'logo':
        if (!militaryOrganization?.id) return
        CARD_PROPS.modalIcon = 'mdi-shield-star'
        CARD_PROPS.modalTextButton = $t('$vuetify.close')
        break
      case 'delete':
        if (!militaryOrganization?.id) return
        CARD_PROPS.modalIcon = 'mdi-alert'
        CARD_PROPS.btnIcon = 'mdi-delete'
        CARD_PROPS.modalTextButton = $t('delete')
        break
    }

    dialog.value = true
  }

  const closeDialog = () => {
    clearSelection()
    dialog.value = false
  }

  const headers: VDataTable['$props']['headers'] = [
    { title: $t('color'), key: 'color', sortable: false, align: 'center' },
    { title: $t('name'), key: 'name' },
    { title: $t('acronym'), key: 'acronym' },
    { title: $t('logo'), key: 'logo', sortable: false, align: 'center' },
    { title: $t('parentOrganization'), key: 'parentOrganization' },
    { title: $t('actions'), key: 'actions', sortable: false, align: 'center' },
  ]

  onMounted(() => {
    fetchMilitaryOrganizations()
  })
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseTitle :title-variables="{title: $t('militaryOrganizationsManagement'),icon: 'mdi-domain'}" />

        <v-card class="border border-solid border-opacity-100" rounded="xl">

          <!-- card title e add MO btn-->
          <v-card-title>
            <v-row>
              <v-col class="px-5 d-flex justify-space-between align-center">
                <span>{{ $t('listedMilitaryOrganizations') }}</span>
                <v-btn
                  :loading="loading"
                  :text="$t('add') + ' ' + $t('leftMenu.militaryOrganization') "
                  class="mt-2"
                  color="primary"
                  prepend-icon="mdi-plus-circle"
                  rounded="xl"
                  size="small"
                  @click="openModal('add')"
                />
              </v-col>
            </v-row>

          </v-card-title>

          <v-card-text>

            <!-- error exhibition-->
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
              :search="search"
              density="compact"
            >
              <!-- color-->
              <template #[`item.color`]="{ item }">
                <div
                  v-if="item.color"
                  :style="{ backgroundColor: item.color }"
                  class="color-circle"
                />
                <span v-else> - </span>
              </template>

              <!--if parent-->
              <template #[`item.parentOrganization`]="{ item }">
                <span v-if="item.parentOrganization">{{ item.parentOrganization?.acronym }}</span>
                <span v-else> {{ $t('isParentMilitaryOrganization') }} </span>
              </template>

              <!-- mo logo -->
              <template #[`item.logo`]="{ item }">
                <v-row class="d-flex justify-center align-center">
                  <v-col class="text-center">
                    <v-img
                      :alt="item.logo === '/logos/default/default.png' ? 'Sem Logo cadastrado' : `Logo ${item.acronym}`"
                      :src="item.logo && item.logo !== '/logos/default/default.png' ? retrieveMiniImage(item.logo) : '/logos/default/default_mini.png'"
                      class="pt-2 cursor-pointer hover-effect mx-auto"
                      height="58"
                      width="50"
                      @click="openModal('logo', item)"
                    />
                  </v-col>
                </v-row>
              </template>

              <!-- actions-->
              <template #[`item.actions`]="{ item }">

                <!-- edit -->
                <v-tooltip :text="$t('edit')" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      :loading="loading"
                      class="mr-3"
                      color="primary"
                      icon="mdi-pencil"
                      size="x-small"
                      v-bind="props"
                      variant="outlined"
                      @click="openModal('edit', item)"
                    />
                  </template>
                </v-tooltip>

                <!-- delete-->
                <v-tooltip :text="$t('delete')" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      :loading="loading"
                      color="error"
                      icon="mdi-delete"
                      size="x-small"
                      v-bind="props"
                      variant="outlined"
                      @click="openModal('delete', item)"
                    />
                  </template>
                </v-tooltip>

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
        CARD_PROPS.modalType === 'add' || CARD_PROPS.modalType === 'edit' ? '50%' : '30%'
      "
      persistent
    >
      <!-- for create and update -->
      <military-organization-form
        v-if="CARD_PROPS.modalType === 'add' || CARD_PROPS.modalType === 'edit'"
        :card-props="CARD_PROPS"
        @close-dialog="closeDialog"
      />

      <!-- for exclusions-->
      <military-organization-delete-military-organization
        v-else-if="CARD_PROPS.modalType === 'delete' && selectedMilitaryOrganization"
        :card-props="CARD_PROPS"
        @close-dialog="closeDialog" />

      <!-- Show MO logo-->
      <military-organization-show-logo v-else
                                       :card-props="CARD_PROPS"
                                       @close-dialog="closeDialog" />

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
