# Matriz de Vigilância de Regressão (Regression Watch)

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`
> Contexto: Greenfield (`prd.md` + specs SDD)

## Observações de Requisitos Implementados

Os requisitos funcionais abaixo foram implementados com sucesso e passarão a ser vigiados contra regressões após futuras execuções do `/reversa`:

| ID | Requisito / Regra | Origem | Comportamento Esperado |
|----|-------------------|--------|------------------------|
| W001 | Flag Admin Modo Evento 24h | `requirements.md#RN-04` | O Admin deve manter o switch de atração do Modo Evento funcionando via `/api/admin/config`. |
| W002 | Hero & Banners Dinâmicos | `requirements.md#RN-05` | Ao ativar a flag 24h, o e-commerce exibe o banner chamativo e troca os prazos de 5 dias para 24h. |
| W003 | Guia de Tamanhos Interceptador | `requirements.md#RN-06` | O personalizador exige a confirmação no Guia de Tamanhos antes de abrir a tela de personalização. |
| W004 | Canvas Zoom Ampliado | `requirements.md#RN-07` | O canvas permite zoom deslizante amplo (`0.2x` a `3.0x`) e exportação da imagem redonda recortada. |
| W005 | Tabela de Pedidos no Admin | `requirements.md#RN-08` | O Admin exibe Nome, Telefone, Imagem Recortada Redonda, Imagem Original e Prazo em cada pedido. |
| W006 | Mecanismo Anti-Ban WhatsApp | `requirements.md#RN-09` | Fila FIFO em memória com delay humanizado (5-15s) e simulação de presença 'composing' ativada. |

## Histórico de re-extrações

*(Vazio - será preenchido quando `/reversa` for executado no futuro)*

## Arquivadas

*(Vazio)*
