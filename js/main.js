/* ═══════════════════════════════════════════════════════════════
   PALM LIFE COMMERCIAL — Main JS
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ─── 1. NAV ─── */
(function () {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMobile');

  if (!nav) return;

  /* Scroll state */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 36);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile toggle */
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    /* Close on link click */
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();


/* ─── 2. SCROLL ANIMATIONS (IntersectionObserver) ─── */
(function () {
  /* Lower threshold so items reveal faster; rootMargin pre-reveals below fold */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* Immediate fallback: mark everything in the initial viewport as visible right away */
  function revealInitial() {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible');
      }
    });
  }
  revealInitial();
  /* Also fire once after a short delay in case layout isn't settled yet */
  setTimeout(revealInitial, 300);
})();


/* ─── 3. HERO VIDEO AUTOPLAY ─── */
/* preload="metadata" keeps initial load fast.
   We trigger play after the page is interactive. */
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  function tryPlay() {
    video.play().catch(() => {
      /* Autoplay blocked (uncommon with muted) — silently ignore */
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryPlay();
  } else {
    document.addEventListener('DOMContentLoaded', tryPlay);
  }
})();


/* ─── 4. SMOOTH SCROLL ─── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (document.getElementById('mainNav')?.offsetHeight || 68);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── 5. STAT COUNTER ANIMATION ─── */
(function () {
  /* Elements with numeric content */
  const targets = document.querySelectorAll('.trs-num, .hb-item strong');
  if (!targets.length) return;

  function parse(str) {
    const m = str.match(/^([\$]?)([\d.]+)([M+K%\s\w\-]*)$/);
    return m ? { pre: m[1], val: parseFloat(m[2]), suf: m[3], raw: str } : null;
  }

  function animate(el, p, dur = 1400) {
    const start = performance.now();
    const update = now => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const cur = p.val * ease;
      const disp = p.val < 20 ? (Math.round(cur * 10) / 10) : Math.round(cur).toLocaleString();
      el.textContent = `${p.pre}${disp}${p.suf}`;
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = p.raw;
    };
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        const p = parse(e.target.textContent.trim());
        if (p) animate(e.target, p);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  targets.forEach(el => io.observe(el));
})();


/* ─── 6. CONTACT FORM ─── */
(function () {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const label   = document.getElementById('btnLabel');
  const spin    = document.getElementById('btnSpin');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = {
      fullName:   form.fullName.value.trim(),
      email:      form.email.value.trim(),
      interest:   form.interest.value,
      message:    form.message.value.trim(),
      submittedAt: new Date().toISOString(),
    };

    /* Loading state */
    label.style.display = 'none';
    spin.style.display  = 'inline-flex';
    btn.disabled = true;

    try {
      const res = await fetch('tables/plc_inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();

      form.style.display  = 'none';
      success.classList.add('visible');

    } catch {
      label.style.display = 'inline';
      spin.style.display  = 'none';
      btn.disabled = false;
      showError('Submission error. Please email us directly at commercial@palmliferealty.com');
    }
  });

  function showError(msg) {
    let el = document.getElementById('formErr');
    if (!el) {
      el = Object.assign(document.createElement('p'), {
        id: 'formErr',
        style: 'margin-top:10px;font-size:.82rem;color:#dc2626;line-height:1.5;',
      });
      btn.after(el);
    }
    el.textContent = msg;
  }
})();


/* ─── 7. NAV ACTIVE LINK ─── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          l.style.color = '';
          if (l.getAttribute('href') === `#${id}`) l.style.color = 'var(--gold)';
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ─── 8. BRAND CONSOLE ─── */
console.log(
  '%c PALM LIFE COMMERCIAL ',
  'background:#B8954A;color:#fff;font:600 14px Georgia,serif;padding:5px 14px;border-radius:2px;'
);
console.log(
  '%c Advisory · Development · Investment Sales ',
  'color:#B8954A;font-style:italic;font-size:11px;'
);
