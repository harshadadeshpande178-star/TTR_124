/* ═══════════════════════════════════════════════
   ALEX NOVA — Portfolio JavaScript
   ═══════════════════════════════════════════════ */

/* ── CURSOR GLOW ── */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    const hues = [260, 190, 320];
    this.hue = hues[Math.floor(Math.random() * hues.length)];
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function initP() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  initP();
  loop();
  window.addEventListener('resize', () => { resize(); initP(); });
})();

/* ── ANIMATED COUNTER ── */
function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ── SKILL BAR ANIMATION ── */
function animateSkillBars(root) {
  root.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

/* ── INTERSECTION OBSERVER ── */
const revealEls = document.querySelectorAll(
  '.project-card, .skill-card, .testimonial-card, .about-grid, .contact-wrap, .hero-stats'
);

revealEls.forEach(el => el.classList.add('reveal'));

const statsObserved = new Set();
const skillsObserved = new Set();

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // counters
    if (entry.target.classList.contains('hero-stats') && !statsObserved.has(entry.target)) {
      statsObserved.add(entry.target);
      entry.target.querySelectorAll('.stat-num').forEach(animateCount);
    }

    // skill bars
    if (entry.target.classList.contains('skill-card') && !skillsObserved.has(entry.target)) {
      skillsObserved.add(entry.target);
      animateSkillBars(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

/* ── SMOOTH ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#f1f5f9' : '';
  });
});

/* ── FORM SUBMIT ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-form');
  const success = document.getElementById('form-success');
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.7';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message ✦';
    btn.style.opacity = '1';
    btn.disabled = false;
    e.target.reset();
    success.style.display = 'block';
    setTimeout(() => success.style.display = 'none', 5000);
  }, 1800);
}

/* ── TILT EFFECT on project cards ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── HERO TEXT TYPEWRITER HINT ── */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(20px)';
  setTimeout(() => {
    heroTitle.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
  }, 300);
}

/* ── SECTION LABEL & SUBTITLE REVEAL ── */
const fadeEls = document.querySelectorAll('.section-label, .hero-badge, .hero-subtitle, .hero-actions, .body-text');
fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  const elIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 60);
        elIo.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  elIo.observe(el);
});
