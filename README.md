# Dev Portfolio — Igor Augusto

Landing page pessoal em pt-BR para apresentar serviços de desenvolvimento web, portfólio de projetos e captar solicitações de orçamento de clientes.

## Visão geral

- Site estático de página única (one-page), sem frameworks e sem etapa de build.
- HTML, CSS e JavaScript vivem todos no mesmo arquivo: `index.html`.
- Tipografia via Google Fonts (`Space Mono` + `Syne`).
- Visual dark/neon com cursor customizado, barra de progresso de scroll, contadores animados e revelação de elementos ao rolar a página.

## Estrutura do projeto

```
index.html   → HTML + CSS (inline em <style>) + JS (inline em <script>)
```

Tudo em um único arquivo — não há pasta `src/`, `assets/` nem `package.json`.

## Como rodar localmente

Não há dependências para instalar. Basta abrir o arquivo no navegador:

```bash
# opção 1 — abrir direto
open index.html        # macOS
start index.html        # Windows

# opção 2 (recomendada) — servir com um servidor local,
# garante que os efeitos de scroll/observer se comportem como em produção
npx serve .
# ou
python3 -m http.server 8000
```

## Seções da página

| # | Seção | Âncora | Conteúdo |
|---|-------|--------|----------|
| — | Nav | — | Logo + menu para as seções |
| — | Hero | `#hero` | Headline, CTA e contadores animados (projetos, anos, clientes) |
| 01 | Skills | `#skills` | Cards de stack por categoria (Frontend, Backend, DB, Cloud, Mobile, IA) |
| 02 | Projetos | `#projects` | Grid com 6 projetos de exemplo (nome, stack, links) |
| 03 | Processo | `#process` | 5 etapas de trabalho, de briefing a deploy |
| 04 | Orçamento | `#orcamento` | Formulário de solicitação de orçamento |
| — | Contact bar / Footer | — | Links de contato e créditos |

## Stack técnica

HTML5 · CSS3 (custom properties, grid, animações) · JavaScript vanilla (sem bibliotecas externas).

## ⚠️ Antes de publicar

O formulário de orçamento hoje **não envia dados para lugar nenhum** (é só uma simulação no front-end), e há alguns links/placeholders que precisam ser trocados por valores reais. A lista completa está na seção **"Pendências"** de [`DOCUMENTACAO.md`](./DOCUMENTACAO.md).

## Licença

Uso pessoal — definir licença conforme necessidade de publicação.
