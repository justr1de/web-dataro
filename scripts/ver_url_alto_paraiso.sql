-- Ver URL do painel que FUNCIONA (Alto Paraíso)
SELECT 
    m.nome,
    p.embed_url
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome = 'Alto Paraíso';
