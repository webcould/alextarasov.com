(() => {
  const links = [
    ['Home', 'index.html'], ['About', 'about.html'], ['Engineering', 'engineering.html'],
    ['Writing', 'writing.html'], ['Travel', 'travel.html'], ['Now', 'now.html'], ['Contact', 'contact.html']
  ];
  const routePage = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const current = routePage === 'travel-country.html' ? 'travel.html' : routePage;
  let navigationAttempt = 0;
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, location.href);
    if (destination.protocol !== location.protocol || destination.origin !== location.origin || destination.pathname === location.pathname) return;
    const siteScript = [...document.scripts].find(script => /assets\/js\/site\.js(?:\?|$)/.test(script.src));
    const scriptPath = siteScript ? new URL(siteScript.src, location.href).pathname : '/assets/js/site.js';
    const rootPath = scriptPath.replace(/assets\/js\/site\.js$/, '');
    const pagePath = destination.pathname.startsWith(rootPath) ? destination.pathname.slice(rootPath.length) : destination.pathname.replace(/^\/+/, '');
    const route = pagePath.replace(/\/index\.html?$/i, '').replace(/^index\.html?$/i, '').replace(/\.html?$/i, '').replace(/^\/+|\/+$/g, '');
    const command = `cd ${route ? `~/${route}` : '~'}`;
    event.preventDefault();
    const attempt = ++navigationAttempt;
    if (!header) { location.assign(destination.href); return; }
    let line = header.nextElementSibling;
    if (!line || !line.classList.contains('transition-terminal')) {
      line = document.createElement('div');
      line.className = 'transition-terminal';
      line.setAttribute('aria-hidden', 'true');
      header.insertAdjacentElement('afterend', line);
    }
    line.replaceChildren();
    const prompt = document.createElement('span');
    prompt.className = 'terminal-command';
    prompt.textContent = 'alex@berlin ~ % ';
    const typedCommand = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    line.append(prompt, typedCommand, cursor);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navigate = () => { if (attempt === navigationAttempt) location.assign(destination.href); };
    if (reduced) {
      typedCommand.textContent = command;
      window.setTimeout(navigate, 260);
    } else {
      let position = 0;
      const typeCharacter = () => {
        if (attempt !== navigationAttempt) return;
        typedCommand.textContent += command.charAt(position++);
        if (position < command.length) window.setTimeout(typeCharacter, 42);
        else window.setTimeout(navigate, 210);
      };
      window.setTimeout(typeCharacter, 90);
    }
  });
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const nav = links.map(([label, href]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    header.innerHTML = `<div class="masthead-inner"><a class="brand" href="index.html">Alexander Tarasov</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">Menu</button></div><nav class="nav" id="site-navigation" aria-label="Main navigation">${nav}</nav>`;
    const button = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.nav');
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'Menu';
      menu.classList.toggle('is-open', open);
    });

  }
  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.innerHTML = '<span>© 2026 Alexander Tarasov · Berlin</span><div class="footer-tools"><label class="language-label" for="language-select">Language</label><select class="language-select" id="language-select" aria-label="Choose language"><option value="en" selected>English</option><option value="ru">Русский</option></select><span class="footer-social"><a href="https://www.instagram.com/alexistravelling/" target="_blank" rel="me noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></svg>Instagram</a><a href="https://www.linkedin.com/in/meetalextrasov/" target="_blank" rel="me noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 9v10"/></svg>LinkedIn</a><a href="mailto:contact@alextarasov.com"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>Email</a></span></div>';
    const languageSelect = footer.querySelector('.language-select');
    languageSelect.addEventListener('change', () => {
      if (languageSelect.value !== 'ru') return;
      languageSelect.value = 'en';
      const greeting = document.createElement('div');
      greeting.className = 'russian-greeting';
      greeting.setAttribute('aria-hidden', 'true');
      greeting.textContent = 'Привет';
      document.body.append(greeting);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.setTimeout(() => greeting.remove(), reducedMotion ? 350 : 2300);

      let dialog = document.querySelector('#language-joke');
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'language-joke';
        dialog.className = 'language-dialog';
        dialog.setAttribute('aria-labelledby', 'language-dialog-title');
        dialog.innerHTML = `<div class="language-dialog-titlebar"><span class="dialog-lights" aria-hidden="true"><i></i><i></i><i></i></span><span id="language-dialog-title">Language Error</span><button class="dialog-close" type="button" aria-label="Close">×</button></div><div class="language-dialog-content"><div class="error-symbol" aria-hidden="true">!</div><p class="error-copy" tabindex="0">I do speak Russian, but this website is English-only.<span class="error-translation" lang="ru">Я говорю по-русски, но этот сайт только на английском.</span></p><button class="dialog-ok" type="button">OK</button></div></dialog>`;
        document.body.append(dialog);
        const closeDialog = () => dialog.close();
        dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
        dialog.querySelector('.dialog-ok').addEventListener('click', closeDialog);
        dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
      }
      if (!dialog.open) window.setTimeout(() => dialog.showModal(), reducedMotion ? 250 : 2150);
    });
  }

  const contactCommand = document.querySelector('[data-contact-command]');
  const contactOutput = document.querySelector('[data-contact-output]');
  const contactThinking = document.querySelector('[data-contact-thinking]');
  if (contactCommand && contactOutput) {
    const command = contactCommand.getAttribute('data-contact-command') || '';
    contactOutput.hidden = true;
    contactCommand.textContent = '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      contactCommand.textContent = command;
      if (contactThinking) contactThinking.hidden = false;
      window.setTimeout(() => {
        if (contactThinking) contactThinking.hidden = true;
        contactOutput.hidden = false;
      }, 650);
    } else {
      let position = 0;
      const typeContactCommand = () => {
        contactCommand.textContent += command.charAt(position++);
        if (position < command.length) window.setTimeout(typeContactCommand, 90);
        else {
          if (contactThinking) contactThinking.hidden = false;
          window.setTimeout(() => {
            if (contactThinking) contactThinking.hidden = true;
            contactOutput.hidden = false;
          }, 650);
        }
      };
      window.setTimeout(typeContactCommand, 240);
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lifeSeconds = document.querySelector('[data-life-seconds]');
  if (lifeSeconds) {
    let elapsedSeconds = 0;
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let dateSeed = 2166136261;
    for (const character of dateKey) dateSeed = Math.imul(dateSeed ^ character.charCodeAt(0), 16777619) >>> 0;
    const dailyRange = 30 * 24 * 60 * 60;
    const startingSeconds = 978265512 + (dateSeed % dailyRange) - Math.floor(dailyRange / 2);
    const updateLifeCounter = () => {
      lifeSeconds.textContent = new Intl.NumberFormat('en-GB').format(startingSeconds + elapsedSeconds++);
      lifeSeconds.classList.remove('is-ticking');
      void lifeSeconds.offsetWidth;
      lifeSeconds.classList.add('is-ticking');
    };
    updateLifeCounter();
    window.setInterval(updateLifeCounter, 1000);
  }
  const typePageHeading = heading => {
    if (!heading || heading.hasAttribute('data-heading-trail') || heading.dataset.headingTyped || prefersReducedMotion) return;
    const text = heading.textContent.trim();
    if (!text || text === 'Loading country…') return;
    heading.dataset.headingTyped = 'true';
    heading.setAttribute('aria-label', text);
    heading.textContent = '';
    heading.classList.add('is-typing');
    let index = 0;
    const typeNextCharacter = () => {
      heading.textContent += text.charAt(index++);
      if (index < text.length) window.setTimeout(typeNextCharacter, 38);
      else {
        heading.classList.remove('is-typing');
        heading.removeAttribute('aria-label');
      }
    };
    window.setTimeout(typeNextCharacter, 220);
  };
  window.typePageHeading = typePageHeading;
  document.querySelectorAll('.page-intro h1').forEach(typePageHeading);

  const typed = [...document.querySelectorAll('[data-type-text]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typed.length && !reducedMotion) {
    typed.forEach(node => node.closest('[data-terminal-row]')?.setAttribute('hidden', ''));
    typed.forEach(node => { node.textContent = ''; });
    let line = 0;
    const typeNext = () => {
      if (line >= typed.length) return;
      const node = typed[line];
      node.closest('[data-terminal-row]')?.removeAttribute('hidden');
      const value = node.getAttribute('data-type-text') || '';
      let char = 0;
      const typeChar = () => {
        node.textContent += value.charAt(char++);
        if (char < value.length) window.setTimeout(typeChar, 32 + Math.random() * 27);
        else { line++; window.setTimeout(typeNext, node.classList.contains('terminal-output') ? 240 : 170); }
      };
      typeChar();
    };
    window.setTimeout(typeNext, 320);
  }
})();
