<script lang="ts" setup>
  const { logout } = useAuth()

  const useAuthStore = useAuthUserStore()


  const serviceName = computed(() => {
    if (!useAuthStore.user) return null
    return `${useAuthStore.user.rank?.acronym} ${useAuthStore.user.serviceName}`
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {

      createAppError('errors.serverCommunication', {
        statusCode: 500,
        statusMessageKey: 'errors.serverCommunication',
        fallbackStatusMessage: 'Logout Error',
        fallbackMessage: 'Erro ao fazer logout'
      })
    }
  }
</script>

<template>
  <v-container  class="text-right" fluid grid-list-md>
    <v-row>
      <v-col>
        <v-menu>
          <template #activator="{ props }">
            <v-btn color="white" flat size="small" v-bind="props" variant="plain">
              {{ serviceName }}
            </v-btn>
          </template>
          <v-list>
            <v-container>
              <v-row>
                <v-col>
                  <v-alert v-if="useAuthStore.user" color="blue-grey-darken-4">
                    <v-icon left>mdi-account</v-icon>

                    {{ useAuthStore.user.rank?.acronym }} {{ useAuthStore.user.serviceName }}<br >
                    <b>{{ $t('nameLabel') }}:</b> {{ useAuthStore.user.name }}<br >
                    <b>{{ $t('cpfLabel') }}: </b>{{ useAuthStore.user.cpf }}<br >
                    <b>{{ $t('emailLabel') }}: </b>{{ useAuthStore.user.email }}<br >
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
            <!-- TODO: Corrigir o @click para a funcionalidade correta -->
            <v-list-item prepend-icon="mdi-account" :title="$t('editData')" />
            <v-list-item prepend-icon="mdi-logout" :title="$t('logout')" @click="handleLogout" />
          </v-list>
        </v-menu>
        <br >

        <v-btn
          flat
          prepend-icon="mdi-logout"
          size="small"
          :text="$t('logout')"
          variant="plain"
          @click="handleLogout"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
