-- Script SQL SIMPLES para inserir movimentações de saída
-- Responsável: Adelina Floresta

-- PASSO 1: Criar responsável (se não existir)
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

-- PASSO 1.1: Criar vendedor (mesmo ID para manter consistência)
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

-- PASSO 2: Inserir movimentação 1 (00076 - VX680)
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

-- PASSO 3: Inserir item da movimentação 1
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 15:59:00+00' LIMIT 1),
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

-- PASSO 4: Atualizar quantidade do item 00076
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00076';

-- PASSO 5: Inserir movimentação 2 (00082 - VX680)
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

-- PASSO 6: Inserir item da movimentação 2
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
WHERE code = '00082';

-- PASSO 7: Atualizar quantidade do item 00082
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00082';

-- PASSO 8: Inserir movimentação 3 (00083 - VX680)
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

-- PASSO 9: Inserir item da movimentação 3
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
WHERE code = '00083';

-- PASSO 10: Atualizar quantidade do item 00083
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00083';

-- PASSO 11: Inserir movimentação 4 (00004 - Android Laranja)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:00:00+00',
  NOW()
);

-- PASSO 12: Inserir item da movimentação 4
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:00:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '00004';

-- PASSO 13: Atualizar quantidade do item 00004
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00004';

-- PASSO 14: Inserir movimentação 5 (89550287500013661856 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:08:00+00',
  NOW()
);

-- PASSO 15: Inserir item da movimentação 5
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:08:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '89550287500013661856';

-- PASSO 16: Atualizar quantidade do item 89550287500013661856
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '89550287500013661856';

-- PASSO 17: Inserir movimentação 6 (89550287500013661948 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:09:00+00',
  NOW()
);

-- PASSO 18: Inserir item da movimentação 6
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:09:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '89550287500013661948';

-- PASSO 19: Atualizar quantidade do item 89550287500013661948
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '89550287500013661948';

-- PASSO 20: Inserir movimentação 7 (895502870013661823 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:10:00+00',
  NOW()
);

-- PASSO 21: Inserir item da movimentação 7
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:10:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '895502870013661823';

-- PASSO 22: Atualizar quantidade do item 895502870013661823
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '895502870013661823';

-- PASSO 23: Inserir movimentação 8 (895502870013661864 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:10:00+00',
  NOW()
);

-- PASSO 24: Inserir item da movimentação 8
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:10:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '895502870013661864';

-- PASSO 25: Atualizar quantidade do item 895502870013661864
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '895502870013661864';

-- VERIFICAÇÃO FINAL
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


-- PASSO 1: Criar responsável (se não existir)
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

-- PASSO 1.1: Criar vendedor (mesmo ID para manter consistência)
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

-- PASSO 2: Inserir movimentação 1 (00076 - VX680)
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

-- PASSO 3: Inserir item da movimentação 1
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 15:59:00+00' LIMIT 1),
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

-- PASSO 4: Atualizar quantidade do item 00076
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00076';

-- PASSO 5: Inserir movimentação 2 (00082 - VX680)
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

-- PASSO 6: Inserir item da movimentação 2
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
WHERE code = '00082';

-- PASSO 7: Atualizar quantidade do item 00082
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00082';

-- PASSO 8: Inserir movimentação 3 (00083 - VX680)
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

-- PASSO 9: Inserir item da movimentação 3
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
WHERE code = '00083';

-- PASSO 10: Atualizar quantidade do item 00083
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00083';

-- PASSO 11: Inserir movimentação 4 (00004 - Android Laranja)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:00:00+00',
  NOW()
);

-- PASSO 12: Inserir item da movimentação 4
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:00:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '00004';

-- PASSO 13: Atualizar quantidade do item 00004
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '00004';

-- PASSO 14: Inserir movimentação 5 (89550287500013661856 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:08:00+00',
  NOW()
);

-- PASSO 15: Inserir item da movimentação 5
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:08:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '89550287500013661856';

-- PASSO 16: Atualizar quantidade do item 89550287500013661856
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '89550287500013661856';

-- PASSO 17: Inserir movimentação 6 (89550287500013661948 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:09:00+00',
  NOW()
);

-- PASSO 18: Inserir item da movimentação 6
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:09:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '89550287500013661948';

-- PASSO 19: Atualizar quantidade do item 89550287500013661948
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '89550287500013661948';

-- PASSO 20: Inserir movimentação 7 (895502870013661823 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:10:00+00',
  NOW()
);

-- PASSO 21: Inserir item da movimentação 7
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:10:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '895502870013661823';

-- PASSO 22: Atualizar quantidade do item 895502870013661823
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '895502870013661823';

-- PASSO 23: Inserir movimentação 8 (895502870013661864 - Chip Tim)
INSERT INTO item_movements (id, type, responsible_name, seller_id, seller_name, date, created_at)
VALUES (
  gen_random_uuid(),
  'checkout',
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  '2025-05-09 16:10:00+00',
  NOW()
);

-- PASSO 24: Inserir item da movimentação 8
INSERT INTO movement_items (movement_id, item_id, item_name, item_code, quantity, responsible_name, seller_id, seller_name, created_at)
SELECT 
  (SELECT id FROM item_movements WHERE responsible_name = 'Adelina Floresta' AND date = '2025-05-09 16:10:00+00' ORDER BY created_at DESC LIMIT 1),
  id,
  name,
  code,
  1,
  'Adelina Floresta',
  '00000000-0000-0000-0000-000000000000',
  'Adelina Floresta',
  NOW()
FROM items 
WHERE code = '895502870013661864';

-- PASSO 25: Atualizar quantidade do item 895502870013661864
UPDATE items 
SET 
  available_quantity = available_quantity - 1,
  in_use_quantity = in_use_quantity + 1,
  updated_at = NOW()
WHERE code = '895502870013661864';

-- VERIFICAÇÃO FINAL
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
