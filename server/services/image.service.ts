import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'crypto'

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

export class ImageService {
  private readonly baseUploadDir = join(process.cwd(), 'public')
  private readonly maxSizeMB = 5 // Default 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']

  // ==========================================
  // MÉTODOS DE PROCESSAMENTO DE IMAGEM (Sharp)
  // ==========================================

  /**
   * Valida a string do logo e retorna os matches da expressão regular.
   * Lança um erro se o formato estiver inválido.
   * @param logo string no formato data:image/{mime};base64,...
   */
  public validateLogoData(logo: string): RegExpMatchArray {
    const matches = logo.match(/^data:(.+);base64,(.+)$/)
    if (!matches) {
      throw new Error('Formato de logo inválido.')
    }
    return matches
  }

  /**
   * Retorna o MIME type a partir dos matches da expressão regular.
   * @param matches RegExpMatchArray obtido na validação
   */
  public getMimeType(matches: RegExpMatchArray): string {
    return matches[1]!
  }

  /**
   * Decodifica a parte Base64 da string para um Buffer.
   * @param matches RegExpMatchArray obtido na validação
   */
  public decodeImage(matches: RegExpMatchArray): Buffer {
    return Buffer.from(matches[2]!, 'base64')
  }

  /**
   * Processa a imagem para o tamanho normal (ex: 354 x 472 pixels)
   * @param imageBuffer Buffer da imagem original
   */
  public async processNormalImage(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer).resize(354, 472).png({ quality: 80 }).toBuffer()
  }

  /**
   * Processa a imagem para o tamanho mini (ex: 50px, mantendo o aspect ratio)
   * @param imageBuffer Buffer da imagem original
   */
  public async processMiniImage(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer).resize(50, 50, { fit: 'inside' }).png({ quality: 80 }).toBuffer()
  }

  /**
   * Valida a string do logo, processa a imagem e retorna os buffers das imagens normal e mini.
   * Lança erros com mensagens específicas se algo estiver errado.
   * @param logo string no formato data:image/{mime};base64,...
   */
  public async validateAndProcess(
    logo: string
  ): Promise<{ processedImage: Buffer; processedMiniImage: Buffer }> {
    const matches = this.validateLogoData(logo)
    const mimeType = this.getMimeType(matches)
    if (mimeType !== 'image/png' && mimeType !== 'image/jpeg') {
      throw new Error('Tipo de imagem não suportado. Use PNG ou JPEG.')
    }
    const imageBuffer = this.decodeImage(matches)
    const processedImage = await this.processNormalImage(imageBuffer)
    const processedMiniImage = await this.processMiniImage(imageBuffer)
    return { processedImage, processedMiniImage }
  }

  // ==========================================
  // MÉTODOS DE UPLOAD E GERENCIAMENTO DE ARQUIVOS
  // ==========================================

  /**
   * Salva logo de organização militar com thumbnail (método principal do sistema)
   * 
   * Funcionalidades:
   * - Processa imagem para tamanho padrão (354x472px) e miniatura (50x50px)
   * - Salva com nomes fixos: logo.png e logo_mini.png
   * - Cria diretório específico por organização (/logos/organizationId/)
   * - Retorna URL com timestamp para evitar cache do navegador
   * - Validação automática de formato (PNG/JPEG apenas)
   * 
   * @param base64Data - String base64 da imagem (formato: data:image/type;base64,...)
   * @param organizationId - ID da organização militar (usado para criar pasta)
   * @returns Promise com resultado do upload (sucesso/erro + URL pública)
   */
  async saveLogoWithThumb(
    base64Data: string,
    organizationId: string
  ): Promise<ImageUploadResult> {
    try {
      // Usar processamento interno
      const { processedImage, processedMiniImage } = await this.validateAndProcess(base64Data)
      
      // Diretório específico da organização
      const uploadDir = join(this.baseUploadDir, 'logos', organizationId)
      await this.ensureDirectoryExists(uploadDir)
      
      // Salvar ambas as imagens com nomes fixos
      const logoPath = join(uploadDir, 'logo.png')
      const logoMiniPath = join(uploadDir, 'logo_mini.png')
      
      await fs.writeFile(logoPath, processedImage)
      await fs.writeFile(logoMiniPath, processedMiniImage)
      
      // Retornar URL do logo normal com timestamp para evitar cache
      const timestamp = Date.now()
      const publicUrl = `/logos/${organizationId}/logo.png?v=${timestamp}`
      
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
   * Salva uma imagem base64 como arquivo com nome único (UUID)
   * 
   * Diferente do saveLogoWithThumb, este método:
   * - NÃO processa/redimensiona a imagem (salva como está)
   * - Gera nome único com UUID ao invés de nomes fixos
   * - Suporta diferentes tipos de pasta (logos, profiles, documents)
   * - Valida tamanho e tipo de arquivo antes de salvar
   * 
   * Uso futuro: Upload de documentos, fotos de perfil, imagens diversas
   * 
   * @param base64Data - String base64 da imagem (formato: data:image/type;base64,...)
   * @param options - Configurações de upload (pasta, subpasta, validações)
   * @returns Promise com resultado do upload (sucesso/erro + URLs)
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
      const filePath = join(uploadDir, fileName)
      
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

      const filePath = join(this.baseUploadDir, publicUrl)
      
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
   * Remove pasta inteira de uma entidade (genérico)
   */
  async deleteEntityFolder(
    folder: 'logos' | 'profiles' | 'documents',
    entityId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const folderPath = join(this.baseUploadDir, folder, entityId)
      
      // Verificar se pasta existe
      try {
        await fs.access(folderPath)
        await fs.rm(folderPath, { recursive: true, force: true })
        return { success: true }
      } catch {
        // Pasta não existe, considerar como sucesso
        return { success: true }
      }
      
    } catch (error) {
      console.error(`Error deleting ${folder} folder for entity ${entityId}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Remove pasta inteira de logos de uma organização (método específico para retrocompatibilidade)
   */
  async deleteOrganizationFolder(organizationId: string): Promise<{ success: boolean; error?: string }> {
    return this.deleteEntityFolder('logos', organizationId)
  }

  /**
   * Move uma imagem existente de um local para outro no sistema de arquivos
   * 
   * Processo realizado:
   * 1. Lê arquivo da localização atual
   * 2. Gera novo nome único (UUID) para evitar conflitos  
   * 3. Cria novo diretório de destino (se necessário)
   * 4. Salva arquivo no novo local
   * 5. Remove arquivo da localização original
   * 
   * Uso futuro: Reorganização de arquivos, migração de dados, mudança de estrutura
   * 
   * @param currentUrl - URL atual do arquivo (ex: "/logos/org1/old-file.png")
   * @param newOptions - Novas configurações de localização (pasta, subpasta)
   * @returns Promise com resultado da operação (sucesso/erro + nova URL)
   */
  async moveImage(
    currentUrl: string, 
    newOptions: ImageUploadOptions
  ): Promise<ImageUploadResult> {
    try {
      const currentPath = join(this.baseUploadDir, currentUrl)
      
      // Ler arquivo atual
      const buffer = await fs.readFile(currentPath)
      
      // Gerar novo nome
      const extension = extname(currentUrl).slice(1)
      const fileName = `${randomUUID()}.${extension}`
      
      // Novo diretório
      const newUploadDir = this.buildUploadPath(newOptions)
      await this.ensureDirectoryExists(newUploadDir)
      
      // Novo caminho
      const newFilePath = join(newUploadDir, fileName)
      
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

  // ==========================================
  // MÉTODOS PRIVADOS
  // ==========================================

  private parseBase64(base64Data: string): { mimeType: string; buffer: Buffer; extension: string } {
    // Extrair header: data:image/png;base64,iVBORw0KGgoA...
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
    
    if (!matches) {
      throw new Error('Invalid base64 format')
    }

    const mimeType = matches[1]!
    const base64Content = matches[2]!
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
    
    return join(...parts)
  }

  private buildPublicUrl(options: ImageUploadOptions, fileName: string): string {
    const parts: string[] = [options.folder]
    
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
export const imageService = new ImageService()