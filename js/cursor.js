(function () {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer   = document.getElementById('cursorLayer');
  const trail   = document.getElementById('cursorTrail');
  const core    = document.getElementById('cursorCore');
  const coreIn  = document.getElementById('cursorCoreInner');
  const halo    = document.getElementById('cursorHalo');
  const haloProg= document.getElementById('haloProgress');
  const haloLbl = document.getElementById('cursorHaloLabel');
  if (!layer || !core || !halo) return;

  // Curseur caché tant que l'intro est active
  const introEl = document.getElementById('intro');
  let introActive = !!(introEl && !introEl.classList.contains('done'));

  if (introActive) {
    core.style.opacity = 0;
    halo.style.opacity = 0;
    layer.style.opacity = 0;
  }

  if (introEl) {
    const obs = new MutationObserver(() => {
      if (introEl.classList.contains('done')) {
        introActive = false;
        core.style.opacity = 1;
        halo.style.opacity = 1;
        layer.style.opacity = 1;
        obs.disconnect();
      }
    });
    obs.observe(introEl, { attributes: true, attributeFilter: ['class'] });
  }

  const ctx = trail.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    trail.width  = W * DPR;
    trail.height = H * DPR;
    trail.style.width = W + 'px';
    trail.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: W / 2, y: H / 2 };
  const corePos = { x: mouse.x, y: mouse.y };
  const haloPos = { x: mouse.x, y: mouse.y };
  let clicked = false;
  let hoverState = 'idle';

  const MAX = 60;
  const particles = [];
  let lastSpawn = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (introActive) return;

    const now = performance.now();
    if (now - lastSpawn > 16) {
      lastSpawn = now;
      particles.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 0.6 + (e.movementX || 0) * 0.08,
        vy: (Math.random() - 0.5) * 0.6 + (e.movementY || 0) * 0.08,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: 1 + Math.random() * 1.8,
        hue: 215 + Math.random() * 40
      });
      if (particles.length > MAX) particles.splice(0, particles.length - MAX);
    }
  });

  window.addEventListener('mousedown', () => {
    if (introActive) return;
    clicked = true;
    core.classList.add('click');
  });
  window.addEventListener('mouseup', () => {
    clicked = false;
    core.classList.remove('click');
  });

  const HOVER_SELECTOR = 'a, button, .btn, input, textarea, .nav-toggle';
  const VIEW_SELECTOR  = '.project-card';

  document.addEventListener('mouseover', (e) => {
    if (introActive) return;
    const viewEl = e.target.closest && e.target.closest(VIEW_SELECTOR);
    const hovEl  = e.target.closest && e.target.closest(HOVER_SELECTOR);

    if (viewEl) {
      setState('view');
      haloLbl.textContent = 'VIEW';
      coreIn.textContent = 'VIEW';
    } else if (hovEl) {
      setState('hover');
      haloLbl.textContent = '';
      coreIn.textContent = '';
    } else {
      setState('idle');
      haloLbl.textContent = '';
      coreIn.textContent = '';
    }
  });

  function setState(state) {
    if (hoverState === state) return;
    hoverState = state;
    core.classList.remove('hover', 'view');
    halo.classList.remove('hover', 'view');
    if (state === 'hover') {
      core.classList.add('hover');
      halo.classList.add('hover');
    } else if (state === 'view') {
      core.classList.add('view');
      halo.classList.add('view');
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    if (introActive) return;

    corePos.x += (mouse.x - corePos.x) * 0.35;
    corePos.y += (mouse.y - corePos.y) * 0.35;
    haloPos.x += (mouse.x - haloPos.x) * 0.14;
    haloPos.y += (mouse.y - haloPos.y) * 0.14;

    core.style.transform = `translate(${corePos.x}px, ${corePos.y}px) translate(-50%, -50%)`;
    halo.style.transform = `translate(${haloPos.x}px, ${haloPos.y}px) translate(-50%, -50%)`;
    halo.classList.add('active');

    core.style.filter = clicked ? 'blur(0.5px)' : 'none';

    const speed = Math.hypot(mouse.x - haloPos.x, mouse.y - haloPos.y);
    const pct = Math.min(speed / 60, 1);
    haloProg.style.strokeDashoffset = 290 - 290 * pct;

    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.94; p.vy *= 0.94;
      p.life -= p.decay;
      p.size *= 0.985;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
      grad.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.life * 0.9})`);
      grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const alpha = (1 - Math.sqrt(d2) / 90) * 0.18 * Math.min(a.life, b.life);
          ctx.strokeStyle = `rgba(120, 160, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }
  loop();

  document.addEventListener('mouseleave', () => {
    if (introActive) return;
    core.style.opacity = 0;
    halo.style.opacity = 0;
  });
  document.addEventListener('mouseenter', () => {
    if (introActive) return;
    core.style.opacity = 1;
    halo.style.opacity = 1;
  });
})();