-- Verificar URLs atuais dos 4 painéis
SELECT 
    m.nome,
    p.id,
    p.embed_url
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Chupinguaia', 'Rio Crespo', 'Vilhena', 'Cujubim')
ORDER BY m.nome;
