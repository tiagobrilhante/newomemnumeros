import prisma from '~/server/prisma'
import fs from 'fs'
import path from 'path'
import { ImageService } from '~/services/imageService'

const imageService = new ImageService()
// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validação dos campos obrigatórios
    if (!body.name || !body.acronym) {
      return createError({
        statusCode: 400,
        message: 'Dados inválidos. Nome, sigla e logo são obrigatórios.',
      })
    }

    let logoToSend = undefined
    if (body.logo) {
      // Delegar a validação e o processamento da imagem para o ImageService
      const { processedImage, processedMiniImage } = await imageService.validateAndProcess(
        body.logo
      )

      // Definir o diretório para salvar as imagens
      const organizationId = body.acronym + '_' + Date.now().toString() // ou use o id da organização se disponível
      const userDir = path.resolve('public', 'logos', organizationId)
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true })
      }
      const logoPath = path.join(userDir, 'logo.png')
      const logoMiniPath = path.join(userDir, 'logo_mini.png')

      // Salvar as imagens processadas
      fs.writeFileSync(logoPath, processedImage)
      fs.writeFileSync(logoMiniPath, processedMiniImage)

      logoToSend = `/logos/${organizationId}/logo.png`
    }

    // Criar a Organização Militar no banco, armazenando o caminho relativo dos logos
    return await prisma.militaryOrganization.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        color: body.color,
        militaryOrganizationId: body.militaryOrganizationId,
        logo: logoToSend,
      },
      include: {
        parentOrganization: true,
        subOrganizations: true,
      },
    })
  } catch (error) {
    console.error('Erro ao criar Organização Militar:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao criar Organização Militar',
    })
  }
})
