-- Script para resetar quantidades dos itens após deletar movimentações
-- Este script coloca todos os itens como disponíveis

-- Atualizar todos os itens para ficarem disponíveis
UPDATE public.items 
SET 
  available_quantity = total_quantity,
  in_use_quantity = 0,
  updated_at = timezone('utc'::text, now())
WHERE total_quantity > 0;

-- Verificar quantos itens foram atualizados
SELECT 
  COUNT(*) as total_items,
  SUM(total_quantity) as total_quantity_sum,
  SUM(available_quantity) as available_quantity_sum,
  SUM(in_use_quantity) as in_use_quantity_sum
FROM public.items;

-- Mostrar alguns exemplos dos itens atualizados
SELECT 
  code,
  name,
  category,
  total_quantity,
  available_quantity,
  in_use_quantity
FROM public.items 
ORDER BY code 
LIMIT 10;


