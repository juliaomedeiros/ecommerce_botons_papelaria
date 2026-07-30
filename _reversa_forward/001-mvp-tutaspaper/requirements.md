# Requirements: MVP E-commerce de Bottons, Checkout Mercado Pago e Painel Admin

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30` (Atualizado via `/reversa-clarify`)
> Pasta da extração/especificação reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O MVP do Sistema Tuta's Paper é uma plataforma web responsiva (PWA/Mobile-First) totalmente conteinerizada com Docker, composta por:
1. **E-commerce com Foco em Modelos de Imagens Prontas & Botão de Personalização:** Vitrine principal focada em modelos pré-prontos organizados por categorias (Bottons, Artigos Religiosos, Papelaria), com um botão de destaque para acionar o personalizador com foto própria.
2. **Flag de Modo Evento (24h vs 5 Dias) via Admin:** O administrador controla via chave/flag no Painel Admin se o site está operando em "Modo Evento" (produção expressa em 24h com banners e badges dedicados) ou no prazo de produção padrão (5 dias úteis exibidos no checkout).
3. **Fluxo com Guia de Tamanhos Visível:** O Guia de Tamanhos (25mm e 38mm) é apresentado estrategicamente antes de iniciar a personalização de fotos ("Entendi, escolher meu botton") e no momento em que o usuário adiciona modelos prontos ao carrinho antes do pagamento.
4. **Personalizador Canvas com Zoom Ampliado e Instruções:** Módulo de prévia circular com slider de zoom estendido para ajustar fotos de qualquer resolução e instruções visuais passo a passo (arraste + zoom).
5. **Checkout, Tabela de Pedidos no Admin & WhatsApp:** Pagamento via Mercado Pago (Pix/Cartão), gravação de pedidos no Admin em tabela contendo Nome, Telefone, Imagem Recortada Redonda, Imagem Original e Prazo de Entrega, além do disparo via Evolution API para o WhatsApp do administrador contendo a imagem final redonda para prensa.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/prd.md#escopo-in` | Escopo completo do MVP (Conteinerizado Docker, Guia de Tamanhos 25mm/38mm, Variações Alfinete/Chaveiro/Ímã, Admin 100%). | 🟢 |
| `_reversa_sdd/sdd/ecommerce-catalog-fastfood.md#requisitos-funcionais` | Catálogo de categorias, componente Canvas/Crop circular, Guia de Tamanhos e seletores 25mm/38mm + alfinete/chaveiro/ímã. | 🟢 |
| `_reversa_sdd/sdd/inventory-dashboard-admin.md#requisitos-funcionais` | CRUD de Categorias/Produtos no Admin, controle de matérias-primas e Fila de Produção Noturna detalhada. | 🟢 |
| `_reversa_sdd/sdd/checkout-payment-mp.md#requisitos-funcionais` | Fluxo de pagamento transparente Mercado Pago (Pix/Cartão) e reserva de estoque. | 🟢 |
| `_reversa_sdd/sdd/notification-whatsapp-evolution.md#requisitos-funcionais` | Fila e envio de mensagens transacionais via Evolution API. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Cliente Comprador de Catálogo | Navegar pelos modelos prontos, verificar o tamanho ideal e comprar rapidamente. | Acessa o site, visualiza o Guia de Tamanhos, escolhe um terço/botton religioso de 38mm com alfinete e finaliza no Pix. |
| Cliente Comprador Personalizado | Criar um botton/chaveiro exclusivo com sua própria foto durante um evento ou no dia a dia. | Clica no botão "Personalizar com sua Foto", visualiza o Guia de Tamanhos, faz upload da imagem, ajusta no zoom amplo e faz o pedido. |
| Administrador / Dono | Alternar entre Modo Evento (24h) e Prazo Padrão (5 dias), gerenciar catálogo e produzir os itens. | Ativa a flag "Modo Evento 24h" no admin antes da feira, visualiza na tabela de pedidos o nome, telefone, prazo e baixa a arte recortada redonda pronta para a prensa. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Arquitetura Docker):** Toda a aplicação (frontend, backend, banco de dados e serviços auxiliares) deve ser empacotada em contêineres Docker leves orquestrados via `docker-compose.yml`. 🟢
2. **RN-02 (Cadastro 100% no Admin):** 100% dos produtos, categorias, variações, fotos e preços exibidos no e-commerce devem ser alimentados diretamente pelo Painel Administrativo. 🟢
3. **RN-03 (Opções de Diâmetro e Acabamento):** Tanto os produtos de catálogo quanto os personalizados devem suportar obrigatoriamente dois tamanhos (**25mm** e **38mm**) e três modalidades de acabamento (**Alfinete**, **Chaveiro** e **Ímã**). 🟢
4. **RN-04 (Flag Admin "Modo Evento / 24h"):** O Painel Admin possui uma chave (toggle) para ativar/desativar o Modo Evento 24h. 🟢
5. **RN-05 (Comportamento Dinâmico de Prazo no E-commerce):**
   - **Flag Ativa (Modo Evento):** O Hero exibe a frase *"Seu botton em 24 Horas com opção de personalizar"*, ativa um banner chamativo sem poluição visual no topo e adiciona a tag *"Personalizável em 24h"* nos cards do catálogo.
   - **Flag Desativada (Modo Padrão):** O Hero exibe a frase *"Escolha seu botton, chaveiro ou ímã com as imagens abaixo ou personalize com uma imagem sua"*, remove menções a 24h e exibe o prazo padrão de **5 dias úteis** no Checkout. 🟢
