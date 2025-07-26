<!--suppress JSUnusedGlobalSymbols -->
<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import { toast } from 'vue3-toastify'
  import { usePermissionSetupStore } from '~/stores/admin/permissionSetupStore'
  import { useMilitaryOrganizationStore } from '~/stores/military-organization.store'
  import { useSectionStore } from '~/stores/section.store'
  import type { VDataTable, VSelect } from 'vuetify/components'
  import { PERMISSION_CATEGORIES } from '~/constants/permissions'
  import { retrieveMilitaryOrganizationAcronym } from '~/utils/retrieve-military-organization-acronym'
  import { retrieveMilitaryOrganizationLogo } from '~/utils/retrieve-military-organization-logo'

  useHead({
    title: 'Gerenciamento de Permissões',
  })

  const permissionSetupStore = usePermissionSetupStore()
  const militaryOrganizationStore = useMilitaryOrganizationStore()

  // todo fazer a limpeza de store quando sair do componente
  onBeforeUnmount(() => {
    permissionSetupStore.clearPermissionState()
    militaryOrganizationStore.clearMilitaryOrganizationState()
  })

  const titleVariables = {
    title: 'Gerenciamento de Funções e Permissões',
    icon: 'mdi-shield-account',
  }

  onMounted(async () => {
    await fetchMilitaryOrganizations()
  })

  const setupName = ref('')
  const selectedMilitaryOrganization = ref<number | null>(null)
  const typeOfAction = ref('Criar')
  const addUpdateCard = ref(false)
  const loadingBtn = ref(false)
  const loadingBtnCreateSetup = ref(false)
  const shoeSetupPermissionsTableCard = ref(true)
  const dialogDelete = ref(false)
  const collapsedStates = ref<Record<string, boolean>>({})
  const selectedPermissions = ref<string[]>([])
  const selectedLinkSections = ref<number[]>([])
  const selectedMO = ref<number | null>(null)
  const listOfSections = ref<section[]>([])
  const listOfMilitaryOrganizations = ref<militaryOrganization[]>([])
  const moduleSelectAll: Record<string, ReturnType<typeof computed<boolean>>> = {}
  const listOfPermissionsbyModules = PERMISSION_CATEGORIES
  const headers: VDataTable['$props']['headers'] = [
    { title: 'Nome', key: 'name' },
    { title: 'Permissões', key: 'permissions' },
    { title: 'Om', key: 'om' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]
  const adminSectionStore = useSectionStore()

  const sections = await adminSectionStore.fetchSections()

  listOfSections.value = sections ?? []

  const fetchMilitaryOrganizations = async () => {
    await militaryOrganizationStore.fetchMilitaryOrganizations()
    listOfMilitaryOrganizations.value = militaryOrganizationStore.militaryOrganizations ?? []
  }

  // Monitorar mudanças na ref "selectedPermissions"
  watch(selectedPermissions, (newVal) => {
    // Se "super_admin" ou "super_admin_mo" estiver presente e houver outros valores, redefina para apenas para o valor válido
    if (
      (newVal.includes('super_admin') || newVal.includes('super_admin_mo')) &&
      newVal.length > 1
    ) {
      if (newVal.includes('super_admin_mo')) {
        selectedPermissions.value = ['super_admin_mo']
      } else {
        selectedPermissions.value = ['super_admin']
      }
    }
  })

  const createEditSetupPermission = () => {
    const arrayOfValidationErrors = []

    if (setupName.value.trim() === '') {
      arrayOfValidationErrors.push('Nome do setup de permissões não pode ser vazio')
    }

    if (selectedMO.value === null) {
      arrayOfValidationErrors.push('Selecione a Om para a qual o setup de permissões será definido')
    }

    if (selectedPermissions.value.length === 0) {
      arrayOfValidationErrors.push('Selecione ao menos uma permissão')
    }

    if (
      selectedPermissions.value.includes('create_user_link') &&
      selectedLinkSections.value.length === 0
    ) {
      arrayOfValidationErrors.push('Selecione ao menos uma seção para o vínculo')
    }

    if (arrayOfValidationErrors.length > 0) {
      let errorMessage = '<ul>'
      arrayOfValidationErrors.forEach((error) => {
        errorMessage += `<li class="pl-5 ml-5">${error}</li>`
      })
      errorMessage += '</ul>'

      toast('Existem erros no cadastro! <br> ' + errorMessage, {
        theme: 'dark',
        type: 'error',
        style: {
          width: 'auto',
        },
        autoClose: 7000,
        dangerouslyHTMLString: true,
      })
      return
    }

    if (typeOfAction.value === 'Editar' && permissionSetupStore.selectedPermissionSetup) {
      const updatedPermissionSetup: permissionSetupSubmission = {
        id: permissionSetupStore.selectedPermissionSetup.id,
        name: setupName.value.trim(),
        militaryOrganizationId: selectedMO.value!,
        permissions: selectedPermissions.value!,
        selectedLinkSections: selectedLinkSections.value,
      }
      permissionSetupStore
        .updatePermissionSetup(updatedPermissionSetup)
        .catch((error) => {
          toast('Erro ao editar setup de permissões! <br> ' + error, {
            theme: 'dark',
            type: 'error',
            style: {
              width: 'auto',
            },
            autoClose: 5000,
            dangerouslyHTMLString: true,
          })
        })
        .then(() => {
          toast('Setup de permissões editado com sucesso!', {
            theme: 'dark',
            type: 'success',
            style: {
              width: 'auto',
            },
            autoClose: 7000,
          })
        })
        .finally(() => {
          resetForm()
          toggleAddUpdateCard(typeOfAction.value)
        })
    } else {
      const newPermissionSetup: permissionSetupSubmission = {
        name: setupName.value.trim(),
        permissions: selectedPermissions.value!,
        militaryOrganizationId: selectedMO.value!,
        selectedLinkSections: selectedLinkSections.value,
      }

      permissionSetupStore
        .addPermissionSetup(newPermissionSetup)
        .catch((error) => {
          toast('Erro ao criar setup de permissões! <br> ' + error, {
            theme: 'dark',
            type: 'error',
            style: {
              width: 'auto',
            },
            autoClose: 5000,
            dangerouslyHTMLString: true,
          })
        })
        .then(() => {
          toast('Setup de permissões criado com sucesso!', {
            theme: 'dark',
            type: 'success',
            style: {
              width: 'auto',
            },
            autoClose: 7000,
          })
        })
        .finally(() => {
          resetForm()
          toggleAddUpdateCard(typeOfAction.value)
        })
    }
  }

  const closeDialog = () => {
    dialogDelete.value = false
    permissionSetupStore.clearSelectedPermissionSetup()
  }

  const resetForm = () => {
    setupName.value = ''
    selectedPermissions.value = []
    selectedMO.value = null
    selectedLinkSections.value = []
  }

  const toggleCollapse = (moduleAlias: string) => {
    collapsedStates.value[moduleAlias] = !collapsedStates.value[moduleAlias]
  }

  const toggleAll = () => {
    const allCollapsed = Object.values(collapsedStates.value).every((state) => state)
    Object.keys(collapsedStates.value).forEach((key) => {
      collapsedStates.value[key] = !allCollapsed
    })
  }

  const buttonLabel = computed(() => {
    const allCollapsed = Object.values(collapsedStates.value).every((state) => state)
    return allCollapsed ? 'Expandir Todos' : 'Colapsar Todos'
  })

  listOfPermissionsbyModules.forEach((mod) => {
    collapsedStates.value[mod.module_alias] = true
    const modulePermissions = mod.permissions.map((p) => p.alias)
    // noinspection JSUnusedGlobalSymbols
    moduleSelectAll[mod.module_alias] = computed({
      get() {
        return modulePermissions.every((permission) =>
          selectedPermissions.value.includes(permission)
        )
      },
      set(newValue: boolean) {
        if (newValue) {
          selectedPermissions.value = Array.from(
            new Set([...selectedPermissions.value, ...modulePermissions])
          )
        } else {
          selectedPermissions.value = selectedPermissions.value.filter(
            (permission) => !modulePermissions.includes(permission)
          )
        }
      },
    })
  })

  const returnDescription = (permissionAlias: string) => {
    const permissionModule = listOfPermissionsbyModules.find((module) =>
      module.permissions.some((p) => p.alias === permissionAlias)
    )
    if (!permissionModule) return { module: '', description: '', color: '' }
    const permission = permissionModule.permissions.find((p) => p.alias === permissionAlias)
    return {
      module: permissionModule.module,
      description: permission?.description ?? '',
      color: permissionModule.module_color,
    }
  }

  const toggleAddUpdateCard = (action: string) => {
    loadingBtnCreateSetup.value = true

    typeOfAction.value = action

    if (typeOfAction.value === 'Editar') {
      setupName.value = permissionSetupStore.selectedPermissionSetup?.name ?? ''
      selectedPermissions.value =
        permissionSetupStore.selectedPermissionSetup?.permissions.map((p) => p.permission) ?? []

      selectedMO.value = selectedMilitaryOrganization.value ?? null

      listOfPermissionsbyModules.forEach((module) => {
        const hasSelectedPermissions = module.permissions.some((permission) =>
          selectedPermissions.value.includes(permission.alias)
        )
        collapsedStates.value[module.module_alias] = !hasSelectedPermissions
      })

      addUpdateCard.value = !addUpdateCard.value
      shoeSetupPermissionsTableCard.value = !shoeSetupPermissionsTableCard.value
      loadingBtnCreateSetup.value = false
    } else {
      resetForm()
      typeOfAction.value = 'Criar'

      listOfPermissionsbyModules.forEach((module) => {
        collapsedStates.value[module.module_alias] = true
      })

      selectedMO.value = selectedMilitaryOrganization.value ?? null

      addUpdateCard.value = !addUpdateCard.value
      shoeSetupPermissionsTableCard.value = !shoeSetupPermissionsTableCard.value
      loadingBtnCreateSetup.value = false
    }
  }

  const openModal = async (id: number) => {
    if (!id) return
    await permissionSetupStore.findPermissionSetup(id)
    const selectedPermissionSetup = permissionSetupStore.selectedPermissionSetup
    if (selectedPermissionSetup) {
      permissionSetupStore.setSelectedPermissionSetup(selectedPermissionSetup)
      dialogDelete.value = true
    }
  }

  const openToEdit = async (id: number) => {
    if (!id) return
    await permissionSetupStore.findPermissionSetup(id)
    const selectedPermissionSetup = permissionSetupStore.selectedPermissionSetup
    if (selectedPermissionSetup) {
      permissionSetupStore.setSelectedPermissionSetup(selectedPermissionSetup)
      typeOfAction.value = 'Editar'
      selectedLinkSections.value = selectedPermissionSetup.permissions
        .filter((p) => p.permission === 'create_user_link')
        .map((p) => p.linkSectionPermission?.map((s) => s.section.id) ?? [])
        .flat()
      toggleAddUpdateCard(typeOfAction.value)
    }
  }

  const deleteSetupPermission = async (id: number) => {
    loadingBtn.value = true
    await permissionSetupStore
      .deletePermissionSetup(id)
      .then(() => {
        permissionSetupStore.permissionSetups = permissionSetupStore.permissionSetups.filter(
          (ps) => ps.id !== id
        )

        toast('Setup de permissão excluído com Sucesso!', {
          theme: 'dark',
          type: 'success',
          dangerouslyHTMLString: true,
          autoClose: 5000,
        })
      })
      .finally(() => {
        loadingBtn.value = false
        dialogDelete.value = false
      })
  }

  const getSetupPermissionsByOmId = async (omId: number) => {
    await permissionSetupStore.fetchPermissionSetupsByOmId(omId)
    addUpdateCard.value = false
    shoeSetupPermissionsTableCard.value = true
  }
</script>

<template>
  <v-container fluid>
    <!-- base title-->
    <v-row>
      <v-col>
        <BaseTitle :title-variables="titleVariables" />

        <!-- busca por OM-->
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
                  @update:model-value="getSetupPermissionsByOmId"
                />
              </v-col>
              <v-col class="align-content-center">
                <h3 class="pb-4">Selecione a OM</h3>
              </v-col>
              <v-col v-if="selectedMilitaryOrganization" class="text-right" cols="2">
                <nuxt-img
                  :src="`${retrieveMilitaryOrganizationLogo(
                    selectedMilitaryOrganization,
                    'mini',
                    militaryOrganizationStore.militaryOrganizations
                  )}`"
                  class="text-right pt-auto pb-auto my-auto align-content-center"
                  width="35"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col class="mt-0 pt-0">
        <!-- Card: Setup de Permissões -->
        <v-card
          v-if="addUpdateCard"
          class="mx-auto pl-3 mb-4 border border-solid border-opacity-100"
          elevation="10"
          rounded="xl"
        >
          <!-- titulo - expandir ou colapsar e cancelar-->
          <v-card-title>
            <v-row>
              <v-col class="ml-3" cols="9">{{ typeOfAction }} Setup de Permissões</v-col>
              <v-col class="text-right">
                <v-btn
                  :text="buttonLabel"
                  class="mr-4"
                  color="primary"
                  prepend-icon="mdi-arrow-expand"
                  rounded="xl"
                  size="small"
                  variant="outlined"
                  @click="toggleAll"
                />

                <v-btn
                  color="error"
                  prepend-icon="mdi-close"
                  rounded="xl"
                  size="small"
                  text="Cancelar"
                  variant="outlined"
                  @click="toggleAddUpdateCard"
                />
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <!-- nome e btn criar-->
            <v-row>
              <!-- Campo de nome -->
              <v-col>
                <v-text-field
                  id="name"
                  v-model="setupName"
                  density="compact"
                  label="Nome do setup de permissões"
                  placeholder="Nome do setup de permissões"
                  required
                  rounded="xl"
                  variant="outlined"
                />
              </v-col>

              <!-- om -->
              <v-col>
                <v-select
                  v-model="selectedMO"
                  :item-title="(item) => `${item.acronym} - ${item.name}`"
                  :items="listOfMilitaryOrganizations"
                  :readonly="true"
                  dense
                  density="compact"
                  item-value="id"
                  label="Om do setup"
                  placeholder="Om"
                  rounded="xl"
                  variant="outlined"
                />
              </v-col>

              <!-- criar-->
              <v-col>
                <v-btn
                  block
                  class="mt-1"
                  color="primary"
                  rounded="xl"
                  variant="tonal"
                  @click="createEditSetupPermission"
                >
                  {{ typeOfAction }} Setup de Permissões
                </v-btn>
              </v-col>
            </v-row>

            <!-- super admin-->
            <v-row class="mt-0">
              <v-col v-if="!selectedPermissions.includes('super_admin_mo')">
                <v-checkbox
                  v-model="selectedPermissions"
                  density="compact"
                  hide-details
                  label="Super Administrador"
                  value="super_admin"
                />
              </v-col>
              <v-col v-if="!selectedPermissions.includes('super_admin')">
                <v-checkbox
                  v-model="selectedPermissions"
                  density="compact"
                  hide-details
                  label="Administrador Nível Om"
                  value="super_admin_mo"
                />
              </v-col>
            </v-row>

            <!-- cards de seleção de permissões-->
            <v-row
              v-if="
                !selectedPermissions.includes('super_admin') &&
                !selectedPermissions.includes('super_admin_mo')
              "
            >
              <v-col
                v-for="module in listOfPermissionsbyModules"
                :key="module.module_alias"
                cols="4"
              >
                <v-card
                  class="mx-auto mb-4 border border-solid border-opacity-100"
                  density="compact"
                  elevation="10"
                  rounded="xl"
                >
                  <v-card-title :class="'bg-' + module.module_color + '-lighten-3'">
                    <v-row>
                      <v-col class="text-left pt-4" cols="10">{{ module.module }}</v-col>
                      <v-col class="text-right" cols="2">
                        <v-btn icon size="x-small" @click="toggleCollapse(module.module_alias)">
                          <v-icon size="large"
                            >{{
                              collapsedStates[module.module_alias]
                                ? 'mdi-chevron-down'
                                : 'mdi-chevron-up'
                            }}
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-title>
                  <v-card-text v-show="!collapsedStates[module.module_alias]" class="py-5">
                    <!-- Checkbox para selecionar/deselecionar todas as permissões do módulo -->
                    <div class="d-flex align-center">
                      <v-checkbox
                        :label="
                          (moduleSelectAll[module.module_alias].value ?? false)
                            ? 'Remover todas'
                            : 'Selecionar todas'
                        "
                        :model-value="moduleSelectAll[module.module_alias].value ?? false"
                        density="compact"
                        hide-details
                        @update:model-value="
                          (value) => {
                            moduleSelectAll[module.module_alias].value = value ?? false
                          }
                        "
                      />
                      <v-tooltip
                        :text="'Seleciona todas as opções do módulo: ' + module.module"
                        location="top"
                      >
                        <template #activator="{ props }">
                          <v-icon class="ml-2" small v-bind="props"> mdi-information</v-icon>
                        </template>
                      </v-tooltip>
                    </div>
                    <!-- Checkboxes individuais com tooltip inline -->
                    <div
                      v-for="(permission, index) in module.permissions"
                      :key="index"
                      class="d-flex align-center"
                    >
                      <v-checkbox
                        v-model="selectedPermissions"
                        :label="permission.name"
                        :value="permission.alias"
                        density="compact"
                        hide-details
                      />

                      <v-tooltip :text="permission.description" location="top">
                        <template #activator="{ props }">
                          <v-icon class="ml-2" small v-bind="props"> mdi-information</v-icon>
                        </template>
                      </v-tooltip>
                    </div>

                    <v-row v-if="module.module_alias === 'user_link'" class="pt-6">
                      <v-col v-if="selectedPermissions.includes('create_user_link')">
                        <v-select
                          v-model="selectedLinkSections"
                          :item-title="(item) => `${item.acronym} - ${item.name}`"
                          :items="listOfSections"
                          chips
                          clearable
                          closable-chips
                          dense
                          density="compact"
                          item-value="id"
                          label="Seções permitidas (para o vínculo)"
                          multiple
                          placeholder="Seção"
                          rounded="xl"
                          variant="outlined"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-0">
              <v-col>
                <v-btn
                  block
                  class="mt-1"
                  color="primary"
                  rounded="xl"
                  variant="tonal"
                  @click="createEditSetupPermission"
                >
                  {{ typeOfAction }} Setup de Permissões
                </v-btn>
              </v-col>

              <v-col>
                <v-btn
                  block
                  class="mt-1"
                  color="secondary"
                  rounded="xl"
                  text="Cancelar"
                  variant="tonal"
                  @click="toggleAddUpdateCard"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!-- gerenciamento de permissionsSetup -->
        <v-card
          v-if="
            shoeSetupPermissionsTableCard &&
            selectedMilitaryOrganization &&
            permissionSetupStore.permissionSetups.length > 0
          "
          class="mx-auto mb-4 border border-solid border-opacity-100"
          elevation="10"
          rounded="xl"
        >
          <v-card-title class="bg-grey">
            <v-row>
              <v-col class="ml-3" cols="9"
                >Setup de Permissões Cadastradas -
                {{
                  retrieveMilitaryOrganizationAcronym(
                    selectedMilitaryOrganization,
                    militaryOrganizationStore.militaryOrganizations
                  )
                }}
              </v-col>
              <v-col class="text-right">
                <v-btn
                  :loading="loadingBtnCreateSetup"
                  color="black"
                  prepend-icon="mdi-plus-circle"
                  rounded="xl"
                  size="small"
                  text="Adicionar Setup de Permissões"
                  variant="outlined"
                  @click="toggleAddUpdateCard"
                />
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="permissionSetupStore.permissionSetups"
              :loading="permissionSetupStore.loading"
              density="compact"
              item-value="id"
            >
              <template #[`item.permissions`]="{ item }">
                <ul v-if="item.permissions">
                  <li v-for="permission in item.permissions" :key="permission.id">
                    <v-chip
                      v-if="
                        permission.permission !== 'super_admin' &&
                        permission.permission !== 'super_admin_mo'
                      "
                      :color="returnDescription(permission.permission).color"
                      density="compact"
                      size="small"
                      text-color="white"
                    >
                      {{ returnDescription(permission.permission).module }}
                    </v-chip>
                    <span
                      v-if="
                        permission.permission !== 'super_admin' &&
                        permission.permission !== 'super_admin_mo'
                      "
                    >
                      {{ returnDescription(permission.permission).description }}
                    </span>

                    <span
                      v-if="
                        permission.permission === 'create_user_link' &&
                        permission.linkSectionPermission
                      "
                    >
                      <v-chip
                        v-for="sectionsLink in permission.linkSectionPermission"
                        :key="sectionsLink.id"
                        class="mx-2"
                        density="compact"
                      >
                        {{ sectionsLink.section.acronym }}</v-chip
                      >
                    </span>

                    <v-chip
                      v-if="permission.permission === 'super_admin'"
                      color="yellow"
                      density="compact"
                      size="small"
                      text="Super Administrador"
                      text-color="black"
                    />

                    <v-chip
                      v-if="permission.permission === 'super_admin_mo'"
                      color="yellow"
                      density="compact"
                      size="small"
                      text="Administrador nível OM"
                      text-color="black"
                    />
                  </li>
                </ul>
              </template>
              <template #[`item.om`]="{ item }">
                {{ item.militaryOrganization.acronym }}
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn
                  class="mr-3"
                  color="primary"
                  prepend-icon="mdi-account-edit"
                  rounded="xl"
                  size="x-small"
                  text="Editar"
                  variant="outlined"
                  @click="openToEdit(item.id)"
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
                  @click="openModal(item.id)"
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

        <!-- sem setup de permissões-->
        <v-card
          v-if="
            !permissionSetupStore.loading &&
            shoeSetupPermissionsTableCard &&
            selectedMilitaryOrganization &&
            permissionSetupStore.permissionSetups.length === 0
          "
          class="mx-auto mb-4 border border-solid border-opacity-100"
          elevation="10"
          rounded="xl"
        >
          <v-card-text class="text-center">
            <v-row>
              <v-col />
              <v-col
                ><h3>
                  Sem setups de permissões cadastradas para
                  {{
                    retrieveMilitaryOrganizationAcronym(
                      selectedMilitaryOrganization,
                      militaryOrganizationStore.militaryOrganizations
                    )
                  }}
                </h3></v-col
              >
              <v-col class="text-right">
                <v-btn
                  :loading="loadingBtnCreateSetup"
                  color="white"
                  prepend-icon="mdi-plus-circle"
                  rounded="xl"
                  size="small"
                  text="Adicionar Setup de Permissões"
                  variant="outlined"
                  @click="toggleAddUpdateCard"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- exclusão de setup-->
    <v-dialog
      v-if="permissionSetupStore.selectedPermissionSetup"
      v-model="dialogDelete"
      max-width="30%"
      persistent
    >
      <v-card class="rounded-xl" prepend-icon="mdi-alert" title="Exclusão de setup de permissão">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col class="text-justify">
                <p>
                  Você tem certeza que deseja excluir o setup de permissão:
                  <b> {{ permissionSetupStore.selectedPermissionSetup.name }}?</b>
                </p>
                <br >
                <hr >
                <br >
                <p>Essa ação é irreversível.</p>

                <br >
                <hr >
                <br >
                <p>
                  As contas vinculadas a esse setup deixarão de ter acesso administrativo aos
                  módulos afetados.
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            v-if="permissionSetupStore.selectedPermissionSetup?.id !== undefined"
            :loading="loadingBtn"
            color="error"
            prepend-icon="mdi-alert"
            rounded="xl"
            text="Excluir"
            variant="elevated"
            @click="deleteSetupPermission(permissionSetupStore.selectedPermissionSetup.id!)"
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
