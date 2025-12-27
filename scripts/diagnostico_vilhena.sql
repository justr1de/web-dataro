-- Diagnóstico completo de Vilhena

-- 1. Verificar município Vilhena
SELECT 
  id,
  nome
FROM municipios 
WHERE nome ILIKE '%vilhena%';

-- 2. Verificar painéis de Vilhena
SELECT 
  pb.id as painel_id,
  pb.municipio_id,
  m.nome as municipio,
  pb.titulo,
  pb.url_powerbi,
  pb.embed_url,
  pb.status,
  pb.data_criacao,
  pb.data_atualizacao
FROM paineis_bi pb
LEFT JOIN municipios m ON pb.municipio_id = m.id
WHERE m.nome ILIKE '%vilhena%';

-- 3. Verificar se existe painel sem município associado que possa ser de Vilhena
SELECT 
  pb.id as painel_id,
  pb.municipio_id,
  pb.titulo,
  pb.url_powerbi,
  pb.embed_url,
  pb.status
FROM paineis_bi pb
WHERE pb.titulo ILIKE '%vilhena%'
   OR pb.municipio_id = (SELECT id FROM municipios WHERE nome = 'Vilhena');

-- 4. Listar todos os painéis dos 4 municípios recém-adicionados
SELECT 
  pb.id,
  m.nome as municipio,
  pb.titulo,
  LEFT(pb.url_powerbi, 60) as url_inicio,
  LEFT(pb.embed_url, 60) as embed_inicio,
  pb.status
FROM paineis_bi pb
JOIN municipios m ON pb.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
