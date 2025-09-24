# 📝 Instruções para Inserir Movimentações de Saída

## 🎯 Objetivo
Inserir 8 movimentações de saída para o responsável **Adelina Floresta** com os seguintes itens:

| Data | Código | Nome | Quantidade |
|------|--------|------|------------|
| 09/05/2025 15:59 | 00076 | VX680 | 1 |
| 09/05/2025 15:59 | 00082 | VX680 | 1 |
| 09/05/2025 15:59 | 00083 | VX680 | 1 |
| 09/05/2025 16:00 | 00004 | Android Laranja | 1 |
| 09/05/2025 16:08 | 89550287500013661856 | Chip Tim | 1 |
| 09/05/2025 16:09 | 89550287500013661948 | Chip Tim | 1 |
| 09/05/2025 16:10 | 895502870013661823 | Chip Tim | 1 |
| 09/05/2025 16:10 | 895502870013661864 | Chip Tim | 1 |

## 📁 Arquivos SQL Criados

### **1. `insert_movements.sql`** ⭐ (Recomendado)
- **Script completo** com todas as inserções
- **Execução em lote** mais eficiente
- **Verificações automáticas** no final

### **2. `insert_movements_simple.sql`**
- **Script passo a passo** mais fácil de debugar
- **Execução individual** de cada movimentação
- **Mais seguro** para identificar problemas

## 🚀 Como Executar

### **Opção 1: Via Supabase Dashboard (Recomendado)**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até **SQL Editor**
4. Execute o arquivo `insert_movements.sql` completo

### **Opção 2: Execução Passo a Passo**
1. Use o arquivo `insert_movements_simple.sql`
2. Execute cada bloco de código separadamente
3. Verifique se cada passo foi executado com sucesso

## 🔍 O que o Script Faz

### **1. Cria Responsável**
```sql
INSERT INTO responsibles (id, name, whatsapp, address, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '00000000000',
  'Endereço não informado',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

### **2. Insere Movimentações**
```sql
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 15:59:00+00',
  NOW()
);
```

### **3. Insere Itens das Movimentações**
```sql
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 15:59:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '00076';
```

### **4. Atualiza Quantidades dos Itens**
```sql
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00076';
```

## ✅ Verificações Automáticas

O script inclui verificações automáticas que mostram:

### **1. Total de Movimentações**
```sql
SELECT 
  'Movimentações inseridas:' as status,
  COUNT(*) as total_movements
FROM item_movements 
WHERE responsible_name = 'Adelina Floresta' 
  AND date >= '2025-05-09 15:59:00+00'
  AND date <= '2025-05-09 16:10:00+00';
```

### **2. Total de Itens**
```sql
SELECT 
  'Itens das movimentações:' as status,
  COUNT(*) as total_items
FROM movement_items 
WHERE responsible_name = 'Adelina Floresta';
```

### **3. Status dos Itens**
```sql
SELECT 
  'Status dos itens após movimentação:' as status,
  code,
  name,
  available_quantity,
  in_use_quantity,
  total_quantity