6. **RN-06 (Fluxo do Guia de Tamanhos):** O Guia de Tamanhos deve ser exibido obrigatoriamente:
   - Antes de iniciar a personalização de foto (com o botão de confirmação *"Entendi, escolher meu botton"* para prosseguir).
   - Ao adicionar modelos prontos do catálogo ao carrinho antes da etapa de pagamento. 🟢
7. **RN-07 (Controles de Ajuste e Zoom no Canvas):** O personalizador de foto circular deve apresentar explicações claras de uso (arraste + zoom) e um slider de zoom de longo alcance para ajuste perfeito de imagens de qualquer dimensão. 🟢
8. **RN-08 (Tabela de Pedidos no Admin e Notificação WhatsApp):** A tabela de pedidos no Admin deve listar **Nome do Cliente**, **Telefone**, **Imagem Recortada Redonda**, **Imagem Original** e **Prazo de Entrega (24h ou 5 dias)**. As notificações para o WhatsApp do Admin devem conter a imagem já formatada redonda. 🟢
9. **RN-09 (Mecanismo Anti-Ban WhatsApp via Evolution API):** Para prevenir bloqueios do número por envio em massa pela Meta/WhatsApp, o disparo de mensagens utiliza uma **Fila FIFO em Memória**, ativa o sinal de presença **"Digitando..." (`composing`)** por 2 a 4 segundos e aplica um **Delay Humanizado Aleatório (5 a 15 segundos)** entre cada envio. 🟢

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | O sistema deve exibir o catálogo por categorias com foco nos modelos pré-prontos e botão destacado para personalização. | Must | Vitrine prioriza imagens prontas e traz botão visível para "Personalizar com sua Foto". | 🟢 |
| RF-02 | O Admin deve conter uma flag/switch para ativar ou desativar o "Modo Evento (24h)". | Must | Alteração no Admin atualiza instantaneamente as frases do Hero, banners e badges da loja pública. | 🟢 |
| RF-03 | O sistema deve apresentar o Guia de Tamanhos no fluxo do personalizador (antes de abrir a tela) e no carrinho para itens de catálogo. | Must | Exibição explicativa dos diâmetros de 25mm e 38mm em pontos estratégicos da jornada. | 🟢 |
| RF-04 | O personalizador deve conter instruções visuais de ajuste (arraste) e slider com grande amplitude de zoom. | Must | Facilidade de redimensionar fotos de baixa e alta resolução dentro da máscara circular. | 🟢 |
| RF-05 | O cliente deve poder escolher o diâmetro (25mm/38mm) e o acabamento (Alfinete/Chaveiro/Ímã) para qualquer modelo. | Must | Seleção via rádio/pills recalculando o preço total e validando estoque de insumos. | 🟢 |
| RF-06 | Integração de Checkout com Mercado Pago (Pix QR Code/Copia e Cola e Cartão de Crédito). | Must | Transação aprovada grava o pedido e atualiza o status. | 🟢 |
| RF-07 | Tabela de Pedidos no Admin contendo Nome, Telefone, Imagem Recortada, Imagem Original e Prazo de Entrega. | Must | Visualização completa de todos os dados do pedido e download da imagem pronta. | 🟢 |
| RF-08 | Disparo de WhatsApp via Evolution API enviando a foto pronta circular para a produção do Admin. | Should | Notificação no WhatsApp com o arquivo redondo formatado. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Tempo de resposta do Canvas de crop < 100ms e carregamento da loja < 1,5s | Otimização para celulares e redes móveis. | 🟢 |
| Infraestrutura | Deploy simplificado em 1 comando via `docker compose up -d` | Restrição explícita de facilidade de manutenção em VPS Linux. | 🟢 |
| Segurança | Autenticação do Admin via JWT com expiração em 24h e hashing bcrypt para senhas | Proteção da área administrativa. | 🟢 |
| Usabilidade | Interface moderna sem poluição visual, destacando prazos e tamanhos de forma límpida | Experiência limpa e intuitiva para o comprador. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Compra em dia normal com prazo de 5 dias
  Dado que o administrador desativou a flag "Modo Evento" no Admin
  E um cliente acessa o e-commerce pelo celular
  Quando visualiza o Hero com o texto "Escolha seu botton, chaveiro ou ímã com as imagens abaixo ou personalize com uma imagem sua"
  E escolhe um modelo religioso pronto, seleciona "38mm Chaveiro" e adiciona ao carrinho
  Então o Guia de Tamanhos é exibido no carrinho para confirmação
  E na etapa final de Checkout é informado o prazo padrão de produção de 5 dias úteis.

