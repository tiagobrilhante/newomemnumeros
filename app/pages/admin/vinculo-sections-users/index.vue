<script lang="ts" setup>
  import BaseTitle from '~/layouts/partials/BaseTitle.vue'
  import { useSectionFunctionUserStore } from '~/stores/admin/sectionFunctionUserStore'
  import { usePermissionSetupStore } from '~/stores/admin/permissionSetupStore'
  import type { VDataTable, VSelect } from 'vuetify/components'
  import { toast } from 'vue3-toastify'
  import FindUserAndLink from '~/components/vinculo-section-users/FindUserAndLink.vue'
  import ShowUserPermissionSetup from '~/components/vinculo-section-users/ShowUserPermissionSetup.vue'

  useHead({
    title: 'Gerenciamento de Vínculo de Usuário',
  })

  const { currentUser } = useUserData()

  const dialog = ref(false)
  const loadingBtn = ref(false)
  const tipoDialog = ref('')
  const sectionFunctionUserStore = useSectionFunctionUserStore()
  const permissionSetupStore = usePermissionSetupStore()
  const myFirstSectionIdfunctionUser = ref<number | null>(null)
  const selectRef = ref<InstanceType<typeof VSelect> | null>(null)
  const activeSectionId = ref(0)
  const selectedSectionFunctionUser = ref<sectionFunctionUser | null>(null)
  const selectedPermissionFunctionUserToTransfer = ref<number[] | []>([])
  const selectedUserToTransfer = ref<number | null>(null)
  const sectionFunctionUser = ref<sectionFunctionUser | null>(null)
  const headersMyUsers: VDataTable['$props']['headers'] = [
    { title: 'Função', key: 'functionName' },
    { title: 'Militar', key: 'user' },
    { title: 'Om', key: 'om', align: 'center' },
    { title: 'Setup de Permissões', key: 'permissionSetupUser', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]
  const titleVariables = {
    title: 'Gerenciamento de Vínculo de Usuário',
    icon: 'mdi-arrow-collapse',
  }
  const dialogVariables = ref<{
    titleText: string
    btnText: string
    iconDialog: string
  }>({
    titleText: '',
    btnText: '',
    iconDialog: '',
  })

  const getFirstSectionFunctionUser = (linkSectionPermissions?: { sectionId: number }[]) => {
    if (!linkSectionPermissions || linkSectionPermissions.length === 0) {
      return null
    }
    const firstSection = linkSectionPermissions[0]
    activeSectionId.value = firstSection.sectionId
    return firstSection.sectionId
  }

  onMounted(() => {
    myFirstSectionIdfunctionUser.value = getFirstSectionFunctionUser(mySectionsForLink.value)
    sectionFunctionUserStore.fetchSectionsFunctionsUsersBySectionId(activeSectionId.value ?? 0)
  })

  const mySectionsForLink = computed(() => {
    if (currentUser.value.permissionSetupUser) {
      const permissionSetup = currentUser.value.permissionSetupUser.find((setup) =>
        setup.permissionSetup.permissions.some(
          (permission) => permission.permission === 'create_user_link'
        )
      )

      if (permissionSetup) {
        const permission = permissionSetup.permissionSetup.permissions.find(
          (permission) => permission.permission === 'create_user_link'
        )

        return permission?.linkSectionPermission || []
      }
    }
    return []
  })

  const sectionsFunctionsUsersFirstSectionId = computed(
    () => sectionFunctionUserStore.sectionsFunctionsUsersBySectionId
  )

  const changeSectionIdForSectionFunctionUser = async (sectionId: number) => {
    if (sectionId === activeSectionId.value) {
      return
    }
    await sectionFunctionUserStore.fetchSectionsFunctionsUsersBySectionId(sectionId).then(() => {
      activeSectionId.value = sectionId
    })
  }

  const closeDialog = () => {
    dialog.value = false
  }

  const openDialog = async (tipo: string, item: sectionFunctionUser | permissionSetupUser) => {
    tipoDialog.value = tipo

    if (tipo === 'Transferir Permissões' || tipo === 'Excluir Vínculo') {
      if ('functionName' in item) {
        selectedSectionFunctionUser.value = item
        dialogVariables.value = {
          titleText: tipo === 'Transferir Permissões' ? 'Transferir Permissões' : 'Excluir Vínculo',
          btnText: tipo === 'Transferir Permissões' ? 'Transferir' : 'Excluir',
          iconDialog: tipo === 'Transferir Permissões' ? 'mdi-arrow-oscillating' : 'mdi-delete',
        }
      } else {
        console.error('Expected sectionFunctionUser but received permissionSetupUser')
        return
      }
    }

    if (tipo === 'Ver Permissões') {
      if ('permissionSetup' in item) {
        sectionFunctionUserStore.selectedSetupOfPermissions = item
        dialogVariables.value = {
          titleText: 'Ver Permissões',
          btnText: 'Excluir',
          iconDialog: 'mdi-lock',
        }
      } else {
        console.error('Expected permissionSetupUser but received sectionFunctionUser')
        return
      }
    }

    dialog.value = true
  }

  const handleSelectionComplete = () => {
    const input = selectRef.value?.$el.querySelector('input')
    input?.blur()
  }

  const proceedAction = async (tipo: string) => {
    if (tipo === 'Transferir') {
      const errorMessage = []
      if (!selectedUserToTransfer.value) {
        errorMessage.push('Usuário para transferência não selecionado.')
      }

      if (selectedPermissionFunctionUserToTransfer.value.length === 0) {
        errorMessage.push('Setup de permissões para transferência não selecionado.')
      }

      if (errorMessage.length) {
        let msgError = '<ul class="pl-5">'
        errorMessage.forEach((msg) => {
          msgError += `<li>${msg}</li>`
        })
        msgError += '</ul>'

        // TODO criar modulo para abstrair a chamada pura nos componentes
        toast(msgError, {
          theme: 'dark',
          type: 'error',
          dangerouslyHTMLString: true,
          style: {
            width: '500px',
          },
          autoClose: 5000,
        })

        return
      }

      interface TransferPermissionPayload {
        permissionsSetup: number[]
        userId: number | null
        permissionProvider: number | null
      }

      const objetoParaEnvio: TransferPermissionPayload = {
        permissionsSetup: selectedPermissionFunctionUserToTransfer.value,
        userId: selectedUserToTransfer.value,
        permissionProvider: selectedSectionFunctionUser.value?.userId ?? null,
      }

      if (objetoParaEnvio.permissionProvider !== null) {
        await permissionSetupStore
          .tranferPermissionSetupUser(objetoParaEnvio)
          .catch((error) => {
            toast(`Erro ao transferir Setup de permissão.${error}`, {
              theme: 'dark',
              type: 'error',
              dangerouslyHTMLString: true,
            })
          })
          .then(async () => {
            toast('Setup de permissão transferido com sucesso !', {
              theme: 'dark',
              type: 'success',
              dangerouslyHTMLString: true,
              autoClose: 5000,
            })

            selectedPermissionFunctionUserToTransfer.value = []
            selectedUserToTransfer.value = null
            selectedSectionFunctionUser.value = null
          })
          .finally(() => {
            loadingBtn.value = false
            closeDialog()
          })
      } else {
        console.error('Selected section function user is null')
      }
    } else {
      if (selectedSectionFunctionUser.value) {
        await sectionFunctionUserStore
          .deleteSectionFunctionUser(selectedSectionFunctionUser.value.id)
          .catch((error) => {
            toast(`Erro ao excluir vínculo de militar.${error}`, {
              theme: 'dark',
              type: 'error',
              dangerouslyHTMLString: true,
            })
          })
          .then(async () => {
            toast('Vínculo excluído com sucesso !', {
              theme: 'dark',
              type: 'success',
              dangerouslyHTMLString: true,
              autoClose: 5000,
            })
          })
          .finally(() => {
            loadingBtn.value = false
            closeDialog()
          })
      }
    }
  }

  const filteredSectionsFunctionsUsers = computed(() => {
    return sectionsFunctionsUsersFirstSectionId.value.filter(
      (item) =>
        item.user &&
        selectedSectionFunctionUser.value?.user &&
        item.user.id !== selectedSectionFunctionUser.value.user.id
    )
  })
</script>

<template>
  <v-container fluid>
    <BaseTitle :title-variables="titleVariables" />

    <FindUserAndLink @update-section="changeSectionIdForSectionFunctionUser" />

    <v-row>
      <v-col>
        <v-card
          class="mx-auto rounded-xl border border-solid border-opacity-100"
          density="compact"
          elevation="10"
          title="Usuários vinculados"
        >
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn
                  v-for="mySection in mySectionsForLink"
                  :key="mySection.id"
                  :active="activeSectionId === mySection.sectionId"
                  :class="activeSectionId === mySection.sectionId ? 'bg-white' : ''"
                  class="mr-5"
                  color="primary"
                  rounded="xl"
                  variant="outlined"
                  @click="changeSectionIdForSectionFunctionUser(mySection.sectionId)"
                >
                  {{ mySection.section.acronym }}
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-data-table
                  :headers="headersMyUsers"
                  :items="sectionsFunctionsUsersFirstSectionId"
                  :loading="sectionFunctionUserStore.loading"
                  density="compact"
                  item-value="id"
                >
                  <template #[`item.user`]="{ item }">
                    <span v-if="item.user">
                      {{ item.user.rank.acronym }} - {{ item.user.serviceName }} (
                      {{ item.user.name }} )
                    </span>
                  </template>

                  <template #[`item.om`]="{ item }">
                    <span v-if="item.user">
                      {{ item.user.militaryOrganization.acronym }}
                    </span>
                  </template>

                  <template #[`item.permissionSetupUser`]="{ item }">
                    <template v-if="item.user">
                      <v-chip
                        v-for="setup in item.user.permissionSetupUser"
                        :key="setup.id"
                        append-icon="mdi-magnify"
                        class="d-block my-2 py-1"
                        size="small"
                        @click="openDialog('Ver Permissões', setup)"
                      >
                        {{ setup.permissionSetup.name }}
                      </v-chip>
                    </template>
                  </template>

                  <template #[`item.actions`]="{ item }">
                    <v-btn
                      v-if="
                        item.user &&
                        item.user.permissionSetupUser &&
                        item.user.permissionSetupUser.length > 0
                      "
                      class="mr-3"
                      color="primary"
                      prepend-icon="mdi-arrow-oscillating"
                      rounded="xl"
                      size="x-small"
                      text="Transferir Permissões"
                      variant="outlined"
                      @click="openDialog('Transferir Permissões', item)"
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
                      @click="openDialog('Excluir Vínculo', item)"
                    >
                      <template #prepend>
                        <v-icon class="pt-1" />
                      </template>
                      Excluir Vínculo
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
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
          <v-container v-if="selectedSectionFunctionUser && selectedSectionFunctionUser.user" fluid>
            <v-row>
              <v-col>
                <b>Militar: </b> {{ selectedSectionFunctionUser.user.rank.acronym }}
                {{ selectedSectionFunctionUser.user.serviceName }} <br >
                <b>Nome Completo: </b> {{ selectedSectionFunctionUser.user.name }}<br >
                <b>OM: </b>{{ selectedSectionFunctionUser.user.militaryOrganization.acronym }}<br >
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="tipoDialog === 'Transferir Permissões'">
            <v-row>
              <v-col>
                <v-alert closable type="warning">
                  <p class="text-justify">
                    <b>Atenção:</b> A transferência de permissões de um militar para outro, implica
                    na perda de todas as permissões atuais do militar que as possui.
                  </p>
                  <br >
                  <p class="text-justify">
                    Ex: Se o administrador "A" que possui um setup de permissões "X", transferir
                    esse setup para o militar "B", o militar "A" perde acesso às permissões "X",
                    passando todas as prerrogativas ao militar "B".
                  </p>
                  <br >
                  <v-alert type="error">
                    Certifique-se de selecionar os setups corretos.
                    <br ><br >
                    Caso o militar possua mais de um setup de permissões, e você deseja transferir
                    todos ao mesmo tempo para um outro militar, selecione todos.<br ><br >
                    Caso você deseje transferir um setup para um, e outro para outro militar, faça
                    isso por etapas.<br >
                    primeiro transfira um setup para um usuário, e em seguida realize a operação de
                    transferência pendente.
                  </v-alert>
                </v-alert>

                <br >

                <h4>Selecione os Setups de Permissão para a transferência.</h4>

                <v-select
                  v-if="
                    selectedSectionFunctionUser &&
                    selectedSectionFunctionUser.user &&
                    selectedSectionFunctionUser.user.permissionSetupUser
                  "
                  ref="selectRef"
                  v-model="selectedPermissionFunctionUserToTransfer"
                  :items="selectedSectionFunctionUser.user.permissionSetupUser"
                  chips
                  clearable
                  closable-chips
                  density="compact"
                  item-title="permissionSetup.name"
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

                <br >

                <h4
                  v-if="
                    selectedPermissionFunctionUserToTransfer.length > 0 &&
                    sectionsFunctionsUsersFirstSectionId.length > 0
                  "
                >
                  Selecione o usuário que receberá o setup selecionado.
                </h4>
                <v-select
                  v-if="
                    selectedPermissionFunctionUserToTransfer.length > 0 &&
                    sectionsFunctionsUsersFirstSectionId.length > 0
                  "
                  v-model="selectedUserToTransfer"
                  :item-title="
                    (item) =>
                      item?.user ? `${item.user.rank.acronym} ${item.user.serviceName}` : ''
                  "
                  :items="filteredSectionsFunctionsUsers"
                  density="compact"
                  item-value="userId"
                  label="Usuário"
                  placeholder="Selecione o usuário que receberá o setup"
                  required
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="tipoDialog === 'Excluir Vínculo'">
            <v-row>
              <v-col>
                <v-alert type="warning">
                  <p class="text-justify">
                    <b>Atenção:</b> A exclusão de vínculo, remove o estado ativo do mesmo em uma
                    Seção (Caso só exista um vínculo com a mesma).
                  </p>
                  <p class="text-justify">
                    Militares que não possuem vínculos com nenhuma seção, não conseguem acessar
                    nenhum módulo do sistema (apesar de ainda acessarem o sistema em si).
                  </p>

                  <p v-if="selectedSectionFunctionUser" class="pt-8">
                    Você deseja excluir o vínculo de:
                    <b>{{ selectedSectionFunctionUser.functionName }}</b> da seção:
                    <b>{{ selectedSectionFunctionUser.section.acronym }}</b>
                  </p>
                </v-alert>
                <v-spacer class="my-5" />
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="tipoDialog === 'Ver Permissões'">
            <ShowUserPermissionSetup />
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            v-if="tipoDialog !== 'Ver Permissões'"
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
