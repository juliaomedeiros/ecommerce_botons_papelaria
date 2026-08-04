# Regression Watch: Feature 002 (Admin, Estoque, PDF, Clientes e Modo 24h)

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`

## 1. Tabela de Verificação de Regressão (Watch List)

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `requirements.md#RN-11` | O estoque do produto deve sofrer baixa automática ao aprovar venda e bloquear botão se zerado. | presença | Produto com estoque 0 ser vendido ou não decrementar quantidade. |
| W002 | `requirements.md#RN-13` | Perfil `funcionario` pode alterar preços e estoque, mas tem acesso negado ao faturamento e chaves Mercado Pago. | presença | Usuário `funcionario` conseguir acessar `/api/admin/dashboard` ou alterar chaves do MP. |
| W003 | `requirements.md#RN-15` | O PDF timbrado oficial (*MATERIAL CONSIGNADO TATI.pdf*) é gerado e despachado no WhatsApp do checkout. | presença | Falha na geração do PDF ou envio para número diferente do formulário de checkout. |
| W004 | `requirements.md#RN-19` | Quando `modo_24h = true`, a personalização de botton é totalmente oculta e a frase do hero é atualizada. | presença | Card de personalização visível com Modo 24h ativado. |
| W005 | `requirements.md#RN-20` | O Modal de personalização calcula auto-fit e permite zoom flexível de 0.1x a 5.0x sem limites rígidos. | presença | Imagens de alta resolução (ex: 4000x3000px) não conseguirem ser reduzidas no enquadramento. |

## 2. Observações

- RF-18 (Gestão de Clientes): Cadastro de compradores no Admin suportando CPF como campo opcional.
- RF-14 (Mercado Pago Environment): Alternância entre ambiente Sandbox e Produção mantida em `store_config`.

## 3. Histórico de re-extrações

*(Aguardando futuras re-extrações do ciclo reverso)*

## 4. Arquivadas

*(Nenhuma regra arquivada)*
