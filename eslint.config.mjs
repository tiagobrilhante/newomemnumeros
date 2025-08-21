// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: ['node_modules/**', '.nuxt/**', 'dist/**', '.output/**'],
    rules: {
      'vue/multi-word-component-names': 'error',
    },
  },
  {
    files: ['app.vue', 'error.vue', 'pages/**/*.vue', 'layouts/**/*.vue', 'components/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Override TypeScript rules
    name: 'nuxt:typescript-override',
    rules: {
      '@typescript-eslint/ban-types': 'off',
    },
  },
])
