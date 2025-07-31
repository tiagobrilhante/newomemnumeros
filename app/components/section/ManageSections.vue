<script lang="ts" setup>
  import type { VDataTable } from 'vuetify/components'

  const { selectedMilitaryOrganization, loading, findMilitaryOrganization } = useMilitaryOrganizations()
  const { selectSection } = useSections()

  type State = 'list' | 'add' | 'edit' | 'delete'

  const currentState = ref<State>('list')

  defineProps<{
    cardProps: {
      modalType: string
      modalTextButton: string
      modalIcon: string
      showCancelBtn: boolean
    }
  }>()

  const FORM_PROPS = reactive({
    formType: '',
    formTextButton: '',
    formIcon: '',
    btnIcon: '',
  })

  const emit = defineEmits(['close-dialog'])

  const search = ref('')

  const headers: VDataTable['$props']['headers'] = [
    { title: $t('name'), key: 'name' },
    { title: $t('acronym'), key: 'acronym' },
    { title: $t('actions'), key: 'actions', sortable: false, align: 'center' },
  ]

  const changeCurrentState = (state: State, section?: section) => {
    currentState.value = state

    if (state === 'add') {
      FORM_PROPS.formType = 'add'
      FORM_PROPS.formTextButton = $t('add')
      FORM_PROPS.formIcon = 'mdi-plus-circle'
      FORM_PROPS.btnIcon = 'mdi-check'
    } else if (state === 'edit') {
      selectSection(section!)
      FORM_PROPS.formType = 'edit'
      FORM_PROPS.formTextButton = $t('edit')
      FORM_PROPS.formIcon = 'mdi-pencil'
      FORM_PROPS.btnIcon = 'mdi-content-save-check-outline'
    } else if (state === 'delete') {
      selectSection(section!)
      FORM_PROPS.formType = 'delete'
      FORM_PROPS.formTextButton = $t('delete')
      FORM_PROPS.formIcon = 'mdi-warning'
      FORM_PROPS.btnIcon = 'mdi-delete'
    }
  }

  const handleChildEvent = (newState: State) => {
    changeCurrentState(newState)
  }

  onMounted(async () => {
    if (selectedMilitaryOrganization.value?.id) {
      try {
        await findMilitaryOrganization(selectedMilitaryOrganization.value.id)
      } catch (error) {
        console.error('Erro ao atualizar dados da organização militar:', error)
      }
    }
  })


</script>
<template>
  <v-card
    :loading class="white-thick-border" rounded="xl"
  >

    <v-card-title class="bg-surface-light pt-4 grey-thick-border-bottom">
      <v-row>
        <v-col cols="10">
          <v-icon class="mr-3 mt-0" color="yellow" size="small">{{ cardProps.modalIcon }}</v-icon>
          {{ $t('manageSections') }}
        </v-col>
        <v-col v-if="cardProps.showCancelBtn && currentState === 'list'" class="text-right pr-2 pt-1" cols="2">
          <v-btn icon size="small" variant="text" @click="emit('close-dialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>

      <v-fade-transition mode="out-in">
        <v-alert v-if="currentState === 'list'" key="list">
          <v-row dense>
            <v-col >
              <h3>{{ $t('registeredSections') }} - {{ selectedMilitaryOrganization?.acronym }}</h3>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-btn color="primary" prepend-icon="mdi-plus-circle" rounded="xl" size="small" variant="outlined"
                     @click="changeCurrentState('add')">{{ $t('addNewSection') }}
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="selectedMilitaryOrganization?.sections"
            :loading="loading"
            :search="search"
            class="mt-3"
            density="compact"
          >
            <!-- actions-->
            <template #[`item.actions`]="{ item }">

              <!-- edit -->
              <v-tooltip :text="$t('edit')" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon-btn
                    :loading="loading"
                    class="mr-3"
                    color="primary"
                    icon="mdi-pencil"
                    size="small"
                    v-bind="props"
                    variant="outlined"
                    @click="changeCurrentState('edit', item)"

                  />
                </template>
              </v-tooltip>

              <!-- delete-->
              <v-tooltip :text="$t('delete')" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon-btn
                    :loading="loading"
                    color="error"
                    icon="mdi-delete"
                    size="small"
                    v-bind="props"
                    variant="outlined"
                    @click="changeCurrentState('delete', item)"

                  />
                </template>
              </v-tooltip>

            </template>
          </v-data-table>

        </v-alert>

        <section-form v-else-if="currentState === 'add' || currentState === 'edit'" key="form" :form-props="FORM_PROPS"
                      @change-state="handleChildEvent" />

        <section-delete-section v-else-if="currentState === 'delete'" key="delete" :form-props="FORM_PROPS"
                                @change-state="handleChildEvent" />
      </v-fade-transition>

    </v-card-text>

    <v-fade-transition>
      <v-card-actions v-if="cardProps.showCancelBtn && currentState === 'list'"
                      class="bg-surface-light py-4 px-5 grey-thick-border-top">
        <v-btn
          :text="cardProps.modalTextButton"
          class="px-4"
          color="primary"
          prepend-icon="mdi-close"
          rounded="xl"
          variant="elevated"
          @click="emit('close-dialog')"
        />
      </v-card-actions>
    </v-fade-transition>
  </v-card>
</template>


