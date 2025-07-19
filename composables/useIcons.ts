import type { FunctionalComponent } from 'vue'

export const useIcons = () => {
  const createIcon = (name: string, props = {}): FunctionalComponent => {
    return () => h(resolveComponent('Icon'), {
      name,
      ...props
    })
  }

  return {
    createIcon,
    brazilFlag: createIcon('flag:br-4x3'),
    usFlag: createIcon('flag:us-4x3'),
  }
}
