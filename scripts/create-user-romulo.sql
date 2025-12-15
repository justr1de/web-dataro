-- Script SQL para criar usuário Rômulo Azevedo
-- Execute este script no Supabase Dashboard (SQL Editor)
-- Ou use o execute_sql via MCP

-- Inserir usuário na tabela usuarios
INSERT INTO usuarios (nome, email, senha_hash, ativo, tipo, requer_troca_senha, created_at, updated_at)
VALUES (
  'Rômulo Azevedo',
  'romuloazevedo.ro@gmail.com',
  '123456', -- Senha padrão (em produção, use bcrypt para hash)
  true,
  'usuario', -- Tipo: usuário comum (pode visualizar painéis)
  true, -- Requer troca de senha no primeiro login
  NOW(),
  NOW()
);

-- Verificar se o usuário foi criado
SELECT id, nome, email, ativo, tipo, requer_troca_senha, created_at
FROM usuarios
WHERE email = 'romuloazevedo.ro@gmail.com';
