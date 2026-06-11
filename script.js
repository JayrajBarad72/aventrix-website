// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// Mobile menu
function toggleMenu() {
  const menu = document.getElementById('navMobile');
  menu.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navMobile').classList.remove('open');
  });
});

// FAQ toggle
function toggleFAQ(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer.open').forEach(a => {
    a.classList.remove('open');
    a.previousElementSibling.querySelector('.faq-icon').textContent = '+';
  });

  if (!isOpen) {
    answer.classList.add('open');
    icon.textContent = '−';
  }
}

// FAQ filter
function filterFAQ(cat) {
  document.querySelectorAll('.faq-cat').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.faq-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Billing toggle
function toggleBilling() {
  const isAnnual = document.getElementById('billingToggle').checked;
  const starterEl = document.getElementById('starterPrice');
  const businessEl = document.getElementById('businessPrice');
  const monthLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');

  if (isAnnual) {
    starterEl.textContent = '3,150';
    businessEl.textContent = '756';
    monthLabel.classList.remove('active');
    annualLabel.classList.add('active');
  } else {
    starterEl.textContent = '3,500';
    businessEl.textContent = '840';
    monthLabel.classList.add('active');
    annualLabel.classList.remove('active');
  }
}

// Contact form
function submitForm(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card, .pillar-card, .step-card, .price-card, .industry-card, .blog-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Load blog posts from HQ API
async function loadBlogPosts() {
  try {
    const response = await fetch('https://avebackend.onrender.com/api/blog/posts?limit=3');
    if (!response.ok) return;
    const data = await response.json();
    if (!data.posts || data.posts.length === 0) return;

    const grid = document.getElementById('blogGrid');
    grid.innerHTML = data.posts.map(post => `
      <div class="blog-card">
        <div class="blog-tag">AI Security</div>
        <h3>${post.title}</h3>
        <p>${post.content.substring(0, 150)}...</p>
        <a href="blog.html" class="blog-read">Read Article →</a>
      </div>
    `).join('');
  } catch(e) {
    // Keep static fallback
  }
}

loadBlogPosts();
