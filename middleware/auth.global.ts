import type { AuthRouteMeta } from '~/types/auth'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware((to) => {
  const routeAuthMeta = to.meta.auth;

  if (!routeAuthMeta) {
    return;
  }

  const authStore = useAuthUserStore();
  const isAuthenticated = authStore.isAuthenticated;
  const localePath = useLocalePath();

  const isAuthObject = (meta: unknown): meta is AuthRouteMeta => {
    return typeof meta === 'object' && meta !== null;
  };

  if (isAuthObject(routeAuthMeta) && routeAuthMeta.unauthenticatedOnly) {
    if (isAuthenticated) {
      return navigateTo(localePath(routeAuthMeta.navigateAuthenticatedTo || '/home'));
    }
    return;
  }

  if (!isAuthenticated) {
    return navigateTo(localePath('/'));
  }
});
