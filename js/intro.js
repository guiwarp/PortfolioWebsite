(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const QUOTE  = "What does not kill me makes me stronger";
  const AUTHOR = "Nietzsche";
  const STEPS  = ["WEBGL", "SHADERS", "PROJECTS", "READY"];

  const quoteEl  = document.getElementById('introQuote');
  const authorEl = document.getElementById('introAuthor');
  const pctEl    = document.getElementById('introPercent');
  const fillEl   = document.getElementById('introFill');
  const glowEl   = document.getElementById('introGlow');
  const stepsEl  = document.getElementById('introSteps');
  const flashEl  = document.getElementById('introFlash');
  const curtain  = document.getElementById('introCurtain');

  // Citation lettre par lettre
  quoteEl.innerHTML = '';
  const words = QUOTE.split(' ');
  words.forEach((word, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.whiteSpace = 'nowrap';
    wordSpan.style.display = 'inline-block';
    [...word].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      wordSpan.appendChild(s);
    });
    quoteEl.appendChild(wordSpan);
    if (wi < words.length - 1) {
      const sp = document.createElement('span');
      sp.className = 'char';
      sp.textContent = ' ';
      quoteEl.appendChild(sp);
    }
  });
  const chars = quoteEl.querySelectorAll('.char');

  stepsEl.innerHTML = STEPS.map(s => `<span>${s}</span>`).join('');
  const stepSpans = stepsEl.querySelectorAll('span');

  authorEl.textContent = AUTHOR;

  requestAnimationFrame(() => intro.classList.add('revealed'));

  if (reduced) {
    chars.forEach(c => c.classList.add('shown'));
    stepSpans.forEach(s => s.classList.add('done'));
    pctEl.textContent = '100%';
    fillEl.style.width = '100%';
    glowEl.style.left = '100%';
    finish(true);
    return;
  }

  chars.forEach((c, i) => {
    setTimeout(() => c.classList.add('shown'), i * 22);
  });

  const TOTAL = 4200;
  const start = performance.now();
  const thresholds = [0.15, 0.35, 0.6, 0.85];
  let stepIndex = 0;

  function tick(now) {
    const t = Math.min((now - start) / TOTAL, 1);
    const eased = 1 - Math.pow(1 - t, 2.5);

    pctEl.textContent = Math.round(eased * 100) + '%';
    fillEl.style.width = (eased * 100) + '%';
    glowEl.style.left  = (eased * 100) + '%';

    while (stepIndex < thresholds.length && eased >= thresholds[stepIndex]) {
      if (stepIndex > 0) {
        stepSpans[stepIndex - 1].classList.remove('active');
        stepSpans[stepIndex - 1].classList.add('done');
      }
      stepSpans[stepIndex].classList.add('active');
      stepIndex++;
    }

    if (t < 1) requestAnimationFrame(tick);
    else {
      stepSpans.forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
      finish(false);
    }
  }
  requestAnimationFrame(tick);

  let finished = false;
  function finish(instant) {
    if (finished) return;
    finished = true;

    if (instant) {
      intro.classList.add('done');
      document.body.style.overflow = '';
      return;
    }

    flashEl.classList.add('fire');
    setTimeout(() => {
      curtain.classList.add('open');
      document.body.style.overflow = '';
      setTimeout(() => intro.classList.add('done'), 900);
    }, 250);
  }

  intro.addEventListener('click', () => finish(true));
})();