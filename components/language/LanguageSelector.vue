<script setup lang="ts">
  const { setLocale } = useI18n()
  const { brazilFlag, usFlag } = useIcons()
</script>

<template>
  <v-btn
    :icon="brazilFlag"
    rounded
    variant="text"
    @click="setLocale('pt-BR')"
  />

  <v-btn
    :icon="usFlag"
    rounded
    variant="text"
    @click="setLocale('en-US')"
  />
</template>
