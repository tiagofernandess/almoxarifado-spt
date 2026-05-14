-- Script SQL para inserir movimentações de saída
-- Responsável: Adelina Floresta (ID: 0000)

-- Primeiro, vamos criar o responsável e vendedor
-- Criar responsável
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

-- Criar vendedor (mesmo ID para manter consistência)
INSERT INTO sellers (id, name, whatsapp, address, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '00000000000',
  'Endereço não informado',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Inserir as movimentações de saída
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES 
  -- Movimentação 1: 00076 - VX680
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 15:59:00+00',
    NOW()
  ),
  -- Movimentação 2: 00082 - VX680
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 15:59:00+00',
    NOW()
  ),
  -- Movimentação 3: 00083 - VX680
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 15:59:00+00',
    NOW()
  ),
  -- Movimentação 4: 00004 - Android Laranja
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 16:00:00+00',
    NOW()
  ),
  -- Movimentação 5: 89550287500013661856 - Chip Tim
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 16:08:00+00',
    NOW()
  ),
  -- Movimentação 6: 89550287500013661948 - Chip Tim
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 16:09:00+00',
    NOW()
  ),
  -- Movimentação 7: 895502870013661823 - Chip Tim
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 16:10:00+00',
    NOW()
  ),
  -- Movimentação 8: 895502870013661864 - Chip Tim
  (
    gen_random_uuid(),
    'checkout',
    'Adelina Floresta',
    '00000000-0000-0000-0000-000000000000',
    'Adelina Floresta',
    '2025-05-09 16:10:00+00',
    NOW()
  );

-- Agora vamos inserir os itens das movimentações
-- Primeiro, vamos obter os IDs das movimentações que acabamos de inserir
WITH movement_ids AS (
  SELECT id, date
  FROM item_movements 
  WHERE responsible_name = 'Adelina Floresta' 
    AND date >= '2025-05-09 15:59:00+00'
    AND date <= '2025-05-09 16:10:00+00'
  ORDER BY date
),
item_codes AS (
  SELECT unnest(ARRAY[
    '00076', '00082', '00083', '00004', 
    '89550287500013661856', '89550287500013661948', 
    '895502870013661823', '895502870013661864'
  ]) AS code,
  unnest(ARRAY[
    'VX680', 'VX680', 'VX680', 'Android Laranja',
    'Chip Tim', 'Chip Tim', 'Chip Tim', 'Chip Tim'
  ]) AS name
)
INSERT INTO movement_items (
  movement_id, 
  item_id, 
  item_name, 
  item_code, 
  quantity, 
  responsible_name, 
  seller_id, 
  seller_name, 
  created_at
)
SELECT 
  mi.id,
  i.id,
  ic.name,
  ic.code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM movement_ids mi
CROSS JOIN item_codes ic
LEFT JOIN items i ON i.code = ic.code
WHERE i.id IS NOT NULL;

-- Atualizar as quantidades dos itens (reduzir disponível e aumentar em uso)
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code IN (
  '00076', '00082', '00083', '00004', 
  '89550287500013661856', '89550287500013661948', 
  '895502870013661823', '895502870013661864'
);

-- Verificar se as inserções foram bem-sucedidas
SELECT 
  'Movimentações inseridas:' as status,
  COUNT(*) as total_movements
FROM item_movements 
WHERE responsible_name = 'Adelina Floresta' 
  AND date >= '2025-05-09 15:59:00+00'
  AND date <= '2025-05-09 16:10:00+00';

SELECT 
  'Itens das movimentações:' as status,
  COUNT(*) as total_items
FROM movement_items 
WHERE responsible_name = 'Adelina Floresta';

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


