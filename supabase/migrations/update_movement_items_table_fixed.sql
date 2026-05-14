-- Atualizar tabela movement_items para incluir informações do responsável e vendedor
-- Versão corrigida com sintaxe PostgreSQL válida

-- Primeiro, vamos adicionar as novas colunas
ALTER TABLE movement_items 
ADD COLUMN IF NOT EXISTS responsible_name TEXT,
ADD COLUMN IF NOT EXISTS seller_id UUID,
ADD COLUMN IF NOT EXISTS seller_name TEXT;

-- Adicionar foreign key para seller_id (verificando se já existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'movement_items_seller_id_fkey'
        AND table_name = 'movement_items'
    ) THEN
        ALTER TABLE movement_items 
        ADD CONSTRAINT movement_items_seller_id_fkey 
        FOREIGN KEY (seller_id) REFERENCES sellers(id);
    END IF;
END $$;

-- Criar índices para melhor performance (se não existirem)
CREATE INDEX IF NOT EXISTS idx_movement_items_responsible_name ON movement_items(responsible_name);
CREATE INDEX IF NOT EXISTS idx_movement_items_seller_id ON movement_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_movement_items_seller_name ON movement_items(seller_name);

-- Atualizar registros existentes com informações da tabela item_movements
UPDATE movement_items 
SET 
  responsible_name = im.responsible_name,
  seller_id = im.seller_id,
  seller_name = im.seller_name
FROM item_movements im
WHERE movement_items.movement_id = im.id
AND (movement_items.responsible_name IS NULL OR movement_items.seller_id IS NULL OR movement_items.seller_name IS NULL);

-- Comentários para documentação
COMMENT ON COLUMN movement_items.responsible_name IS 'Nome do responsável pela movimentação';
COMMENT ON COLUMN movement_items.seller_id IS 'ID do vendedor (referência à tabela sellers)';
COMMENT ON COLUMN movement_items.seller_name IS 'Nome do vendedor';

-- Criar uma view para facilitar consultas com informações completas
DROP VIEW IF EXISTS movement_items_complete;
CREATE VIEW movement_items_complete AS
SELECT 
  mi.id,
  mi.movement_id,
  mi.item_id,
  mi.item_name,
  mi.item_code,
  mi.quantity,
  mi.responsible_name,
  mi.seller_id,
  mi.seller_name,
  mi.created_at,
  im.type as movement_type,
  im.date as movement_date
FROM movement_items mi
LEFT JOIN item_movements im ON mi.movement_id = im.id;

-- Comentário na view
COMMENT ON VIEW movement_items_complete IS 'View que combina informações de movement_items com item_movements para consultas completas';

-- Verificar se a migração foi aplicada corretamente
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as total_movement_items,
  COUNT(CASE WHEN responsible_name IS NOT NULL THEN 1 END) as items_with_responsible,
  COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as items_with_seller
FROM movement_items;

-- Versão corrigida com sintaxe PostgreSQL válida

-- Primeiro, vamos adicionar as novas colunas
ALTER TABLE movement_items 
ADD COLUMN IF NOT EXISTS responsible_name TEXT,
ADD COLUMN IF NOT EXISTS seller_id UUID,
ADD COLUMN IF NOT EXISTS seller_name TEXT;

-- Adicionar foreign key para seller_id (verificando se já existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'movement_items_seller_id_fkey'
        AND table_name = 'movement_items'
    ) THEN
        ALTER TABLE movement_items 
        ADD CONSTRAINT movement_items_seller_id_fkey 
        FOREIGN KEY (seller_id) REFERENCES sellers(id);
    END IF;
END $$;

-- Criar índices para melhor performance (se não existirem)
CREATE INDEX IF NOT EXISTS idx_movement_items_responsible_name ON movement_items(responsible_name);
CREATE INDEX IF NOT EXISTS idx_movement_items_seller_id ON movement_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_movement_items_seller_name ON movement_items(seller_name);

-- Atualizar registros existentes com informações da tabela item_movements
UPDATE movement_items 
SET 
  responsible_name = im.responsible_name,
  seller_id = im.seller_id,
  seller_name = im.seller_name
FROM item_movements im
WHERE movement_items.movement_id = im.id
AND (movement_items.responsible_name IS NULL OR movement_items.seller_id IS NULL OR movement_items.seller_name IS NULL);

-- Comentários para documentação
COMMENT ON COLUMN movement_items.responsible_name IS 'Nome do responsável pela movimentação';
COMMENT ON COLUMN movement_items.seller_id IS 'ID do vendedor (referência à tabela sellers)';
COMMENT ON COLUMN movement_items.seller_name IS 'Nome do vendedor';

-- Criar uma view para facilitar consultas com informações completas
DROP VIEW IF EXISTS movement_items_complete;
CREATE VIEW movement_items_complete AS
SELECT 
  mi.id,
  mi.movement_id,
  mi.item_id,
  mi.item_name,
  mi.item_code,
  mi.quantity,
  mi.responsible_name,
  mi.seller_id,
  mi.seller_name,
  mi.created_at,
  im.type as movement_type,
  im.date as movement_date
FROM movement_items mi
LEFT JOIN item_movements im ON mi.movement_id = im.id;

-- Comentário na view
COMMENT ON VIEW movement_items_complete IS 'View que combina informações de movement_items com item_movements para consultas completas';

-- Verificar se a migração foi aplicada corretamente
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as total_movement_items,
  COUNT(CASE WHEN responsible_name IS NOT NULL THEN 1 END) as items_with_responsible,
  COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as items_with_seller
FROM movement_items;
