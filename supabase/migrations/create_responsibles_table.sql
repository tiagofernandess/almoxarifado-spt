-- Criar tabela responsibles
CREATE TABLE IF NOT EXISTS responsibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_responsibles_name ON responsibles(name);
CREATE INDEX IF NOT EXISTS idx_responsibles_created_at ON responsibles(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE responsibles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso a todos os usuários autenticados
CREATE POLICY "Allow all operations for authenticated users" ON responsibles
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_responsibles_updated_at 
  BEFORE UPDATE ON responsibles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Migrar dados existentes da tabela sellers para responsibles (se houver)
INSERT INTO responsibles (name, whatsapp, address, created_at)
SELECT name, whatsapp, address, created_at
FROM sellers
WHERE NOT EXISTS (
  SELECT 1 FROM responsibles WHERE responsibles.name = sellers.name
);

-- Comentários para documentação
COMMENT ON TABLE responsibles IS 'Tabela para armazenar informações dos responsáveis';
COMMENT ON COLUMN responsibles.name IS 'Nome completo do responsável';
COMMENT ON COLUMN responsibles.whatsapp IS 'Número do WhatsApp do responsável';
COMMENT ON COLUMN responsibles.address IS 'Endereço completo do responsável';
COMMENT ON COLUMN responsibles.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN responsibles.updated_at IS 'Data da última atualização do registro';

CREATE TABLE IF NOT EXISTS responsibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_responsibles_name ON responsibles(name);
CREATE INDEX IF NOT EXISTS idx_responsibles_created_at ON responsibles(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE responsibles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso a todos os usuários autenticados
CREATE POLICY "Allow all operations for authenticated users" ON responsibles
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_responsibles_updated_at 
  BEFORE UPDATE ON responsibles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Migrar dados existentes da tabela sellers para responsibles (se houver)
INSERT INTO responsibles (name, whatsapp, address, created_at)
SELECT name, whatsapp, address, created_at
FROM sellers
WHERE NOT EXISTS (
  SELECT 1 FROM responsibles WHERE responsibles.name = sellers.name
);

-- Comentários para documentação
COMMENT ON TABLE responsibles IS 'Tabela para armazenar informações dos responsáveis';
COMMENT ON COLUMN responsibles.name IS 'Nome completo do responsável';
COMMENT ON COLUMN responsibles.whatsapp IS 'Número do WhatsApp do responsável';
COMMENT ON COLUMN responsibles.address IS 'Endereço completo do responsável';
COMMENT ON COLUMN responsibles.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN responsibles.updated_at IS 'Data da última atualização do registro';
