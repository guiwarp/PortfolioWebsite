<div align="center">

<!-- Bannière (optionnel — tu peux la retirer si tu n'as pas d'image) -->
<!-- <img src="assets/banner.png" alt="banner" width="100%" /> -->

# ⌨️ guiwarp — Portfolio

**Computer Science Student · Developer · Gamedev**

*I build interactive experiences, games and modern web applications.*

[![License: MIT](https://img.shields.io/badge/License-MIT-4f7cff.svg?style=for-the-badge)](./LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)

[Live Demo](#) · [Report Bug](https://github.com/yourusername/portfolio/issues) · [Request Feature](https://github.com/yourusername/portfolio/issues)

</div>

---

## ✨ À propos

Un portfolio personnel **dark / futuriste / cyber** conçu comme une véritable expérience interactive. Il combine shaders WebGL, animations 3D, curseur personnalisé et terminal interactif — le tout sans framework, en **vanilla JS**.

> _"Ce n'est pas juste une page web. C'est une interface."_

---

## 🎬 Aperçu des fonctionnalités

<table>
<tr>
<td width="50%">

### 🌌 Intro cinématique
- Citation révélée lettre par lettre
- Barre de chargement animée
- Flash + curtain reveal
- Shader WebGL dédié

</td>
<td width="50%">

### 🖱️ Curseur premium
- Core morphing (idle / hover / view)
- Halo SVG progressif selon la vélocité
- Traînée de particules en constellation
- Désactivé sur mobile

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Shader WebGL custom
- Fragment shader GLSL fait main
- Vagues fbm animées
- Grille perspective défilante
- Lumière qui suit la souris

</td>
<td width="50%">

### 💼 Portfolio complet
- Hero plein écran
- About / Skills / Projects / Timeline
- Terminal interactif (`help`, `about`, `skills`…)
- Modal projet avec tilt 3D

</td>
</tr>
</table>

---

## 🚀 Installation

### Prérequis
- Un navigateur moderne (Chrome, Edge, Firefox, Safari)
- **Python 3** ou **Node.js** (pour lancer un serveur local)

### Lancer le projet

```bash
# 1. Clone le repo
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Lance un serveur local
python -m http.server 8080
# ou
npx serve .
