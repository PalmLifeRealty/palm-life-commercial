/* ============================================================
   OUTLOOK WAY — JAVASCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initVideo();
  initNav();
  initReveal();
  initExitTabs();
  initCharts();
  initForm();
});

/* ── Video ── */
function initVideo() {
  const v = document.getElementById('heroVideo');
  if (!v) return;
  v.load();
  const p = v.play();
  if (p !== undefined) {
    p.catch(() => {
      const play = () => { v.play(); document.removeEventListener('click', play); };
      document.addEventListener('click', play, { once: true });
    });
  }
}

/* ── Navigation ── */
function initNav() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── Reveal on scroll ── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Exit strategy tabs ── */
function initExitTabs() {
  const tabs = document.querySelectorAll('.exit-tab');
  const panels = document.querySelectorAll('.exit-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

/* ── Charts ── */
function initCharts() {
  const noiCtx = document.getElementById('noiChart');
  if (!noiCtx) return;

  new Chart(noiCtx, {
    type: 'bar',
    data: {
      labels: ['Townhome STR (12 units)', 'Boutique Hotel (7 keys)', 'Retail + Hotel Lobby'],
      datasets: [{
        label: 'Annual NOI',
        data: [1379641, 270432, 211300],
        backgroundColor: [
          'rgba(184,152,63,0.75)',
          'rgba(184,152,63,0.5)',
          'rgba(184,152,63,0.3)',
        ],
        borderColor: ['#B8983F', '#B8983F', '#B8983F'],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' $' + ctx.raw.toLocaleString() + ' NOI'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#7A8FA8',
            callback: v => '$' + (v/1000).toFixed(0) + 'K'
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7A8FA8', font: { size: 11 } }
        }
      }
    }
  });
}

/* ── Form ── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('btnLabel').style.display = 'none';
    document.getElementById('btnSpin').style.display = 'inline-flex';
    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    }, 1400);
  });
}
