<script lang="ts" setup>
  const useAuthStore = useAuthUserStore()

  const { currentUser } = useUserData()

  const shouldShowCard = computed(() => !!currentUser)
  const serviceName = computed(() => {
    if (!currentUser.value) return null
    return `${currentUser.value.rank?.acronym} ${currentUser.value.serviceName}`
  })
  const handleLogout = useDebounceFn(async () => {
    try {
      await useAuthStore.logout()
      await navigateTo('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, 300)
</script>

<template>
  <v-container v-if="shouldShowCard" class="text-right" fluid grid-list-md>
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
                  <v-alert color="blue-grey-darken-4">
                    <v-icon left>mdi-account</v-icon>

                    {{ currentUser.rank.acronym }} {{ currentUser.serviceName }}<br >
                    <b>Nome:</b> {{ currentUser.name }}<br >
                    <b>Cpf: </b>{{ currentUser.cpf }}<br >
                    <b>Email: </b>{{ currentUser.email }}<br >
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
            <v-list-item prepend-icon="mdi-account" title="Alterar Dados" @click="handleLogout" />
            <v-list-item prepend-icon="mdi-logout" title="Sair" @click="handleLogout" />
          </v-list>
        </v-menu>
        <br >

        <v-btn
          flat
          prepend-icon="mdi-logout"
          size="small"
          text="Sair"
          variant="plain"
          @click="handleLogout"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
