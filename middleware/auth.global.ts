import type { AuthRouteMeta } from '~/types/auth'

export default defineNuxtRouteMiddleware((to) => {
  const routeAuthMeta = to.meta.auth;

  if (!routeAuthMeta) {
    return;
  }

  const authCookie = useCookie<{ user: object | null }>('auth');
  const isAuthenticated = !!authCookie.value?.user;

  const isAuthObject = (meta: any): meta is AuthRouteMeta => {
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
