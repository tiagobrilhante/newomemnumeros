# CHANGELOG - 04/08/2025

## [2025-08-04] - Consolidação de Utilitários e Organização de Módulos

### ✨ Principais Mudanças
- **[Consolidação]** - Todas as funções utilitárias consolidadas em `shared/utils/index.ts`
- **[Organização]** - Remoção de pastas individuais de utilities espalhadas pelo projeto
- **[Manutenibilidade]** - Imports simplificados e estrutura mais limpa
- **[Performance]** - Redução de imports duplicados e melhor tree-shaking

### 🗂️ Reestruturação de Arquivos

#### ❌ Arquivos Removidos
```
app/utils/
├── clean-string-to-create-folders.ts
├── convert-date-for-pickers.ts
├── debounce.ts
├── format-big-numbers-whithout-comma.ts
├── generate-random-code.ts
└── get-random-color.ts

shared/utils/ (individuais)
├── retrieve-date-from-datetime.ts
├── retrieve-first-created-item.ts
├── retrieve-formated-datetime.ts
├── retrieve-last-created-item.ts
├── retrieve-military-organization-acronym.ts
├── retrieve-military-organization-logo.ts
├── retrieve-mini-image.ts
├── retrieve-permissions-info.ts
├── retrieve-time-from-datetime.ts
└── sanitize-data.ts
```

#### ✅ Arquivo Consolidado
```
shared/utils/index.ts (164 linhas)
├── retrieveDate()
├── retrieveTime()
├── formatedDatetime()
├── convertForPickers()
├── retrieveMiniImage()
├── sanitizeData()
├── sanitizeForFilename()
├── cleanStringToCreateFolders()
├── debounce()
├── generateRandomCode()
├── getRandomColor()
├── getColorOrRandom()
└── retrievePermissionInfo()
```

### 🔧 Melhorias Implementadas

#### **Imports Simplificados**
```typescript
// Antes (múltiplos imports)
import { retrieveDate } from '~/shared/utils/retrieve-date-from-datetime'
import { sanitizeData } from '~/shared/utils/sanitize-data'
import { generateCode } from '~/app/utils/generate-random-code'

// Agora (import único)
import { retrieveDate, sanitizeData, generateRandomCode } from '#shared/utils'
```

#### **Consistência de Padrões**
- **Nomenclatura**: Funções seguem padrão camelCase consistente
- **Documentação**: JSDoc para todas as funções principais
- **Tipagem**: TypeScript strict em todas as funções
- **Organização**: Agrupamento lógico por categoria de uso

### 📈 Melhorias de Constantes

#### **Sistema de Permissões Expandido**
```typescript
// shared/constants/permissions.ts (97 linhas)
PERMISSION_CATEGORIES = [
  {
    module: 'Admin',
    module_alias: 'admin',
    module_color: 'yellow',
    permissions: [
      { slug: 'system.admin', description: 'Super usuário - Admin Global' },
      { slug: 'mo.admin', description: 'Admin de Organização Militar' },
      { slug: 'militaryOrganization.management', description: 'Gerência de OM' },
      { slug: 'linkUser.management', description: 'Vinculação de usuários' },
      { slug: 'reports.generate', description: 'Gerar relatórios' },
      { slug: 'reports.export', description: 'Exportar relatórios' },
      { slug: 'sections.management', description: 'Gerência de Seções' },
      { slug: 'users.management', description: 'Gerência de Usuários' },
      { slug: 'roles.management', description: 'Gerência de papéis' },
    ]
  },
  {
    module: 'Numbers',
    module_alias: 'number', 
    module_color: 'blue',
    permissions: [
      { slug: 'number.create.category', description: 'Criar categorias OM' },
      // + outras permissões herdadas do módulo Admin
    ]
  }
]
```

### 🏗️ Componentes Atualizados

#### **Novo Componente: RoleManagement.vue**
```vue
<!-- app/components/permissions/RoleManagement.vue -->
<script lang="ts" setup>
  import { PERMISSION_CATEGORIES } from '#shared/constants/permissions'
</script>
<template>
  <v-row>
    <v-col>
      <v-card>
        {{PERMISSION_CATEGORIES}}
      </v-card>
    </v-col>
  </v-row>
</template>
```

### 🔄 Refatorações Realizadas

