-- Atualizar Chupinguaia com novo link (reportEmbed)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/reportEmbed?reportId=d732b246-7e7c-48dd-b88b-f3a1c785a6ca&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    embed_url = 'https://app.powerbi.com/reportEmbed?reportId=d732b246-7e7c-48dd-b88b-f3a1c785a6ca&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    titulo = 'Inteligência Territorial de Chupinguaia',
    data_atualizacao = NOW()
WHERE id = 97;

-- Verificar
SELECT 
    nome,
    SUBSTRING(embed_url, 1, 80) as url
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome = 'Chupinguaia';
