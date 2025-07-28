import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { ImageService } from '../../app/services/imageService'

export interface ImageUploadOptions {
  folder: 'logos' | 'profiles' | 'documents'
  subFolder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

export interface ImageUploadResult {
  success: boolean
  filePath?: string
  publicUrl?: string
  error?: string
}

export class ImageUploadService {
  private readonly baseUploadDir = path.join(process.cwd(), 'public')
  private readonly maxSizeMB = 5 // Default 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  private readonly imageService = new ImageService()

  /**
   * Salva logo com thumbnail usando o padrão existente
   */
  async saveLogoWithThumb(
    base64Data: string,
    organizationId: string
  ): Promise<ImageUploadResult> {
    try {
      // Usar seu ImageService existente
      const { processedImage, processedMiniImage } = await this.imageService.validateAndProcess(base64Data)
      
      // Diretório específico da organização
      const uploadDir = path.join(this.baseUploadDir, 'logos', organizationId)
      await this.ensureDirectoryExists(uploadDir)
      
      // Salvar ambas as imagens com nomes fixos
      const logoPath = path.join(uploadDir, 'logo.png')
      const logoMiniPath = path.join(uploadDir, 'logo_mini.png')
      
      await fs.writeFile(logoPath, processedImage)
      await fs.writeFile(logoMiniPath, processedMiniImage)
      
      // Retornar URL do logo normal
      const publicUrl = `/logos/${organizationId}/logo.png`
      
      return {
        success: true,
        filePath: logoPath,
        publicUrl
      }
      
    } catch (error) {
      console.error('Error saving logo with thumb:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process logo' 
      }
    }
  }

  /**
   * Salva uma imagem base64 como arquivo
   */
  async saveBase64Image(
    base64Data: string, 
    options: ImageUploadOptions
  ): Promise<ImageUploadResult> {
    try {
      // Validar e extrair dados da base64
      const { mimeType, buffer, extension } = this.parseBase64(base64Data)
      
      // Validações
      const validation = this.validateImage(buffer, mimeType, options)
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // Gerar nome único do arquivo
      const fileName = `${randomUUID()}.${extension}`
      
      // Construir caminho do diretório
      const uploadDir = this.buildUploadPath(options)
      
      // Criar diretório se não existir
      await this.ensureDirectoryExists(uploadDir)
      
      // Caminho completo do arquivo
      const filePath = path.join(uploadDir, fileName)
      
      // Salvar arquivo
      await fs.writeFile(filePath, buffer)
      
      // URL pública relativa
      const publicUrl = this.buildPublicUrl(options, fileName)
      
      return {
        success: true,
        filePath,
        publicUrl
      }
      
    } catch (error) {
      console.error('Error saving image:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Remove uma imagem do sistema de arquivos
   */
  async deleteImage(publicUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Não deletar imagem padrão
      if (publicUrl.includes('default.png')) {
        return { success: true }
      }

      const filePath = path.join(this.baseUploadDir, publicUrl)
      
      // Verificar se arquivo existe
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
        return { success: true }
      } catch {
        // Arquivo não existe, considerar como sucesso
        return { success: true }
      }
      
    } catch (error) {
      console.error('Error deleting image:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Move uma imagem de um local para outro
   */
  async moveImage(
    currentUrl: string, 
    newOptions: ImageUploadOptions
  ): Promise<ImageUploadResult> {
    try {
      const currentPath = path.join(this.baseUploadDir, currentUrl)
      
      // Ler arquivo atual
      const buffer = await fs.readFile(currentPath)
      
      // Gerar novo nome
      const extension = path.extname(currentUrl).slice(1)
      const fileName = `${randomUUID()}.${extension}`
      
      // Novo diretório
      const newUploadDir = this.buildUploadPath(newOptions)
      await this.ensureDirectoryExists(newUploadDir)
      
      // Novo caminho
      const newFilePath = path.join(newUploadDir, fileName)
      
      // Salvar no novo local
      await fs.writeFile(newFilePath, buffer)
      
      // Deletar arquivo antigo
      await fs.unlink(currentPath)
      
      return {
        success: true,
        filePath: newFilePath,
        publicUrl: this.buildPublicUrl(newOptions, fileName)
      }
      
    } catch (error) {
      console.error('Error moving image:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Métodos privados
  private parseBase64(base64Data: string): { mimeType: string; buffer: Buffer; extension: string } {
    // Extrair header: data:image/png;base64,iVBORw0KGgoA...
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
    
    if (!matches) {
      throw new Error('Invalid base64 format')
    }

    const mimeType = matches[1]
    const base64Content = matches[2]
    const buffer = Buffer.from(base64Content, 'base64')
    
    // Mapear MIME type para extensão
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg', 
      'image/png': 'png',
      'image/webp': 'webp',
      'image/svg+xml': 'svg'
    }
    
    const extension = extensionMap[mimeType]
    if (!extension) {
      throw new Error(`Unsupported image type: ${mimeType}`)
    }

    return { mimeType, buffer, extension }
  }

  private validateImage(
    buffer: Buffer, 
    mimeType: string, 
    options: ImageUploadOptions
  ): { isValid: boolean; error?: string } {
    const maxSizeMB = options.maxSizeMB || this.maxSizeMB
    const allowedTypes = options.allowedTypes || this.allowedTypes
    
    // Validar tamanho
    const sizeMB = buffer.length / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      return { 
        isValid: false, 
        error: `Image too large. Max size: ${maxSizeMB}MB, got: ${sizeMB.toFixed(2)}MB` 
      }
    }
    
    // Validar tipo
    if (!allowedTypes.includes(mimeType)) {
      return { 
        isValid: false, 
        error: `Invalid image type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}` 
      }
    }
    
    return { isValid: true }
  }

  private buildUploadPath(options: ImageUploadOptions): string {
    const parts = [this.baseUploadDir, options.folder]
    
    if (options.subFolder) {
      parts.push(options.subFolder)
    }
    
    return path.join(...parts)
  }

  private buildPublicUrl(options: ImageUploadOptions, fileName: string): string {
    const parts = [options.folder]
    
    if (options.subFolder) {
      parts.push(options.subFolder)
    }
    
    parts.push(fileName)
    
    return '/' + parts.join('/')
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }
}

// Instância singleton para reutilização
export const imageUploadService = new ImageUploadService()