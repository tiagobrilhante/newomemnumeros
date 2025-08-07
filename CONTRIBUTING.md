# 🤝 Contributing Guide - BasicOM

Welcome to **BasicOM - Basic administrative management system for Military Organizations**. This guide provides guidelines for contributing to the project in a professional and standardized manner.

---

## 📋 Project Scope

Before contributing, it's important to understand the **BasicOM** scope:

### ✅ **Within Scope**
- **Administrative Life**: Administrative, bureaucratic and organizational aspects
- **Personnel Management**: Registration, organization and administrative control
- **Organizational Structure**: Organizational chart and distribution by sections
- **Permission System**: Administrative access control
- **Administrative Reports**: Organizational data and statistics

### ❌ **Out of Scope**
- **Command and Control**: Operational or tactical aspects
- **Military Operations**: Combat or mission activities
- **Command Hierarchy**: Limited to administrative aspects
- **Military Intelligence**: Classified or sensitive data
- **Weapons Systems**: Any weapon-related functionality

---

## 🚀 How to Contribute

### 1. **Fork and Setup**
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/newomemnumeros.git
cd newomemnumeros

# 3. Configure upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/newomemnumeros.git

# 4. Install dependencies
pnpm install

# 5. Setup development environment
cp .env.example .env
# Edit .env with your local configurations
```

### 2. **Development Process**
```bash
# 1. Create a branch for your feature
git checkout -b feature/amazing-feature

# 2. Make your changes following established patterns

# 3. Run tests and checks
pnpm run lint          # Check code
pnpm run format        # Format code
pnpm run build         # Test build

# 4. Commit your changes
git add .
git commit -m "feat: add amazing feature"

# 5. Push to your fork
git push origin feature/amazing-feature

# 6. Open a Pull Request
```

---

## 📝 Development Standards

### **Clean Code Principles**
- **Descriptive names**: Use clear names for variables, functions and classes
- **Small functions**: Keep functions with single responsibility
- **Minimal comments**: Code should be self-explanatory
- **Avoid duplication**: Follow DRY (Don't Repeat Yourself) principle
- **Consistent formatting**: Use Prettier for automatic formatting

### **SOLID Principles**
- **Single Responsibility**: Each class/function has one responsibility
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable by their base types
- **Interface Segregation**: Small and specific interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### **TypeScript Guidelines**
```typescript
// ✅ Good: Explicit typing and well-defined interfaces
interface UserCreateInput {
  name: string
  email: string
  rankId: string
  sectionId: string
}

const createUser = async (data: UserCreateInput): Promise<ApiResponse<User>> => {
  return await userService.create(data)
}

// ❌ Bad: Implicit typing and any
const createUser = async (data: any) => {
  return await userService.create(data)
}
```

---

## 🔄 Conventional Commits (Mandatory)

### **Standard Format**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Commit Types**
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add JWT token refresh` |
| `fix` | Bug fix | `fix(user): resolve email validation issue` |
| `docs` | Documentation | `docs(readme): update installation guide` |
| `style` | Formatting | `style(components): fix indentation` |
| `refactor` | Refactoring | `refactor(services): improve error handling` |
| `test` | Tests | `test(auth): add login flow tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `perf` | Performance | `perf(api): optimize database queries` |
| `ci` | CI/CD | `ci(github): add automated tests` |

### **Practical Examples**
```bash
# New feature
git commit -m "feat(roles): implement global roles system"

# Bug fix
git commit -m "fix(auth): resolve token expiration handling"

# Breaking change
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: User API now returns different structure"

# Documentation
git commit -m "docs(contributing): add development guidelines"
```

---

## 🏗️ Architecture and Patterns

### **Folder Structure**
```
app/
├── components/              # Reusable Vue components
│   ├── auth/               # Authentication components
│   ├── user/               # User components
│   └── permissions/        # Permission components
├── composables/            # Reusable logic
├── services/               # API communication
├── stores/                 # State management (Pinia)
└── types/                  # TypeScript definitions

server/
├── api/                    # API endpoints
├── services/               # Business logic
├── transformers/           # Data normalization
├── schemas/                # Zod validation
└── utils/                  # Server utilities
```

### **Naming Conventions**
```typescript
// ✅ Files and components
UserManagement.vue          // PascalCase for components
useUserManagement.ts        // camelCase for composables
user.service.ts             // kebab-case for services
UserTransformer.ts          // PascalCase for classes

// ✅ Variables and functions
const userName = 'John'             // camelCase
const API_BASE_URL = 'http://...'   // SCREAMING_SNAKE_CASE for constants
const getUserById = (id: string)    // camelCase for functions

