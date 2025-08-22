<script lang="ts" setup>
  import { PERMISSION_CATEGORIES } from '#shared/constants/permissions'

  const { t } = useI18n()
  const { selectedMilitaryOrganization } = useMilitaryOrganizations()
  const { loading, selectedRoleType } = useRoles()

  const selectedPermissions = ref<string[]>([])

  const { cardProps } = defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      modalIcon: string
      btnIcon: string
    }
  }>()

  const emit = defineEmits<{
    'close-dialog': []
  }>()

  const SUPER_ADMIN_PERMISSION = 'global.system.manage'
  const ORG_ADMIN_PERMISSION = 'global.organization.manage'
  const name = ref('')
  const sectionId = ref<string | undefined>(undefined)
  const error = ref<{
    msgError: string
    active: boolean
    arrayOfErrors: string[]
  }>({
    msgError: '',
    active: false,
    arrayOfErrors: [],
  })


  // form validations
  const requiredRule = [(v: string) => !!v || `${t('thisField')} ${t('isRequired')}`]


  const isSuperAdmin = computed(() => selectedPermissions.value.includes(SUPER_ADMIN_PERMISSION))
  const isOrgAdmin = computed(() => selectedPermissions.value.includes(ORG_ADMIN_PERMISSION))
  const hasHighLevelPermission = computed(() => isSuperAdmin.value || isOrgAdmin.value)

  const isModuleVisible = (moduleAlias: string) => {
    if (selectedRoleType.value === 'global') {
      // Se está criando role global, mostra APENAS o módulo global
      return moduleAlias === 'global'
    } else {
      // Se está criando role de MO, mostra todos EXCETO o global
      return moduleAlias !== 'global'
    }
  }

  const isSubcategoryVisible = (moduleAlias: string, subcategoryName: string) => {
    if (isSuperAdmin.value || isOrgAdmin.value) {
      return moduleAlias === 'global' && subcategoryName === 'system_access'
    }

    return true
  }

  const isPermissionVisible = (slug: string) => {
    if (isSuperAdmin.value) {
      return slug === SUPER_ADMIN_PERMISSION
    }
    if (isOrgAdmin.value) {
      return slug === ORG_ADMIN_PERMISSION
    }

    return true
  }

  const isSubcategoryFullySelected = (subcategoryPermissions: any[]) => {
    const visiblePermissions = subcategoryPermissions.filter(p => isPermissionVisible(p.slug))
    return visiblePermissions.length > 0 && visiblePermissions.every(permission =>
      selectedPermissions.value.includes(permission.slug),
    )
  }

  const isSubcategoryPartiallySelected = (subcategoryPermissions: any[]) => {
    const visiblePermissions = subcategoryPermissions.filter(p => isPermissionVisible(p.slug))
    return visiblePermissions.some(permission =>
      selectedPermissions.value.includes(permission.slug),
    ) && !isSubcategoryFullySelected(subcategoryPermissions)
  }

  const toggleSubcategorySelection = (subcategoryPermissions: any[]) => {
    const visiblePermissions = subcategoryPermissions.filter(p => isPermissionVisible(p.slug))
    const subcategorySlugs = visiblePermissions.map(p => p.slug)

    if (isSubcategoryFullySelected(subcategoryPermissions)) {
      selectedPermissions.value = selectedPermissions.value.filter(slug =>
        !subcategorySlugs.includes(slug),
      )
    } else {
      const newSlugs = subcategorySlugs.filter(slug =>
        !selectedPermissions.value.includes(slug),
      )
      selectedPermissions.value.push(...newSlugs)
    }
  }

  const togglePermissionSelection = (slug: string) => {
    const index = selectedPermissions.value.indexOf(slug)

    if (index > -1) {
      selectedPermissions.value.splice(index, 1)
    } else {
      if (slug === SUPER_ADMIN_PERMISSION) {
        selectedPermissions.value = [SUPER_ADMIN_PERMISSION]
      } else if (slug === ORG_ADMIN_PERMISSION) {
        selectedPermissions.value = [ORG_ADMIN_PERMISSION]
      } else {
        selectedPermissions.value.push(slug)
      }
    }
  }

  const resetError = () => {
    error.value.msgError = ''
    error.value.active = false
    error.value.arrayOfErrors = []
  }
</script>

