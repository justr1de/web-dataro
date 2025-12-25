# Debug - Dados de Demonstração

O modal ainda está mostrando "Dados de Demonstração" em vez de "Dados Reais".

## Valores exibidos (2024):
- Bolsa Família: R$ 1.065.523 (1.598 beneficiários)
- BPC: R$ 665.952 (334 beneficiários)
- FNDE: R$ 532.761
- FNS: R$ 399.571
- Convênios: R$ 1.331.904 (10 convênios)
- Emendas: R$ 799.142 (8 emendas)
- **Total: R$ 4.794.853**

## Problema identificado:
O código está caindo no fallback de dados mockados porque a API está demorando ou falhando.

## Valores esperados (testados manualmente):
- Bolsa Família 2024: ~R$ 12.4 milhões (soma de todos os meses)
- BPC 2024: ~R$ 9.6 milhões (soma de todos os meses)

## Ação necessária:
Verificar se o deploy foi feito corretamente e se as novas alterações estão ativas.
