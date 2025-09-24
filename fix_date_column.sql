-- Script para corrigir a coluna date da tabela item_movements
-- Remove o DEFAULT que está sobrescrevendo as datas selecionadas pelo usuário

-- Remover o DEFAULT da coluna date
ALTER TABLE public.item_movements 
ALTER COLUMN date DROP DEFAULT;

-- Verificar se a alteração foi aplicada
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type
FROM information_schema.columns 
WHERE table_name = 'item_movements' 
AND column_name = 'date';

-- Mostrar alguns exemplos de movimentações existentes
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at
FROM public.item_movements 
ORDER BY created_at DESC 
LIMIT 5;

-- Remove o DEFAULT que está sobrescrevendo as datas selecionadas pelo usuário

-- Remover o DEFAULT da coluna date
ALTER TABLE public.item_movements 
ALTER COLUMN date DROP DEFAULT;

-- Verificar se a alteração foi aplicada
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type
FROM information_schema.columns 
WHERE table_name = 'item_movements' 
AND column_name = 'date';

-- Mostrar alguns exemplos de movimentações existentes
SELECT 
  id,
  type,
  responsible_name,
  date,
  created_at
FROM public.item_movements 
ORDER BY created_at DESC 
LIMIT 5;
