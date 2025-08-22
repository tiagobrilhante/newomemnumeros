<script lang="ts" setup>
const { selectedRoleType, setRoleType } = useRoles()
const { t } = useI18n()

const selectRoleType = (type: string) => {
  setRoleType(type)
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
          <h2 class="pt-0"> {{ t('permission.roleTypes') }}
          </h2>
        </v-col>
        <v-col>

          <v-btn block color="primary" :variant="selectedRoleType === 'global' ? 'flat' : 'outlined'" rounded="xl" @click="selectRoleType('global')" :text="t('permission.globalLabel')"/>
        </v-col>
        <v-col cols="1"/>
        <v-col>
          <v-btn block color="primary" :variant="selectedRoleType === 'mo' ? 'flat' : 'outlined'" rounded="xl" @click="selectRoleType('mo')" :text="t('permission.mo')"/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

