-- Atualizar os 4 painéis com as URLs públicas validadas
-- Chupinguaia, Cujubim, Rio Crespo e Vilhena

-- Chupinguaia (ID: 97)
UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiYjA2ZjIwNGUtOWNlMC00M2QyLWI1NjEtNzA5ZDFhYjBlODkzIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiYjA2ZjIwNGUtOWNlMC00M2QyLWI1NjEtNzA5ZDFhYjBlODkzIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE id = 97;

-- Cujubim (ID: 98)
UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiNmU0NzZmNTctMjc3Mi00NzljLTlkNzItMzYyYjMyMWZhMWI4IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiNmU0NzZmNTctMjc3Mi00NzljLTlkNzItMzYyYjMyMWZhMWI4IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE id = 98;

-- Rio Crespo (ID: 99)
UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiM2VlMDM4ZTEtNGY2MC00MjhjLTkwOGEtMzFjMGJlNzRiZDI5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiM2VlMDM4ZTEtNGY2MC00MjhjLTkwOGEtMzFjMGJlNzRiZDI5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE id = 99;

-- Vilhena (buscar ID pelo município)
UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiNmEzMDBhYjUtNzNlYS00NGY5LTk5ZWYtMjExZmFjODk5ZjA5IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE municipio_id = (
  SELECT id FROM municipios WHERE nome = 'Vilhena'
);

-- Verificar as atualizações
SELECT 
  pb.id,
  m.nome as municipio,
  pb.titulo,
  LEFT(pb.url_powerbi, 50) as url_powerbi_inicio,
  LEFT(pb.embed_url, 50) as embed_url_inicio,
  pb.data_atualizacao
FROM paineis_bi pb
JOIN municipios m ON pb.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
