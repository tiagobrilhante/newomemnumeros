<script setup lang="ts">
import type { Role } from '#shared/types/role'
import type { VDataTable } from 'vuetify/components'
import { isGlobalRole, getOrganizationRoles } from '#shared/utils'

const { selectedMilitaryOrganization } = useMilitaryOrganizations()
const { fetchRolesByOrganization, fetchRoles, fetchRoleUsage, roles, loading } = useRoles()
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
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Sigla', key: 'acronym', sortable: true },
  { title: 'Permissões', key: 'permissions', sortable: false },
  { title: 'Uso', key: 'usage', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' }
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
const editRole = (role: Role) => {
  console.log('Editar role:', role)
  // TODO: Implementar edição
}

const deleteRole = (role: Role) => {
  console.log('Deletar role:', role)
  // TODO: Implementar confirmação e deleção
}

const viewRoleUsage = async (role: Role) => {
  try {
    if (!role.id) {
      console.error('Role ID não encontrado')
      return
    }
    
    const usage = await fetchRoleUsage(role.id)
    console.log('Uso da role:', usage)
    
    // Mostrar dialog com informações de uso
    const orgCount = usage.organizationsUsingRole?.length || 0
    const userCount = usage.usersWithRole || 0
    const sectionCount = usage.sectionsUsingRole?.length || 0
    const isGlobal = usage.isGlobal ? 'Global' : 'Organizacional'
    
    const message = `Role: ${role.name}\nOrganizações que usam: ${orgCount}\nUsuários com esta role: ${userCount}\nSeções vinculadas: ${sectionCount}\nTipo: ${isGlobal}`
    
    alert(message) // TODO: Substituir por dialog melhor
  } catch (error) {
    console.error('Erro ao buscar uso da role:', error)
    alert('Erro ao buscar informações de uso da role')
  }
}

const openDialog = (type: string) => {
  CARD_PROPS.modalType = type
  dialog.value = true
}

onMounted(async () => {
  // Buscar todos os roles para poder mostrar tanto organizacionais quanto globais
  await fetchRoles()
})
</script>
<template>
  <div class="mt-4">
    <v-expansion-panels variant="accordion" rounded="xl" class="border rounded-xl border-solid border-opacity-100">
      <!-- Panel de Roles da Organização Selecionada -->
      <v-expansion-panel v-if="selectedMilitaryOrganization">
        <v-expansion-panel-title>
          <div class="d-flex align-center ga-2">
            <v-icon>mdi-account-group</v-icon>
            <span>Roles da {{ selectedMilitaryOrganization.acronym }}</span>
            <v-chip size="small" color="primary" variant="text">
              {{ organizationRoles.length }}
            </v-chip>
          </div>
          <template #actions>
            <v-btn
              prepend-icon="mdi-plus-circle"
              color="primary"
              size="small"
              @click.stop="openDialog('add')"
            >
              Criar Role da OM
            </v-btn>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="headers"
            :items="organizationRoles"
            :loading="loading"
            :items-per-page="10"
            loading-text="Carregando roles da organização..."
            no-data-text="Nenhum role encontrado para esta organização"
            class="mt-4"
          >
            <template #[`item.permissions`]="{ item }">
              <div class="d-flex flex-wrap ga-1">
                <v-chip
                  v-for="rolePermission in item.permissions || []"
                  :key="rolePermission.id"
                  size="x-small"
                  color="primary"
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
                size="small"
                color="info"
                variant="tonal"
                @click="viewRoleUsage(item)"
                class="cursor-pointer"
              >
                <v-icon start>mdi-information-outline</v-icon>
                Ver uso
              </v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                size="small"
                icon="mdi-pencil"
                variant="text"
                @click="editRole(item)"
              ></v-btn>
              <v-btn
                size="small"
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="deleteRole(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Panel de Roles Globais -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <div class="d-flex align-center ga-2">
            <v-icon>mdi-earth</v-icon>
            <span>Roles Globais</span>
            <v-chip size="small" color="secondary" variant="text">
              {{ globalRoles.length }}
            </v-chip>
          </div>
          <template #actions>
            <v-btn
              prepend-icon="mdi-plus-circle"
              color="secondary"
              size="small"
              @click.stop=""
            >
              Criar Role Global
            </v-btn>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="headers"
            :items="globalRoles"
            :loading="loading"
            :items-per-page="10"
            loading-text="Carregando roles globais..."
            no-data-text="Nenhum role global encontrado"
            class="mt-4"
          >
            <template #[`item.permissions`]="{ item }">
              <div class="d-flex flex-wrap ga-1">
                <v-chip
                  v-for="rolePermission in item.permissions || []"
                  :key="rolePermission.id"
                  size="x-small"
                  color="secondary"
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
                size="small"
                color="success"
                variant="tonal"
                @click="viewRoleUsage(item)"
                class="cursor-pointer"
              >
                <v-icon start>mdi-earth</v-icon>
                Ver organizações
              </v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                size="small"
                icon="mdi-pencil"
                variant="text"
                @click="editRole(item)"
              ></v-btn>
              <v-btn
                size="small"
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="deleteRole(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>



    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :max-width="CARD_PROPS.modalType === 'add' || CARD_PROPS.modalType === 'edit' ? '80%' : CARD_PROPS.modalType === 'delete' ? '60%' : '30%'"
      persistent
    >
      <permissions-form />
    </v-dialog>



  </div>
</template>

