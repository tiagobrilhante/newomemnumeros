import type { VueI18n } from 'vue-i18n'

// Tipos de idiomas suportados
export type SupportedLocale = 'pt-BR' | 'en-US'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: VueI18n['t']
    $tc: VueI18n['tc']
    $te: VueI18n['te']
    $d: VueI18n['d']
    $n: VueI18n['n']
  }
}

export {}
