import type { AuthRouteMeta } from '~/types/auth'

export default defineNuxtRouteMiddleware((to) => {
  const routeAuthMeta = to.meta.auth;

  if (!routeAuthMeta) {
    return;
  }

  // Usa a store diretamente, que é persistida automaticamente pelo Pinia
  const authStore = useAuthUserStore();
  const isAuthenticated = authStore.isAuthenticated;

  const isAuthObject = (meta: unknown): meta is AuthRouteMeta => {
    return typeof meta === 'object' && meta !== null;
  };

  if (isAuthObject(routeAuthMeta) && routeAuthMeta.unauthenticatedOnly) {
    if (isAuthenticated) {
      return navigateTo(routeAuthMeta.navigateAuthenticatedTo || '/home');
    }
    return;
  }

  if (!isAuthenticated) {
    return navigateTo('/');
  }
});
