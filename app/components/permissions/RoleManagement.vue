<script lang="ts" setup>
  import { PERMISSION_CATEGORIES } from '#shared/constants/permissions'
</script>
<template>
  <v-row>
    <v-col>
      <v-card>
        {{PERMISSION_CATEGORIES}}
      </v-card>
    </v-col>
  </v-row>
</template>
