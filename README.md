# Deploy Digital — Site Institucional (One Page)

Site institucional em HTML5, CSS3 e JavaScript puro (sem frameworks/dependências) para a **Deploy Digital**, marca de serviços de tecnologia (sites, sistemas web, aplicativos, loja virtual, manutenção e consultoria).

🔗 Domínio: `deploydigital.com.br`

## 📁 Estrutura de arquivos

```
.
├── index.html   # Estrutura e conteúdo de todas as seções
├── style.css    # Design tokens, layout e responsividade
└── script.js    # Interações e comportamento da página
```

## 🛠 Tecnologias

- **HTML5** semântico, com dados estruturados (Schema.org `Organization`), Open Graph e Twitter Card para SEO/compartilhamento.
- **CSS3** organizado por tokens (`:root`), com suporte a `prefers-reduced-motion` e breakpoints responsivos (mobile, tablet ≥760px, desktop ≥981px/1040px).
- **JavaScript vanilla**, sem dependências externas, dividido por funcionalidade dentro de `script.js`.
- Fontes via Google Fonts: **Space Grotesk** (títulos), **Inter** (corpo) e **JetBrains Mono** (elementos de terminal/código).

## ✨ Funcionalidades implementadas

| Módulo | Descrição |
|---|---|
| Menu mobile | Abre/fecha a navegação em telas pequenas |
| Scroll spy | Destaca o link do menu correspondente à seção visível |
| Terminal animado | Efeito de "digitação" no herói, reforçando o conceito "Deploy Digital" |
| Carrossel genérico | Reutilizado no Portfólio e nos Depoimentos, com setas e dots |
| Formulário de contato | Envio via WhatsApp ou e-mail (`mailto:`), com validação de campos |
| Seletor de idioma (i18n) | Alternância entre **PT / EN / 中文** via atributos `data-i18n` |
| Modal de login | Apenas front-end — **requer backend** para autenticação real |
| Botão flutuante do WhatsApp | Fixo, com mensagem pré-preenchida |
| Mapa do Google | Embed via iframe na seção Localização |

## 🔍 SEO & Analytics

- Meta tags de descrição, keywords, `canonical`, Open Graph e Twitter Card já preenchidas.
- Google Analytics (GA4) incluído no `<head>`.
- Dados estruturados `Organization` com telefone, redes sociais e idiomas atendidos.

## ⚠️ Itens com placeholder — substituir antes de publicar

- [ ] **GA4**: trocar `G-XXXXXXXXXX` pelo ID real da propriedade (2 ocorrências em `index.html`).
- [ ] **Favicon e OG image**: criar/enviar `assets/favicon.svg`, `assets/favicon.ico`, `assets/og-image.jpg` e `assets/logo.svg`.
- [ ] **Mapa**: endereço atual é genérico (Bragança Paulista, SP) — ajustar para o endereço real, se houver.
- [ ] **Portfólio e Blog**: `media-placeholder` no lugar das imagens reais dos projetos/posts.
- [ ] **Depoimentos**: textos e nomes são fictícios/genéricos — substituir por depoimentos reais de clientes.
- [ ] **Formulário de contato**: funciona apenas no front-end (WhatsApp/e-mail); não há envio para servidor/CRM.
- [ ] **Login/Área do cliente**: modal é só de interface — precisa de backend de autenticação.
- [ ] **Loja virtual**: mencionada nos serviços, mas ainda não implementada no site.

## ▶️ Como rodar localmente

Não há build nem dependências. Basta abrir `index.html` no navegador, ou servir a pasta com um servidor local simples, por exemplo:

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000`.

## ♿ Acessibilidade

- Link "Pular para o conteúdo" (`skip-link`).
- `aria-label`, `aria-expanded`, `aria-live` e `role` aplicados em nav, formulário, carrosséis e modal.
- Respeita `prefers-reduced-motion` (desativa animações do terminal e transições quando ativado pelo usuário).

## 📱 Responsividade

Layout mobile-first, testado com breakpoints em `760px`, `980px`/`981px` e `1040px` (ajustes de menu, carrossel e grid).
