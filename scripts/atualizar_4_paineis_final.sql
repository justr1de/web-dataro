-- ======================================================================
-- ATUALIZAR TODOS OS 4 PAINÉIS COM AS URLS CORRETAS (reportEmbed)
-- ======================================================================

-- Chupinguaia (ID: 97)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/reportEmbed?reportId=d732b246-7e7c-48dd-b88b-f3a1c785a6ca&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    embed_url = 'https://app.powerbi.com/reportEmbed?reportId=d732b246-7e7c-48dd-b88b-f3a1c785a6ca&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    titulo = 'Inteligência Territorial de Chupinguaia',
    data_atualizacao = NOW()
WHERE id = 97;

-- Rio Crespo (ID: 99)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/reportEmbed?reportId=e0755036-1e4e-41ce-9186-26005c356978&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    embed_url = 'https://app.powerbi.com/reportEmbed?reportId=e0755036-1e4e-41ce-9186-26005c356978&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    titulo = 'Inteligência Territorial de Rio Crespo',
    data_atualizacao = NOW()
WHERE id = 99;

-- Cujubim (ID: 98)
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/reportEmbed?reportId=0b42aa02-ea49-4831-b0ce-1244c77a7bf2&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    embed_url = 'https://app.powerbi.com/reportEmbed?reportId=0b42aa02-ea49-4831-b0ce-1244c77a7bf2&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    titulo = 'Inteligência Territorial de Cujubim',
    data_atualizacao = NOW()
WHERE id = 98;

-- Vilhena
UPDATE paineis_bi
SET 
    url_powerbi = 'https://app.powerbi.com/reportEmbed?reportId=575d56ac-ddbc-4bb0-86de-8e7b718dc47a&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    embed_url = 'https://app.powerbi.com/reportEmbed?reportId=575d56ac-ddbc-4bb0-86de-8e7b718dc47a&autoAuth=true&ctid=9bd4775d-999f-4c87-b3cf-bff04bb4a1e4&actionBarEnabled=true&reportCopilotInEmbed=true',
    titulo = 'Inteligência Territorial de Vilhena',
    data_atualizacao = NOW()
WHERE municipio_id = (SELECT id FROM municipios WHERE nome = 'Vilhena');

-- ======================================================================
-- VERIFICAR TODAS AS ATUALIZAÇÕES
-- ======================================================================
SELECT 
    m.nome AS municipio,
    p.id AS painel_id,
    p.titulo,
    CASE 
        WHEN p.embed_url LIKE '%reportEmbed%' THEN '✅ URL reportEmbed OK'
        ELSE '❌ URL antiga'
    END as status,
    SUBSTRING(p.embed_url, 1, 70) as url_preview
FROM municipios m
JOIN paineis_bi p ON p.municipio_id = m.id
WHERE m.nome IN ('Cujubim', 'Chupinguaia', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
