<script lang="ts" setup>
  import type { TITLEVARIABLES } from '#shared//types/components'

  const props = defineProps<{
    titleVariables: TITLEVARIABLES
  }>()
</script>

<template>
  <v-card
    class="mx-auto pl-3 mb-4 border border-solid border-opacity-100"
    elevation="10"
    rounded="xl"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col align-self="center" class="text-left align-content-center pt-1">
          <h2 class="pt-0">
            <v-icon class="mr-4">{{ props.titleVariables.icon || undefined }}</v-icon>
            {{ props.titleVariables.title }}
          </h2>
          <h4 v-if="props.titleVariables.subtitle">
            {{ props.titleVariables.subtitle || undefined }}
          </h4>
        </v-col>
        <v-col v-if="props.titleVariables.haveSpaceForComponent" ref="center" class="pt-1">
          <template
            v-if="props.titleVariables.haveSpaceForComponent && props.titleVariables.components"
          >
            <template v-for="(component, i) in props.titleVariables.components" :key="i">
              <component
                :is="component"
                v-if="
                  props.titleVariables.componentPosition &&
                  props.titleVariables.componentPosition[i] === 'center'
                "
              />
            </template>
          </template>
        </v-col>
        <v-col v-if="props.titleVariables.haveSpaceForComponent" ref="right" class="pt-1">
          <template
            v-if="props.titleVariables.haveSpaceForComponent && props.titleVariables.components"
          >
            <template v-for="(component, i) in props.titleVariables.components" :key="i">
              <component
                :is="component"
                v-if="
                  props.titleVariables.componentPosition &&
                  props.titleVariables.componentPosition[i] === 'right'
                "
              />
            </template>
          </template>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
