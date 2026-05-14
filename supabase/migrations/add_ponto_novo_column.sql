-- Adicionar coluna ponto_novo na tabela item_movements
ALTER TABLE item_movements 
ADD COLUMN ponto_novo BOOLEAN DEFAULT FALSE;

-- Comentário para documentar a coluna
COMMENT ON COLUMN item_movements.ponto_novo IS 'Indica se a saída é para um ponto novo de venda';
