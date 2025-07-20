<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page-fade', mode: 'out-in' }" />
  </NuxtLayout>
</template>



<style>
  /* Demos um nome diferente ('page-fade') para evitar conflitos e ser mais descritivo */
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 0;
  }
</style>
