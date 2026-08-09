# Requisitos: Matriz de Variações de Bottons (Tamanho x Acabamento) & Separação de Categorias

> Identificador: `005-matriz-variacoes-bottons`
> Data: `2026-08-09`

## Resumo Executivo
Implementação da matriz de gestão de variações para a categoria `Bottons` (Pronta Entrega com estampas do catálogo) e diferenciação estrita da categoria `Bottons Personalizados` (Canvas 300DPI).

## Requisitos Funcionais (RF)

### RF001 — Nomenclatura e Separação de Categorias
- **Categoria "Bottons"**: Categoria pública para os bottons de catálogo com estampas pré-definidas enviadas pelo Admin.
- **Categoria "Bottons Personalizados"**: Categoria dedicada ao produto de criação com foto própria do comprador via Canvas.

### RF002 — Matriz de Estoque e Preços (25mm/38mm x Alfinete/Chaveiro/Ímã)
- O Admin pode configurar preço e estoque individual para até 6 variações por produto da categoria `Bottons`:
  1. `25mm x Alfinete`
  2. `25mm x Chaveiro`
  3. `25mm x Ímã`
  4. `38mm x Alfinete`
  5. `38mm x Chaveiro`
  6. `38mm x Ímã`

### RF003 — Comportamento de Compra Dinâmico
- No modal de detalhes (`ProductDetailModal.jsx`), ao selecionar o Diâmetro e o Acabamento:
  - O sistema busca a variação específica em `product.variations`.
  - Atualiza o preço, a prévia do verso no `BottonMockupDisplay` e checa o estoque individual.
  - Se a combinação escolhida estiver com estoque `0` ou sem cadastro, marca como `(Esgotado)` e bloqueia a adição ao carrinho.

### RF004 — Baixa de Estoque por Variação no Pagamento Aprovado
- Ao confirmar o pagamento (`payment_status = 'approved'`), o sistema reduz o `stock_quantity` da variação específica (`product_variations`).
