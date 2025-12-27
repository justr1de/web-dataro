/*
 * Script SQL para adicionar painéis Power BI aos municípios pendentes
 * Municípios: Chupinguaia, Cujubim, Rio Crespo, Vilhena
 * 
 * INSTRUÇÕES:
 * 1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
 * 2. Vá em SQL Editor
 * 3. Primeiro, execute a CONSULTA abaixo para ver os IDs dos municípios
 * 4. Depois, preencha as URLs dos painéis nas instruções INSERT
 * 5. Execute os INSERTs para adicionar os painéis
 */

-- ==============================================================================
-- PASSO 1: CONSULTAR OS IDs DOS MUNICÍPIOS
-- ==============================================================================

SELECT 
    id,
    nome,
    prefeito,
    CASE 
        WHEN EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id)
        THEN '⚠️ JÁ TEM PAINEL'
        ELSE '✅ PRONTO'
    END as status_painel
FROM municipios
WHERE nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY nome;

-- ==============================================================================
-- PASSO 2: VERIFICAR PAINÉIS EXISTENTES (SE HOUVER)
-- ==============================================================================

SELECT 
    p.id as painel_id,
    m.nome as municipio,
    p.titulo,
    p.status,
    LEFT(p.url_powerbi, 50) as url_preview
FROM paineis_bi p
JOIN municipios m ON m.id = p.municipio_id
WHERE m.nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena');

-- ==============================================================================
-- PASSO 3: ADICIONAR OS PAINÉIS (PREENCHA AS URLs ANTES DE EXECUTAR)
-- ==============================================================================

-- IMPORTANTE: Substitua 'CODIGO_DO_PAINEL_AQUI' pelo código real fornecido pelo Bruno
-- O código é a parte após "?r=" na URL do Power BI
-- Exemplo: https://app.powerbi.com/view?r=eyJrIjoiNzY5NWUxNWEt...

-- 3.1 CHUPINGUAIA
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Chupinguaia',
    'Dados econômicos e sociais do município de Chupinguaia',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'ativo'
FROM municipios
WHERE nome = 'Chupinguaia'
AND NOT EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id);

-- 3.2 CUJUBIM ✅
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Inteligência Territorial de Cujubim',
    'Dados econômicos e sociais do município de Cujubim',
    'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'https://app.powerbi.com/view?r=eyJrIjoiODMxMDliOTMtNjgwZi00MDQ3LWE0NTctM2QyNjNiOGI1ZTBlIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=a39dc3705064708de137',
    'ativo'
FROM municipios
WHERE nome = 'Cujubim'
AND NOT EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id);

-- 3.3 RIO CRESPO
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Rio Crespo',
    'Dados econômicos e sociais do município de Rio Crespo',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'ativo'
FROM municipios
WHERE nome = 'Rio Crespo'
AND NOT EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id);

-- 3.4 VILHENA
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Vilhena',
    'Dados econômicos e sociais do município de Vilhena',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',  -- ⚠️ SUBSTITUIR
    'ativo'
FROM municipios
WHERE nome = 'Vilhena'
AND NOT EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id);

-- ==============================================================================
-- PASSO 4: VERIFICAR OS PAINÉIS ADICIONADOS
-- ==============================================================================

SELECT 
    m.nome as municipio,
    p.titulo,
    p.status,
    p.data_criacao,
    LEFT(p.url_powerbi, 60) as url_powerbi
FROM paineis_bi p
JOIN municipios m ON m.id = p.municipio_id
WHERE m.nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;

-- ==============================================================================
-- DICAS E EXEMPLOS
-- ==============================================================================

/*
EXEMPLO DE URL COMPLETA:
https://app.powerbi.com/view?r=eyJrIjoiNzY5NWUxNWEtNmFkMy00MzQzLTliODgtZmE3Y2I2NzVhYjEwIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9

FORMATO PARA PREENCHER:
url_powerbi: 'https://app.powerbi.com/view?r=CODIGO_AQUI'
embed_url:   'https://app.powerbi.com/view?r=CODIGO_AQUI'

OBSERVAÇÕES:
- O sistema permite apenas 1 painel por município (constraint UNIQUE)
- Se já existir um painel, o INSERT não será executado (NOT EXISTS)
- Os painéis são exibidos em iframe no MunicipioPainel.jsx
- URLs devem ser públicas (não requerem autenticação)
*/
