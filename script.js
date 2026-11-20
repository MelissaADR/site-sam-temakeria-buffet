// Atualize este número com o WhatsApp oficial da SAM, somente dígitos e DDI.
const WHATSAPP_NUMBER = '5500000000000';

const menuToggle = document.querySelector('.menu-toggle'), nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen)); menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('is-open', !isOpen); document.body.classList.toggle('menu-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open'); document.body.classList.remove('menu-open');
  }));
}

// Mantém os links de WhatsApp em um único lugar para facilitar a alteração futura.
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => { link.href = link.href.replace('5500000000000', WHATSAPP_NUMBER); });

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

function animateNumber(element) {
  const goal = Number(element.dataset.count), suffix = element.dataset.suffix || '', duration = 1450, start = performance.now();
  function tick(now) { const progress = Math.min((now - start) / duration, 1), eased = 1 - ((1 - progress) ** 3); element.textContent = `${Math.floor(goal * eased)}${suffix}`; if (progress < 1) requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries, observer) => { if (!entries[0].isIntersecting) return; statsBar.querySelectorAll('[data-count]').forEach(animateNumber); observer.unobserve(statsBar); }, { threshold: 0.55 });
  statsObserver.observe(statsBar);
}

const track = document.querySelector('.service-track');
if (track) {
  const serviceStep = () => Math.max(track.clientWidth * .52, 300);
  const moveServices = (direction) => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8, atStart = track.scrollLeft <= 8;
    if ((direction > 0 && atEnd) || (direction < 0 && atStart)) { track.scrollTo({ left: direction > 0 ? 0 : track.scrollWidth, behavior: 'smooth' }); return; }
    track.scrollBy({ left: serviceStep() * direction, behavior: 'smooth' });
  };

  document.querySelector('.slider-button.prev')?.addEventListener('click', () => moveServices(-1));
  document.querySelector('.slider-button.next')?.addEventListener('click', () => moveServices(1));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let serviceTimer;
    const startAutoplay = () => { window.clearInterval(serviceTimer); serviceTimer = window.setInterval(() => moveServices(1), 4800); };
    const pauseAutoplay = () => window.clearInterval(serviceTimer);
    ['mouseenter', 'focusin', 'touchstart'].forEach((event) => track.addEventListener(event, pauseAutoplay, { passive: true }));
    ['mouseleave', 'focusout'].forEach((event) => track.addEventListener(event, startAutoplay));
    startAutoplay();
  }
}

// Mantém apenas uma resposta de FAQ aberta por vez, sem impedir que o usuário a feche.
document.querySelectorAll('.accordion details').forEach((item) => { item.addEventListener('toggle', () => { if (!item.open) return; document.querySelectorAll('.accordion details').forEach((other) => { if (other !== item) other.open = false; }); }); });

const form = document.querySelector('#quote-form');
if (form) {
  const message = form.querySelector('.form-message');
  form.addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(form); const name = (data.get('nome') || '').trim().split(' ')[0]; message.textContent = `Obrigada, ${name}! Recebemos seu pedido e retornaremos em até 24 horas úteis.`; form.reset(); });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();