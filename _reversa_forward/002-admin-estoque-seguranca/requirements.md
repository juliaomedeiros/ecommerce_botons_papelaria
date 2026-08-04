# Requirements: Evolução do Admin — Gestão de Produtos, Estoque, Dashboard, Perfis RBAC, Mercado Pago Sandbox/Prod, Segurança, Testes Automatizados e PDF Timbrado no WhatsApp

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-07-30`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Esta feature expande o Painel Administrativo do Tuta's Paper de uma ferramenta básica para uma plataforma completa de retaguarda empresarial. Ela adiciona cadastro de produtos com fotos e preços refletidos instantaneamente no e-commerce, controle rígido de estoque com baixa automática, dashboard financeiro e estatístico, controle de acesso baseado em papéis (`admin` vs `funcionario`), alternância entre Mercado Pago Sandbox (Testes) e Produção, segurança reforçada contra invasões, suíte de testes automatizados e o gerador de PDF de Pedido Timbrado (no padrão oficial do layout *MATERIAL CONSIGNADO TATI.pdf*) enviado automaticamente via WhatsApp.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/prd.md#escopo-in` | Expansão do módulo administrativo e controle de vendas. | 🟢 |
| `_reversa_sdd/sdd/inventory-dashboard-admin.md#requisitos-funcionais` | Gestão de produtos, categorias e integrações. | 🟢 |
| `_reversa_sdd/sdd/checkout-payment-mp.md#requisitos-funcionais` | Fluxo de checkout Mercado Pago com Pix e Cartão. | 🟢 |
| `_reversa_sdd/sdd/notification-whatsapp-evolution.md#requisitos-funcionais` | Envio de mensagens via Evolution Go. | 🟢 |
| `_reversa_sdd/addenda/001-mvp-tutaspaper.md#resumo-da-entrega` | Suporte à rota nativa `/admin` e Fila Anti-Ban no WhatsApp. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador (Dono) | Gerenciar todo o negócio, produtos, estoque, finanças e usuários com segurança total. | Cadastrar produtos, monitorar o dashboard financeiro, gerenciar chaves do Mercado Pago (Sandbox/Prod) e criar acessos para funcionários. |
| Funcionário da Oficina | Produzir pedidos e atualizar o estoque sem acessar dados de faturamento. | Visualizar a Fila Noturna de Prensa, baixar artes em HD, visualizar/baixar o PDF timbrado do pedido e atualizar quantidades em estoque. |
| Comprador da Loja | Comprar itens de catálogo ou personalizados com garantia de estoque e receber comprovante em PDF no WhatsApp. | Escolher modelos com estoque disponível, realizar o pagamento e receber no WhatsApp o PDF timbrado idêntico ao modelo físico da empresa. |

## 4. Regras de negócio novas ou alteradas

