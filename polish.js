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
  const elements = document.querySelectorAll('.section-heading,.gallery-card,.why-columns article,.feature-list article,.plan,.about-story');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if (!reduce.matches) entry.target.animate([{transform:'translateY(18px)',opacity:.75},{transform:'translateY(0)',opacity:1}], {duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});
  }), {threshold:.08});
  elements.forEach(element => observer.observe(element));
  const jumps = new Set();
  window.mopixyConceptFeedback = () => {
    const preview = document.querySelector('.creator-preview');
    if (mobile.matches) {
      document.querySelector('#concept-prompt').blur();
      preview.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'});
    }
    if (reduce.matches) return;
    const phone = document.querySelector('#concept-phone');
    phone.classList.remove('concept-updated'); void phone.offsetWidth; phone.classList.add('concept-updated');
    preview.querySelectorAll('.concept-pixel').forEach(p=>p.remove());
    for (let i=0;i<8;i++) {
      const p=document.createElement('span');p.className='concept-pixel';p.setAttribute('aria-hidden','true');
      p.style.setProperty('--px',Math.round(Math.cos(i*Math.PI/4)*135)+'px');
      p.style.setProperty('--py',Math.round(Math.sin(i*Math.PI/4)*100)-30+'px');
      preview.append(p);
      const timer=setTimeout(()=>{p.remove();jumps.delete(timer)},700);jumps.add(timer);
    }
  };
  document.querySelector('#concept-phone').addEventListener('animationend', e=>{if(e.animationName==='concept-nod')e.currentTarget.classList.remove('concept-updated')});
})();
