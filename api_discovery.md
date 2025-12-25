# Descobertas sobre APIs de Transferências Federais

## 1. Portal da Transparência (api.portaldatransparencia.gov.br)

### Endpoints Funcionais:
- **Bolsa Família**: `/novo-bolsa-familia-por-municipio?codigoIbge={ibge}&mesAno={YYYYMM}&pagina=1`
  - Retorna: valor, quantidadeBeneficiados
  - Testado: Alta Floresta (202411) = R$ 1.127.900,00 / 1.655 beneficiários

- **BPC**: `/bpc-por-municipio?codigoIbge={ibge}&mesAno={YYYYMM}&pagina=1`
  - Retorna: valor, quantidadeBeneficiados, tipo (BPC)
  - Testado: Alta Floresta (202411) = R$ 917.890,75 / 556 beneficiários

- **Emendas Parlamentares**: `/emendas?ano={ano}&pagina={pagina}`
  - Retorna: nomeAutor, localidadeDoGasto, valorEmpenhado, tipoEmenda
  - Filtrar por localidadeDoGasto contendo "RONDÔNIA" ou " - RO"
  - Lento: precisa paginar todas as páginas

### Endpoints NÃO disponíveis diretamente:
- FNDE (Educação) - não há endpoint específico
- FNS (Saúde) - não há endpoint específico

## 2. TransfereGov API (api.transferegov.gestao.gov.br/fundoafundo)

### Endpoints Funcionais:
- **programa_beneficiario**: Lista beneficiários de programas fundo a fundo
  - Filtro: `?uf_beneficiario_programa=eq.RO`
  - Retorna: nome_beneficiario_programa, valor_beneficiario_programa, nome_parlamentar_beneficiario_programa

### Municípios de RO encontrados (com valores):
| Município | Valor Total |
|-----------|-------------|
| Porto Velho | R$ 30.293.743,92 |
| Ji-Paraná | R$ 6.392.439,35 |
| Vilhena | R$ 6.071.161,80 |
| Ariquemes | R$ 5.174.844,88 |
| Cacoal | R$ 4.499.561,06 |
| Rolim de Moura | R$ 2.993.531,34 |
| Jaru | R$ 2.725.987,82 |
| Guajará-Mirim | R$ 2.264.265,72 |
| Machadinho d'Oeste | R$ 2.162.804,88 |
| Buritis | R$ 2.061.842,50 |
| Alta Floresta d'Oeste | R$ 1.421.849,73 |

## 3. Estratégia de Implementação

### Para Bolsa Família e BPC:
- Usar API do Portal da Transparência
- Somar valores de todos os meses do ano
- Já está funcionando parcialmente

### Para FNDE e FNS:
- Não há API direta disponível
- Opções:
  1. Usar dados do TransfereGov (fundo a fundo)
  2. Scraping do portal do FNDE/FNS (não recomendado)
  3. Exibir como "Dados não disponíveis via API"

### Para Emendas Parlamentares:
- Usar API do Portal da Transparência
- Filtrar por localidade de Rondônia
- Extrair nome do parlamentar (nomeAutor)

## 4. Próximos Passos
1. Atualizar serviço para buscar Bolsa Família somando todos os meses
2. Atualizar serviço para buscar BPC somando todos os meses
3. Implementar busca de emendas com nome do parlamentar
4. Integrar dados do TransfereGov para complementar
