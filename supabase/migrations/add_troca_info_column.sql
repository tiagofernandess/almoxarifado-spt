-- Adicionar coluna movimento_type na tabela item_movements
ALTER TABLE item_movements 
ADD COLUMN movimento_type TEXT CHECK (movimento_type IN ('ponto_novo', 'troca') OR movimento_type IS NULL);

-- Adicionar coluna ponto_novo_info na tabela item_movements
ALTER TABLE item_movements 
ADD COLUMN ponto_novo_info TEXT;

-- Adicionar coluna troca_info na tabela item_movements
ALTER TABLE item_movements 
ADD COLUMN troca_info TEXT;

-- Comentários para documentar as colunas
COMMENT ON COLUMN item_movements.movimento_type IS 'Tipo de movimentação: ponto_novo ou troca';
COMMENT ON COLUMN item_movements.ponto_novo_info IS 'Informações sobre o ponto novo quando o tipo de saída for ponto_novo';
COMMENT ON COLUMN item_movements.troca_info IS 'Informações sobre para quem foi a troca quando o tipo de saída for troca';

