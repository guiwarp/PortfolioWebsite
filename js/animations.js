(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduced) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const timelineItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          tio.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    timelineItems.forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
      tio.observe(el);
    });
  } else {
    timelineItems.forEach(el => el.classList.add('visible'));
  }

  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduced) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(el => el.textContent = el.dataset.count);
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const contribGrid = document.getElementById('contribGrid');
  if (contribGrid) {
    const cells = 52 * 7;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div');
      cell.className = 'contrib-cell';
      const r = Math.random();
      if (r > 0.85) cell.classList.add('l4');
      else if (r > 0.65) cell.classList.add('l3');
      else if (r > 0.4) cell.classList.add('l2');
      else if (r > 0.15) cell.classList.add('l1');
      frag.appendChild(cell);
    }
    contribGrid.appendChild(frag);
  }
})();