# CHANGELOG - 31/07/2025

## [2025-07-31] - Atualizações de Schema e Melhorias de UX

### ✨ Novas Funcionalidades
- **[Schema]** - Introduzido relacionamento many-to-many RoleSection entre Role e Section
- **[Roles]** - Implementadas roles globais (Admin Geral e Admin OM) sem vinculação organizacional
- **[Permissions]** - Sistema de permissões granular com categorias específicas
- **[Seeding]** - Distribuição automática de usuários em seções aleatórias via seed
- **[UX]** - Renderização condicional do layout default aguardando MenuLeft ficar visível
- **[UX]** - Estado de loading durante logout para evitar flickering visual

### 🔧 Melhorias
- **[Architecture]** - Reestruturação dos relacionamentos: User → Role → MilitaryOrganization + User → Section
- **[Performance]** - Layout principal só renderiza após menu lateral estar pronto
- **[User Experience]** - Transição suave durante logout com feedback visual
- **[Code Quality]** - Padronização arquitetural entre módulos militaryOrganizations e sections

### 🐛 Correções
- **[Bug Critical]** - Corrigido forçamento de acrônimos para uppercase, preservando case original
- **[TypeScript]** - Corrigidos erros de tipagem no middleware auth.global.ts usando tipos compartilhados
- **[Server]** - Corrigidas importações H3 faltantes no server middleware
- **[Services]** - Corrigida cascata de deleção no section.service.ts para novo schema
- **[Transformers]** - Atualizados todos os transformers para nova estrutura de relacionamentos
- **[Flickering]** - Eliminado flickering visual durante processo de logout

### 🔒 Segurança
- **[Permissions]** - Sistema simplificado com apenas 2 permissões principais (system.admin e mo.admin)
- **[Data Integrity]** - Cascata de deleção manual via RoleSection preservando integridade
- **[Validation]** - Preservação de case em schemas Zod mantendo validação case-insensitive

### 📚 Documentação
- **[README]** - Atualizado com nova arquitetura e estatísticas do projeto
- **[CLAUDE.md]** - Documentação técnica atualizada para nova estrutura
- **[Changelog]** - Migração para estrutura padrão da pasta docs/changelog/

### 🏗️ Infraestrutura
- **[Service Layer]** - Padronizado entre militaryOrganizations e sections
- **[Interceptor]** - Removido interceptor Prisma em favor de controle explícito nos services
- **[Store Management]** - Adicionado estado isLoggingOut para controle de UX

### ⚠️ Breaking Changes
- **[BREAKING]** - Role.militaryOrganizationId agora é opcional para roles globais
- **[BREAKING]** - User agora tem sectionId separado, não mais via Role
- **[BREAKING]** - Removida tabela Role.sectionId, substituída por RoleSection many-to-many

### 🗃️ Banco de Dados
- **[Migration]** - Schema atualizado com RoleSection pivot table
- **[Schema]** - Role.militaryOrganizationId opcional para administradores globais
- **[Relationships]** - Novo fluxo: User → Role → MilitaryOrganization + User → Section

---

## Detalhes Técnicos

### Arquivos Modificados
- `prisma/schema.prisma` - Reestruturação completa dos relacionamentos
- `prisma/seed.ts` - Atualizado com nova estrutura de permissões e roles
- `server/services/section.service.ts` - Corrigida cascata de deleção
- `server/transformers/militaryOrganization.transformer.ts` - Adicionado suporte a sections
- `app/middleware/auth.global.ts` - Corrigidos erros de tipagem
- `server/middleware/auth.global.ts` - Adicionadas importações H3 faltantes
- `app/stores/auth.store.ts` - Adicionado estado isLoggingOut
- `app/composables/useAuth.ts` - Implementado delay e estado de logout
- `app/components/user/UserCard.vue` - Feedback visual durante logout
- `app/layouts/partials/NavBar.vue` - Manutenção de visibilidade durante logout
- `app/layouts/partials/MenuLeft.vue` - Controle de visibilidade e expose para parent
- `app/layouts/default.vue` - Renderização condicional baseada em MenuLeft

### APIs Afetadas
- `GET /api/auth/verify-token` - Atualizado para nova estrutura User
- Todos os endpoints que retornam User - Ajustados para nova estrutura de relacionamentos

### Novo Schema de Relacionamentos
```
Antes: User → Role → Section → MilitaryOrganization
Agora: 
- User → Role → MilitaryOrganization (roles organizacionais)
- User → Section → MilitaryOrganization (vinculação direta)
- Role ↔ Section (many-to-many via RoleSection)
```

### Nova Estrutura de Permissões
```typescript
// Apenas 2 permissões principais
{
  slug: "system.admin",    // Admin Geral - controle total
  slug: "mo.admin"         // Admin OM - administração organizacional
}
```

### Fluxo de Logout Melhorado
```typescript
// Novo fluxo sem flickering
1. authStore.setLoggingOut(true)           // Ativa estado visual
2. await authService.logout()              // Processa logout
3. setTimeout(() => {                      // Delay para transição suave
     authStore.$reset()                    // Limpa dados
     navigateTo('/')                       // Navega para login
   }, 500)
```

### Layout Condicional
```vue
<!-- Renderização condicional no default.vue -->
<template v-if="isContentReady">
  <slot />
</template>
<template v-else>
  <LoadingSpinner />
</template>
```

---

## Notas de Upgrade

### Para Desenvolvedores
1. Execute `pnpm run db:reset` para aplicar novo schema
2. Execute `pnpm run db:seed` para popular dados com nova estrutura
3. Verifique imports que usam User type - estrutura foi alterada
4. Teste fluxo de logout - agora tem delay intencional de 500ms

### Para Deploy
1. **CRÍTICO**: Backup completo do banco antes do deploy
2. Aplicar migration que reestrutura relacionamentos
3. Executar seed para popular novas permissões
4. Verificar se não há queries hardcoded que usam Role.sectionId

### Impacto na UX
1. **Layout Loading** - Conteúdo principal aguarda menu lateral ficar pronto
2. **Logout Suave** - Transição sem flickering com feedback visual
3. **Performance** - Renderização condicional melhora percepção de velocidade

### Benefícios Técnicos
1. **Flexibilidade** - Roles podem existir sem organização (admins globais)
2. **Manutenibilidade** - Relacionamentos many-to-many mais flexíveis
3. **UX Profissional** - Estados de loading e transições suaves
4. **Consistência** - Padrões arquiteturais unificados entre módulos

---

**Autor**: TC Brilhante  
**Data**: 31/07/2025  
**Versão**: v1.2.0
