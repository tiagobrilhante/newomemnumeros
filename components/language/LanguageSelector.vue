<script setup lang="ts">
  const { brazilFlag, usFlag } = useIcons()
  const { selectedLanguage, changeLanguage } = useLanguageManager()

  const languages = [
    {
      code: 'pt-BR',
      name: 'Português',
      flag: brazilFlag,
      countryCode: 'BR'
    },
    {
      code: 'en-US',
      name: 'English',
      flag: usFlag,
      countryCode: 'US'
    }
  ] as const

  type LanguageCode = typeof languages[number]['code']

  const currentLanguage = computed(() => {
    return languages.find(lang => lang.code === selectedLanguage.value) || languages[0]
  })

  const handleLanguageChange = (languageCode: LanguageCode) => {
    changeLanguage(languageCode)
  }
</script>

<template>
  <v-menu
    :close-on-content-click="true"
    location="bottom end"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :prepend-icon="currentLanguage.flag"
        variant="text"
        rounded
        class="language-selector-btn"
        size="small"
      >
        <span class="text-caption font-weight-medium">
          {{ currentLanguage.countryCode }}
        </span>
        <v-icon size="x-small" class="ml-1">
          mdi-chevron-down
        </v-icon>
      </v-btn>
    </template>

    <v-card class="language-selector-menu" elevation="8" rounded="lg">
      <v-list class="py-0" density="compact">
        <v-list-item
          v-for="language in languages"
          :key="language.code"
          :class="{ 'bg-primary-lighten-4': language.code === selectedLanguage }"
          class="language-option"
          @click="() => handleLanguageChange(language.code)"
        >
          <template #prepend>
            <v-icon
              :icon="language.flag"
              size="large"
              class="language-flag"
            />
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ language.name }}
          </v-list-item-title>

          <template #append>
            <v-icon
              v-show="language.code === selectedLanguage"
              color="primary"
              size="small"
            >
              mdi-check
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.language-selector-btn {
  min-width: 70px !important;
  padding: 0 8px !important;
}

.language-selector-menu {
  min-width: 140px;
}

.language-option {
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 48px;
}

.language-flag {
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
