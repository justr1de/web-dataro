-- ============================================================================
-- ADICIONAR PAINEL DE CUJUBIM
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ============================================================================

-- Inserir o painel de Cujubim
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Inteligência Territorial de Cujubim',
    'Dados econômicos e sociais do município de Cujubim',
    'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'ativo'
FROM municipios
WHERE nome = 'Cujubim'
AND NOT EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id);

-- Verificar se foi inserido com sucesso
SELECT 
    m.id,
    m.nome as municipio,
    p.titulo,
    p.status,
    p.data_criacao,
    LEFT(p.url_powerbi, 70) as url_preview
FROM paineis_bi p
JOIN municipios m ON m.id = p.municipio_id
WHERE m.nome = 'Cujubim';
