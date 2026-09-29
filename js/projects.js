(function () {
  const grid = document.getElementById('projectsGrid');
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  if (!grid) return;

  let projects = [];

  const FALLBACK = [
    { id: "mythicalbattle", name: "MythicalBattle",
      description: "Prototype web de jeu de construction / free build.",
      longDescription: "Un prototype jouable dans le navigateur qui explore les mécaniques de construction en temps réel.",
      technologies: ["JavaScript", "HTML", "CSS", "WebGL"],
      image: "", github: "https://github.com/yourusername/mythicalbattle", demo: "" },
    { id: "onechance", name: "OneChance",
      description: "Jeu 2D avec mode histoire et combats.",
      longDescription: "Jeu 2D développé sous Unity avec un système de combat au tour par tour.",
      technologies: ["Unity", "C#"],
      image: "", github: "https://github.com/yourusername/onechance", demo: "" },
    { id: "clashroyalestats", name: "Clash Royale Stats",
      description: "Site d'analyse de statistiques Clash Royale.",
      longDescription: "Application web consommant l'API officielle de Clash Royale.",
      technologies: ["HTML", "CSS", "JavaScript", "Node.js"],
      image: "", github: "https://github.com/yourusername/clash-royale-stats", demo: "" },
    { id: "gamingstats", name: "Gaming Stats",
      description: "Portfolio de statistiques gaming.",
      longDescription: "Dashboard personnel regroupant les statistiques de plusieurs jeux vidéo.",
      technologies: ["HTML", "CSS", "JavaScript"],
      image: "", github: "https://github.com/yourusername/gaming-stats", demo: "" },
    { id: "projectx", name: "Project X",
      description: "Projet placeholder.",
      longDescription: "Description détaillée à personnaliser.",
      technologies: ["JavaScript", "Three.js"], image: "", github: "", demo: "" },
    { id: "projecty", name: "Project Y",
      description: "Autre projet placeholder.",
      longDescription: "Description détaillée à personnaliser.",
      technologies: ["Python", "Flask"], image: "", github: "", demo: "" }
  ];

  function render() {
    grid.innerHTML = projects.map(p => `
      <article class="project-card" data-id="${p.id}">
        <div class="project-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
            : `<div class="placeholder">[ ${p.name} preview ]</div>`}
        </div>
        <div class="project-hint">CLICK TO OPEN</div>
        <div class="project-body">
          <h3 class="project-title">${p.name}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${p.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    attachTilt();
    attachModal();
  }

  function attachTilt() {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -8;
        const ry = ((x / rect.width) - 0.5) * 8;
        card.style.setProperty('--mx', (x / rect.width * 100) + '%');
        card.style.setProperty('--my', (y / rect.height * 100) + '%');
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function attachModal() {
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const p = projects.find(x => x.id === card.dataset.id);
        if (p) openModal(p);
      });
    });
  }

  function openModal(p) {
    modalBody.innerHTML = `
      <div class="modal-hero">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}">`
          : `<div class="placeholder">[ ${p.name} preview ]</div>`}
      </div>
      <div class="modal-info">
        <h3 class="modal-title">${p.name}</h3>
        <p class="modal-desc">${p.longDescription || p.description}</p>
        <div class="modal-tags">
          ${p.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="modal-actions">
          ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-ghost">GitHub</a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="btn btn-primary">Live Demo</a>` : ''}
        </div>
      </div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  fetch('data/projects.json')
    .then(r => r.json())
    .then(data => { projects = data.projects || FALLBACK; render(); })
    .catch(() => { projects = FALLBACK; render(); });
})();