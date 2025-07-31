# Template - CHANGELOG

## [Data] - Título da Release

### ✨ Novas Funcionalidades
- [Funcionalidade] - Descrição breve da nova funcionalidade
- [Módulo] - Nova feature implementada

### 🔧 Melhorias
- [Componente] - Melhoria implementada
- [Performance] - Otimização realizada

### 🐛 Correções
- [Bug] - Descrição do bug corrigido
- [Issue] - Problema resolvido

### 🔒 Segurança
- [Security] - Melhoria de segurança implementada
- [Vulnerability] - Vulnerabilidade corrigida

### 📚 Documentação
- [Docs] - Documentação adicionada/atualizada
- [README] - Mudanças no README

### 🏗️ Infraestrutura
- [DevOps] - Mudanças na infraestrutura
- [Config] - Mudanças na configuração

### ⚠️ Breaking Changes
- [BREAKING] - Mudança que quebra compatibilidade
- [API] - Mudança na API que requer atualização

### 🗃️ Banco de Dados
- [Migration] - Nova migração adicionada
- [Schema] - Mudança no esquema de dados

---

## Detalhes Técnicos

### Arquivos Modificados
- `path/to/file.ts` - Descrição da mudança
- `another/file.vue` - O que foi alterado

### APIs Afetadas
- `GET /api/endpoint` - Mudança na resposta
- `POST /api/other` - Novo parâmetro adicionado

### Migrações
```sql
-- Exemplo de migração SQL
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
```

### Configuração
```bash
# Novas variáveis de ambiente necessárias
NEW_CONFIG_VAR="value"
```

---

## Notas de Upgrade

### Para Desenvolvedores
1. Execute `pnpm install` para atualizar dependências
2. Execute `pnpm run db:migrate` para aplicar migrações
3. Verifique as novas variáveis de ambiente

### Para Deploy
1. Backup do banco de dados antes do deploy
2. Aplicar migrações em produção
3. Atualizar variáveis de ambiente

---

**Autor**: Nome do Desenvolvedor  
**Data**: DD/MM/YYYY  
**Versão**: v0.x.x