Cenário: Ativação do Modo Evento 24h no Admin e pedido personalizado
  Dado que o administrador ativa a flag "Modo Evento" no Painel Admin
  Quando o cliente acessa a loja e vê a frase "Seu botton em 24 Horas com opção de personalizar" e o banner chamativo de evento
  E clica no botão "Personalizar com sua Foto"
  Então o Guia de Tamanhos é exibido com o botão "Entendi, escolher meu botton"
  E após clicar, o cliente faz upload da foto, ajusta com o zoom amplo e conclui a compra
  E no Admin o pedido é salvo na tabela com Nome, Telefone, Imagem Recortada Redonda, Imagem Original e Prazo de 24h.
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 a RF-07 | Must | Essenciais para o funcionamento do MVP (Vendas + Retaguarda + Produção). |
| RF-08 | Should | Notificações de WhatsApp agregam valor e agilizam o atendimento ao cliente. |
| RNF Docker | Must | Garante portabilidade e execução padronizada em VPS. |

## 9. Esclarecimentos

### Sessão 2026-07-30

- **Q:** Como a flag de 24h (Modo Evento) ativada no Admin deve se comportar no e-commerce?
  **R:** Quando a flag estiver ATIVADA, o Hero exibe a frase *"Seu botton em 24 Horas com opção de personalizar"*, exibe um banner chamativo no topo para atrair atenção sem poluição visual, e inclui o badge *"Personalizável em 24h"* nos cards do catálogo. Quando DESATIVADA, remove qualquer menção a 24h, exibe a frase *"Escolha seu botton, chaveiro ou ímã com as imagens abaixo ou personalize com uma imagem sua"* e informa o prazo padrão de 5 dias úteis no Checkout.

- **Q:** Como o Guia de Tamanhos deve ser apresentado no fluxo?
  **R:** Ao clicar no botão de personalização, o Guia de Tamanhos é exibido primeiro e o usuário clica em *"Entendi, escolher meu botton"* para abrir o personalizador. Para os modelos pré-prontos do catálogo, o Guia de Tamanhos é exibido ao adicionar ao carrinho antes da etapa de pagamento.

- **Q:** Qual é o foco da página e onde fica o botão de personalização?
  **R:** O foco principal da vitrine é nos modelos pré-prontos do catálogo. A opção de personalização é uma segunda opção acessível via botão dedicado no local onde ficava o botão de Fast Food.

- **Q:** Quais melhorias devem ser feitas no personalizador Canvas, Admin e WhatsApp?
  **R:** Os tamanhos (25mm/38mm) e acabamentos (Alfinete, Chaveiro, Ímã) são idênticos para produtos do catálogo e personalizados. O personalizador Canvas ganha uma explicação visual de ajuste (arraste) e slider de zoom com maior amplitude. No Admin, a tabela de pedidos lista Nome, Telefone, Imagem Recortada Redonda, Imagem Original e Prazo de Entrega. A notificação no WhatsApp do Admin recebe a imagem formatada redonda.

- **Q:** Quando é exibido o aviso do prazo padrão de 5 dias?
  **R:** O prazo de 5 dias úteis é informado na etapa finalização do pedido (Checkout).

## 10. Lacunas

Nenhuma lacuna pendente. Todas as dúvidas sobre a flag do admin (Modo Evento 24h vs 5 dias), exibição do Guia de Tamanhos, catálogo pré-pronto, zoom do canvas e tabela do admin foram 100% esclarecidas e incorporadas aos requisitos.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-07-30 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-07-30 | Incorporação do Modo Evento 24h/5dias, fluxo do Guia de Tamanhos e tabela do Admin via `/reversa-clarify` | reversa-clarify |
