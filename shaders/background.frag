// Fragment shader de référence — version complète commentée.
//
// Combine :
//  - fbm (fractal brownian motion) pour les vagues abstraites
//  - lignes sinusoïdales lumineuses
//  - grille perspective animée
//  - lumière qui suit la souris
//  - vignette + grain subtil

precision highp float;

varying vec2 vUv;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_quality;   // 0.6 mobile, 1.0 desktop

// Hash pseudo-aléatoire
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Bruit de valeur 2D
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// FBM — superpose plusieurs octaves de bruit
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Coordonnées corrigées du ratio d'écran
  vec2 uv = vUv;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  float t = u_time * 0.15;

  // --- Vagues abstraites (fbm) ---
  float n = fbm(p * 2.5 + vec2(t, t * 0.7));
  n += 0.5 * fbm(p * 5.0 - vec2(t * 1.3, t));
  n /= 1.5;

  // --- Lignes lumineuses horizontales ---
  float lines = sin((p.y + n * 0.6 + t) * 18.0);
  lines = smoothstep(0.92, 1.0, abs(lines));

  // --- Grille perspective qui défile ---
  vec2 g = fract(p * 8.0 + vec2(0.0, t * 2.0));
  float grid = smoothstep(0.96, 1.0, max(g.x, g.y));

  // --- Lumière qui suit la souris ---
  float d = distance(uv, u_mouse);
  float glow = smoothstep(0.55, 0.0, d) * 0.35;

  // --- Palette ---
  vec3 c1 = vec3(0.31, 0.49, 1.0);   // bleu électrique
  vec3 c2 = vec3(0.55, 0.36, 0.96);  // violet
  vec3 c3 = vec3(0.13, 0.83, 0.93);  // cyan

  vec3 base = mix(c1, c2, n);
  base = mix(base, c3, lines * 0.4);

  // --- Composition finale ---
  vec3 col = vec3(0.02, 0.025, 0.04);
  col += base * (n * 0.35);
  col += c3 * grid * 0.08;
  col += c1 * glow;

  // Vignette
  float vig = smoothstep(1.1, 0.3, length(p));
  col *= vig;

  // Grain subtil pour éviter le banding
  col += (hash(uv * u_resolution.xy + u_time) - 0.5) * 0.015;

  gl_FragColor = vec4(col, 1.0);
}