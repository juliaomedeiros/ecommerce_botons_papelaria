# Matriz de Vigilância contra Regressão (Regression Watch)

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. Itens de VigilânciaAtiva (Watch Items)

| ID | Origem | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|--------|-----------------------------|---------------------|-------------------|
| W001 | `AdminDashboard.jsx` | Cadastro de bottons aceita 1 acabamento único e checkboxes dos diâmetros | `presença` | Produto criado sem acabamento ou sem variações de diâmetro |
| W002 | `Catalog.jsx` | Filtro por acabamento funciona e cards exibem imagem da estampa própria | `presença` | Produtos de acabamento diferente aparecendo no filtro isolado |
| W003 | `customerController.js` | Lista de clientes compradores retorna todos os registros do PostgreSQL | `presença` | Tabela de clientes na aba Admin vazia ou com erro 500 |
| W004 | `orderController.js` | Lista de Pedidos (Fila Noturna) é ordenada por `created_at ASC` (FIFO) | `ordenação` | Pedidos recentes aparecendo no topo antes dos mais antigos |
| W005 | `ProductDetailModal.jsx` | Tamanho com estoque zero fica desabilitado dinamicamente | `comportamento` | Botão de tamanho esgotado permitido para seleção e compra |

---

## 2. Histórico de Re-extrações

*(Aguardando próxima execução do `/reversa` sobre o código evoluído)*
