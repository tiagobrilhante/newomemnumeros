export type ComponentPosition = ['center'] | ['right'] | ['center', 'right'] | ['right', 'center']

export type TITLEVARIABLES = {
  title: string
  icon?: string
  subtitle?: string
  haveSpaceForComponent?: boolean
  components?: Component[]
  componentPosition?: ComponentPosition
}
