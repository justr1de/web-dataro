# Endpoints da API do Portal da Transparência

## URL Base
https://api.portaldatransparencia.gov.br/api-de-dados

## Endpoints Identificados

### 1. Emendas Parlamentares
**Endpoint:** `/emendas`
**Parâmetros:**
- `codigoEmenda` (string) - Código da Emenda
- `numeroEmenda` (string) - Número da emenda
- `nomeAutor` (string) - Nome do Autor (PARLAMENTAR)
- `tipoEmenda` (string) - Tipo de emenda
- `ano` (integer) - Ano
- `codigoFuncao` (string) - Código da função
- `codigoSubfuncao` (string) - Código da subfunção
- `pagina` (integer, required) - Página consultada (default: 1)

### 2. Bolsa Família (Novo)
**Endpoint:** `/novo-bolsa-familia-por-municipio`
**Parâmetros:**
- `codigoIbge` - Código IBGE do município
- `mesAno` - Mês/Ano no formato YYYYMM (ex: 202412)
- `pagina` - Página

### 3. BPC (Benefício de Prestação Continuada)
**Endpoint:** `/bpc-por-municipio`
**Parâmetros:**
- `codigoIbge` - Código IBGE do município
- `mesAno` - Mês/Ano no formato YYYYMM
- `pagina` - Página

### 4. Convênios
**Endpoint:** `/convenios`
**Parâmetros:**
- `codigoIBGE` - Código IBGE do município
- `pagina` - Página
- `quantidade` - Quantidade por página

### 5. Despesas - Recursos Recebidos
**Endpoint:** `/despesas/recursos-recebidos`
- Recebimento de recursos por favorecido (pode incluir FNDE, FNS)

### 6. Despesas - Tipo Transferência
**Endpoint:** `/despesas/tipo-transferencia`
- Consulta os tipos de transferências usados nas despesas

## Observações Importantes

1. **Emendas Parlamentares**: O endpoint permite filtrar por `nomeAutor` para obter o nome do parlamentar
2. **FNDE e FNS**: Não há endpoints específicos na API do Portal da Transparência. Os dados podem estar em:
   - Endpoint de despesas/recursos-recebidos
   - Ou precisam ser obtidos de outras fontes (FNDE.gov.br, FNS.saude.gov.br)

## Próximos Passos
1. Testar endpoint de emendas com filtro por UF=RO e município
2. Verificar se recursos-recebidos contém dados de FNDE/FNS
3. Buscar APIs alternativas para FNDE e FNS se necessário
