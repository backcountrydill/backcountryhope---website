
(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      const label = menuButton.querySelector('.sr-only');
      if (label) label.textContent = isOpen ? 'Close navigation' : 'Open navigation';
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const requestForm = document.querySelector('[data-request-form]');
  if (requestForm) {
    const status = requestForm.querySelector('[data-form-status]');
    requestForm.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(requestForm);
      const request = [
        'BACK COUNTRY HOPE REQUEST',
        '--------------------------',
        `Name: ${data.get('name') || 'Not provided'}`,
        `Preferred reply method: ${data.get('reply') || 'Not provided'}`,
        `Request type: ${data.get('type') || 'General message'}`,
        '',
        String(data.get('message') || '').trim()
      ].join('\n');
      try {
        await navigator.clipboard.writeText(request);
        status.textContent = 'Your request was copied. Paste it into Discord, Instagram, or Facebook using the links beside the form.';
      } catch (error) {
        status.textContent = 'Copy was blocked by your browser. Select your message and copy it manually, then send it through one of the contact links.';
      }
    });
  }
})();
