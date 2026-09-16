/* ==========================================================================
   DEPLOY DIGITAL — script.js
   JavaScript vanilla, sem dependências. Organizado por funcionalidade:
   1. Utilidades
   2. Menu mobile
   3. Scroll spy (link ativo no menu)
   4. Terminal animado do herói
   5. Carrossel genérico (portfólio + depoimentos)
   6. Formulário de contato (WhatsApp / e-mail)
   7. Modal de login (somente front-end — ver nota no final do arquivo)
   8. Internacionalização (PT / EN / ZH)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------- 1. Utilidades ---------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  $('#year').textContent = new Date().getFullYear();

  /* ---------------------- 2. Menu mobile ---------------------- */
  const navToggle = $('#nav-toggle');
  const mainNav = $('.main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------- 3. Scroll spy ---------------------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));

  /* ---------------------- 4. Terminal animado do herói ---------------------- */
  // Único "momento" de motion orquestrado da página: simula um deploy sendo
  // digitado no terminal, reforçando o conceito da marca ("Deploy Digital").
  const terminalOutput = $('#terminal-output');
  const terminalLines = [
    '$ deploy digital.com.br --status=live',
    '> build otimizado ✅',
    '> imagens comprimidas ✅',
    '> performance verificada ✅',
    '> site no ar 🚀'
  ];

  function typeTerminal() {
    if (!terminalOutput) return;

    if (prefersReducedMotion) {
      terminalOutput.textContent = terminalLines.join('\n');
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let text = '';

    function typeChar() {
      if (lineIndex >= terminalLines.length) return;
      const currentLine = terminalLines[lineIndex];

      if (charIndex < currentLine.length) {
        text += currentLine[charIndex];
        terminalOutput.textContent = text;
        charIndex++;
        setTimeout(typeChar, 24);
      } else {
        text += '\n';
        terminalOutput.textContent = text;
        lineIndex++;
        charIndex = 0;
        setTimeout(typeChar, 420);
      }
    }
    typeChar();
  }
  typeTerminal();

  /* ---------------------- 5. Carrossel genérico ---------------------- */
  function initCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track) return;

    const wrapper = track.closest('[data-carousel]');
    const slides = $$('.carousel-slide', track);
    const prevBtn = $('.carousel-btn[data-dir="-1"]', wrapper);
    const nextBtn = $('.carousel-btn[data-dir="1"]', wrapper);

    // Gera os indicadores (dots) — um por slide
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para o item ${i + 1}`);
      dot.addEventListener('click', () => scrollToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$('button', dotsWrap);

    function slidesPerView() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(track.clientWidth / slideWidth));
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / slides[0].getBoundingClientRect().width);
    }

    function scrollToSlide(index) {
      const max = slides.length - slidesPerView();
      const clamped = Math.min(Math.max(index, 0), Math.max(max, 0));
      track.scrollTo({ left: clamped * slides[0].getBoundingClientRect().width, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    function updateDots() {
      const idx = currentIndex();
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }

    prevBtn.addEventListener('click', () => scrollToSlide(currentIndex() - 1));
    nextBtn.addEventListener('click', () => scrollToSlide(currentIndex() + 1));
    track.addEventListener('scroll', () => {
      window.clearTimeout(track._scrollTimeout);
      track._scrollTimeout = window.setTimeout(updateDots, 80);
    });
    window.addEventListener('resize', updateDots);

    updateDots();
  }

  initCarousel('portfolio-track', 'portfolio-dots');
  initCarousel('testimonials-track', 'testimonials-dots');

  /* ---------------------- 6. Formulário de contato ---------------------- */
  const form = $('#contact-form');
  const statusEl = $('#form-status');

  function validateField(id, condition, messageKey) {
    const field = $(`#${id}`);
    const errorEl = $(`#${id}-error`);
    const row = field.closest('.form-row');
    if (!condition) {
      row.classList.add('has-error');
      if (errorEl) errorEl.textContent = t(messageKey);
      return false;
    }
    row.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function validateForm() {
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validName = validateField('name', name.length > 1, 'contact.form.errorName');
    const validEmail = validateField('email', emailOk, 'contact.form.errorEmail');
    const validMessage = validateField('message', message.length > 4, 'contact.form.errorMessage');

    return validName && validEmail && validMessage;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) {
      statusEl.textContent = '';
      return;
    }

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const phone = $('#phone').value.trim();
    const message = $('#message').value.trim();
    const viaEmail = event.submitter && event.submitter.dataset.action === 'email';

    if (viaEmail) {
      // Sem backend próprio: usa mailto como canal direto de e-mail.
      const subject = encodeURIComponent(`Contato pelo site — ${name}`);
      const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\n\nMensagem:\n${message}`);
      window.location.href = `mailto:contato@deploydigital.com.br?subject=${subject}&body=${body}`;
    } else {
      // Sem backend próprio: envia o conteúdo do formulário como mensagem no WhatsApp.
      const text = encodeURIComponent(`Olá! Meu nome é ${name}.\nE-mail: ${email}\nTelefone: ${phone}\n\n${message}`);
      window.open(`https://wa.me/5511999999999?text=${text}`, '_blank', 'noopener');
    }

    statusEl.textContent = t('contact.form.success');
    form.reset();
  });

  /* ---------------------- 7. Modal de login ----------------------
     NOTA IMPORTANTE: este modal é apenas a interface visual da área do
     cliente. Não há autenticação real — para funcionar de fato, é preciso
     um backend (API + banco de dados) validando e-mail/senha e controlando
     sessão. Mantido aqui como ponto de partida para essa integração futura. */
  const loginModal = $('#login-modal');
  const loginForm = $('#login-form');
  let lastFocusedEl = null;

  function openLoginModal() {
    lastFocusedEl = document.activeElement;
    loginModal.hidden = false;
    $('#login-email').focus();
    document.addEventListener('keydown', onModalKeydown);
  }

  function closeLoginModal() {
    loginModal.hidden = true;
    document.removeEventListener('keydown', onModalKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function onModalKeydown(event) {
    if (event.key === 'Escape') closeLoginModal();
  }

  $('#login-open').addEventListener('click', openLoginModal);
  $('#login-open-2').addEventListener('click', openLoginModal);
  $('#login-close').addEventListener('click', closeLoginModal);
  loginModal.addEventListener('click', (event) => {
    if (event.target === loginModal) closeLoginModal();
  });
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert(t('login.pending'));
  });

  /* ---------------------- 8. Internacionalização (PT / EN / ZH) ---------------------- */
  const translations = {
    pt: {
      'a11y.skip': 'Pular para o conteúdo',
      'a11y.openMenu': 'Abrir menu',
      'a11y.prev': 'Anterior',
      'a11y.next': 'Próximo',
      'a11y.whatsapp': 'Falar no WhatsApp',

      'nav.home': 'Início', 'nav.about': 'Sobre', 'nav.services': 'Serviços',
      'nav.portfolio': 'Portfólio', 'nav.blog': 'Blog', 'nav.contact': 'Contato',
      'nav.location': 'Localização', 'nav.login': 'Entrar', 'nav.cta': 'Fale no WhatsApp',

      'hero.eyebrow': 'Desenvolvimento web full-stack',
      'hero.title': 'Da ideia ao deploy, sem atalhos.',
      'hero.subtitle': 'Criamos sites, sistemas e aplicativos rápidos, escaláveis e bonitos — pensados para funcionar de verdade, do primeiro clique ao crescimento do seu negócio.',
      'hero.cta.whatsapp': 'Falar no WhatsApp',
      'hero.cta.schedule': 'Agendar reunião',
      'hero.stat1.value': '100%', 'hero.stat1.label': 'Código próprio, sem atalhos de template',
      'hero.stat2.value': 'Full-stack', 'hero.stat2.label': 'Do front ao back, um time só',
      'hero.stat3.value': 'Suporte', 'hero.stat3.label': 'Manutenção contínua pós-entrega',

      'about.title': 'Quem coloca sua ideia no ar',
      'about.text': 'A Deploy Digital nasceu para encurtar a distância entre um bom plano e um produto digital funcionando. Somos um time full-stack: cuidamos do design, do código e da infraestrutura, para que o seu site, sistema ou aplicativo saia do papel — e continue evoluindo depois do lançamento.',
      'about.step1.title': 'Descoberta', 'about.step1.text': 'Entendemos seu negócio, seu público e o problema que o projeto precisa resolver.',
      'about.step2.title': 'Design', 'about.step2.text': 'Desenhamos uma experiência própria, alinhada à sua marca e fácil de usar.',
      'about.step3.title': 'Desenvolvimento', 'about.step3.text': 'Construímos com código limpo, performance e responsividade de verdade.',
      'about.step4.title': 'Deploy & suporte', 'about.step4.text': 'Publicamos, acompanhamos os resultados e seguimos evoluindo com você.',

      'services.title': 'Serviços',
      'services.subtitle': 'Escolha o ponto de partida — e fale com a gente para um orçamento sob medida.',
      'services.cta': 'Pedir orçamento',
      'services.sites.title': 'Sites institucionais', 'services.sites.text': 'Sites rápidos e responsivos que apresentam sua empresa e geram contato qualificado.',
      'services.systems.title': 'Sistemas web', 'services.systems.text': 'Plataformas e painéis sob medida para organizar e automatizar sua operação.',
      'services.apps.title': 'Aplicativos', 'services.apps.text': 'Apps web e mobile pensados para performance e uma boa experiência de uso.',
      'services.ecommerce.title': 'Loja virtual', 'services.ecommerce.text': 'Vitrine digital para vender seus produtos ou serviços com um checkout simples.',
      'services.maintenance.title': 'Manutenção & suporte', 'services.maintenance.text': 'Acompanhamento contínuo, atualizações e melhorias depois do site no ar.',
      'services.consulting.title': 'Consultoria digital', 'services.consulting.text': 'Diagnóstico e plano de ação para sua presença digital sair do lugar.',

      'portfolio.title': 'Portfólio',
      'portfolio.subtitle': 'Alguns projetos recentes — substitua pelos cases reais da Deploy Digital.',
      'portfolio.placeholder': 'Imagem do projeto',
      'portfolio.p1.title': 'Loja de moda online', 'portfolio.p1.text': 'E-commerce com catálogo dinâmico e checkout otimizado para conversão.',
      'portfolio.p2.title': 'Sistema de agendamento', 'portfolio.p2.text': 'Painel para clínicas organizarem consultas e reduzirem faltas.',
      'portfolio.p3.title': 'App de logística', 'portfolio.p3.text': 'Aplicativo para rastreio de entregas em tempo real.',
      'portfolio.p4.title': 'Site institucional', 'portfolio.p4.text': 'Presença digital para um escritório de advocacia, com foco em geração de leads.',

      'testimonials.title': 'O que dizem nossos clientes',
      'testimonials.t1.text': '"A equipe entendeu exatamente o que a gente precisava. O site ficou rápido e as vendas melhoraram já no primeiro mês."',
      'testimonials.t1.name': 'Cliente Deploy Digital', 'testimonials.t1.role': 'Loja de moda online',
      'testimonials.t2.text': '"Profissionais atenciosos do início ao fim. O sistema de agendamento resolveu um problema que tínhamos há anos."',
      'testimonials.t2.name': 'Cliente Deploy Digital', 'testimonials.t2.role': 'Clínica de estética',
      'testimonials.t3.text': '"Comunicação clara em cada etapa do projeto. Recomendo para quem quer um trabalho sério de verdade."',
      'testimonials.t3.name': 'Cliente Deploy Digital', 'testimonials.t3.role': 'Transportadora regional',

      'blog.title': 'Blog',
      'blog.subtitle': 'Conteúdo sobre tecnologia, direto daqui e do nosso Instagram.',
      'blog.placeholder': 'Imagem da postagem',
      'blog.p1.tag': 'Performance', 'blog.p1.title': '5 sinais de que seu site está lento', 'blog.p1.text': 'Como identificar (e corrigir) os principais gargalos de performance.',
      'blog.p2.tag': 'Negócios', 'blog.p2.title': 'Site ou sistema: por onde começar?', 'blog.p2.text': 'Um guia rápido para decidir o primeiro passo da sua presença digital.',
      'blog.p3.tag': 'Bastidores', 'blog.p3.title': 'Como organizamos um projeto, do briefing ao deploy', 'blog.p3.text': 'Um olhar por dentro do nosso processo de trabalho.',
      'blog.instagramNote': 'Acompanhe também as novidades no nosso Instagram.',
      'blog.instagramCta': 'Seguir no Instagram',

      'contact.title': 'Vamos colocar seu projeto no ar',
      'contact.subtitle': 'Preencha o formulário ou fale direto pelo WhatsApp — respondemos rápido.',
      'contact.form.name': 'Nome', 'contact.form.email': 'E-mail', 'contact.form.phone': 'Telefone / WhatsApp', 'contact.form.message': 'Mensagem',
      'contact.form.submitWhatsapp': 'Enviar pelo WhatsApp', 'contact.form.submitEmail': 'Enviar por e-mail',
      'contact.form.errorName': 'Digite seu nome.', 'contact.form.errorEmail': 'Digite um e-mail válido.', 'contact.form.errorMessage': 'Escreva sua mensagem.',
      'contact.form.success': 'Tudo certo! Abrimos o canal escolhido para você concluir o envio.',
      'contact.side.title': 'Outros canais', 'contact.side.whatsapp': 'WhatsApp', 'contact.side.email': 'E-mail', 'contact.side.instagram': 'Instagram',

      'location.title': 'Localização',
      'location.subtitle': 'Atendemos remotamente todo o Brasil — substitua o mapa abaixo pelo endereço real da Deploy Digital.',

      'footer.tagline': 'Da ideia ao deploy.', 'footer.rights': 'Todos os direitos reservados.',

      'login.title': 'Área do cliente', 'login.note': 'Em breve: acompanhe aqui o andamento do seu projeto.',
      'login.email': 'E-mail', 'login.password': 'Senha', 'login.submit': 'Entrar',
      'login.pending': 'A área do cliente ainda está em desenvolvimento. Em breve você poderá acompanhar seu projeto por aqui.'
    },

    en: {
      'a11y.skip': 'Skip to content',
      'a11y.openMenu': 'Open menu',
      'a11y.prev': 'Previous',
      'a11y.next': 'Next',
      'a11y.whatsapp': 'Chat on WhatsApp',

      'nav.home': 'Home', 'nav.about': 'About', 'nav.services': 'Services',
      'nav.portfolio': 'Portfolio', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
      'nav.location': 'Location', 'nav.login': 'Sign in', 'nav.cta': 'Chat on WhatsApp',

      'hero.eyebrow': 'Full-stack web development',
      'hero.title': 'From idea to deploy, no shortcuts.',
      'hero.subtitle': 'We build fast, scalable, beautiful websites, systems and apps — made to truly work, from the first click to the growth of your business.',
      'hero.cta.whatsapp': 'Chat on WhatsApp',
      'hero.cta.schedule': 'Book a meeting',
      'hero.stat1.value': '100%', 'hero.stat1.label': 'Original code, no template shortcuts',
      'hero.stat2.value': 'Full-stack', 'hero.stat2.label': 'Front to back, one team',
      'hero.stat3.value': 'Support', 'hero.stat3.label': 'Ongoing maintenance after launch',

      'about.title': 'Who gets your idea live',
      'about.text': 'Deploy Digital exists to shorten the distance between a good plan and a working digital product. We are a full-stack team: we handle design, code and infrastructure, so your site, system or app leaves the drawing board — and keeps evolving after launch.',
      'about.step1.title': 'Discovery', 'about.step1.text': 'We learn about your business, your audience, and the problem the project needs to solve.',
      'about.step2.title': 'Design', 'about.step2.text': 'We design an experience of its own, aligned with your brand and easy to use.',
      'about.step3.title': 'Development', 'about.step3.text': 'We build with clean code, real performance and true responsiveness.',
      'about.step4.title': 'Deploy & support', 'about.step4.text': 'We publish, track the results, and keep evolving with you.',

      'services.title': 'Services',
      'services.subtitle': 'Pick a starting point — and talk to us for a tailored quote.',
      'services.cta': 'Request a quote',
      'services.sites.title': 'Business websites', 'services.sites.text': 'Fast, responsive websites that present your company and generate qualified leads.',
      'services.systems.title': 'Web systems', 'services.systems.text': 'Custom platforms and dashboards to organize and automate your operation.',
      'services.apps.title': 'Apps', 'services.apps.text': 'Web and mobile apps built for performance and a great user experience.',
      'services.ecommerce.title': 'Online store', 'services.ecommerce.text': 'A digital storefront to sell your products or services with a simple checkout.',
      'services.maintenance.title': 'Maintenance & support', 'services.maintenance.text': 'Ongoing monitoring, updates and improvements after your site goes live.',
      'services.consulting.title': 'Digital consulting', 'services.consulting.text': 'A diagnosis and action plan to get your digital presence moving.',

      'portfolio.title': 'Portfolio',
      'portfolio.subtitle': 'A few recent projects — replace with Deploy Digital\u2019s real case studies.',
      'portfolio.placeholder': 'Project image',
      'portfolio.p1.title': 'Online fashion store', 'portfolio.p1.text': 'E-commerce with a dynamic catalog and a checkout optimized for conversion.',
      'portfolio.p2.title': 'Booking system', 'portfolio.p2.text': 'A dashboard for clinics to organize appointments and reduce no-shows.',
      'portfolio.p3.title': 'Logistics app', 'portfolio.p3.text': 'An app for real-time delivery tracking.',
      'portfolio.p4.title': 'Business website', 'portfolio.p4.text': 'A digital presence for a law firm, focused on lead generation.',

      'testimonials.title': 'What our clients say',
      'testimonials.t1.text': '"The team understood exactly what we needed. The site got fast and sales improved in the very first month."',
      'testimonials.t1.name': 'Deploy Digital client', 'testimonials.t1.role': 'Online fashion store',
      'testimonials.t2.text': '"Attentive professionals from start to finish. The booking system solved a problem we\u2019d had for years."',
      'testimonials.t2.name': 'Deploy Digital client', 'testimonials.t2.role': 'Aesthetics clinic',
      'testimonials.t3.text': '"Clear communication at every step of the project. I recommend them to anyone who wants serious, real work."',
      'testimonials.t3.name': 'Deploy Digital client', 'testimonials.t3.role': 'Regional carrier',

      'blog.title': 'Blog',
      'blog.subtitle': 'Content about technology, straight from here and from our Instagram.',
      'blog.placeholder': 'Post image',
      'blog.p1.tag': 'Performance', 'blog.p1.title': '5 signs your website is slow', 'blog.p1.text': 'How to spot (and fix) the main performance bottlenecks.',
      'blog.p2.tag': 'Business', 'blog.p2.title': 'Website or system: where to start?', 'blog.p2.text': 'A quick guide to deciding the first step of your digital presence.',
      'blog.p3.tag': 'Behind the scenes', 'blog.p3.title': 'How we run a project, from briefing to deploy', 'blog.p3.text': 'A look inside our workflow.',
      'blog.instagramNote': 'Also follow our updates on Instagram.',
      'blog.instagramCta': 'Follow on Instagram',

      'contact.title': 'Let\u2019s get your project live',
      'contact.subtitle': 'Fill out the form or message us directly on WhatsApp — we reply fast.',
      'contact.form.name': 'Name', 'contact.form.email': 'Email', 'contact.form.phone': 'Phone / WhatsApp', 'contact.form.message': 'Message',
      'contact.form.submitWhatsapp': 'Send via WhatsApp', 'contact.form.submitEmail': 'Send via email',
      'contact.form.errorName': 'Please enter your name.', 'contact.form.errorEmail': 'Please enter a valid email.', 'contact.form.errorMessage': 'Please write your message.',
      'contact.form.success': 'All set! We opened your chosen channel so you can finish sending it.',
      'contact.side.title': 'Other channels', 'contact.side.whatsapp': 'WhatsApp', 'contact.side.email': 'Email', 'contact.side.instagram': 'Instagram',

      'location.title': 'Location',
      'location.subtitle': 'We serve clients remotely across Brazil — replace the map below with Deploy Digital\u2019s real address.',

      'footer.tagline': 'From idea to deploy.', 'footer.rights': 'All rights reserved.',

      'login.title': 'Client area', 'login.note': 'Coming soon: track your project\u2019s progress here.',
      'login.email': 'Email', 'login.password': 'Password', 'login.submit': 'Sign in',
      'login.pending': 'The client area is still under development. Soon you\u2019ll be able to track your project here.'
    },

    zh: {
      'a11y.skip': '跳到主要内容',
      'a11y.openMenu': '打开菜单',
      'a11y.prev': '上一个',
      'a11y.next': '下一个',
      'a11y.whatsapp': '通过WhatsApp联系',

      'nav.home': '首页', 'nav.about': '关于我们', 'nav.services': '服务',
      'nav.portfolio': '作品集', 'nav.blog': '博客', 'nav.contact': '联系我们',
      'nav.location': '位置', 'nav.login': '登录', 'nav.cta': '通过WhatsApp联系',

      'hero.eyebrow': '全栈网站开发',
      'hero.title': '从创意到上线，一步到位。',
      'hero.subtitle': '我们打造快速、可扩展且精美的网站、系统与应用程序——从第一次点击到业务成长，都能真正发挥作用。',
      'hero.cta.whatsapp': '通过WhatsApp联系',
      'hero.cta.schedule': '预约会议',
      'hero.stat1.value': '100%', 'hero.stat1.label': '原创代码，拒绝模板',
      'hero.stat2.value': '全栈团队', 'hero.stat2.label': '前后端一体，一个团队搞定',
      'hero.stat3.value': '持续支持', 'hero.stat3.label': '上线后持续维护',

      'about.title': '把你的创意变为现实',
      'about.text': 'Deploy Digital 致力于缩短好想法与真正可运行的数字产品之间的距离。我们是一支全栈团队：负责设计、代码与基础架构，让你的网站、系统或应用从构思落地——并在上线后持续进化。',
      'about.step1.title': '需求发现', 'about.step1.text': '了解你的业务、目标用户，以及项目需要解决的问题。',
      'about.step2.title': '设计', 'about.step2.text': '打造符合你品牌调性、易于使用的独特体验。',
      'about.step3.title': '开发', 'about.step3.text': '使用整洁的代码，实现真正的性能与响应式效果。',
      'about.step4.title': '上线与支持', 'about.step4.text': '发布项目，追踪成效，并与你一起持续优化。',

      'services.title': '服务项目',
      'services.subtitle': '选择一个起点——联系我们获取定制报价。',
      'services.cta': '获取报价',
      'services.sites.title': '企业官网', 'services.sites.text': '快速、响应式的网站，展示企业形象并带来优质咨询。',
      'services.systems.title': 'Web系统', 'services.systems.text': '定制化平台与管理后台，助力业务组织与自动化。',
      'services.apps.title': '应用程序', 'services.apps.text': '注重性能与体验的Web及移动应用。',
      'services.ecommerce.title': '在线商店', 'services.ecommerce.text': '简洁结账流程的数字化店铺，用于销售产品或服务。',
      'services.maintenance.title': '维护与支持', 'services.maintenance.text': '网站上线后的持续监测、更新与优化。',
      'services.consulting.title': '数字化咨询', 'services.consulting.text': '为你的数字化布局提供诊断与行动方案。',

      'portfolio.title': '作品集',
      'portfolio.subtitle': '近期部分项目——请替换为Deploy Digital的真实案例。',
      'portfolio.placeholder': '项目图片',
      'portfolio.p1.title': '在线时尚商店', 'portfolio.p1.text': '拥有动态商品目录、结账流程针对转化率优化的电商网站。',
      'portfolio.p2.title': '预约系统', 'portfolio.p2.text': '帮助诊所安排预约、减少爽约的管理后台。',
      'portfolio.p3.title': '物流应用', 'portfolio.p3.text': '用于实时追踪配送状态的应用程序。',
      'portfolio.p4.title': '企业官网', 'portfolio.p4.text': '为一家律师事务所打造的数字形象，专注于获客。',

      'testimonials.title': '客户评价',
      'testimonials.t1.text': '"团队完全理解我们的需求。网站变得更快，第一个月销售额就有所提升。"',
      'testimonials.t1.name': 'Deploy Digital 客户', 'testimonials.t1.role': '在线时尚商店',
      'testimonials.t2.text': '"从始至终都非常专业细致。预约系统解决了我们多年的难题。"',
      'testimonials.t2.name': 'Deploy Digital 客户', 'testimonials.t2.role': '美容诊所',
      'testimonials.t3.text': '"项目每个阶段沟通都很清晰。推荐给真正想做好项目的人。"',
      'testimonials.t3.name': 'Deploy Digital 客户', 'testimonials.t3.role': '区域物流公司',

      'blog.title': '博客',
      'blog.subtitle': '关于技术的内容，来自本站与我们的Instagram。',
      'blog.placeholder': '文章图片',
      'blog.p1.tag': '性能', 'blog.p1.title': '网站变慢的5个信号', 'blog.p1.text': '如何发现（并解决）主要的性能瓶颈。',
      'blog.p2.tag': '商业', 'blog.p2.title': '网站还是系统：从哪里开始？', 'blog.p2.text': '快速指南，帮你决定数字化布局的第一步。',
      'blog.p3.tag': '幕后花絮', 'blog.p3.title': '我们如何管理项目：从需求到上线', 'blog.p3.text': '深入了解我们的工作流程。',
      'blog.instagramNote': '也可以在Instagram上关注我们的最新动态。',
      'blog.instagramCta': '在Instagram上关注',

      'contact.title': '让我们把你的项目上线',
      'contact.subtitle': '填写表单，或直接通过WhatsApp联系我们——我们会快速回复。',
      'contact.form.name': '姓名', 'contact.form.email': '邮箱', 'contact.form.phone': '电话 / WhatsApp', 'contact.form.message': '留言',
      'contact.form.submitWhatsapp': '通过WhatsApp发送', 'contact.form.submitEmail': '通过邮箱发送',
      'contact.form.errorName': '请输入你的姓名。', 'contact.form.errorEmail': '请输入有效的邮箱地址。', 'contact.form.errorMessage': '请填写留言内容。',
      'contact.form.success': '已就绪！我们已为你打开所选渠道，请完成发送。',
      'contact.side.title': '其他联系方式', 'contact.side.whatsapp': 'WhatsApp', 'contact.side.email': '邮箱', 'contact.side.instagram': 'Instagram',

      'location.title': '位置',
      'location.subtitle': '我们为全巴西提供远程服务——请将下方地图替换为Deploy Digital的真实地址。',

      'footer.tagline': '从创意到上线。', 'footer.rights': '版权所有。',

      'login.title': '客户中心', 'login.note': '即将上线：在此追踪你的项目进度。',
      'login.email': '邮箱', 'login.password': '密码', 'login.submit': '登录',
      'login.pending': '客户中心功能仍在开发中，敬请期待，未来可在此追踪你的项目进度。'
    }
  };

  let currentLang = localStorage.getItem('dd-lang') || 'pt';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.pt[key] || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : (currentLang === 'zh' ? 'zh-CN' : 'en');

    $$('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    $$('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });

    $$('.lang-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
    });
  }

  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('dd-lang', currentLang);
      applyTranslations();
    });
  });

  applyTranslations();

});

/* ==========================================================================
   NOTAS PARA A PRÓXIMA ETAPA (fora do escopo de um site estático):
   - Área do cliente (login): precisa de backend com autenticação e banco
     de dados para funcionar de verdade. A interface já está pronta acima.
   - Loja virtual: aqui os "produtos" são os próprios serviços, vendidos via
     WhatsApp. Um carrinho com pagamento online exigiria backend + gateway
     de pagamento (Stripe, Mercado Pago, Pagar.me etc.).
   - Blog integrado ao Instagram: a Instagram Graph API exige autenticação
     server-side (token de acesso não pode ficar exposto no front-end).
     O ideal é buscar os posts em um pequeno backend/serverless e servir os
     dados prontos para este script consumir.
   ========================================================================== */
