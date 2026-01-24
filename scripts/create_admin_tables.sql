-- Script para criar tabelas do sistema de administração DATA-RO
-- Banco de dados: Supabase (csuzmlajnhfauxqgczmu)

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_super_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    primeiro_acesso BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de gabinetes
CREATE TABLE IF NOT EXISTS admin_gabinetes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    responsavel_id UUID REFERENCES admin_usuarios(id),
    municipio VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de demandas
CREATE TABLE IF NOT EXISTS admin_demandas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    gabinete_id UUID REFERENCES admin_gabinetes(id),
    criado_por UUID REFERENCES admin_usuarios(id),
    responsavel_id UUID REFERENCES admin_usuarios(id),
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, em_andamento, concluida, urgente
    urgencia VARCHAR(50) DEFAULT 'normal', -- baixa, normal, alta, urgente
    tipo VARCHAR(100),
    data_prazo DATE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS admin_contatos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50),
    cargo VARCHAR(255),
    gabinete_id UUID REFERENCES admin_gabinetes(id),
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de arquivos
CREATE TABLE IF NOT EXISTS admin_arquivos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nome_original VARCHAR(255),
    tipo VARCHAR(100),
    tamanho BIGINT,
    url TEXT,
    storage_path TEXT,
    gabinete_id UUID REFERENCES admin_gabinetes(id),
    demanda_id UUID REFERENCES admin_demandas(id),
    enviado_por UUID REFERENCES admin_usuarios(id),
    excluido BOOLEAN DEFAULT FALSE,
    excluido_em TIMESTAMP WITH TIME ZONE,
    excluido_por UUID REFERENCES admin_usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de credenciais de clientes
CREATE TABLE IF NOT EXISTS admin_credenciais_clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_nome VARCHAR(255) NOT NULL,
    servico VARCHAR(255) NOT NULL,
    usuario VARCHAR(255),
    senha_criptografada TEXT,
    url TEXT,
    observacoes TEXT,
    gabinete_id UUID REFERENCES admin_gabinetes(id),
    criado_por UUID REFERENCES admin_usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de auditoria admin
CREATE TABLE IF NOT EXISTS admin_log_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255),
    usuario_id UUID REFERENCES admin_usuarios(id),
    tipo_evento VARCHAR(100) NOT NULL,
    detalhes TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS admin_configuracoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chave VARCHAR(255) UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT,
    tipo VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    editavel BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES admin_usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS admin_notificacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES admin_usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT,
    tipo VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
    lida BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuário super admin padrão (contato@dataro-it.com.br)
INSERT INTO admin_usuarios (email, nome, senha_hash, role, is_super_admin, primeiro_acesso)
VALUES ('contato@dataro-it.com.br', 'DATA-RO Admin', '@D4taR0x1', 'super_admin', TRUE, FALSE)
ON CONFLICT (email) DO UPDATE SET
    is_super_admin = TRUE,
    role = 'super_admin',
    updated_at = NOW();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_admin_demandas_gabinete ON admin_demandas(gabinete_id);
CREATE INDEX IF NOT EXISTS idx_admin_demandas_status ON admin_demandas(status);
CREATE INDEX IF NOT EXISTS idx_admin_demandas_urgencia ON admin_demandas(urgencia);
CREATE INDEX IF NOT EXISTS idx_admin_arquivos_gabinete ON admin_arquivos(gabinete_id);
CREATE INDEX IF NOT EXISTS idx_admin_arquivos_demanda ON admin_arquivos(demanda_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_auditoria_email ON admin_log_auditoria(email);
CREATE INDEX IF NOT EXISTS idx_admin_log_auditoria_created ON admin_log_auditoria(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_notificacoes_usuario ON admin_notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_admin_notificacoes_lida ON admin_notificacoes(lida);

-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE admin_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_gabinetes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_arquivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credenciais_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_log_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir acesso via service_role)
CREATE POLICY "Allow all for service role" ON admin_usuarios FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_gabinetes FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_demandas FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_contatos FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_arquivos FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_credenciais_clientes FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_log_auditoria FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_configuracoes FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin_notificacoes FOR ALL USING (true);
