<script lang="ts" setup>
  import type { Role } from '#shared/types/role'
  import type { VDataTable } from 'vuetify/components'
  import { getOrganizationRoles, isGlobalRole } from '#shared/utils'

  const { selectedMilitaryOrganization } = useMilitaryOrganizations()
  const { t } = useI18n()
  const {
    fetchRoles,
    fetchRoleUsage,
    roles,
    loading,
    getRoleType,
  } = useRoles()
  const dialog = ref(false)
  const CARD_PROPS = reactive({
    modalType: '',
    modalTextButton: '',
    modalIcon: '',
    btnIcon: '',
    showCancelBtn: true,
  })

  // Headers da tabela
  const headers: VDataTable['$props']['headers'] = [
    { title: t('name'), key: 'name', sortable: true },
    { title: t('acronym'), key: 'acronym', sortable: true },
    { title: t('permission.permissions'), key: 'permissions', sortable: false },
    { title: t('permission.usage'), key: 'usage', sortable: false },
    { title: t('actions'), key: 'actions', sortable: false, align: 'center' },
  ]

  // Computeds para separar roles organizacionais dos globais baseado nas permissões
  const organizationRoles = computed(() => {
    if (!selectedMilitaryOrganization.value?.id) return []
    return getOrganizationRoles(roles.value, selectedMilitaryOrganization.value.id)
  })

  const globalRoles = computed(() => {
    return roles.value.filter(role => isGlobalRole(role))
  })

  // Funções para ações
  const editRole = (_role: Role) => {
    // TODO: Implementar edição
  }

  const deleteRole = (_role: Role) => {
    // TODO: Implementar confirmação e deleção
  }

  const viewRoleUsage = async (role: Role) => {
    try {
      if (!role.id) {
        console.error('Role ID não encontrado')
        return
      }

      const usage = await fetchRoleUsage(role.id)

      if (!usage) {
        alert('Erro: Informações de uso não encontradas')
        return
      }

      // Mostrar dialog com informações de uso
      const orgCount = usage!.organizationsUsingRole?.length || 0
      const userCount = usage!.usersWithRole || 0
      const sectionCount = usage!.sectionsUsingRole?.length || 0
      const isGlobal = usage!.isGlobal ? 'Global' : 'Organizacional'

      const message = `Role: ${role.name}\nOrganizações que usam: ${orgCount}\nUsuários com esta role: ${userCount}\nSeções vinculadas: ${sectionCount}\nTipo: ${isGlobal}`

      alert(message) // TODO: Substituir por dialog melhor
    } catch (error) {
      console.error('Erro ao buscar uso da role:', error)
      alert('Erro ao buscar informações de uso da role')
    }
  }

  const openDialog = (type: string) => {
    CARD_PROPS.modalType = type

    switch (type) {
      case 'add':
        CARD_PROPS.modalTextButton = t('save')
        CARD_PROPS.modalIcon = 'mdi-plus-circle'
        CARD_PROPS.btnIcon = 'mdi-content-save-check'
        break
      case 'edit':
        if (!selectedMilitaryOrganization) return
        CARD_PROPS.modalIcon = 'mdi-pencil-circle'
        CARD_PROPS.btnIcon = 'mdi-content-save-check'
        CARD_PROPS.modalTextButton = t('update')
        break
      case 'delete':
        if (!selectedMilitaryOrganization) return
        CARD_PROPS.modalIcon = 'mdi-alert'
        CARD_PROPS.btnIcon = 'mdi-delete'
        CARD_PROPS.modalTextButton = t('delete')
        break
    }

    dialog.value = true
  }

  onMounted(async () => {
    // Buscar todos os roles para poder mostrar tanto organizacionais quanto globais
    await fetchRoles()
  })
