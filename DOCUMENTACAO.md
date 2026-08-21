# Documentação Técnica — Dev Portfolio (Igor Augusto)

## 1. Visão geral

Landing page de página única voltada para apresentar Igor Augusto como desenvolvedor freelancer/full-stack: mostra stack técnica, projetos de portfólio, processo de trabalho e um formulário para captar pedidos de orçamento. Público-alvo: potenciais clientes avaliando contratar um serviço de desenvolvimento.

## 2. Arquitetura

Site estático, arquivo único (`index.html`), sem build step e sem dependências instaláveis:

- **HTML** — estrutura semântica com `<nav>`, `<section>` por bloco de conteúdo e `<footer>`.
- **CSS** — todo dentro de uma tag `<style>` no `<head>`, usando custom properties (`:root`), Grid/Flexbox e animações via `@keyframes`.
- **JavaScript** — todo dentro de uma tag `<script>` no final do `<body>`, sem módulos nem bibliotecas externas.
- **Fontes** — carregadas via `<link>` do Google Fonts (`Space Mono`, `Syne`).
- **Script externo do Cloudflare** — o arquivo referencia `/cdn-cgi/scripts/.../email-decode.min.js`, injetado automaticamente pelo Cloudflare Email Obfuscation (ver seção 7.2).

## 3. Design tokens (`:root`)

| Variável | Uso |
|---|---|
| `--bg` | Fundo geral (`#0a0a0f`, quase preto) |
| `--surface` | Fundo de seções alternadas (skills, process) |
| `--card` | Fundo dos cards (skill, projeto, formulário) |
| `--border` | Bordas e linhas divisórias |
| `--accent` | Verde neon (`#00ff99`) — cor de destaque principal |
| `--accent2` | Roxo (`#7c3aed`) — usado no glow do hero |
| `--accent3` | Laranja (`#ff6b35`) — usado para indicar erro de validação |
| `--text` / `--muted` | Texto principal e texto secundário |
| `--font-display` / `--font-mono` | `Syne` (títulos) e `Space Mono` (corpo/UI) |

Trocar a paleta ou tipografia do site inteiro é feito só editando essas variáveis.

## 4. Estrutura de seções

- **Nav** — fixa no topo, com blur de fundo; links para `#skills`, `#projects`, `#process`, `#orcamento`.
- **Hero** (`#hero`) — grid de fundo, dois glows radiais animados, título, subtítulo, dois CTAs e três contadores (`data-target`) que animam ao entrar na tela.
- **Skills** (`#skills`) — grid de 6 `.skill-card` (Frontend, Backend, Banco de Dados, Cloud & DevOps, Mobile, Integrações & IA), cada um com ícone, descrição e tags de tecnologia.
- **Projetos** (`#projects`) — grid de 6 `.project-card` (thumb com gradiente `thumb-1` a `thumb-6`, nome, descrição, stack e links "Demo"/"GitHub").
- **Processo** (`#process`) — 5 `.process-step` (Briefing → Proposta → Desenvolvimento → Revisão → Deploy & Suporte).
- **Orçamento** (`#orcamento`) — duas colunas: `.budget-info` (texto + lista de diferenciais) e `.budget-form` (formulário completo).
- **Contact bar** — faixa verde com CTA e links (E-mail, WhatsApp, LinkedIn, GitHub).
- **Footer** — copyright e status de disponibilidade.

## 5. Comportamentos JavaScript

| Funcionalidade | Como funciona |
|---|---|
| Cursor customizado | Um ponto segue o mouse 1:1; um anel externo segue com interpolação (`lerp` a 0.12 por frame via `requestAnimationFrame`) e cresce ao passar sobre elementos interativos |
| Barra de progresso de scroll | `.scroll-bar` tem a largura recalculada a cada `scroll`, proporcional ao quanto já foi rolado |
| Contadores animados | `IntersectionObserver` dispara ao hero-stats entrar 50% na tela; `animateCounter()` incrementa cada número até o valor de `data-target` |
| Slider de orçamento | `input[type=range]` de 1 a 10 mapeado ao array `ranges` (10 faixas, de "Até R$ 1k" a "R$ 100k+"); `updateBudget(val)` atualiza o texto exibido |
| Validação do formulário | `submitForm()` verifica se `nome`, `email`, `tipo`, `prazo` e `descricao` estão preenchidos; campos vazios recebem borda laranja (`--accent3`) até o usuário digitar algo |
| Envio do formulário | **Simulado** — ao validar, o form (`#formContent`) é escondido e a mensagem de sucesso (`#formSuccess`) é exibida. Não há `fetch`/requisição de rede: nenhum dado é realmente enviado (ver Pendências) |
| Revelação ao rolar | `IntersectionObserver` remove `opacity: 0` / `translateY(20px)` de `.skill-card`, `.project-card`, `.process-step` e `.budget-item` conforme entram na viewport |

