<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  /* Transição PADRÃO (Fade) */
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s ease;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }

  /* Transição SLIDE-LEFT (para a página de registro) */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.25s ease-out;
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  /* Transição SLIDE-RIGHT (para a página de login) */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.25s ease-out;
  }
  .slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