// ✅ Interfaces and types
interface UserCreateInput { }       // PascalCase
type ApiResponse<T> = { }           // PascalCase
```

### **Service Pattern**
```typescript
// user.service.ts - Client-side service
export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await $fetch<ApiResponse<User[]>>('/api/users')
    return data
  },
  
  async createUser(userData: UserCreateInput): Promise<User> {
    const { data } = await $fetch<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: userData
    })
    return data
  }
}
```

### **Composables Pattern**
```typescript
// useUsers.ts - Composable
export const useUsers = () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      users.value = await userService.getUsers()
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    fetchUsers
  }
}
```

---

## 🧪 Testing and Quality

### **Mandatory Tests**
- **Unit Tests**: For utility functions and services
- **Component Tests**: For complex Vue components
- **API Tests**: For critical endpoints
- **Integration Tests**: For main flows

### **Quality Tools**
```bash
# Linting (mandatory before commit)
pnpm run lint

# Formatting (automatic)
pnpm run format

# Build (must pass without errors)
pnpm run build

# Tests (when implemented)
pnpm run test
```

### **Editor Configuration**
```json
// Recommended .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 📋 Pull Request Guidelines

### **PR Template**
```markdown
## 📝 Description
Brief description of implemented changes.

## 🎯 Type of Change
- [ ] 🐛 Bug fix (fix that resolves an issue)
- [ ] ✨ New feature (adds functionality without breaking existing)
- [ ] 💥 Breaking change (change that breaks compatibility)
- [ ] 📚 Documentation (documentation-only changes)
- [ ] 🎨 Style (formatting, no logic changes)
- [ ] ♻️ Refactoring (code improvement without functionality change)

## 🧪 Testing
- [ ] Tests passing
- [ ] New tests added (if applicable)
- [ ] Build without errors
- [ ] Lint without warnings

## 📸 Screenshots (if applicable)
Add screenshots for UI changes

## ✅ Checklist
- [ ] Code follows project standards
- [ ] Self-review of code completed
- [ ] Comments added to complex code
- [ ] Documentation updated (if necessary)
- [ ] No breaking changes without notice
```

### **Approval Criteria**
- ✅ **Build** passes without errors or warnings
- ✅ **Lint** passes without violations
- ✅ **Tests** pass (when implemented)
- ✅ **Code Review** approved by maintainer
- ✅ **Conventional Commits** followed
- ✅ **Documentation** updated (if necessary)

---

## 🔐 Security and Best Practices

### **Sensitive Data**
```typescript
// ❌ NEVER do this
const password = 'mySecretPassword'
console.log('User password:', password)

// ✅ Always do this
const password = process.env.USER_PASSWORD
// Never log passwords or tokens
```

### **Input Validation**
```typescript
// Always use Zod schemas for validation
import { z } from 'zod'

const UserCreateSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  rankId: z.string().uuid(),
})

export const createUser = async (input: unknown) => {
  const data = UserCreateSchema.parse(input) // Automatic validation
  // ... rest of logic
}
```

### **Permissions and Authorization**
```typescript
// Always check permissions on server
export async function checkPermission(userId: string, permission: string) {
  const user = await getUserWithRoles(userId)
  return user.roles.some(role => 
    role.permissions.some(p => p.slug === permission)
  )
}
```

---

## 🌍 Internationalization

### **Adding Translations**
```json
// i18n/locales/pt-BR.json
{
  "user": {
    "name": "Nome",
    "email": "Email",
    "actions": {
      "create": "Criar Usuário",
      "edit": "Editar Usuário"
    }
  }
}

// i18n/locales/en-US.json
{
  "user": {
    "name": "Name",
    "email": "Email",
    "actions": {
      "create": "Create User",
      "edit": "Edit User"
    }
  }
}
```

### **Usage in Components**
```vue
<template>
  <div>
    <h1>{{ $t('user.actions.create') }}</h1>
    <input :placeholder="$t('user.name')" />
  </div>
</template>
```

---

## 📚 Resources and References

### **Technical Documentation**
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vuetify 3 Components](https://vuetifyjs.com/en/components/all/)
- [Prisma ORM](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Standards and Conventions**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Vue Style Guide](https://vuejs.org/style-guide/)

### **Development Tools**
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Zod Validation](https://zod.dev/)

---

## 🤝 Community and Support

### **Communication Channels**
- **Issues**: For bugs and feature requests
- **Discussions**: For general questions and discussions
- **Code Review**: Via Pull Requests

### **Professional Etiquette**
- **Be respectful** in interactions
- **Provide sufficient context** in issues and PRs
- **Be constructive** in code reviews
- **Document important decisions**

---

## ⚖️ License and Rights

This project is under **private license** and is developed for use in **military environment**.

- **Contributions** become part of the project
- **Confidentiality** must be maintained
- **Appropriate use** according to military scope

---

<div align="center">

**Thank you for contributing to BasicOM!**  
*Developed with professionalism for basic administrative management of Military Organizations*

**Maintained by**: TC Brilhante - Ch STI CMA

</div>