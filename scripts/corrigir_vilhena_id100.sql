-- Atualizar Vilhena usando o ID correto do painel (100)

UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiMmZlNWRlYTktOTYwYS00NWZiLWFkZWEtNzk4Mjk4MDI3YjE4IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiMmZlNWRlYTktOTYwYS00NWZiLWFkZWEtNzk4Mjk4MDI3YjE4IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE id = 100;

-- Verificar a atualização
SELECT 
  pb.id,
  m.nome as municipio,
  pb.titulo,
  pb.url_powerbi,
  pb.embed_url,
  pb.data_atualizacao
FROM paineis_bi pb
JOIN municipios m ON pb.municipio_id = m.id
WHERE pb.id = 100;
