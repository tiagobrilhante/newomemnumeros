# 🪖 Sistema de Gestão Militar

<div align="center">

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.0+-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.0+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.0+-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**Sistema web completo para gestão militar hierárquica**  
*Gerenciamento de usuários, organizações, seções, patentes e permissões*

[🚀 Demo](#-como-executar) • [📖 Documentação](#-funcionalidades) • [🛠️ API](#-apis-implementadas) • [🏗️ Arquitetura](#-arquitetura)

</div>

---

## 📋 Visão Geral

Sistema web robusto de gestão militar desenvolvido com **Nuxt 4**, projetado para gerenciar hierarquias complexas de organizações militares, controle granular de permissões e administração completa de usuários com diferentes patentes e funções.

### ✨ Características Principais

- 🔐 **Autenticação JWT** completa e segura
- 🏛️ **Hierarquia organizacional** com suporte pai-filho
- 👥 **Gestão de usuários** com patentes e funções
- 🛡️ **Sistema de permissões** granular por módulo
- 🖼️ **Upload de logos** com processamento automático
- 🌍 **Internacionalização** pt-BR/en-US
- 📱 **Design responsivo** mobile-first
- 🎨 **Temas personalizáveis** por organização

---

## 🛠️ Stack Tecnológica

<table>
<tr>
<td width="50%">

### Frontend
- **Nuxt 4** - Vue 3 + SSR/SSG
- **Vuetify 3** - Material Design UI
- **TypeScript** - Tipagem estrita
- **Pinia** - Estado com persistência
- **Vue i18n** - Internacionalização
- **Vue3-Toastify** - Notificações
- **Vue Advanced Cropper** - Edição de imagens

</td>
<td width="50%">

### Backend & Database
- **Nuxt Server API** - 31 endpoints
- **Prisma ORM** - MySQL
- **JWT** - Autenticação segura
- **bcrypt** - Hash de senhas
- **Sharp** - Processamento de imagens
- **Zod** - Validação de schemas
- **ApiResponse System** - Error handling unificado
- **Docker Compose** - Desenvolvimento

</td>
</tr>
</table>

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** 18+
- **MySQL** 8.0+
- **pnpm** (recomendado)

### 🔧 Instalação

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd newomemnumeros

# 2. Instalar dependências
pnpm install

# 3. Configurar ambiente
cp .env.example .env
# Editar DATABASE_URL e outras variáveis no .env

# 4. Configurar banco de dados
pnpm run db:migrate    # Executar migrações
pnpm run db:seed       # Popular dados iniciais

# 5. Executar em desenvolvimento
pnpm run dev           # Disponível em http://localhost:3000
```

### 🐳 Com Docker

```bash
# Subir banco MySQL + aplicação
docker-compose up -d

# Executar migrações
pnpm run db:migrate
pnpm run db:seed
```

---

## 🎯 Funcionalidades

<table>
<tr>
<td width="50%">

### 🔐 Autenticação & Segurança
- ✅ Login/Logout com JWT
- ✅ Registro de usuários com validação
- ✅ Middleware de autenticação global
- ✅ Controle de permissões granular
- ✅ Persistência de sessão
- ✅ Verificação de token server-side
- ✅ Hash de senhas com bcrypt
- ✅ Sanitização automática de dados
- ✅ Sistema de error handling unificado

### 🏛️ Gestão Organizacional
- ✅ Organizações militares hierárquicas
- ✅ Seções dentro das organizações
- ✅ Suporte a estrutura pai-filho
- ✅ Gestão de patentes militares
- ✅ Sistema de funções/cargos
- ✅ Soft delete para preservação de dados

</td>
<td width="50%">

### 👥 Gestão de Usuários
- ✅ CRUD completo de usuários
- ✅ Vinculação a patentes e funções
- ✅ Controle de acesso por permissões
- ✅ Histórico de modificações
- ✅ Busca avançada por critérios
- ✅ Validação de dados robusta

### 🎨 Interface & UX
- ✅ Design responsivo mobile-first
- ✅ Tema dark otimizado
- ✅ Upload de logos com cropping
- ✅ Notificações interativas
- ✅ Loading states informativos
- ✅ Internacionalização completa
- ✅ Navegação intuitiva

</td>
</tr>
</table>

---

## 🗃️ Modelo de Dados

### Hierarquia Organizacional
```
MilitaryOrganization (OM)
├── Sections (Seções)
├── Roles (Funções/Cargos) → vinculadas à OM
└── Users (Usuários) → vinculados a Rank, Role e Section

RoleSection (Many-to-Many)
├── Role ↔ Section (relacionamento flexível)
└── Permissions via RolePermission
```

### 📊 Entidades (8) - Arquitetura v1.2.0
| Entidade | Descrição | Campos Principais |
|----------|-----------|-------------------|
| **User** | Usuários do sistema | `name`, `email`, `rankId`, `roleId`, `sectionId` |
| **Rank** | Patentes militares | `name`, `hierarchy`, `acronym` |
| **MilitaryOrganization** | Organizações militares | `name`, `acronym`, `color`, `logo`, `parentId` |
| **Section** | Seções organizacionais | `name`, `acronym`, `militaryOrganizationId` |
| **Role** | Funções/cargos | `name`, `acronym`, `militaryOrganizationId` (opcional) |
| **Permission** | Permissões do sistema | `slug`, `description`, `category` |
| **RolePermission** | Pivot roles-permissions | `roleId`, `permissionId` |
| **RoleSection** | Pivot roles-sections | `roleId`, `sectionId` |

> **Nova Arquitetura**: Role.militaryOrganizationId é opcional, permitindo roles globais. User agora tem vinculação direta com Section.

---

## 🌐 APIs Implementadas

<details>
<summary><strong>🔐 Autenticação (4 endpoints)</strong></summary>

```http
POST   /api/auth/login           # Login de usuários
POST   /api/auth/logout          # Logout seguro
POST   /api/auth/register        # Registro de usuários
GET    /api/auth/verify-token    # Verificação de token
```
</details>

<details>
<summary><strong>🏛️ Organizações Militares (7 endpoints)</strong></summary>

```http
GET    /api/military-organizations                    # Listar OM
POST   /api/military-organizations                    # Criar OM
GET    /api/military-organizations/[id]               # Buscar OM por ID
PUT    /api/military-organizations/[id]               # Atualizar OM
DELETE /api/military-organizations/[id]               # Deletar OM
DELETE /api/military-organizations/delete-logo/[id]   # Remover logo
```
</details>

<details>
<summary><strong>📂 Seções (6 endpoints)</strong></summary>

```http
GET    /api/sections                    # Listar seções
POST   /api/sections                    # Criar seção
GET    /api/sections/[id]               # Buscar seção
PUT    /api/sections/[id]               # Atualizar seção
DELETE /api/sections/[id]               # Deletar seção
GET    /api/sections/by-om-id/[id]      # Seções por OM
```
</details>

<details>
<summary><strong>👥 Usuários (8 endpoints)</strong></summary>

```http
GET    /api/users                                      # Listar usuários
POST   /api/users                                      # Criar usuário
GET    /api/users/[id]                                 # Buscar usuário
PUT    /api/users/[id]                                 # Atualizar usuário
DELETE /api/users/[id]                                 # Deletar usuário
POST   /api/users/get-user-by-servicename             # Buscar por nome de guerra
POST   /api/users/get-users-by-servicename-all-om     # Buscar em todas OM
GET    /api/users/get-users-by-om/[id]                # Usuários por OM
```
</details>

<details>
<summary><strong>🎖️ Patentes (5 endpoints)</strong></summary>

```http
GET    /api/ranks                           # Listar patentes
POST   /api/ranks                           # Criar patente
GET    /api/ranks/[id]                      # Buscar patente
PUT    /api/ranks/[id]                      # Atualizar patente
DELETE /api/ranks/[id]                      # Deletar patente
GET    /api/ranks/hierarchy/[hierarchy]     # Por hierarquia
```
</details>

---

## 🏗️ Arquitetura

### 📁 Estrutura do Projeto
```
newomemnumeros/
├── app/
│   ├── components/              # 17 componentes organizados
│   ├── composables/             # 7 composables reutilizáveis
│   ├── middleware/              # 4+ middlewares de segurança
│   ├── pages/                   # 7 páginas funcionais
│   ├── services/                # 7 services client-side
│   ├── stores/                  # 8 stores Pinia (6 core + 2 admin)
│   └── types/                   # Definições TypeScript
├── server/
│   ├── api/                     # 31 endpoints organizados
│   ├── services/                # 6 services server-side
│   ├── transformers/            # 8 transformers de dados
│   ├── schemas/                 # Validação Zod
│   └── utils/                   # Utilitários do servidor
│       ├── errorHandler.ts      # Sistema unificado de error handling
│       ├── responseWrapper.ts   # Utilitários de resposta API
│       └── clientErrorHandler.ts # Error handling client-side
├── shared/                      # Módulos compartilhados
│   ├── constants/               # Constantes (permissions, defaults)
│   ├── types/                   # Tipos compartilhados
│   │   └── api-response.ts      # ApiResponse + ErrorCode sistema
│   ├── utils/                   # Utilitários consolidados
│   └── config/                  # Configurações
├── docs/                        # Documentação e changelogs
├── public/logos/                # Sistema de upload
└── prisma/                      # Schema e migrações
```

### 🔄 Padrões Arquiteturais

**Composables Pattern**: Lógica reutilizável encapsulada
```typescript
// useAuth.ts - Lógica de autenticação
export const useAuth = () => {
  const login = async (credentials) => { /* ... */ }
  const logout = async () => { /* ... */ }
  return { login, logout, user, isAuthenticated }
}
```

**Services Pattern**: Comunicação com APIs
```typescript
// auth.service.ts - Serviços de API
export const authService = {
  login: (data) => $fetch('/api/auth/login', { method: 'POST', body: data }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' })
}
```

**Transformers Pattern**: Normalização de dados
```typescript
// user.transformer.ts - Transformação consistente
export const UserTransformer = {
  transform: (user) => ({ /* normalized user */ }),
  collection: (users) => users.map(this.transform)
}
```

---

## 🌍 Internacionalização

### Idiomas Suportados
- 🇧🇷 **pt-BR**: Português do Brasil (padrão)
- 🇺🇸 **en-US**: English (fallback)

### Funcionalidades i18n
- ✅ **Interface traduzida** completamente
- ✅ **Mensagens de erro** multilíngues
- ✅ **Validações** com suporte a idiomas
- ✅ **Seletor de idioma** integrado
- ✅ **Persistência** de preferência
- ✅ **Server-side** translation support

---

## 🎨 Sistema de Temas & Upload

### Temas Personalizáveis
- **Dark Mode** otimizado por padrão
- **Cores customizáveis** por organização militar
- **Design responsivo** mobile-first
- **Breakpoints Vuetify** para todas as telas

### Upload de Imagens
- ✅ **Upload de logos** para organizações
- ✅ **Processamento automático** com Sharp
- ✅ **Geração de miniaturas** (50x50px)
- ✅ **Cropping avançado** com Vue Advanced Cropper
- ✅ **Validação de formatos** (PNG/JPEG)
- ✅ **Organização por pastas** baseada em acrônimos

### Estrutura de Armazenamento
```
/public/logos/
├── default/                    # Logos padrão
│   ├── default.png            # 354x472px
│   └── default_mini.png       # 50x50px
└── [acronimo_om]/             # Por organização
    ├── logo.png               # Principal
    └── logo_mini.png          # Miniatura
```

---

## 📝 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm run dev              # Servidor desenvolvimento (localhost:3000)
pnpm run build            # Build para produção
pnpm run preview          # Preview do build
```

### Banco de Dados
```bash
pnpm run db:migrate       # Executar migrações
pnpm run db:reset         # Reset completo do banco
pnpm run db:seed          # Popular dados iniciais
pnpm run db:studio        # Interface visual (Prisma Studio)
```

### Qualidade de Código
```bash
pnpm run lint             # Verificar código (ESLint)
pnpm run lint:fix         # Corrigir problemas automáticos
pnpm run format           # Formatar código (Prettier)
```

---

## 🔒 Segurança

### ✅ Implementado
- **JWT** com refresh automático
- **Cookies HttpOnly** para tokens
- **Middleware de autenticação** global
- **Controle de permissões** granular com categorização
- **Hash de senhas** com bcrypt
- **Validação de entrada** com Zod schemas
- **Sanitização** automática de dados
- **Soft delete** com cascata manual
- **Verificação server-side** de tokens
- **Preservação de case** em acrônimos
- **Relacionamentos many-to-many** flexíveis
- **Sistema de error handling unificado** com ApiResponse pattern
- **Error categorization** automática (database, validation, auth, etc.)
- **Retry logic** para erros transientes
- **Graceful degradation** com error boundaries
- **Tradução automática** de mensagens de erro (i18n)

### 🔮 Melhorias Futuras
- **Monitoring** de erros com Sentry/LogRocket
- **Rate limiting** para endpoints
- **Sistema de recuperação** de senha
- **Autenticação 2FA** (dois fatores)
- **Logs de auditoria** detalhados
- **Critérios de senha** mais rigorosos
- **Verificação de email** após registro
- **Error analytics** e dashboards de métricas

---

## 📊 Estatísticas do Projeto

<div align="center">

| Categoria | Quantidade | Descrição |
|-----------|------------|-----------|
| 🌐 **APIs** | 31 | Endpoints funcionais implementados |
| 🧩 **Componentes** | 17 | Componentes Vue organizados por funcionalidade |
| 📄 **Páginas** | 7 | Páginas funcionais (públicas + admin) |
| 🔧 **Composables** | 7 | Lógica de negócio reutilizável |
| 🗃️ **Stores** | 8 | Estados Pinia com persistência (6 core + 2 admin) |
| 🔄 **Services** | 13 | Client/Server comunicação API (7+6) |
| 🔀 **Transformers** | 8 | Consistência de dados |
| 🛡️ **Middlewares** | 4+ | Segurança e controle |
| 🚨 **Error System** | 1 | Sistema unificado de tratamento de erro |
| 🌍 **Idiomas** | 2 | pt-BR e en-US completos |
| 📊 **Entidades** | 8 | Modelos de banco relacionais |

</div>

---

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
```bash
# Banco de Dados
DATABASE_URL="mysql://user:password@localhost:3306/database"

# Aplicação  
NUXT_APP_NAME="Sistema de Gestão Militar"
NUXT_APP_CREATOR="Desenvolvedor"

# JWT (opcional - usa padrão se não definida)
JWT_SECRET="sua-chave-secreta-jwt"

# Configurações de Upload
UPLOAD_MAX_SIZE=5242880  # 5MB
ALLOWED_EXTENSIONS="png,jpg,jpeg"
```

---

## 🚀 Deploy & Produção

### Preparação para Deploy
```bash
# Build da aplicação
pnpm run build

# Executar migrações em produção
pnpm run db:migrate

# Popular dados iniciais (se necessário)
pnpm run db:seed
```

### Docker
```bash
# Build da imagem
docker build -t sistema-gestao-militar .

# Executar container
docker run -p 3000:3000 sistema-gestao-militar
```

---

## 🚨 Sistema de Error Handling Unificado

### Arquitetura de Tratamento de Erros
Implementação do padrão **"Handler Unified with Specialized Layers"** garantindo consistência total no tratamento de erros:

#### 🎯 Componentes Principais
- **ApiResponse Interface**: Padronização de todas as respostas da API
- **ErrorCode Enum**: Categorização inteligente de tipos de erro
- **Unified Error Handler**: Processamento centralizado server-side
- **Client Error Handler**: Interceptação e tratamento frontend
- **useErrorHandler Composable**: Composable reativo para Vue
- **Error Enhancement**: Contextualização automática de erros
- **Retry Logic**: Tentativas automáticas para erros transientes

#### 🔄 Fluxo de Error Handling
1. **Server**: Erro capturado → `handleError()` → Mapeamento + Tradução → `ApiResponse`
2. **API**: `createError()` com status HTTP + dados da ApiResponse
3. **Frontend**: Interceptação → `clientErrorHandler` → Toast + Log
4. **Vue**: `useErrorHandler` → Tratamento específico + UX otimizada

#### ✅ Padronização Total Implementada
- **31 endpoints** padronizados para `Promise<ApiResponse<T>>`
- **Eliminação completa** de suporte legacy
- **Mapeamento automático** de erros Prisma (P2002, P2025, P2003)
- **Tradução multilíngue** de mensagens de erro
- **Toast notifications** automáticas para usuário
- **Error boundaries** para graceful degradation

## 📈 Monitoramento & Performance

### Métricas Disponíveis
- **Response times** dos endpoints
- **Error rates** por categoria e endpoint
- **Uso de memória** da aplicação
- **Queries do banco** otimizadas
- **Bundle size** otimizado
- **Core Web Vitals** monitorados

### Logs Estruturados
- **Error logging** com contexto completo
- **Autenticação e autorização** 
- **Operações CRUD** por entidade
- **Performance de queries**
- **Error patterns** e análise de tendências

---

## 🤝 Contribuição

### Processo de Contribuição
1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código
- **ESLint + Prettier** configurados
- **TypeScript** estrito habilitado
- **Conventional Commits** recomendado
- **Testes** obrigatórios para novas features

---

## 📄 Licença

Este projeto está sob licença privada. Todos os direitos reservados.

---

<div align="center">

**Desenvolvido com ❤️ para gestão militar eficiente**

[🔝 Voltar ao topo](#-sistema-de-gestão-militar)

</div>