-- Criar tipo enum para categorias de itens
CREATE TYPE item_category AS ENUM (
  'Máquinas VX',
  'Máquinas Digital',
  'Notebook/PC',
  'Suprimentos',
  'Material de Escritório',
  'Bancadas',
  'Chips'
);

-- Criar tabela de usuários extendendo a tabela auth.users do Supabase
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de itens
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category item_category NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  in_use_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de vendedores
CREATE TABLE sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de movimentações
CREATE TABLE item_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('checkout', 'return')),
  responsible_name TEXT NOT NULL,
  seller_id UUID REFERENCES sellers(id),
  seller_name TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de itens das movimentações
CREATE TABLE movement_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  movement_id UUID REFERENCES item_movements(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id),
  item_name TEXT NOT NULL,
  item_code TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar políticas de segurança (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_items ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler todos os itens"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem modificar itens"
  ON items FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os vendedores"
  ON sellers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem modificar vendedores"
  ON sellers FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as movimentações"
  ON item_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem modificar movimentações"
  ON item_movements FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os itens de movimentações"
  ON movement_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem modificar itens de movimentações"
  ON movement_items FOR ALL
  TO authenticated
  USING (true); 