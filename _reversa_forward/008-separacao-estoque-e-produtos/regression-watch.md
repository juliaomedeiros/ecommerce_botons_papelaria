# Regression Watch: Separação do Cadastro de Estoque e Exibição de Produtos no Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`

## 1. Itens de Vigilância para Futuras Re-extrações

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | O saldo de matéria-prima deve ser gerido centralizadamente em `raw_materials_stock` | presença | Cadastro de produto exigindo saldo individual de estoque. |
| W002 | `_reversa_sdd/sdd/checkout-payment-mp.md` | A baixa de estoque de insumos deve ocorrer no fechamento/aprovação do pedido | presença | Baixa prematura ou duplicada de estoque. |

## 2. Histórico de Re-extrações

*Nenhuma re-extração registrada ainda.*

## 3. Arquivadas

*Nenhum item arquivado.*

## 4. Observações

- **RF-01 a RF-04:** Requisitos da feature 008 entregues e prontos para verificação na próxima rodada de extração reversa.
