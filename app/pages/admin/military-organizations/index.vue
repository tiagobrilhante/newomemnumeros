<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import { retrieveMiniImage } from '~/utils/retrieve-mini-image'
  import type { VDataTable } from 'vuetify/components'

  const config = useRuntimeConfig()
  const appName = config.public.APP_NAME

  useHead({
    title: $t('militaryOrganizationsManagement')  + ' - ' + appName,
  })

  definePageMeta({
    auth: true
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

  const CARD_PROPS = reactive({
    modalType: '',
    modalTextButton: '',
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
        clearSelection()
        break
      case 'edit':
        if (!militaryOrganization?.id) return
        CARD_PROPS.modalTextButton = $t('update')
        break
      case 'logo':
        if (!militaryOrganization?.id) return
        CARD_PROPS.modalTextButton = $t('$vuetify.close')
        break
      case 'delete':
        if (!militaryOrganization?.id) return
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
        <BaseTitle :title-variables="{
    title: $t('militaryOrganizationsManagement'),
    icon: 'mdi-domain',
  }" />

        <v-card class="border border-solid border-opacity-100" rounded="xl">

          <!-- card title e add MO btn-->
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ $t('listedMilitaryOrganizations') }}</span>
            <v-btn
              :loading="loading"
              :text="$t('add') + ' ' + $t('leftMenu.militaryOrganization') "
              color="primary"
              prepend-icon="mdi-plus-circle"
              rounded="xl"
              size="small"
              @click="openModal('add')"
            />
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
              density="compact"
              item-value="id"
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
              <!-- todo needs internationalization -->
              <template #[`item.parentOrganization`]="{ item }">
                <span v-if="item.parentOrganization">{{ item.parentOrganization?.acronym }}</span>
                <span v-else> {{ $t('isParentMilitaryOrganization') }} </span>
              </template>

              <!-- mo logo -->
              <template #[`item.logo`]="{ item }">
                <v-row class="d-flex justify-center align-center">
                  <v-col class="text-center">
                    <v-img
                      v-if="item.logo && item.logo === '/logos/default/default.png'"
                      alt="Sem logo cadastrado"
                      class="pt-2 cursor-pointer hover-effect mx-auto"
                      src="/logos/default/default_mini.png"
                      width="auto"
                      @click="openModal('logo', item)"
                    />
                    <v-img
                      v-else-if="item.logo && item.logo !== '/logos/default/default.png'"
                      :alt="`Logo ${item.acronym}`"
                      :src="retrieveMiniImage(item.logo)"
                      class="pt-auto pb-auto d-flex justify-center align-center mx-auto cursor-pointer hover-effect"
                      height="auto"
                      width="auto"
                      @click="openModal('logo', item)"
                    />
                  </v-col>
                </v-row>
              </template>

              <!-- actions-->
              <!-- todo needs internationalization -->
              <template #[`item.actions`]="{ item }">

                <!-- edit -->
                <v-tooltip :text="$t('edit')" location="top">
                  <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="mr-3"
                  color="primary"
                  icon="mdi-pencil"
                  size="x-small"
                  :loading="loading"
                  variant="outlined"
                  @click="openModal('edit', item)"
                  />
                  </template>
                </v-tooltip>


                <!-- delete-->
                <v-tooltip :text="$t('delete')" location="top">
                  <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="error"
                  icon="mdi-delete"
                  size="x-small"
                  variant="outlined"
                  :loading="loading"
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
