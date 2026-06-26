/* ============================================
   SecureAI Gateway — interactions
   ============================================ */

/* ---------- Particle field ---------- */
(function particles() {
  const c = document.getElementById('particles');
  if (!c) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = c.getContext('2d');
  let w, h, pts;

  function size() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    const count = Math.min(70, Math.floor(w / 22));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.4
    }));
  }
  size();
  window.addEventListener('resize', size);

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,199,0.5)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.14 * (1 - d / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- Scroll reveal ---------- */
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
})();

/* ---------- Animated counters ---------- */
(function counters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target % 1 === 0 ? Math.floor(eased * target) : (eased * target).toFixed(1);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(e => io.observe(e));
})();

/* ---------- Nav toggle ---------- */
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (btn && links) btn.addEventListener('click', () => links.classList.toggle('open'));
})();

/* ---------- Live DLP terminal demo ---------- */
(function terminal() {
  const out = document.getElementById('term-feed');
  if (!out) return;

  const samples = [
    { who: 'priya.s', model: 'Claude', text: 'Summarize our Q3 financial report and growth metrics', flag: false },
    { who: 'raj.m', model: 'GPT-4o', text: 'Clean this customer list — Aadhaar 4567 8901 2345', flag: true, reason: 'Aadhaar Number' },
    { who: 'dev.k', model: 'Llama', text: 'Refactor this auth function for better readability', flag: false },
    { who: 'hr.team', model: 'GPT-4o', text: 'Draft offer letter, salary ₹18,00,000 for new hire', flag: true, reason: 'Salary Data' },
    { who: 'amit.p', model: 'Claude', text: 'Explain SOC 2 Type II controls in plain language', flag: false },
    { who: 'fin.ops', model: 'Claude', text: 'Reconcile this sheet — card 4111 1111 1111 1111', flag: true, reason: 'Credit Card' },
    { who: 'neha.r', model: 'Llama', text: 'Translate this onboarding doc to Hindi', flag: false },
  ];

  let i = 0;
  function add() {
    const s = samples[i % samples.length];
    i++;
    const row = document.createElement('div');
    row.className = 'term-row' + (s.flag ? ' blocked' : ' allowed');
    row.innerHTML = `
      <div class="term-meta"><span class="term-user">${s.who}</span><span class="term-model">${s.model}</span></div>
      <div class="term-text">${s.text}</div>
      <div class="term-verdict">${s.flag
        ? `<span class="v-block">⛔ BLOCKED · ${s.reason}</span>`
        : `<span class="v-ok">✅ ALLOWED · forwarded</span>`}</div>
    `;
    out.prepend(row);
    requestAnimationFrame(() => row.classList.add('show'));
    while (out.children.length > 5) out.removeChild(out.lastChild);
  }
  add(); add();
  setInterval(add, 2200);
})();
