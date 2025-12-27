-- ======================================================================
-- ATUALIZAR TODOS OS 4 PAINÉIS COM AS URLS CORRETAS
-- ======================================================================

-- Cujubim (ID: 98)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Cujubim',
    descricao = 'Painel Power BI com indicadores e análises do município de Cujubim',
    data_atualizacao = NOW()
WHERE id = 98;

-- Chupinguaia (ID: 97)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Chupinguaia',
    descricao = 'Painel Power BI com indicadores e análises do município de Chupinguaia',
    data_atualizacao = NOW()
WHERE id = 97;

-- Rio Crespo (ID: 99)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Rio Crespo',
    descricao = 'Painel Power BI com indicadores e análises do município de Rio Crespo',
    data_atualizacao = NOW()
WHERE id = 99;

-- Vilhena
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Vilhena',
    descricao = 'Painel Power BI com indicadores e análises do município de Vilhena',
    data_atualizacao = NOW()
WHERE municipio_id = (SELECT id FROM municipios WHERE nome = 'Vilhena');

-- ======================================================================
-- VERIFICAR TODAS AS ATUALIZAÇÕES
-- ======================================================================
SELECT 
    m.nome AS municipio,
    p.id AS painel_id,
    p.titulo,
    LENGTH(p.embed_url) as tamanho_url,
    CASE 
        WHEN p.embed_url IS NOT NULL AND LENGTH(p.embed_url) > 50 THEN '✅ URL OK'
        ELSE '❌ SEM URL'
    END as status,
    SUBSTRING(p.embed_url, 1, 60) as url_preview
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Cujubim', 'Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
