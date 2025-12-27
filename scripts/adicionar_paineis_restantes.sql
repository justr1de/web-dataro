-- ======================================================================
-- Script para adicionar painéis Power BI restantes
-- Municípios: Chupinguaia, Rio Crespo, Vilhena
-- Data: 2024-12-26
-- ======================================================================

-- 1. Verificar IDs dos municípios
SELECT id, nome FROM municipios 
WHERE nome IN ('Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY nome;

-- ======================================================================
-- 2. INSERIR PAINÉIS (execute após confirmar os IDs acima)
-- ======================================================================

-- Painel de Chupinguaia
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Inteligência Territorial de Chupinguaia',
    'Painel Power BI com indicadores e análises do município de Chupinguaia',
    'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'ativo'
FROM municipios
WHERE nome = 'Chupinguaia'
AND NOT EXISTS (
    SELECT 1 FROM paineis_bi 
    WHERE municipio_id = municipios.id
);

-- Painel de Rio Crespo
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Inteligência Territorial de Rio Crespo',
    'Painel Power BI com indicadores e análises do município de Rio Crespo',
    'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'ativo'
FROM municipios
WHERE nome = 'Rio Crespo'
AND NOT EXISTS (
    SELECT 1 FROM paineis_bi 
    WHERE municipio_id = municipios.id
);

-- Painel de Vilhena
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Inteligência Territorial de Vilhena',
    'Painel Power BI com indicadores e análises do município de Vilhena',
    'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'ativo'
FROM municipios
WHERE nome = 'Vilhena'
AND NOT EXISTS (
    SELECT 1 FROM paineis_bi 
    WHERE municipio_id = municipios.id
);

-- ======================================================================
-- 3. VERIFICAR INSERÇÕES
-- ======================================================================

SELECT 
    m.nome AS municipio,
    p.id AS painel_id,
    p.titulo,
    p.status,
    CASE 
        WHEN p.embed_url IS NOT NULL THEN '✅ URL configurada'
        ELSE '❌ URL faltando'
    END AS url_status,
    p.data_criacao
FROM municipios m
LEFT JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;

-- ======================================================================
-- Total de painéis cadastrados
-- ======================================================================
SELECT COUNT(*) as total_paineis_ativos FROM paineis_bi WHERE status = 'ativo';
