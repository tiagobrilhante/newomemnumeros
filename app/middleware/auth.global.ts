// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to) => {
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

  // Verificar se tem cookie mas store vazio (caso de reload)
  if (!isAuthenticated && routeAuthMeta === true) {
    const authCookie = useCookie('auth-token');
    if (authCookie.value) {
      try {
        // Tentar verificar token apenas quando necessário
        const response = await $fetch('/api/auth/verify-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (response?.user) {
          authStore.setUser(response.user);
          return; // Continue com a navegação
        }
      } catch (error: any) {
        // Se erro 401, token expirou - limpar cookie e fazer logout
        if (error?.response?.status === 401 || error?.statusCode === 401) {
          console.log('[MIDDLEWARE] Token expired - performing automatic logout');
          authCookie.value = null;
          authStore.$reset();
          return navigateTo(localePath('/'));
        }
      }
    }
  }

  if (isAuthObject(routeAuthMeta) && routeAuthMeta.unauthenticatedOnly) {
    if (isAuthenticated) {
      return navigateTo(localePath(routeAuthMeta.navigateAuthenticatedTo || '/home'));
    }
    return;
  }

  if (routeAuthMeta === true && !isAuthenticated) {
    return navigateTo(localePath('/'));
  }
});
