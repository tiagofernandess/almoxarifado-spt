# Instruções para Aplicar as Migrações

## 📋 Migrações Disponíveis

### 1. **create_responsibles_table.sql**
- Cria a tabela `responsibles` para gerenciar responsáveis
- Migra dados existentes da tabela `sellers` para `responsibles`
- Configura RLS (Row Level Security) e políticas de acesso

### 2. **update_movement_items_table_fixed.sql** ⭐ (Use esta versão)
- Adiciona colunas `responsible_name`, `seller_id` e `seller_name` à tabela `movement_items`
- Atualiza registros existentes com informações da tabela `item_movements`
- Cria índices para melhor performance
- Cria uma view `movement_items_complete` para consultas facilitadas
- **Versão corrigida** com sintaxe PostgreSQL válida

## 🚀 Como Aplicar as Migrações

### Opção 1: Via Supabase Dashboard (Recomendado)
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até **SQL Editor**
4. Execute cada migração individualmente:

```sql
-- Primeiro execute: create_responsibles_table.sql
-- Depois execute: update_movement_items_table_fixed.sql
```

### Opção 2: Via CLI (se configurado)
```bash
# Se você tiver o Supabase CLI configurado
supabase db push
```

### Opção 3: Via SQL direto
Copie e cole o conteúdo de cada arquivo `.sql` no SQL Editor do Supabase.

## ⚠️ Importante

- **Backup**: Sempre faça backup do banco antes de aplicar migrações
- **Ordem**: Execute as migrações na ordem correta (1º responsibles, 2º movement_items)
- **Teste**: Teste em ambiente de desenvolvimento antes de aplicar em produção

## 🔍 Verificação

Após aplicar as migrações, verifique se:

1. A tabela `responsibles` foi criada
2. As colunas foram adicionadas à tabela `movement_items`
3. Os dados existentes foram migrados corretamente
4. A view `movement_items_complete` está funcionando

## 📊 Benefícios das Migrações

- **Rastreabilidade**: Cada item de movimentação agora tem informações completas
- **Performance**: Índices otimizados para consultas rápidas
- **Integridade**: Foreign keys garantem consistência dos dados
- **Flexibilidade**: View facilita consultas complexas

## 📋 Migrações Disponíveis

### 1. **create_responsibles_table.sql**
- Cria a tabela `responsibles` para gerenciar responsáveis
- Migra dados existentes da tabela `sellers` para `responsibles`
- Configura RLS (Row Level Security) e políticas de acesso

### 2. **update_movement_items_table_fixed.sql** ⭐ (Use esta versão)
- Adiciona colunas `responsible_name`, `seller_id` e `seller_name` à tabela `movement_items`
- Atualiza registros existentes com informações da tabela `item_movements`
- Cria índices para melhor performance
- Cria uma view `movement_items_complete` para consultas facilitadas
- **Versão corrigida** com sintaxe PostgreSQL válida

## 🚀 Como Aplicar as Migrações

### Opção 1: Via Supabase Dashboard (Recomendado)
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até **SQL Editor**
4. Execute cada migração individualmente:

```sql
-- Primeiro execute: create_responsibles_table.sql
-- Depois execute: update_movement_items_table_fixed.sql
```

### Opção 2: Via CLI (se configurado)
```bash
# Se você tiver o Supabase CLI configurado
supabase db push
```

### Opção 3: Via SQL direto
Copie e cole o conteúdo de cada arquivo `.sql` no SQL Editor do Supabase.

## ⚠️ Importante

- **Backup**: Sempre faça backup do banco antes de aplicar migrações
- **Ordem**: Execute as migrações na ordem correta (1º responsibles, 2º movement_items)
- **Teste**: Teste em ambiente de desenvolvimento antes de aplicar em produção

## 🔍 Verificação

Após aplicar as migrações, verifique se:

1. A tabela `responsibles` foi criada
2. As colunas foram adicionadas à tabela `movement_items`
3. Os dados existentes foram migrados corretamente
4. A view `movement_items_complete` está funcionando

## 📊 Benefícios das Migrações

- **Rastreabilidade**: Cada item de movimentação agora tem informações completas
- **Performance**: Índices otimizados para consultas rápidas
- **Integridade**: Foreign keys garantem consistência dos dados
- **Flexibilidade**: View facilita consultas complexas
