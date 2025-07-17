// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  // Verificar se existe usuário no contexto do evento
  const user = event.context.user

  if (!user) {
    return false
  }

  return true
})
