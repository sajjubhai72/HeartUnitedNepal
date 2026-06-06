/* ============================================================
   Hearts United Nepal Org — main.js  (shared across all pages)
   ============================================================ */
'use strict';

/* ── DOM refs ── */
const navbar       = document.getElementById('navbar');
const menuBtn      = document.getElementById('menuBtn');
const mobileCanvas = document.getElementById('mobileCanvas');
const overlay      = document.getElementById('canvasOverlay');
const scrollTopBtn = document.getElementById('scrollTop');

/* ================================================================
   MOBILE CANVAS
   ================================================================ */
function openCanvas()  {
  mobileCanvas.classList.remove('translate-x-full');
  overlay.classList.remove('opacity-0','pointer-events-none');
  overlay.classList.add('opacity-100');
  menuBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCanvas() {
  mobileCanvas.classList.add('translate-x-full');
  overlay.classList.add('opacity-0','pointer-events-none');
  overlay.classList.remove('opacity-100');
  menuBtn.classList.remove('open');
  document.body.style.overflow = '';
}
menuBtn?.addEventListener('click', () => {
  mobileCanvas.classList.contains('translate-x-full') ? openCanvas() : closeCanvas();
});
document.getElementById('closeCanvas')?.addEventListener('click', closeCanvas);
overlay?.addEventListener('click', closeCanvas);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeCanvas(); });

/* ================================================================
   NAVBAR scroll hide/show + shadow
   ================================================================ */
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', y > 10);
    navbar.style.transform = (y > 80 && y > lastY) ? 'translateY(-100%)' : 'translateY(0)';
  }
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
  lastY = y;
});

/* ================================================================
   ACTIVE NAV LINK  — highlights current page
   ================================================================ */
const currentPage = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-link, .canvas-link').forEach(a => {
  const href = a.getAttribute('href');
  const pagePath = currentPage === '' ? '/' : currentPage;
  if (href === pagePath ||
      (pagePath === '/' && href === '/') ||
      (pagePath !== '/' && href !== '/' && pagePath.startsWith(href))) {
    a.classList.add('active');
  }
});

/* ================================================================
   SMART LINKS — local dev uses .html, production uses clean URLs
   ================================================================ */
(function() {
  var hostname = location.hostname;
  var isLocal  = hostname === '127.0.0.1' || hostname === 'localhost' || location.protocol === 'file:';
  // GitHub Pages: username.github.io (not custom domain)
  var isGHPages = hostname.endsWith('github.io');

  if (!isLocal && !isGHPages) return; // Netlify/Vercel: clean URLs work natively

  document.querySelectorAll('a[href]').forEach(function(a) {
    var href = a.getAttribute('href');
    // rewrite /about → about.html  (or /RepoName/about → /RepoName/about.html)
    var match = href.match(/^(.*?)\/(about|programs|gallery|team|volunteer|donate|contact)$/);
    if (match) {
      a.setAttribute('href', match[1] + '/' + match[2] + '.html');
    } else if (href === '/') {
      // root → index.html (for local) or keep / for GH Pages
      if (isLocal) a.setAttribute('href', 'index.html');
    }
  });
})();

/* ================================================================
   SCROLL-TO-TOP
   ================================================================ */
scrollTopBtn?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ================================================================
   COUNTER ANIMATION
   ================================================================ */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step     = Math.ceil(target / (duration / 16));
    let current    = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(t); }
      el.textContent = current.toLocaleString();
    }, 16);
  });
}
const heroSec = document.querySelector('[data-counter-trigger]');
if (heroSec) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if(e.isIntersecting){ animateCounters(); obs.unobserve(e.target); } });
  }, {threshold:.3}).observe(heroSec);
} else {
  // fallback: run on load
  window.addEventListener('load', animateCounters);
}

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('revealed'), i * 80);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.program-card,.team-card,.feature-card,.gallery-item,.contact-info-card,.reveal-item'
).forEach(el => { el.classList.add('reveal'); revObs.observe(el); });

/* ================================================================
   DONATION AMOUNT SELECTOR
   ================================================================ */
document.querySelectorAll('.donate-amt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.donate-amt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const wrap = document.getElementById('customAmtWrap');
    if (wrap) wrap.classList.toggle('hidden', btn.dataset.amount !== 'custom');
    if (btn.dataset.amount === 'custom') document.getElementById('customAmt')?.focus();
  });
});

/* ================================================================
   TOAST HELPER
   ================================================================ */
function showToast(msg, type='success') {
  const t = document.createElement('div');
  t.className = `fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-xl transition-all duration-300 ${
    type==='success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 3200);
}

/* ================================================================
   FORM SUBMISSIONS
   ================================================================ */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault(); showToast('✓ Message sent! We will reply soon.'); e.target.reset();
});
document.getElementById('volunteerForm')?.addEventListener('submit', e => {
  e.preventDefault(); showToast('✓ Application submitted! Thank you.'); e.target.reset();
});
// donateForm is handled in donate.html inline script (opens payment modal)
document.getElementById('newsletterForm')?.addEventListener('submit', e => {
  e.preventDefault(); showToast('✓ Subscribed to newsletter!'); e.target.reset();
});

/* ================================================================
   SMOOTH SCROLL (same-page anchors)
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - (navbar?.offsetHeight||70) - 8, behavior:'smooth' });
    }
  });
});

/* ================================================================
   GALLERY LIGHTBOX
   ================================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      const lbImg = document.getElementById('lightboxImg');
      if (lbImg && src) { lbImg.src = src; lightbox.classList.remove('hidden'); }
    });
  });
  document.getElementById('closeLightbox')?.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', e => { if(e.target===lightbox) lightbox.classList.add('hidden'); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') lightbox.classList.add('hidden'); });
}
