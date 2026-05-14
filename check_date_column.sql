-- Script para verificar se a coluna date está correta
-- Verifica se o DEFAULT foi removido e mostra a estrutura atual

-- Verificar a estrutura da coluna date
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'item_movements' 
AND column_name = 'date';

-- Verificar se há triggers na tabela
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'item_movements';

-- Mostrar as últimas movimentações para verificar as datas
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at,
  EXTRACT(timezone FROM date) as timezone_offset
FROM public.item_movements 
ORDER BY created_at DESC 
LIMIT 10;

-- Teste: inserir uma movimentação com data específica
INSERT INTO public.item_movements (
  type,
  responsible_name,
  seller_name,
  date
) VALUES (
  'checkout',
  'Teste Data',
  'Teste Vendedor',
  '2025-05-09 00:00:00+00'::timestamptz
);

-- Verificar se a inserção funcionou
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at
FROM public.item_movements 
WHERE responsible_name = 'Teste Data'
ORDER BY created_at DESC 
LIMIT 1;

-- Limpar o teste
DELETE FROM public.item_movements 
WHERE responsible_name = 'Teste Data';

-- Verifica se o DEFAULT foi removido e mostra a estrutura atual

-- Verificar a estrutura da coluna date
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'item_movements' 
AND column_name = 'date';

-- Verificar se há triggers na tabela
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'item_movements';

-- Mostrar as últimas movimentações para verificar as datas
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at,
  EXTRACT(timezone FROM date) as timezone_offset
FROM public.item_movements 
ORDER BY created_at DESC 
LIMIT 10;

-- Teste: inserir uma movimentação com data específica
INSERT INTO public.item_movements (
  type,
  responsible_name,
  seller_name,
  date
) VALUES (
  'checkout',
  'Teste Data',
  'Teste Vendedor',
  '2025-05-09 00:00:00+00'::timestamptz
);

-- Verificar se a inserção funcionou
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at
FROM public.item_movements 
WHERE responsible_name = 'Teste Data'
ORDER BY created_at DESC 
LIMIT 1;

-- Limpar o teste
DELETE FROM public.item_movements 
WHERE responsible_name = 'Teste Data';
