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

  // Para rotas protegidas, SEMPRE verificar o cookie
  if (routeAuthMeta === true) {
    const authCookie = useCookie('auth-token');
    
    // Se não tem cookie mas tem user no store, tentar verificar token primeiro
    if (!authCookie.value && isAuthenticated) {
      
      try {
        const response = await $fetch<ApiResponse<{ user: user }>>('/api/auth/verify-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (response?.success && response?.data?.user) {
          return;
        }
      } catch (error) {
      }
      
      authStore.logout();
      return navigateTo(localePath('/'));
    }
    
    // Se não está autenticado e tem cookie, verificar token
    if (!isAuthenticated && authCookie.value) {
      try {
        const response = await $fetch<ApiResponse<{ user: user }>>('/api/auth/verify-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (response?.success && response?.data?.user) {
          authStore.setUser(response.data.user);
          return;
        } else {
          // Se a resposta não é successful, limpar e redirecionar
          authStore.logout();
          return navigateTo(localePath('/'));
        }
      } catch (error: any) {
        authStore.logout();
        return navigateTo(localePath('/'));
      }
    }
    
    // Se não está autenticado e não tem cookie, redirecionar para login
    if (!isAuthenticated && !authCookie.value) {
      return navigateTo(localePath('/'));
    }
  }

  if (isAuthObject(routeAuthMeta) && routeAuthMeta.unauthenticatedOnly) {
    if (isAuthenticated) {
      return navigateTo(localePath(routeAuthMeta.navigateAuthenticatedTo || '/home'));
    }
    return;
  }
});
