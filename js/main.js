/* ============================================
   MAIN — initialisation générale
   ============================================ */
(function () {
  const C = window.CONFIG || {};

  // --- Loader ---

// --- Blocage du scroll pendant l'intro ---
// (l'intro gère elle-même la réouverture via js/intro.js)
if (document.getElementById('intro')) {
  document.body.style.overflow = 'hidden';
}
  // --- Injection du contenu depuis CONFIG ---
  const navName = document.getElementById('navName');
  const heroName = document.getElementById('heroName');
  const footerName = document.getElementById('footerName');
  if (navName) navName.textContent = C.navName || C.name;
  if (heroName) heroName.innerHTML = `<span class="gradient-text">${C.name}</span>`;
  if (footerName) footerName.textContent = C.name;

  // About
  const aboutText = document.getElementById('aboutText');
  if (aboutText && C.about) aboutText.textContent = C.about.text;
  const aboutInterests = document.getElementById('aboutInterests');
  if (aboutInterests && C.about) {
    aboutInterests.innerHTML = C.about.interests
      .map(i => `<li>${i}</li>`).join('');
  }

  // Skills
  const skillsGrid = document.getElementById('skillsGrid');
  if (skillsGrid && C.skills) {
    skillsGrid.innerHTML = C.skills.map(s => `
      <div class="skill-card" data-reveal>
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-desc">${s.desc}</div>
      </div>
    `).join('');
  }

  // Timeline
  const timeline = document.getElementById('timeline');
  if (timeline && C.timeline) {
    timeline.innerHTML = C.timeline.map(t => `
      <div class="timeline-item">
        <div class="timeline-year">${t.year}</div>
        <div class="timeline-title">${t.title}</div>
        <div class="timeline-desc">${t.desc}</div>
      </div>
    `).join('');
  }

  // Contact
  const contactList = document.getElementById('contactList');
  if (contactList && C.socials) {
    const items = [
      { key: 'email', label: C.socials.email, icon: '@', href: 'mailto:' + C.socials.email },
      { key: 'github', label: 'GitHub', icon: 'GH', href: C.socials.github },
      { key: 'discord', label: 'Discord', icon: 'DC', href: C.socials.discord },
      { key: 'instagram', label: 'Instagram', icon: 'IG', href: C.socials.instagram },
      { key: 'linkedin', label: 'LinkedIn', icon: 'IN', href: C.socials.linkedin }
    ];
    contactList.innerHTML = items.map(i => `
      <li>
        <a href="${i.href}" target="_blank" rel="noopener" data-cursor="hover">
          <span class="contact-icon">${i.icon}</span>
          <span>${i.label}</span>
        </a>
      </li>
    `).join('');
  }

  // Footer links
  const footerLinks = document.getElementById('footerLinks');
  if (footerLinks && C.socials) {
    footerLinks.innerHTML = `
      <li><a href="${C.socials.github}" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="${C.socials.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      <li><a href="${C.socials.instagram}" target="_blank" rel="noopener">Instagram</a></li>
    `;
  }

  // Année
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // --- Navbar scroll ---
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Menu mobile ---
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  // --- Tilt des skill cards ---
  if (!window.matchMedia('(max-width: 900px)').matches) {
    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', (x / rect.width * 100) + '%');
        card.style.setProperty('--my', (y / rect.height * 100) + '%');
        const rx = ((y / rect.height) - 0.5) * -6;
        const ry = ((x / rect.width) - 0.5) * 6;
        card.style.transform =
          `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Boutons magnétiques ---
  if (!window.matchMedia('(max-width: 900px)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- Formulaire de contact (validation front) ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { el: form.name, test: v => v.trim().length >= 2, msg: "Name required (min 2 chars)" },
        { el: form.email, test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Valid email required" },
        { el: form.message, test: v => v.trim().length >= 10, msg: "Message required (min 10 chars)" }
      ];

      fields.forEach(({ el, test, msg }) => {
        const field = el.closest('.form-field');
        const err = field.querySelector('.form-error');
        if (!test(el.value)) {
          field.classList.add('error');
          err.textContent = msg;
          valid = false;
        } else {
          field.classList.remove('error');
          err.textContent = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = '✓ Message validated (no backend)';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 2600);
      }
    });
  }

  // --- Footer canvas particules ---
  const fc = document.getElementById('footerCanvas');
  if (fc && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = fc.getContext('2d');
    let w, h, particles;
    function resize() {
      w = fc.width = fc.offsetWidth;
      h = fc.height = fc.offsetHeight;
    }
    function initParticles() {
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 124, 255, 0.6)';
        ctx.fill();
      });
      // Lignes entre particules proches
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79, 124, 255, ${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  // --- Smooth scroll pour les ancres ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();