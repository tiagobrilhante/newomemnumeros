# 📚 Documentação do Sistema de Gestão Militar

## 📋 Índice da Documentação

### 📖 Documentação Geral
- [📝 CHANGELOG](./changelog/) - Histórico de mudanças do sistema
- [🛠️ CLAUDE.md](../CLAUDE.md) - Documentação técnica para desenvolvimento
- [🚀 README.md](../README.md) - Visão geral do projeto

### 🔧 Documentação Técnica

#### API Documentation
- [🌐 Endpoints](./api/endpoints.md) - Lista completa de APIs disponíveis
- [🔐 Autenticação](./api/authentication.md) - Sistema de autenticação JWT
- [📊 Modelos de Dados](./api/data-models.md) - Esquemas Prisma e relacionamentos

#### Arquitetura
- [🏗️ Padrões Arquiteturais](./architecture/patterns.md) - Composables, Services, Transformers
- [🗃️ Estrutura do Projeto](./architecture/structure.md) - Organização de pastas e arquivos
- [🔄 Fluxo de Dados](./architecture/data-flow.md) - Como os dados fluem na aplicação

#### Frontend
- [🧩 Componentes](./frontend/components.md) - Documentação dos componentes Vue
- [🎨 Sistema de Temas](./frontend/theming.md) - Customização visual e upload de logos
- [🌍 Internacionalização](./frontend/i18n.md) - Configuração pt-BR/en-US

#### Backend
- [⚙️ Services](./backend/services.md) - Lógica de negócio do servidor
- [🔀 Transformers](./backend/transformers.md) - Normalização de dados
- [🛡️ Middleware](./backend/middleware.md) - Segurança e validação

### 🚀 Guias de Desenvolvimento

#### Setup & Configuração
- [🔧 Configuração do Ambiente](./guides/setup.md) - Instalação e configuração inicial
- [🐳 Docker & Deployment](./guides/deployment.md) - Deploy com Docker
- [🗄️ Banco de Dados](./guides/database.md) - Migrações e seeding

#### Desenvolvimento
- [📝 Convenções de Código](./guides/coding-standards.md) - Padrões e boas práticas
- [✅ Testes](./guides/testing.md) - Estratégias de teste (a implementar)
- [🔍 Debug](./guides/debugging.md) - Ferramentas e técnicas de debug

### 📊 Relatórios e Métricas

#### Performance
- [⚡ Métricas de Performance](./reports/performance.md) - Análise de desempenho
- [📈 Bundle Analysis](./reports/bundle-size.md) - Análise do tamanho do bundle
- [🏎️ Otimizações](./reports/optimizations.md) - Melhorias implementadas

#### Segurança
- [🔒 Auditoria de Segurança](./reports/security-audit.md) - Análise de vulnerabilidades
- [🛡️ Boas Práticas](./reports/security-best-practices.md) - Recomendações de segurança

---

## 🗂️ Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo (índice geral)
├── changelog/                   # Histórico de mudanças
│   ├── 2025-07-31-schema-updates-ux-improvements.md
│   ├── 2025-07-30-store-sync.md
│   └── template.md
├── api/                         # Documentação da API
├── architecture/                # Arquitetura do sistema
├── frontend/                    # Frontend específico
├── backend/                     # Backend específico
├── guides/                      # Guias práticos
└── reports/                     # Relatórios e análises
```

---

## 🚀 Como Usar Esta Documentação

### 👨‍💻 Para Desenvolvedores
1. **Primeiro acesso**: Comece com [Setup & Configuração](./guides/setup.md)
2. **Entendendo a arquitetura**: Leia [Padrões Arquiteturais](./architecture/patterns.md)
3. **Desenvolvendo features**: Consulte [Convenções de Código](./guides/coding-standards.md)

### 🏗️ Para Arquitetos
1. **Visão geral**: [Estrutura do Projeto](./architecture/structure.md)
2. **Fluxo de dados**: [Fluxo de Dados](./architecture/data-flow.md)
3. **APIs**: [Endpoints](./api/endpoints.md)

### 🎨 Para Designers
1. **Sistema visual**: [Sistema de Temas](./frontend/theming.md)
2. **Componentes**: [Componentes](./frontend/components.md)
3. **Internacionalização**: [i18n](./frontend/i18n.md)

---

## 📅 Atualizações da Documentação

A documentação é atualizada continuamente junto com o desenvolvimento. Principais marcos:

- **2025-07-31**: Schema RoleSection, UX logout, renderização condicional layout
- **2025-07-30**: Melhorias na sincronização de stores
- **2025-07-16**: Versão inicial do sistema

---

## 🤝 Contribuindo para a Documentação

Para contribuir com a documentação:

1. **Edite** os arquivos Markdown correspondentes
2. **Mantenha** a estrutura e formatação consistente
3. **Atualize** o changelog quando relevante
4. **Teste** links e referências

---

<div align="center">

**📚 Documentação mantida atualizada com o desenvolvimento ativo**

[🔝 Voltar ao projeto](../README.md)

</div>