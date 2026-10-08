(() => {
  const header = document.querySelector('.header');
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 1000px)');
  function close() { header.classList.remove('menu-open'); button.setAttribute('aria-expanded', 'false'); }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open)); header.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { close(); button.focus(); } });
  document.addEventListener('click', e => { if (!header.contains(e.target)) close(); });
  header.addEventListener('focusout', e => { if (!header.contains(e.relatedTarget)) close(); });
  mobile.addEventListener('change', close);
  const elements = document.querySelectorAll('.section-heading,.gallery-card,.why-columns article,.feature-list article,.plan');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if (!reduce.matches) entry.target.animate([{transform:'translateY(18px)',opacity:.75},{transform:'translateY(0)',opacity:1}], {duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});
  }), {threshold:.08});
  elements.forEach(element => observer.observe(element));
})();
