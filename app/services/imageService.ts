// services/ImageService.ts
import sharp from 'sharp'

export class ImageService {
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
    return matches[1]
  }

  /**
   * Decodifica a parte Base64 da string para um Buffer.
   * @param matches RegExpMatchArray obtido na validação
   */
  public decodeImage(matches: RegExpMatchArray): Buffer {
    return Buffer.from(matches[2], 'base64')
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
}
