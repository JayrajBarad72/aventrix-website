const API = 'https://avebackend.onrender.com/api';

// Warm up backend on contact page load so form submits fast
if (location.pathname.includes('contact')) {
  fetch(`${API}/ping`).catch(() => {});
}

// Nav scroll
window.addEventListener('scroll', () => {
  document.querySelector('.nav')?.classList.toggle('scrolled', scrollY > 10);
});

// Mobile menu
function toggleMenu() {
  document.getElementById('mobMenu')?.classList.toggle('open');
}
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobMenu')?.classList.remove('open'));
});

// Reveal on scroll
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// FAQ
function toggleFAQ(btn) {
  const item = btn.parentElement;
  const ans = item.querySelector('.faq-a');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => {
    a.classList.remove('open');
    a.previousElementSibling.querySelector('.faq-icon').textContent = '+';
  });
  if (!isOpen) { ans.classList.add('open'); icon.textContent = '−'; }
}

// Contact form
async function submitContact(e) {
  e.preventDefault();
  const form = e.target;

  // Collect data
  const interests = [...form.querySelectorAll('input[type=checkbox]:checked')].map(c => c.value).join(', ');
  const data = {
    name: form.full_name?.value || '',
    company: form.company?.value || '',
    email: form.email?.value || '',
    phone: form.phone?.value || '',
    company_size: form.company_size?.value || '',
    industry: form.industry?.value || '',
    interest: interests,
    message: form.message?.value || ''
  };

  // Show success immediately
  form.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';

  // Send to backend in background (non-blocking)
  fetch(`${API}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
    .then(d => console.log('[Form] Backend response:', d))
    .catch(e => console.log('[Form] Backend error (non-blocking):', e));
}


// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Active nav link
const path = location.pathname;
document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a => {
  if (a.getAttribute('href') === path || (path === '/' && a.getAttribute('href') === 'index.html')) {
    a.classList.add('active');
  }
});