#### **Componentes Atualizados**
- `app/components/utils/InputImage.vue` - Import do `shared/utils`
- `app/layouts/default.vue` - Import consolidado
- `app/layouts/guest-layout.vue` - Utilities atualizadas
- `app/pages/admin/military-organizations/index.vue` - Imports limpos
- `app/pages/admin/permissions/index.vue` - Nova estrutura

#### **Services Atualizados**
- `server/services/militaryOrganization.service.ts` - Import limpo
- `server/services/section.service.ts` - Utilities consolidadas

### 📦 Impacto no Bundle

#### **Redução de Arquivos**
- **Antes**: 26+ arquivos utilitários espalhados
- **Agora**: 1 arquivo consolidado + constantes organizadas
- **Benefício**: Tree-shaking mais eficiente e imports simplificados

#### **Melhoria de Performance**
- Redução de imports duplicados
- Melhor caching de módulos
- Bundle size otimizado
- Compilação mais rápida

---

## Detalhes Técnicos

### Funcionalidades Consolidadas

#### **Manipulação de Datas**
```typescript
retrieveDate(datetime: Date): string        // DD/MM/YYYY
retrieveTime(datetime: Date): string        // HH:MM
formatedDatetime(datetime: Date, withHours?: boolean)  // Formatação localizadas
convertForPickers(input: string): Date      // Conversão para date pickers
```

#### **Processamento de Imagens**
```typescript
retrieveMiniImage(imagePath: string): string    // Gera path para miniatura
```

#### **Sanitização e Validação**
```typescript
sanitizeData<T>(data: T): T                     // Sanitização geral
sanitizeForFilename(input: string): string     // Sanitização para nomes de arquivo
cleanStringToCreateFolders(myString: string): string  // Limpeza para pastas
```

#### **Utilitários de Interface**
```typescript
debounce<A, U>(fn: Function, delay: number)    // Debounce para inputs
generateRandomCode(): string                   // Código aleatório único
getRandomColor(): string                       // Cor aleatória válida
getColorOrRandom(color: string | null): string // Cor ou fallback
```

#### **Sistema de Permissões**
```typescript
retrievePermissionInfo(permission: string) => {
  module: string,
  module_color: string, 
  description: string
}
```

### Padrão de Aliases

#### **Configuração de Imports**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    '#shared': resolve('./shared')
  }
})
```

#### **Uso nos Componentes**
```typescript
// Padrão implementado em todo o projeto
import { 
  sanitizeData, 
  generateRandomCode, 
  retrievePermissionInfo 
} from '#shared/utils'

import { PERMISSION_CATEGORIES } from '#shared/constants/permissions'
```

---

## Notas de Upgrade

### Para Desenvolvedores
1. **Atualize imports**: Use `#shared/utils` ao invés de paths individuais
2. **Remova imports antigos**: Não há mais arquivos individuais de utilities
3. **Use aliases**: Prefira `#shared/` ao invés de paths relativos
4. **Verifique tipos**: Todas as funções têm tipagem TypeScript strict

### Migração de Código Existente
```typescript
// ❌ Antigo
import { sanitizeData } from '~/shared/utils/sanitize-data'
import { debounce } from '~/app/utils/debounce'

// ✅ Novo  
import { sanitizeData, debounce } from '#shared/utils'
```

### Impacto na Aplicação
1. **Sem quebras**: Todas as funcionalidades mantidas
2. **Performance**: Melhoria na compilação e bundle
3. **Manutenibilidade**: Código mais organizado e fácil de encontrar
4. **Consistência**: Padrão único de imports em todo o projeto

---

## Benefícios Alcançados

### 🎯 Organização
- **Localização única** para todas as utilities
- **Documentação centralizada** com JSDoc
- **Padrão consistente** de nomenclatura

### ⚡ Performance
- **Bundle otimizado** com tree-shaking eficiente
- **Imports reduzidos** e caching melhorado
- **Compilação mais rápida** com menos arquivos

### 🔧 Manutenibilidade
- **Fácil localização** de funções utilitárias
- **Refatoração simplificada** com imports centralizados
- **Menos duplicação** de código e lógica

### 👥 Experiência do Desenvolvedor
- **Intellisense melhorado** com todas as funções em um lugar
- **Imports automáticos** mais precisos no VS Code
- **Documentação acessível** via JSDoc hover

---

**Autor**: TC Brilhante  
**Data**: 04/08/2025  
**Versão**: v1.3.0  
**Tipo**: Refatoração / Organização