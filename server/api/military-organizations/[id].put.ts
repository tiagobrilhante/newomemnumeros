import prisma from '~/server/prisma'
import { ImageService } from '~/services/imageService'
import path from 'path'
import fs from 'fs/promises'
import { cleanStringToCreateFolders } from '~/utils/clean-string-to-create-folders'

const imageService = new ImageService()

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }

  try {
    const body = await readBody(event)

    const militaryOrganization = await prisma.militaryOrganization.findUnique({
      where: { id: Number(id), deleted: false },
    })

    if (!militaryOrganization) {
      return createError({ statusCode: 404, message: 'Organização Militar não encontrada' })
    }

    if (Object.prototype.hasOwnProperty.call(body, 'logo')) {
      const isBase64 = (str: string): boolean => /^data:image\/(png|jpeg);base64,/.test(str)

      if (isBase64(body.logo)) {
        // Nova imagem enviada: criar nova pasta com acronym e timestamp
        console.time('processImage')
        const { processedImage, processedMiniImage } = await imageService.validateAndProcess(
          body.logo
        )

        const cleanedAcronym = cleanStringToCreateFolders(militaryOrganization.acronym)

        const directoryPath = `${cleanedAcronym}_${Date.now()}`
        const userDir = path.resolve('public', 'logos', directoryPath)

        await fs.mkdir(userDir, { recursive: true })
        await fs.writeFile(path.join(userDir, 'logo.png'), processedImage)
        await fs.writeFile(path.join(userDir, 'logo_mini.png'), processedMiniImage)

        // Se havia um logo anterior (e não era o default), excluí-lo
        if (
          militaryOrganization.logo &&
          militaryOrganization.logo !== '/logos/default/default.png'
        ) {
          const oldDir = path.resolve(
            'public',
            'logos',
            path.dirname(militaryOrganization.logo).replace(/^\/logos\//, '')
          )
          await fs.rm(oldDir, { recursive: true, force: true })
        }

        body.logo = `/logos/${directoryPath}/logo.png`
      } else if (!body.logo || body.logo === '/logos/default/default.png') {
        // Logo removido ou definido como default: excluir pasta antiga se existir
        if (
          militaryOrganization.logo &&
          militaryOrganization.logo !== '/logos/default/default.png'
        ) {
          const userDir = path.resolve(
            'public',
            'logos',
            path.dirname(militaryOrganization.logo).replace(/^\/logos\//, '')
          )
          await fs.rm(userDir, { recursive: true, force: true })
        }
        body.logo = '/logos/default/default.png'
      } else if (body.logo === militaryOrganization.logo) {
        if (militaryOrganization.logo !== '/logos/default/default.png') {
          // Logo não mudou: manter o existente (nenhuma ação necessária)
          console.log('Logo não alterado, mantendo o existente:', body.logo)
        } else {
          console.log('removo o logo existente e substituo pelo default')
        }
      }
    }

    const updated = await prisma.militaryOrganization.update({
      where: { id: Number(id), deleted: false },
      data: body,
      include: {
        users: { where: { deleted: false } },
        subOrganizations: true,
        parentOrganization: true,
      },
    })
    console.timeEnd('prismaUpdate')

    console.timeEnd('Total Execution')
    return updated
  } catch (error) {
    console.error(`Erro ao atualizar Organização Militar ${id}:`, error)
    throw createError({ statusCode: 500, message: 'Erro ao atualizar Organização Militar' })
  }
})
