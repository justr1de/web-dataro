-- Script para criar tabelas de auditoria e sessões
-- Execute este script no SQL Editor do Supabase

-- Tabela de sessões ativas
CREATE TABLE IF NOT EXISTS admin_sessoes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_usuarios(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    ativa BOOLEAN DEFAULT true,
    encerrada_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_sessoes_user_id ON admin_sessoes(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessoes_session_id ON admin_sessoes(session_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessoes_ativa ON admin_sessoes(ativa);

-- Adicionar coluna github na tabela de usuários (se não existir)
ALTER TABLE admin_usuarios ADD COLUMN IF NOT EXISTS github VARCHAR(100);

-- Verificar se a tabela admin_log_auditoria existe, se não criar
CREATE TABLE IF NOT EXISTS admin_log_auditoria (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    user_agent TEXT,
    detalhes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para a tabela de logs
CREATE INDEX IF NOT EXISTS idx_admin_log_auditoria_email ON admin_log_auditoria(email);
CREATE INDEX IF NOT EXISTS idx_admin_log_auditoria_tipo_evento ON admin_log_auditoria(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_admin_log_auditoria_created_at ON admin_log_auditoria(created_at);

-- Habilitar RLS (Row Level Security) para as tabelas
ALTER TABLE admin_sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_log_auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para admin_sessoes
CREATE POLICY "Permitir leitura de sessões para usuários autenticados" ON admin_sessoes
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de sessões para usuários autenticados" ON admin_sessoes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de sessões para usuários autenticados" ON admin_sessoes
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de sessões para usuários autenticados" ON admin_sessoes
    FOR DELETE USING (true);

-- Políticas de acesso para admin_log_auditoria
CREATE POLICY "Permitir leitura de logs para usuários autenticados" ON admin_log_auditoria
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de logs para usuários autenticados" ON admin_log_auditoria
    FOR INSERT WITH CHECK (true);

-- Comentários nas tabelas
COMMENT ON TABLE admin_sessoes IS 'Tabela para controle de sessões ativas dos usuários admin';
COMMENT ON TABLE admin_log_auditoria IS 'Tabela para registro de logs de auditoria do sistema admin';
