# Requirements: Estoque por Categoria, Seletores de Acabamento e CMV no Dashboard

> Identificador: `010-estoque-categorias-cmv-dashboard`
> Data: `2026-08-20`

## 1. Resumo Executivo

Esta feature estende a inteligência de gestão de estoque e financeira do Tuta's Paper:
1. **Estoque de Produtos Prontos (Papelaria, Terços, Pulseiras):** Produtos de categorias que não são bottons passam a ter gestão de estoque por quantidade física própria, integrada ao Livro Razão.
2. **Ativação de Acabamentos no Admin:** Chaveiro e Ímã com chaves de ativação rápida no Admin.
3. **Cálculo de CMV e Lucro Líquido Real no Dashboard:** O Dashboard passa a exibir o Custo da Mercadoria Vendida (CMV) e o Lucro Líquido Real deduzido do custo dos insumos e perdas de prensagem.

## 2. Regras de Negócio
- **RN-01:** Produtos de categorias que não sejam "Bottons" utilizam o campo de estoque próprio do produto (`stock`).
- **RN-02:** Vendas de produtos acabados abatem seu estoque individual e registram `SAIDA_VENDA` no Livro Razão.
- **RN-03:** O Dashboard exibe os cards de **CMV Total** e **Lucro Líquido Real** acumulados.