1. **RN-10 (Cadastro de Produtos com Preço e Imagem):** O Administrador pode cadastrar novos produtos informando nome, descrição, categoria, preço base, taxa de personalização e upload de imagem. O produto fica disponível imediatamente na vitrine do e-commerce. 🟢
2. **RN-11 (Baixa Automática e Limite de Estoque):** Todo produto possui uma quantidade em estoque registrada. Ao aprovar um pedido, o sistema realiza a baixa automática no banco de dados. Caso o estoque chegue a zero, o produto é exibido como "Esgotado" e o botão de compra é bloqueado. 🟢
3. **RN-12 (Dashboard de Vendas e Valor em Estoque):** O painel do Administrador exibe cards com: Total de Vendas (R$), Valor Total de Mercadorias em Estoque (R$), Total de Pedidos Concluídos e Distribuição por Categoria. 🟢
4. **RN-13 (Perfis de Acesso RBAC - Admin vs Funcionário):** Apenas usuários com o papel `admin` têm acesso às métricas financeiras globais de faturamento, alteração de senhas mestre, cadastro de usuários do sistema e chaves do Mercado Pago. Usuários com papel `funcionario` têm acesso à Fila de Produção Noturna, ajuste de estoque e alteração dos preços de venda dos produtos. 🟢
5. **RN-14 (Alternância Mercado Pago Sandbox vs Produção):** O Admin pode alternar via chave seletora (*toggle*) entre o ambiente **Sandbox (Testes)** e **Produção**, garantindo testes de pagamento sem transações reais. 🟢
6. **RN-15 (Gerador de PDF de Pedido Timbrado no Padrão Tuta's Paper):** Ao confirmar o pedido, o sistema gera dinamicamente um arquivo PDF utilizando o layout timbrado idêntico ao arquivo `MATERIAL CONSIGNADO TATI.pdf` (Header com logo oficial, frase *"Papelaria e Artigos Religiosos"*, contatos `@tutaspaper`, `(83) 99985 3299`, endereço completo, cabeçalho de cliente/data/pedido e tabela formatada com Item, Quantidade, Valor Unitário e Valor Venda). 🟢
7. **RN-16 (Envio Automático do PDF no WhatsApp):** O PDF timbrado gerado é enviado automaticamente via Evolution Go para o número de telefone informado prioritariamente no formulário do checkout do pedido. 🟢
8. **RN-17 (Segurança Reforçada e Testes Automatizados):** Senhas devem ser salgadas e criptografadas com Bcrypt, rotas administrativas protegidas por middlewares de autorização estritos e executada uma suíte de testes de unidade e integração (Jest/Supertest) validando APIs e estoque. 🟢
9. **RN-18 (Gestão de Clientes Compradores no Admin):** O Admin disponibilizará uma aba/tela dedicada para cadastro e consulta de todos os clientes que realizam compras na loja. O cadastro deve registrar: Nome Completo, Telefone, Endereço Completo (Rua, Bairro, Cidade, Estado e CEP) e CPF (campo opcional na versão inicial). 🟢
10. **RN-19 (Toggle Modo 24h, Restrição de Personalização e Frase Dinâmica da Vitrine):** No Admin, haverá uma chave seletora (*toggle*) para ativar/desativar o **Modo 24h** (Entrega Expressa). 🟢
    - **Quando `modo_24h = true` (Ativo):** A opção/card *"Personalize com uma imagem"* e toda a seção/fluxo de personalização ficam ocultos/desativados no e-commerce, permitindo apenas compras de produtos já existentes no catálogo. A frase do banner/hero é atualizada para: *"Modo Entrega Rápida 24h: Escolha seu botton diretamente no nosso catálogo."*
    - **Quando `modo_24h = false` (Desativado):** A opção/card *"Personalize com uma imagem"* volta a ficar visível. A frase do banner/hero muda para: *"Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem."*
11. **RN-20 (Personalizador de Botton em Modal Responsivo Mobile e Amplitude Ampliada de Zoom):** 🟢
    - **Modal Mobile-First:** Quando o usuário clica para personalizar um botton (quando o Modo 24h está desativado), o fluxo de personalização abre em um **Modal responsivo (pop-up)**, garantindo perfeita usabilidade em smartphones e telas sensíveis ao toque.
    - **Zoom e Enquadramento Flexível:** O controle de zoom/escala da imagem no Canvas de botton deve possuir amplitude ampliada (permitindo diminuir bastante o zoom em imagens de alta resolução/dimensões grandes e ampliar em imagens menores). O algoritmo de enquadramento inicial calcula automaticamente a escala ideal (*fit/contain*) adaptada para qualquer dimensão (imagens grandes ou pequenas, alta ou baixa resolução).

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-10 | Form da Gestão de Produtos no Admin | Must | Permitir cadastrar nome, descrição, categoria, preço, imagem e estoque com reflexo imediato no e-commerce. | 🟢 |
| RF-11 | Módulo de Estoque e Validação por Venda | Must | Impedir compras acima do estoque disponível e decrementar estoque ao aprovar venda. | 🟢 |
| RF-12 | Painel Dashboard com Métricas Financeiras | Must | Exibir o valor total vendido (R$), valor estocado (R$) e totais por categoria. | 🟢 |
| RF-13 | Controle de Usuários RBAC (`admin` e `funcionario`) | Must | Bloquear acesso de funcionários a relatórios financeiros globais e configurações de chaves. Permitir que funcionários alterem preços de produtos e estoques. | 🟢 |
| RF-14 | Alternância de Ambiente Mercado Pago (Sandbox / Prod) | Must | Permitir trocar Access Tokens entre ambiente de teste e produção por flag. | 🟢 |
| RF-15 | Gerador de PDF Timbrado no Layout *MATERIAL CONSIGNADO TATI.pdf* | Must | Gerar documento PDF com o header timbrado oficial, dados do cliente e tabela de itens formatada. | 🟢 |
| RF-16 | Envio Automático do PDF pelo WhatsApp (Evolution Go) | Must | Anexar e disparar a mensagem com o PDF do pedido no WhatsApp do cliente (usando o número do checkout) através da Fila Anti-Ban. | 🟢 |
| RF-17 | Suíte de Testes Automatizados (Unidade e Integração) | Must | Executar testes cobrindo rotas de produtos, baixa de estoque, autenticação JWT e cálculo de carrinho. | 🟢 |
| RF-18 | Aba/Tela de Gestão e Cadastro de Clientes no Admin | Must | Exibir lista e formulário de dados cadastrais dos clientes (Nome, Telefone, Endereço completo com Rua/Bairro/Cidade/Estado/CEP e CPF opcional). | 🟢 |
| RF-19 | Toggle Modo 24h e Controle Dinâmico de Personalização | Must | Permitir alternar no Admin a flag Modo 24h, ocultando completamente o card e o fluxo de personalização quando ativa, e atualizando a frase inicial da vitrine. | 🟢 |
| RF-20 | Modal Responsivo de Personalização e Enquadramento Dinâmico de Zoom | Must | Abrir a personalização em modal responsivo otimizado para celulares, com controle de zoom de amplitude estendida para enquadrar imagens de qualquer resolução/tamanho. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Autenticação RBAC com Hashing Salto Bcrypt e JWT Revogável | Proteção de dados financeiros e contas de administradores/funcionários contra invasões. | 🟢 |
| Desempenho | Geração do PDF em menos de 1,5 segundos no servidor | Resposta rápida durante a finalização da compra pelo cliente. | 🟢 |
| Qualidade | Cobertura de Testes Automatizados com relatório limpo | Garantir estabilidade nas vendas e prevenção de regressões no estoque. | 🟢 |
| Usabilidade | Interface Mobile-First no Modal de Personalização e Canvas Responsivo | Facilitar a navegação e enquadramento em dispositivos móveis. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Baixa de estoque automática e envio do PDF timbrado no WhatsApp
  Dado que um produto possui 10 unidades em estoque
  Quando o cliente realiza a compra de 2 unidades e o pagamento é confirmado
  Então o estoque atual do produto deve cair para 8 unidades
  E o PDF timbrado do pedido (padrão Tuta's Paper) deve ser gerado e enviado ao WhatsApp informado no checkout do cliente.

Cenário: Tentativa de acesso restrito por perfil Funcionário
  Dado que um usuário está autenticado com a role 'funcionario'
  Quando ele tenta acessar a rota do Dashboard Financeiro (/api/admin/dashboard) ou trocar o token do Mercado Pago
  Então o sistema deve retornar o status HTTP 403 Forbidden com a mensagem "Acesso restrito a administradores".
  Mas se ele tentar alterar o preço ou quantidade de um produto na API de produtos, a operação deve ser autorizada com sucesso.

Cenário: Cadastro e consulta de clientes no Admin
  Dado que o administrador acessa a nova aba "Clientes" no painel administrativo
  Quando ele consulta a listagem ou cadastra um comprador com Nome, Telefone, Endereço e CPF (opcional)
  Então os dados do comprador são armazenados e exibidos corretamente com a estrutura de endereço completa.

Cenário: Ativação do Modo 24h no Admin
  Dado que a flag "Modo 24h" está ativada no Admin
  Quando um cliente acessa o e-commerce
  Então os cards e todo o fluxo de personalização ficam ocultos e a frase inicial é atualizada para indicar a compra exclusiva de itens do catálogo.

Cenário: Enquadramento de imagem no Modal Responsivo
  Dado que o cliente abre o modal de personalização em um dispositivo móvel
  Quando ele faz upload de uma imagem de grandes dimensões (ex: foto em alta resolução)
  Então o slider de zoom permite diminuir a escala o suficiente para ajustar a imagem perfeitamente dentro da área do botton sem travar nos limites.
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-10 (Cadastro de Produtos) | Must | Essencial para o Admin alimentar a loja sem editar código. |
| RF-11 (Controle de Estoque) | Must | Evita vendas acima do limite físico de mercadorias. |
| RF-12 (Dashboard Financeiro) | Must | Proporciona visão de faturamento e capital estocado ao gestor. |
| RF-13 (Perfis Admin/Funcionário) | Must | Protege dados estratégicos de faturamento da empresa enquanto permite gestão operacional ao funcionário. |
| RF-14 (Mercado Pago Sandbox/Prod) | Must | Permite testar o fluxo de vendas sem cobrança real. |
| RF-15 & RF-16 (PDF Timbrado & WhatsApp) | Must | Entrega o comprovante profissional idêntico ao modelo oficial da loja no WhatsApp do checkout. |
| RF-17 (Testes Automatizados & Segurança) | Must | Garante que a aplicação financeira é blindada contra bugs e invasões. |
| RF-18 (Gestão de Clientes no Admin) | Must | Permite visualização e cadastro de compradores com endereço completo e CPF opcional. |
| RF-19 (Toggle Modo 24h & Frase Dinâmica) | Must | Permite desativar a personalização em compras rápidas de 24h e atualizar a frase inicial. |
| RF-20 (Modal de Personalização e Zoom Ampliado) | Must | Garante excelente usabilidade mobile e enquadramento ideal de imagens de qualquer dimensão. |

## 9. Esclarecimentos

### Sessão 2026-08-03

- **Q:** No envio do PDF timbrado pelo WhatsApp, se o cliente alterar o número de telefone no checkout, o PDF deve ser enviado para qual número?
  **R:** O PDF deve ser enviado prioritariamente para o número de telefone informado no formulário do checkout do pedido.
- **Q:** O perfil de funcionário pode alterar os preços de venda dos produtos no estoque?
  **R:** Sim, usuários com perfil `funcionario` podem alterar os preços de venda dos produtos no estoque, além de atualizar quantidades e gerenciar a Fila de Prensa.
- **Q:** Haverá uma aba/tela no Admin para cadastro e visualização de clientes compradores?
  **R:** Sim. Adicionada a aba "Clientes" no Admin para cadastrar e visualizar usuários compradores contendo: Nome Completo, Telefone, Endereço Completo (Rua, Bairro, Cidade, Estado e CEP) e CPF (opcional inicialmente).
- **Q:** Como funcionará o Modo 24h e a nova frase inicial do e-commerce?
  **R:** No Admin haverá a flag "Modo 24h". Quando ATIVA, oculta totalmente o card e a seção/fluxo de personalizar botton e exibe a mensagem de catálogo express. Quando DESATIVA, reexibe a personalização e exibe a nova frase: *"Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem."*
- **Q:** Como será a usabilidade da personalização em dispositivos móveis e o enquadramento de imagens?
  **R:** O fluxo de personalização será aberto em um Modal responsivo (pop-up) com design mobile-first. O controle de zoom/escala no Canvas terá amplitude estendida para permitir diminuir ou aumentar bastante o enquadramento, aceitando imagens de qualquer dimensão ou resolução sem limitações de corte.

## 10. Lacunas

Nenhuma dúvida pendente no momento. Todas as lacunas foram esclarecidas.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-07-30 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-08-03 | Resolução de dúvidas via `/reversa-clarify` e inclusão do RF-18 (Gestão de Clientes no Admin) | reversa-clarify |
