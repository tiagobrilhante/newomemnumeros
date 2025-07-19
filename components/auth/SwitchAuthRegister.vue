<!-- components/auth/SwitchAuthRegister.vue -->
<script lang="ts" setup>
  interface Props {
    modelValue: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const toggleAuth = () => {
    emit('update:modelValue', !props.modelValue)
  }
</script>

<template>
  <v-btn size="small" variant="text" @click="toggleAuth" :text="props.modelValue
        ? $t('noAccountSignUp')
        : $t('haveAccountSignIn')" />
</template>