</script>
<template>
  <div class="mt-4">


    <!-- Panel de Roles da Organização Selecionada -->

    <v-card v-if="selectedMilitaryOrganization && getRoleType() === 'mo'"
            class="border rounded-xl border-solid border-opacity-100">
      <v-card-title class="bg-surface-light py-3">
        <v-row>
          <v-col>
            <v-icon class="mr-4">mdi-account-group</v-icon>
            <span>{{ t('permission.tableTitleMo') }} {{ selectedMilitaryOrganization.acronym }}</span>
            <v-chip color="primary" size="small" variant="text">
              {{ organizationRoles.length }}
            </v-chip>
          </v-col>
          <v-col class="text-right">
            <v-btn
              color="success"
              prepend-icon="mdi-plus-circle"
              rounded="xl"
              size="small"
              @click.stop="openDialog('add')"
            >
              {{ t('permission.createRoleMo') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="organizationRoles"
          :items-per-page="10"
          :loading="loading"
          class="mt-4"
          loading-text="Carregando roles da organização..."
          no-data-text="Nenhum role encontrado para esta organização"
        >
          <template #[`item.permissions`]="{ item }">
            <div class="d-flex flex-wrap ga-1">
              <v-chip
                v-for="rolePermission in item.permissions || []"
                :key="rolePermission.id"
                color="primary"
                size="x-small"
                variant="tonal"
              >
                {{ rolePermission.permission.slug }}
              </v-chip>
              <span v-if="!item.permissions || item.permissions.length === 0" class="text-grey">
                  Nenhuma permissão
                </span>
            </div>
          </template>
          <template #[`item.usage`]="{ item }">
            <v-chip
              class="cursor-pointer"
              color="info"
              size="small"
              variant="tonal"
              @click="viewRoleUsage(item)"
            >
              <v-icon start>mdi-information-outline</v-icon>
              Ver uso
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editRole(item)"
            />
            <v-btn
              color="error"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="deleteRole(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Panel de Roles Globais -->
    <v-card v-if="getRoleType() === 'global'" class="border rounded-xl border-solid border-opacity-100">
      <v-card-title>
        <v-row>
          <v-col>
            <v-icon class="mr-4">mdi-earth</v-icon>
            <span>{{ t('permission.tableTitleGlobal') }}</span>
            <v-chip color="secondary" size="small" variant="text">
              {{ globalRoles.length }}
            </v-chip>
          </v-col>
          <v-col class="text-right">
            <v-btn
              color="success"
              prepend-icon="mdi-plus-circle"
              rounded="xl"
              size="small"
              @click.stop="openDialog('add')"
            >
              {{ t('permission.createRoleGlobal') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="globalRoles"
          :items-per-page="10"
          :loading="loading"
          class="mt-4"
          loading-text="Carregando roles globais..."
          no-data-text="Nenhum role global encontrado"
        >
          <template #[`item.permissions`]="{ item }">
            <div class="d-flex flex-wrap ga-1">
              <v-chip
                v-for="rolePermission in item.permissions || []"
                :key="rolePermission.id"
                color="secondary"
                size="x-small"
                variant="tonal"
              >
                {{ rolePermission.permission.slug }}
              </v-chip>
              <span v-if="!item.permissions || item.permissions.length === 0" class="text-grey">
                  Nenhuma permissão
                </span>
            </div>
          </template>
          <template #[`item.usage`]="{ item }">
            <v-chip
              class="cursor-pointer"
              color="success"
              size="small"
              variant="tonal"
              @click="viewRoleUsage(item)"
            >
              <v-icon start>mdi-earth</v-icon>
              Ver organizações
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editRole(item)"
            />
            <v-btn
              color="error"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="deleteRole(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>


    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :max-width="CARD_PROPS.modalType === 'add' || CARD_PROPS.modalType === 'edit' ? '80%' : CARD_PROPS.modalType === 'delete' ? '60%' : '30%'"
      persistent
    >
      <permissions-form :card-props="CARD_PROPS" @close-dialog="dialog = false" />
    </v-dialog>


  </div>
</template>

