import type { H3Event } from 'h3'

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler((event: H3Event & { _matched?: string }) => {
  const method = event.node.req.method
  const routeFile = event.node.req.url?.split('?')[0] || ''

  // Se o nome do arquivo terminar com '.get.ts' só pode aceitar GET
  if (routeFile.includes('.get.ts') && method !== 'GET') {
    // Retorna explicitamente o status 405
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${method} Not Allowed - This endpoint only accepts GET requests`,
    })
  }
})
