# 📚 Documentação do Sistema de Gestão Militar

## 📋 Índice da Documentação

### 📖 Documentação Geral
- [📝 CHANGELOG](./changelog/) - Histórico de mudanças do sistema
- [🛠️ CLAUDE.md](../CLAUDE.md) - Documentação técnica para desenvolvimento
- [🚀 README.md](../README.md) - Visão geral do projeto

### 🔧 Documentação Técnica

#### API Documentation
- [🌐 Endpoints](../README.md#-apis-implementadas) - Lista completa de APIs disponíveis
- [🔐 Autenticação](../README.md#-autenticação--segurança) - Sistema de autenticação JWT
- [📊 Modelos de Dados](../README.md#-modelo-de-dados) - Esquemas Prisma e relacionamentos

#### Arquitetura
- [🏗️ Padrões Arquiteturais](../README.md#-arquitetura) - Composables, Services, Transformers
- [🗃️ Estrutura do Projeto](../README.md#-estrutura-do-projeto) - Organização de pastas e arquivos
- [🔄 Fluxo de Dados](../README.md#-sistema-de-error-handling-unificado) - Como os dados fluem na aplicação

#### Frontend
- [🧩 Componentes](../README.md#-funcionalidades) - Documentação dos componentes Vue
- [🎨 Sistema de Temas](../README.md#-sistema-de-temas--upload) - Customização visual e upload de logos
- [🌍 Internacionalização](../README.md#-internacionalização) - Configuração pt-BR/en-US

#### Backend
- [⚙️ Services](../README.md#-stack-tecnológica) - Lógica de negócio do servidor
- [🔀 Transformers](../README.md#-padrões-arquiteturais) - Normalização de dados
- [🛡️ Middleware](../README.md#-segurança) - Segurança e validação

### 🚀 Guias de Desenvolvimento

#### Setup & Configuração
- [🔧 Configuração do Ambiente](../README.md#-como-executar) - Instalação e configuração inicial
- [🐳 Docker & Deployment](../README.md#-com-docker) - Deploy com Docker
- [🗄️ Banco de Dados](../README.md#-scripts-disponíveis) - Migrações e seeding

#### Desenvolvimento
- [📝 Convenções de Código](../README.md#-contribuição) - Padrões e boas práticas
- [✅ Testes](../README.md#-próximos-passos-recomendados) - Estratégias de teste (planejadas)
- [🔍 Debug](../README.md#-monitoramento--performance) - Ferramentas e técnicas de debug

### 📊 Relatórios e Métricas

#### Performance
- [⚡ Métricas de Performance](../README.md#-monitoramento--performance) - Análise de desempenho
- [📈 Bundle Analysis](../README.md#-estatísticas-do-projeto) - Análise do tamanho do bundle
- [🏎️ Otimizações](../README.md#-sistema-de-error-handling-unificado) - Melhorias implementadas

#### Segurança
- [🔒 Auditoria de Segurança](../README.md#-segurança) - Análise de vulnerabilidades
- [🛡️ Boas Práticas](../README.md#-segurança) - Recomendações de segurança

---

## 🗂️ Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo (índice geral)
├── changelog/                   # Histórico de mudanças
│   ├── 2025-08-07-roles-global-pivot-architecture.md
│   ├── 2025-08-04-unified-error-handling.md
│   ├── 2025-08-04-utilities-consolidation.md
│   ├── 2025-07-31-schema-updates-ux-improvements.md
│   ├── 2025-07-30-store-sync.md
│   └── template.md
└── upcoming-features.md         # Funcionalidades planejadas
```

---

## 🚀 Como Usar Esta Documentação

### 👨‍💻 Para Desenvolvedores
1. **Primeiro acesso**: Comece com [Como Executar](../README.md#-como-executar)
2. **Entendendo a arquitetura**: Leia [Arquitetura](../README.md#-arquitetura)
3. **Desenvolvendo features**: Consulte [Contribuição](../README.md#-contribuição)

### 🏗️ Para Arquitetos
1. **Visão geral**: [Estrutura do Projeto](../README.md#-estrutura-do-projeto)
2. **Fluxo de dados**: [Sistema de Error Handling](../README.md#-sistema-de-error-handling-unificado)
3. **APIs**: [APIs Implementadas](../README.md#-apis-implementadas)

### 🎨 Para Designers
1. **Sistema visual**: [Sistema de Temas](../README.md#-sistema-de-temas--upload)
2. **Componentes**: [Funcionalidades](../README.md#-funcionalidades)
3. **Internacionalização**: [Internacionalização](../README.md#-internacionalização)

---

## 📅 Atualizações da Documentação

A documentação é atualizada continuamente junto com o desenvolvimento. Principais marcos:

- **2025-08-07**: Sistema de Roles Globais com Arquitetura Pivot (v1.5.0)
- **2025-08-04**: Sistema de Error Handling Unificado (v1.4.0)
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