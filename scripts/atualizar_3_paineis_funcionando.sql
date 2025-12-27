-- ======================================================================
-- ATUALIZAR OS 3 PAINÉIS QUE FUNCIONAM (Vilhena, Rio Crespo, Chupinguaia)
-- ======================================================================

-- Vilhena
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    titulo = 'Inteligência Territorial de Vilhena',
    data_atualizacao = NOW()
WHERE municipio_id = (SELECT id FROM municipios WHERE nome = 'Vilhena');

-- Rio Crespo (ID: 99)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiM2RkZWM4OGEtMzM3OC00NzIyLWEyNWUtMWZkNDY0ZDBhMWIxIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    titulo = 'Inteligência Territorial de Rio Crespo',
    data_atualizacao = NOW()
WHERE id = 99;

-- Chupinguaia (ID: 97)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiOTk2ZWI2YzAtZmE5Mi00MjhjLTk5YmYtNTczZGEzYmYwYTQ1IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    titulo = 'Inteligência Territorial de Chupinguaia',
    data_atualizacao = NOW()
WHERE id = 97;

-- ======================================================================
-- VERIFICAR ATUALIZAÇÕES
-- ======================================================================
SELECT 
    m.nome AS municipio,
    p.id AS painel_id,
    p.titulo,
    '✅ Atualizado' as status
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
