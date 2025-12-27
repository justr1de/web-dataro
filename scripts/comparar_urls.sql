-- Comparar URL de Alto Paraíso (funciona) com os novos painéis
SELECT 
    m.nome,
    p.embed_url,
    LENGTH(p.embed_url) as tamanho
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Alto Paraíso', 'Cujubim', 'Chupinguaia')
ORDER BY m.nome;
