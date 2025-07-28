import 'cropperjs'

declare module 'cropperjs' {
  interface Cropper {
    destroy(): void
  }
}
