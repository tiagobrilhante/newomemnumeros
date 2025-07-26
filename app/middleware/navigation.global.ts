// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware((to, _from) => {
  const navigationStore = useNavigationStore()

  const authStore = useAuthUserStore()
  if (!authStore.isAuthenticated) {
    return
  }

  navigationStore.setCurrentPath(to.path)
})