FROM items 
WHERE code IN (
  '00076', '00082', '00083', '00004', 
  '89550287500013661856', '89550287500013661948', 
  '895502870013661823', '895502870013661864'
)
ORDER BY code;
```

## 🎯 Resultado Esperado

Após executar o script, você deve ver:

### **✅ Movimentações Criadas**
- 8 movimentações de saída
- Todas com responsável "Adelina Floresta"
- Datas corretas (09/05/2025)

### **✅ Itens Atualizados**
- Quantidade disponível reduzida em 1
- Quantidade em uso aumentada em 1
- Total de quantidade mantido

### **✅ Relatório de Movimentações**
- Todas as 8 movimentações aparecem na tela de Relatórios
- Ordenadas por data (mais recente primeiro)
- Responsável e vendedor corretos

## 🚨 Possíveis Problemas

### **1. Item Não Existe**
- Se algum código de item não existir na tabela `items`
- O script continuará, mas não criará a movimentação para esse item
- Verifique se todos os códigos existem antes de executar

### **2. Quantidade Insuficiente**
- Se algum item não tiver quantidade disponível suficiente
- O script pode falhar na atualização de quantidades
- Verifique o estoque antes de executar

### **3. Responsável Já Existe**
- Se o responsável "Adelina Floresta" já existir
- O script usa `ON CONFLICT DO NOTHING` para evitar erros
- Não haverá problemas de duplicação

## 🎉 Após Execução

1. **Verifique o Relatório de Movimentações** na tela de Relatórios
2. **Confirme que os itens** foram atualizados corretamente
3. **Teste a funcionalidade** de exclusão de movimentações
4. **Use "Corrigir Inconsistências"** se necessário

O sistema agora terá todas as movimentações registradas corretamente! 🚀


## 🎯 Objetivo
Inserir 8 movimentações de saída para o responsável **Adelina Floresta** com os seguintes itens:

| Data | Código | Nome | Quantidade |
|------|--------|------|------------|
| 09/05/2025 15:59 | 00076 | VX680 | 1 |
| 09/05/2025 15:59 | 00082 | VX680 | 1 |
| 09/05/2025 15:59 | 00083 | VX680 | 1 |
| 09/05/2025 16:00 | 00004 | Android Laranja | 1 |
| 09/05/2025 16:08 | 89550287500013661856 | Chip Tim | 1 |
| 09/05/2025 16:09 | 89550287500013661948 | Chip Tim | 1 |
| 09/05/2025 16:10 | 895502870013661823 | Chip Tim | 1 |
| 09/05/2025 16:10 | 895502870013661864 | Chip Tim | 1 |

## 📁 Arquivos SQL Criados

### **1. `insert_movements.sql`** ⭐ (Recomendado)
- **Script completo** com todas as inserções
- **Execução em lote** mais eficiente
- **Verificações automáticas** no final

### **2. `insert_movements_simple.sql`**
- **Script passo a passo** mais fácil de debugar
- **Execução individual** de cada movimentação
- **Mais seguro** para identificar problemas

## 🚀 Como Executar

### **Opção 1: Via Supabase Dashboard (Recomendado)**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até **SQL Editor**
4. Execute o arquivo `insert_movements.sql` completo

### **Opção 2: Execução Passo a Passo**
1. Use o arquivo `insert_movements_simple.sql`
2. Execute cada bloco de código separadamente
3. Verifique se cada passo foi executado com sucesso

## 🔍 O que o Script Faz

### **1. Cria Responsável**
```sql
INSERT INTO responsibles (id, name, whatsapp, address, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '00000000000',
  'Endereço não informado',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

### **2. Insere Movimentações**
```sql
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 15:59:00+00',
  NOW()
);
```

### **3. Insere Itens das Movimentações**
```sql
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 15:59:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '00076';
```

### **4. Atualiza Quantidades dos Itens**
```sql
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00076';
```

## ✅ Verificações Automáticas

O script inclui verificações automáticas que mostram:

### **1. Total de Movimentações**
```sql
SELECT 
  'Movimentações inseridas:' as status,
  COUNT(*) as total_movements
FROM item_movements 
WHERE responsible_name = 'Adelina Floresta' 
  AND date >= '2025-05-09 15:59:00+00'
  AND date <= '2025-05-09 16:10:00+00';
```

### **2. Total de Itens**
```sql
SELECT 
  'Itens das movimentações:' as status,
  COUNT(*) as total_items
FROM movement_items 
WHERE responsible_name = 'Adelina Floresta';
```

### **3. Status dos Itens**
```sql
SELECT 
  'Status dos itens após movimentação:' as status,
  code,
  name,
  available_quantity,
  in_use_quantity,
  total_quantity
FROM items 
WHERE code IN (
  '00076', '00082', '00083', '00004', 
  '89550287500013661856', '89550287500013661948', 
  '895502870013661823', '895502870013661864'
)
ORDER BY code;
```

## 🎯 Resultado Esperado

Após executar o script, você deve ver:

### **✅ Movimentações Criadas**
- 8 movimentações de saída
- Todas com responsável "Adelina Floresta"
- Datas corretas (09/05/2025)

### **✅ Itens Atualizados**
- Quantidade disponível reduzida em 1
- Quantidade em uso aumentada em 1
- Total de quantidade mantido

### **✅ Relatório de Movimentações**
- Todas as 8 movimentações aparecem na tela de Relatórios
- Ordenadas por data (mais recente primeiro)
- Responsável e vendedor corretos

## 🚨 Possíveis Problemas

### **1. Item Não Existe**
- Se algum código de item não existir na tabela `items`
- O script continuará, mas não criará a movimentação para esse item
- Verifique se todos os códigos existem antes de executar

### **2. Quantidade Insuficiente**
- Se algum item não tiver quantidade disponível suficiente
- O script pode falhar na atualização de quantidades
- Verifique o estoque antes de executar

### **3. Responsável Já Existe**
- Se o responsável "Adelina Floresta" já existir
- O script usa `ON CONFLICT DO NOTHING` para evitar erros
- Não haverá problemas de duplicação

## 🎉 Após Execução

1. **Verifique o Relatório de Movimentações** na tela de Relatórios
2. **Confirme que os itens** foram atualizados corretamente
3. **Teste a funcionalidade** de exclusão de movimentações
4. **Use "Corrigir Inconsistências"** se necessário

O sistema agora terá todas as movimentações registradas corretamente! 🚀
