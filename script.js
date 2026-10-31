/* Enhance the static page without hiding content behind a loading screen. */
(() => {
  const clock = document.querySelector('#localClock');
  function tick() {
    if (!clock) return;
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const time = now.toLocaleTimeString('en-IN', { ...options, hour: 'numeric', minute: '2-digit' });
    const date = now.toLocaleDateString('en-GB', { ...options, day: 'numeric', month: 'long' });
    clock.textContent = `${time} • ${date}`;
  }
  tick();
  setInterval(tick, 60000);

  const menu = document.querySelector('#siteMenu');
  const toggle = document.querySelector('.menu-toggle');
  const close = document.querySelector('.menu-close');
  if (menu && toggle && close) {
    function setMenu(open, restoreFocus = true) {
      menu.hidden = !open;
      menu.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      if (open) close.focus();
      else if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    close.addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      setMenu(false, false);
      const target = document.querySelector(link.hash);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }));
    document.addEventListener('keydown', event => {
      if (menu.hidden) return;
      if (event.key === 'Escape') setMenu(false);
      if (event.key === 'Tab') {
        const items = [...menu.querySelectorAll('button, a[href]')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });
  }
  const themeSwitch = document.querySelector('.theme-cord');
  if (themeSwitch) themeSwitch.addEventListener('click', () => {
    const dark = document.documentElement.dataset.mode !== 'dark';
    document.documentElement.dataset.mode = dark ? 'dark' : 'light';
    themeSwitch.setAttribute('aria-checked', String(dark));
    themeSwitch.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#201d1d' : '#e8e4e0';
  });
  const calendar = document.querySelector('.skill-calendar');
  if (calendar) {
    const skills = ['Embedded systems', 'IoT & sensors', 'C & Python', 'Biomedical devices'];
    let index = 0;
    calendar.addEventListener('click', () => {
      index = (index + 1) % skills.length;
      const word = calendar.querySelector('.calendar-word');
      word.textContent = skills[index];
      word.classList.remove('flipping');
      void word.offsetWidth;
      word.classList.add('flipping');
      calendar.querySelector('.calendar-number').textContent = `0${index + 1} / 04`;
    });
  }
  const dialog = document.querySelector('.ability-dialog');
  if (dialog) {
    document.querySelector('.ability-button').addEventListener('click', () => dialog.showModal());
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('a').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
