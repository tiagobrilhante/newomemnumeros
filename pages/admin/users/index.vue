<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import type { VDataTable, VSelect } from 'vuetify/components'
  import { useAdminUserStore } from '~/stores/user.store'
  import { usePermissionSetupStore } from '~/stores/admin/permissionSetupStore'
  import { useMilitaryOrganizationStore } from '~/stores/military-organization.store'
  import type { userWithoutPassword } from '~/types/user'
  import type { permissionSetup } from '~/types/permissions/permission-setup'
  import { toast } from 'vue3-toastify'
  import ShowUserPermissionSetup from '~/components/permissions/ShowUserPermissionSetup.vue'
  import { retrieveMilitaryOrganizationAcronym } from '~/utils/retrieve-military-organization-acronym'
  import { retrieveMilitaryOrganizationLogo } from '~/utils/retrieve-military-organization-logo'

  useHead({
    title: 'Gerenciamento de Usuários',
  })

  const adminUserStore = useAdminUserStore()
  const permissionSetupStore = usePermissionSetupStore()
  const militaryOrganizationStore = useMilitaryOrganizationStore()
  const selectedMilitaryOrganization = ref<number | null>(null)

  const titleVariables = {
    title: 'Gerenciamento de Usuários',
    icon: 'mdi-account-group',
  }
  const headers: VDataTable['$props']['headers'] = [
    { title: 'Posto/Grad', key: 'rank.acronym' },
    { title: 'Nome de Guerra', key: 'serviceName' },
    { title: 'Nome', key: 'name' },
    { title: 'CPF', key: 'cpf' },
    { title: 'Email', key: 'email' },
    { title: 'Vínculo', key: 'sectionFunctionUser' },
    { title: 'Permissões', key: 'permissionSetupUser' },
    { title: 'Data de Criação', key: 'createdAt' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]
  const dialog = ref(false)
  const tipoDialog = ref('')
  const loadingBtn = ref(false)
  const selectRef = ref<InstanceType<typeof VSelect> | null>(null)
  const selectedPermissionSetups = ref<number[]>([])
  const selectedUser = ref<userWithoutPassword | null>(null)
  const dialogVariables = ref<{
    titleText: string
    btnText: string
    iconDialog: string
  }>({
    titleText: '',
    btnText: '',
    iconDialog: '',
  })

  const openDialog = async (
    tipo: string,
    item: userWithoutPassword,
    permissionSetup?: permissionSetup
  ) => {
    tipoDialog.value = tipo
    if (tipo === 'Permissões') {
      selectedUser.value = item
      if (
        selectedUser.value.permissionSetupUser &&
        selectedUser.value.permissionSetupUser.length > 0
      ) {
        selectedPermissionSetups.value = selectedUser.value.permissionSetupUser.map(
          (setup) => setup.permissionSetup.id
        )
      } else {
        selectedPermissionSetups.value = []
      }
      dialogVariables.value = {
        titleText: 'Permissões',
        btnText: 'Ajustar',
        iconDialog: 'mdi-arrow-oscillating',
      }
    }
    if (tipo === 'Ver Permissões') {
      selectedUser.value = item
      if (permissionSetup) {
        permissionSetupStore.selectedPermissionSetup = permissionSetup
      }
      dialogVariables.value = {
        titleText: 'Permissões do Setup',
        btnText: '',
        iconDialog: 'mdi-lock-alert',
      }
    }
    if (tipo === 'Excluir') {
      selectedUser.value = item
      dialogVariables.value = {
        titleText: 'Excluir Usuário',
        btnText: 'Excluir',
        iconDialog: 'mdi-delete',
      }
    }
    dialog.value = true
  }

  const closeDialog = () => {
    dialog.value = false
  }

  const handleSelectionComplete = () => {
    const input = selectRef.value?.$el.querySelector('input')
    input?.blur()
  }

  const proceedAction = async (tipo: string) => {
    if (tipo === 'Ajustar' && selectedUser.value) {
      await adminUserStore
        .linkPermissionSetup(selectedPermissionSetups.value, selectedUser.value.id)
        .then(() => {
          toast('Permissões Ajustadas com sucesso!', {
            theme: 'dark',
            type: 'success',
            autoClose: 5000,
            dangerouslyHTMLString: true,
          })
        })
        .finally(() => {
          loadingBtn.value = false
          closeDialog()
        })
    } else {
      if (!selectedUser.value) return

      await adminUserStore
        .deleteUser(selectedUser.value.id)
        .then(() => {
          toast('Usuário Excluído com sucesso!', {
            theme: 'dark',
            type: 'success',
            autoClose: 5000,
            dangerouslyHTMLString: true,
          })
        })
        .finally(() => {
          loadingBtn.value = false
          closeDialog()
        })
    }
  }

  onMounted(() => {
    //adminUserStore.fetchUsers()
    permissionSetupStore.fetchPermissionSetups()
    militaryOrganizationStore.fetchMilitaryOrganizations()
  })

  const getUsersByOmId = async () => {
    if (selectedMilitaryOrganization.value) {
      await adminUserStore.fetchUsersByOmId(Number(selectedMilitaryOrganization.value))
    }
  }
</script>

<template>
  <v-container fluid>
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
                  @update:model-value="getUsersByOmId"
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

        <v-card
          v-if="adminUserStore.users.length > 0 && selectedMilitaryOrganization"
          class="border border-solid border-opacity-100"
          rounded="xl"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span v-if="selectedMilitaryOrganization"
              >Usuários Cadastrados -
              {{
                retrieveMilitaryOrganizationAcronym(
                  selectedMilitaryOrganization,
                  militaryOrganizationStore.militaryOrganizations
                )
              }}</span
            >
            <v-btn
              v-if="selectedMilitaryOrganization"
              :loading="adminUserStore.loading"
              color="primary"
              prepend-icon="mdi-refresh"
              rounded="xl"
              size="small"
              text="Atualizar"
              @click="adminUserStore.fetchUsersByOmId(selectedMilitaryOrganization)"
            />
          </v-card-title>

          <v-card-text>
            <v-alert v-if="adminUserStore.error" class="mb-4 text-center" type="error">
              {{ adminUserStore.error }}
            </v-alert>

            <v-data-table
              v-else
              :headers="headers"
              :items="adminUserStore.users"
              :loading="adminUserStore.loading"
              density="compact"
              item-value="id"
            >
              <template #[`item.createdAt`]="{ item }">
                {{ new Date(item.createdAt).toLocaleString() }}
              </template>
              <template #[`item.sectionFunctionUser`]="{ item }">
                <ul v-if="item.sectionFunctionUser && item.sectionFunctionUser.length > 0">
                  <li
                    v-for="sectionFunctionUser in item.sectionFunctionUser"
                    :key="sectionFunctionUser.id"
                  >
                    {{ sectionFunctionUser.section.acronym }} -
                    {{ sectionFunctionUser.functionName }}
                  </li>
                </ul>

                <v-chip v-else color="yellow" prepend-icon="mdi-alert" size="small" variant="flat">
                  Não vinculado
                </v-chip>
              </template>

              <template #[`item.permissionSetupUser`]="{ item }">
                <ul v-if="item.permissionSetupUser && item.permissionSetupUser.length > 0">
                  <li v-for="userSetup in item.permissionSetupUser" :key="userSetup.id">
                    {{ userSetup.permissionSetup.name }}
                    <v-icon @click="openDialog('Ver Permissões', item, userSetup.permissionSetup)">
                      mdi-magnify
                    </v-icon>
                  </li>
                </ul>

                <span v-else> Usuário normal </span>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  class="mr-3"
                  color="warning"
                  prepend-icon="mdi-lock"
                  rounded="xl"
                  size="x-small"
                  text="Permissões"
                  @click="openDialog('Permissões', item)"
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
                  text="Excluir"
                  @click="openDialog('Excluir', item)"
                >
                  <template #prepend>
                    <v-icon class="pt-1" />
                  </template>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-card
          v-else-if="adminUserStore.users.length === 0 && selectedMilitaryOrganization"
          class="border border-solid border-opacity-100"
          rounded="xl"
        >
          <v-card-text class="text-center"> Não existem usuários cadastrados</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="40%" persistent>
      <v-card
        :prepend-icon="dialogVariables.iconDialog"
        :title="dialogVariables.titleText"
        class="rounded-xl"
      >
        <v-card-text>
          <v-container v-if="selectedUser" fluid>
            <v-row>
              <v-col>
                <b>Militar: </b> {{ selectedUser.rank.acronym }} {{ selectedUser.serviceName
                }}<br >
                <b>Nome Completo: </b> {{ selectedUser.name }}<br >
                <b>OM: </b> {{ selectedUser.militaryOrganization.acronym }}<br >
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="tipoDialog === 'Permissões'">
            <v-row>
              <v-col>
                <v-alert type="warning">
                  <p class="text-justify">
                    <b>Atenção:</b> Vincular um setup de permissões a um usuário, concede poderes
                    administrativos ao mesmo.
                  </p>
                  <br >
                  <p class="text-justify">
                    Um usuário com poderes administrativos pode transferir esse poder para outro
                    usuário.<br >
                    Tenha certeza do que está fazendo.
                  </p>
                </v-alert>

                <br >
                <br >
                <v-select
                  v-if="selectedUser && permissionSetupStore.permissionSetups"
                  ref="selectRef"
                  v-model="selectedPermissionSetups"
                  :items="permissionSetupStore.permissionSetups"
                  chips
                  clearable
                  closable-chips
                  density="compact"
                  item-title="name"
                  item-value="id"
                  label="Setup de permissões"
                  multiple
                  placeholder="Selecione os setups para vínculo"
                  required
                  variant="outlined"
                >
                  <template #append-item>
                    <v-container fluid>
                      <v-row>
                        <v-col>
                          <v-btn
                            block
                            color="primary"
                            variant="outlined"
                            @click="handleSelectionComplete"
                          >
                            Concluir Seleção
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="tipoDialog === 'Excluir'">
            <v-row>
              <v-col>
                <v-alert type="warning">
                  <p class="text-justify">
                    <b>Atenção:</b> A exclusão do usuário, remove o mesmo do sistema.
                  </p>
                  <p class="text-justify">Tenha certeza do que está fazendo!</p>
                </v-alert>
                <v-spacer class="my-5" />
              </v-col>
            </v-row>
          </v-container>

          <v-container
            v-if="tipoDialog === 'Ver Permissões' && permissionSetupStore.selectedPermissionSetup"
          >
            <ShowUserPermissionSetup />
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            v-if="tipoDialog === 'Excluir' || tipoDialog === 'Permissões'"
            :loading="loadingBtn"
            :text="dialogVariables.btnText"
            color="error"
            prepend-icon="mdi-alert"
            rounded="xl"
            variant="elevated"
            @click="proceedAction(dialogVariables.btnText)"
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