<template>
  <v-card :loading class="white-thick-border" rounded="xl">
    <v-card-title class="bg-surface-light pt-4">
      <v-row>
        <v-col cols="10">
          <v-icon class="mr-3 mt-0" size="small">{{ cardProps.modalIcon }}</v-icon>
          {{ t(cardProps.modalType) }} {{ t('permission.role') }}
          <span
            v-if="selectedRoleType === 'mo' && selectedMilitaryOrganization">-  {{ selectedMilitaryOrganization.acronym }}</span>
          <span v-else>- {{ t('permission.' + selectedRoleType + 'Label') }}</span></v-col>
        <v-col class="text-right pr-2 pt-1" cols="2">
          <v-btn icon size="small" variant="text" @click="emit('close-dialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <!--name and section-->
      <v-row>
        <!-- Name - full -->
        <v-col>
          <v-text-field
            id="name"
            v-model="name"
            :label="t('permission.input.role.name')"
            :placeholder="t('permission.input.role.name')"
            :rules="requiredRule"
            class="mb-3"
            density="compact"
            required
            rounded="xl"
            variant="outlined"
            @input="resetError"
          />
        </v-col>
        <!--section-->
        <v-col>
          <v-autocomplete
            v-if="selectedMilitaryOrganization"
            v-model="sectionId"
            :hint="t('selectSessionHint')"
            :items="selectedMilitaryOrganization?.sections"
            :label="t('section')"
            :loading
            :placeholder="t('selectSession')"
            class="mb-3"
            clearable
            density="compact"
            item-title="acronym"
            item-value="id"
            rounded="xl"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <!-- Informative message for admin users -->
      <v-row v-if="hasHighLevelPermission" class="mt-4">
        <v-col cols="12">
          <v-alert
            :text="isSuperAdmin
              ? t('permission.messages.superUserMessage')
              : t('permission.messages.organizationAdminMessage')"
            :title="isSuperAdmin ? t('permission.messages.superUserSelected') : t('permission.messages.organizationAdminSelected')"
            :type="isSuperAdmin ? 'success' : 'info'"
            prominent
            rounded="xl"
            variant="tonal"
          />
        </v-col>
      </v-row>

      <!-- by modules-->
      <v-row class="mt-4">
        <v-col
          v-for="module in PERMISSION_CATEGORIES"
          v-show="isModuleVisible(module.module_alias) && module.subcategories.some(sub => isSubcategoryVisible(module.module_alias, sub.name))"
          :key="module.module_alias"
          cols="12"
          md="6"
        >
          <!-- module info card and permissions-->
          <v-card
            :color="module.module_color"
            :title="t('permission.module.' + module.module_alias)"
            class="mb-6"
            rounded="xl"
            variant="tonal"
          >
            <v-card-text>
              <!--alias-->
              <div class="mb-4">
                <b>Alias: </b>
                <v-chip
                  :color="module.module_color"
                  :text="module.module_alias"
                  size="small"
                  variant="outlined"
                />
              </div>

              <!-- subcategories -->
              <v-expansion-panels
                class="mb-4"
                multiple
                rounded="xl"
                variant="accordion"
              >
                <v-expansion-panel
                  v-for="subcategory in module.subcategories"
                  v-show="isSubcategoryVisible(module.module_alias, subcategory.name)"
                  :key="subcategory.name"
                  :title="t('permission.subcategories.' + subcategory.name + '.title')"
                >
                  <v-expansion-panel-text>
                    <p class="text-body-2 text-medium-emphasis mb-3">
                      {{ t('permission.subcategories.' + subcategory.name + '.description') }}
                    </p>

                    <!-- Checkbox -->
                    <v-list-item
                      v-if="subcategory.permissions.filter(p => isPermissionVisible(p.slug)).length > 1 && subcategory.name !== 'system_access'"
                      class="px-0 mb-2 bg-grey-lighten-4 rounded"
                    >
                      <template #prepend>
                        <v-checkbox
                          :indeterminate="isSubcategoryPartiallySelected(subcategory.permissions)"
                          :model-value="isSubcategoryFullySelected(subcategory.permissions)"
                          color="primary"
                          density="compact"
                          hide-details
                          @click="toggleSubcategorySelection(subcategory.permissions)"
                        />
                      </template>

                      <v-list-item-title class="text-body-2 font-weight-medium">
                        {{ t('selectAll') }} ({{ subcategory.permissions.filter(p => isPermissionVisible(p.slug)).length
                        }})
                      </v-list-item-title>
                    </v-list-item>

                    <!-- list permissions -->
                    <v-list density="compact">
                      <v-list-item
                        v-for="permission in subcategory.permissions"
                        v-show="isPermissionVisible(permission.slug)"
                        :key="permission.slug"
                        class="px-0"
                      >
                        <template #prepend>
                          <v-checkbox
                            :model-value="selectedPermissions.includes(permission.slug)"
                            color="primary"
                            density="compact"
                            hide-details
                            @click="togglePermissionSelection(permission.slug)"
                          />
                        </template>

                        <v-list-item-title class="text-body-2">
                          {{ t('permission.' + permission.slug) }}
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-caption">
                          {{ permission.slug }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- total available permissions -->
              <template v-if="!(module.module_alias === 'global' && hasHighLevelPermission)">
                <v-divider class="mb-3" />
                <div class="d-flex justify-space-between align-center">
              <span class="text-caption text-medium-emphasis">
                {{ t('permission.totalPermissions') }}
              </span>
                  <v-chip size="x-small" variant="outlined">
                    {{ module.subcategories.reduce((total, sub) => total + sub.permissions.length, 0) }}
                  </v-chip>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- selected permissions -->
      <v-row v-if="selectedPermissions.length > 0" class="mt-6">
        <v-col cols="12">
          <v-card
            :title="`${t('permission.selectedPermissions')} ${ selectedPermissions.length }`" color="error"
            rounded="xl" variant="outlined">

            <v-card-text>
              <v-chip-group column>
                <v-chip
                  v-for="permission in selectedPermissions"
                  :key="permission"
                  :text="permission"
                  closable
                  size="small"
                  variant="outlined"
                  @click:close="togglePermissionSelection(permission)"
                />
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- actions-->
    <v-card-actions class="bg-surface-light py-4 px-5">
      <v-spacer />

      <!-- submit-->
      <v-btn
        :prepend-icon="cardProps.btnIcon"
        :text="cardProps.modalTextButton"
        class="mr-5 px-4"
        color="primary"
        rounded="xl"
        type="submit"
        variant="elevated"
      />

      <!-- cancel-->
      <v-btn
        :text="t('cancel')"
        class="px-4"
        color="error"
        prepend-icon="mdi-cancel"
        rounded="xl"
        variant="elevated"
        @click="emit('close-dialog')"
      />
    </v-card-actions>
  </v-card>


</template>
