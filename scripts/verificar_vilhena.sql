-- Verificar se Vilhena existe e qual é seu status

-- Buscar município Vilhena
SELECT id, nome FROM municipios WHERE nome ILIKE '%vilhena%';

-- Buscar painel de Vilhena
SELECT 
  pb.id,
  pb.municipio_id,
  m.nome as municipio,
  pb.titulo,
  pb.url_powerbi,
  pb.embed_url,
  pb.status,
  pb.data_criacao,
  pb.data_atualizacao
FROM paineis_bi pb
JOIN municipios m ON pb.municipio_id = m.id
WHERE m.nome ILIKE '%vilhena%';
