# Sistema de Gestão de Organização Militar

Sistema completo de gestão para organizações militares desenvolvido com **Nuxt 3**, **TypeScript**, **Prisma ORM** e **MySQL**.

## 🚀 Status do Projeto

✅ **Sistema de Login/Logout 100% Funcional**
- Autenticação segura com JWT e cookies HttpOnly
- Middleware inteligente com metadados de rota
- Redirecionamento automático baseado em estado
- Persistência de sessão com Pinia

## 🛠️ Stack Tecnológica

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **UI**: Vuetify 3 (tema escuro)
- **Backend**: Nitro (Nuxt server)
- **Banco**: MySQL + Prisma ORM
- **Auth**: JWT + cookies HttpOnly
- **Estado**: Pinia com persistência

## 🏗️ Arquitetura de Autenticação

### Middleware Baseado em Metadados

```typescript
// Rota protegida
definePageMeta({ auth: true })

// Rota pública com redirect
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/home'
  }
})
```

### Fluxo de Autenticação

1. **Login** → Valida credenciais → Seta cookies + store → Redireciona `/home`
2. **Logout** → Limpa store (`$reset()`) → Limpa cookies → Redireciona `/`
3. **Proteção** → Middleware verifica estado → Redireciona conforme necessário

## 📂 Estrutura Principal

```
├── components/auth/          # Login e Register
├── composables/             # useAuth, useUserData
├── middleware/              # auth.global.ts
├── pages/                   # index (login), home (protegida)
├── server/api/auth/         # Endpoints de autenticação
├── stores/                  # auth.store.ts (Pinia)
├── types/                   # Tipagem TypeScript
└── services/                # auth.service.ts
```

## 🚀 Comandos

### Desenvolvimento
```bash
pnpm dev                     # Servidor desenvolvimento
pnpm build                   # Build produção
```

### Banco de Dados
```bash
pnpm db:migrate             # Executar migrações
pnpm db:seed                # Executar seed
pnpm db:studio              # Abrir Prisma Studio
```

### Qualidade
```bash
pnpm lint                   # ESLint
pnpm lint:fix               # Corrigir automaticamente
```

## ⚙️ Configuração

### Variáveis de Ambiente
```env
DATABASE_URL="mysql://user:pass@localhost:3306/db"
JWT_SECRET="your-secret-key"
```

### Primeiro Setup
```bash
# Instalar dependências
pnpm install

# Configurar banco
pnpm db:migrate
pnpm db:seed

# Iniciar desenvolvimento
pnpm dev
```

## 🔐 Segurança

- ✅ JWT com cookies HttpOnly
- ✅ Proteção CSRF com sameSite: strict
- ✅ Validação server-side
- ✅ Sanitização de dados
- ✅ Soft delete para auditoria

## 📋 Funcionalidades Implementadas

- [x] Sistema de login/logout completo
- [x] Middleware de proteção de rotas
- [x] Gerenciamento de estado com Pinia
- [x] Tipagem TypeScript robusta
- [x] Componentes de autenticação
- [x] Tratamento de erros

## 📖 Documentação Completa

Para documentação detalhada, consulte: [CLAUDE.md](./CLAUDE.md)

## 🤝 Desenvolvimento

Consulte o [CLAUDE.md](./CLAUDE.md) para:
- Arquitetura detalhada
- Padrões de código
- Sistema de permissões
- Troubleshooting
- Roadmap
