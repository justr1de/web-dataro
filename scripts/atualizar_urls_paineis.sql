-- ======================================================================
-- ATUALIZAR URLS DOS PAINÉIS (Chupinguaia, Rio Crespo, Vilhena)
-- ======================================================================

-- Chupinguaia (ID: 97)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Chupinguaia',
    descricao = 'Painel Power BI com indicadores e análises do município de Chupinguaia'
WHERE id = 97;

-- Rio Crespo (ID: 99)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Rio Crespo',
    descricao = 'Painel Power BI com indicadores e análises do município de Rio Crespo'
WHERE id = 99;

-- Vilhena - Primeiro encontrar o ID
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    titulo = 'Inteligência Territorial de Vilhena',
    descricao = 'Painel Power BI com indicadores e análises do município de Vilhena'
WHERE municipio_id = (SELECT id FROM municipios WHERE nome = 'Vilhena');

-- ======================================================================
-- VERIFICAR ATUALIZAÇÃO
-- ======================================================================
SELECT 
    m.nome AS municipio,
    p.id AS painel_id,
    p.titulo,
    CASE 
        WHEN p.embed_url IS NOT NULL THEN '✅ URL OK'
        ELSE '❌ SEM URL'
    END as url_status,
    SUBSTRING(p.embed_url, 1, 50) as url_preview
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
