<script lang="ts" setup>
  import { Cropper } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'

  const { t } = useI18n()

  interface Props {
    inputProps: {
      label: string
    }
  }

  const { inputProps } = defineProps<Props>()
  const emit = defineEmits<{ (e: 'handle-image', data: string): void }>()

  const imageSrc = ref<string | null>(null)
  const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

  function onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imageSrc.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  function clearImage(): void {
    imageSrc.value = null
  }

  function emitCroppedImage(): void {
    if (!cropperRef.value) return

    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      emit('handle-image', dataUrl)
    }
  }

  const debouncedEmit = debounce(emitCroppedImage, 500)

  function onReady(): void {
    emitCroppedImage()
  }

  function onChange(): void {
    debouncedEmit()
  }
</script>

<template>
  <v-row>
    <v-col>
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
      <div v-if="imageSrc" class="cropper-container">
        <Cropper
          ref="cropperRef"
          :auto-zoom="false"
          :image-restriction="'none'"
          :max-zoom="5"
          :min-zoom="0.1"
          :resize-image="{
            adjustStencil: false
          }"
          :src="imageSrc"
          :stencil-props="{
            aspectRatio: 3/4,
            resizable: false,
            movable: false
          }"
          class="cropper"
          @change="onChange"
          @ready="onReady"
        />
      </div>

      <v-alert v-if="imageSrc" closable type="info">
        <ul class="show-bullets">
          <li>{{ t('imageEditor.zoomInstruction') }}</li>
          <li>{{ t('imageEditor.moveInstruction') }}</li>
          <li>{{ t('imageEditor.centerInstruction') }}</li>
        </ul>
      </v-alert>
    </v-col>
  </v-row>
</template>

<style scoped>
  .cropper-container {
    width: 100%;
    margin-bottom: 1rem;
    background-color: #f0f0f0;
    height: 500px;
  }

  .cropper {
    height: 100%;
    width: 100%;
  }

  .show-bullets {
    list-style-type: disc;
    padding-left: 20px;
  }
</style>
