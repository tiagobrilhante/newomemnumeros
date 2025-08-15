<script lang="ts" setup>
const store = useRoleStore()
const selectedRoleScope = ref<string | null>(null)

const selectRoleType = (type: string) => {

  selectedRoleScope.value = type
  store.setRoleType(type)
}

</script>

<template>
  <v-card
    class="mx-auto pl-3 mb-4 border border-solid border-opacity-100"
    elevation="10"
    rounded="xl"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col align-self="center" class="text-left align-content-center pt-1">
          <h2 class="pt-0"> Tipos de Roles
          </h2>
        </v-col>
        <v-col>

          <v-btn @click="selectRoleType('global')" block color="primary" :variant="selectedRoleScope === 'global' ? 'flat' : 'outlined'" rounded="xl">Globais</v-btn>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col>
          <v-btn @click="selectRoleType('mo')" block color="primary" :variant="selectedRoleScope === 'mo' ? 'flat' : 'outlined'" rounded="xl">OM</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

