# Regression Watch: Feature 006 - Melhorias no Painel Admin, Checkout com Autopreenchimento WhatsApp e Notificações

> Identificador: `006-melhorias-painel-checkout-whatsapp`
> Data: `2026-08-10`

## 1. Itens de Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `_reversa_sdd/domain.md#clientes` | Compradores devem ser gravados/atualizados automaticamente no banco via `upsert` a cada pedido | presença | Pedido concluído sem que o comprador apareça na tabela `customers` |
| W002 | `_reversa_sdd/architecture.md#frontend` | Badge de status do WhatsApp deve estar visível dentro do Card da Evolution API | presença | Ausência da tag de status no Card do WhatsApp no Admin |
| W003 | `_reversa_sdd/domain.md#checkout` | Digitar WhatsApp cadastrado no checkout deve autopreenchar Nome, CPF e Endereço Completo | presença | WhatsApp válido não preencher o formulário no checkout |
| W004 | `_reversa_sdd/domain.md#produtos` | Opções de diâmetro (25mm/38mm) e acabamento (alfinete/chaveiro/ímã) devem ser ocultadas para produtos que não sejam Bottons | ausência | Opções de botton exibidas em cadernos, agendas ou papéis |

## 2. Histórico de re-extrações

*(Será atualizado em futuras execuções de `/reversa`)*

## 3. Arquivadas

*(Nenhum item arquivado)*
