// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware((to, _from) => {
  const navigationHistory = useLocalStorage<string[]>('history', [])

  if (to.path) {
    navigationHistory.value.push(to.path)
  }
})
