<script lang="ts" setup>
  const config = useRuntimeConfig()
  const appCreator = config.public.APP_CREATOR
</script>
<template>
  <v-footer app class="footer-layout" color="#222222">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>{{ appCreator }}</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>
<style scoped>
  .footer-layout {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
