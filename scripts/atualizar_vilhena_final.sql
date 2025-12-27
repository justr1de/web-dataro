-- Atualizar Vilhena com a nova URL pública validada

UPDATE paineis_bi
SET 
  url_powerbi = 'https://app.powerbi.com/view?r=eyJrIjoiMTEzYmNiNTYtYTY3Zi00ZTI2LTliMGEtNzZkMjExYWNmN2Y0IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiMTEzYmNiNTYtYTY3Zi00ZTI2LTliMGEtNzZkMjExYWNmN2Y0IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ly1iM2NmLWJmZjA0YmI0YTFlNCJ9',
  data_atualizacao = NOW()
WHERE municipio_id = (
  SELECT id FROM municipios WHERE nome = 'Vilhena'
);

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
WHERE m.nome = 'Vilhena';
