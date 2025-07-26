<script lang="ts" setup>
  import type { Cropper } from 'cropperjs'

  interface Props {
    inputProps: {
      label: string
    }
  }

  const { inputProps } = defineProps<Props>()
  const emit = defineEmits<{ (e: 'handle-image', data: string): void }>()
  const imageSrc = ref<string | null>(null)
  const image = ref<HTMLImageElement | null>(null)
  let cropper: Cropper | null = null

  // Função acionada quando o usuário seleciona um arquivo
  function onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        imageSrc.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para limpar a imagem e destruir a instância do Cropper
  function clearImage(): void {
    imageSrc.value = null
    if (cropper) {
      cropper.destroy()
      cropper = null
    }
  }

  // Função debounce para esperar um tempo após a última chamada
  function debounce<A extends unknown[], U = unknown>(
    fn: (this: U, ...args: A) => void,
    delay: number
  ): (this: U, ...args: A) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    return function (this: U, ...args: A): void {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
  }

  // Função para inicializar o Cropper - SOMENTE NO CLIENT
  async function initializeCropper(): Promise<void> {
    // Só executa no cliente
    if (!import.meta.client) return

    try {
      // Importação dinâmica do CropperJS
      const { default: Cropper } = await import('cropperjs')

      // Destruir instância anterior, se existir
      if (cropper) {
        cropper.destroy()
      }

      if (image.value) {
        // Cria uma função que emite a imagem cropada
        const emitCroppedImage = () => {
          if (cropper) {
            const canvas = cropper.getCroppedCanvas({
              width: 354,
              height: 472,
            })
            const dataUrl = canvas.toDataURL('image/png')
            emit('handle-image', dataUrl)
          }
        }

        // Cria uma versão debounced para o evento zoom
        const debouncedEmit = debounce(emitCroppedImage, 500)

        cropper = new Cropper(image.value, {
          aspectRatio: 3 / 4,
          cropBoxResizable: false,
          cropBoxMovable: false,
          viewMode: 0,
          rotatable: false,
          dragMode: 'move',
          autoCropArea: 0.8,
          ready: () => {
            emitCroppedImage()
          },
          cropend: () => {
            emitCroppedImage()
          },
          zoom: () => {
            debouncedEmit()
          },
        })
      }
    } catch (error) {
      console.error('Erro ao inicializar o Cropper:', error)
    }
  }

  // Destruir o cropper ao desmontar o componente
  onBeforeUnmount(() => {
    cropper?.destroy()
  })
</script>

<template>
  <v-row>
    <v-col>
      <!-- Input para selecionar a imagem -->
      <v-file-input
        :label="inputProps.label"
        accept="image/*"
        clearable
        density="compact"
        prepend-icon="mdi-image"
        variant="outlined"
        @change="onFileChange"
        @click:clear="clearImage"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <!-- Exibir a imagem carregada e pronta para crop -->
      <div v-if="imageSrc">
        <img ref="image" :src="imageSrc" alt="Imagem para crop" @load="initializeCropper">
      </div>

      <v-alert closable type="info">
        <ul class="show-bullets">
          <li>Use o scroll do mouse para ajustar o zoom da imagem.</li>
          <li>
            Com o botão direito do mouse, clique na imagem (mantendo pressionado) para movimentar a
            imagem.
          </li>
          <li>Centralize a imagem no retângulo exibido.</li>
        </ul>
      </v-alert>
    </v-col>
  </v-row>
</template>

<style scoped>
  /* Opcional: ajuste o estilo da imagem e do container conforme necessário */
  img {
    max-width: 50%;
    display: block;
    margin: 1rem 0;
  }

  .show-bullets {
    list-style-type: disc;
    padding-left: 20px;
  }
</style>