## 6. Responsividade

Dois breakpoints principais:

- **`@media (max-width: 900px)`** — menu de navegação escondido, título do hero com menos letter-spacing, colunas de orçamento e formulário empilham, grid de processo vira 2 colunas, contact bar centraliza.
- **`@media (max-width: 600px)`** — paddings reduzidos, checkboxes do formulário em coluna única, grid de processo vira 1 coluna.

## 7. Pendências / pontos de atenção antes do deploy

1. **O formulário não envia dados de verdade.** `submitForm()` só simula sucesso no front-end. Para receber pedidos de orçamento de fato, é preciso integrar com um backend próprio ou um serviço de formulário (Formspree, EmailJS, Getform, etc.) via `fetch`.
2. **O link de e-mail depende do Cloudflare.** O `href` do botão "E-mail" (`/cdn-cgi/l/email-protection#...`) e o script `email-decode.min.js` são gerados automaticamente pela proteção de e-mail do Cloudflare — só funcionam em um domínio servido atrás do Cloudflare com esse recurso ativo. Fora desse cenário, o link fica quebrado e precisa ser trocado por um `mailto:` direto.
3. **Links sociais são placeholders.** "LinkedIn" e "GitHub" na contact bar apontam para `https://linkedin.com` e `https://github.com` (genéricos) em vez dos perfis reais.
4. **Links dos projetos são placeholders.** Todos os 6 cards de projeto têm `href="#"` em "Demo" e "GitHub".
5. **Os checkboxes de "funcionalidades desejadas" não são coletados.** As opções marcadas nesse grupo não são lidas em nenhum ponto de `submitForm()` — se o backend for implementado, é preciso adicionar essa coleta.
6. **Pequena inconsistência no valor inicial do slider de orçamento.** O texto estático no HTML mostra "R$ 3k–5k", mas `updateBudget(3)` roda no carregamento e aplica `ranges[2]` = "R$ 2k–4k" — os dois só baterão se um dos dois for ajustado.
7. **Cursor customizado em telas touch.** `.cursor`/`.cursor-ring` não têm tratamento para dispositivos sem mouse; em celulares eles ficam parados na posição inicial. Vale escondê-los com `@media (hover: none)`.

## 8. Compatibilidade de navegadores

O site usa recursos modernos sem fallback: `backdrop-filter`, `mix-blend-mode: screen`, `IntersectionObserver`, `clamp()` e `mask-image`. Funciona bem em navegadores atuais (Chrome, Edge, Firefox, Safari recentes); pode degradar visualmente em navegadores mais antigos.

## 9. Sugestões de deploy

Como é um site estático de arquivo único, qualquer hospedagem estática serve: GitHub Pages, Vercel, Netlify ou Cloudflare Pages. Cloudflare Pages tem a vantagem de manter a proteção de e-mail (item 7.2) funcionando automaticamente, já que o HTML já foi gerado esperando esse recurso.

## 10. Como customizar

- **Cores/tipografia** — editar as variáveis em `:root` (seção 3).
- **Textos e projetos** — editar diretamente o HTML de cada `.skill-card` / `.project-card` dentro das seções `#skills` e `#projects`.
- **Faixas de orçamento** — editar o array `ranges` no `<script>` (10 posições, uma por valor do slider).
- **Dados de contato** — trocar o `href` do WhatsApp (`https://wa.me/55...`), o e-mail (ver item 7.2) e os links sociais na contact bar.
