(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || !window.THREE) return;

  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { canvas.style.display = 'none'; return; }

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: false, alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
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
      vec2 uv = vUv;
      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 p = (uv - 0.5) * aspect;
      float t = u_time * 0.15;

      float n = fbm(p * 2.5 + vec2(t, t * 0.7));
      n += 0.5 * fbm(p * 5.0 - vec2(t * 1.3, t));
      n /= 1.5;

      float lines = sin((p.y + n * 0.6 + t) * 18.0);
      lines = smoothstep(0.92, 1.0, abs(lines));

      vec2 g = fract(p * 8.0 + vec2(0.0, t * 2.0));
      float grid = smoothstep(0.96, 1.0, max(g.x, g.y));

      float d = distance(uv, u_mouse);
      float glow = smoothstep(0.55, 0.0, d) * 0.35;

      vec3 c1 = vec3(0.31, 0.49, 1.0);
      vec3 c2 = vec3(0.55, 0.36, 0.96);
      vec3 c3 = vec3(0.13, 0.83, 0.93);
      vec3 base = mix(c1, c2, n);
      base = mix(base, c3, lines * 0.4);

      vec3 col = vec3(0.02, 0.025, 0.04);
      col += base * (n * 0.35);
      col += c3 * grid * 0.08;
      col += c1 * glow;

      float vig = smoothstep(1.1, 0.3, length(p));
      col *= vig;
      col += (hash(uv * u_resolution.xy + u_time) - 0.5) * 0.015;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  let targetX = 0.5, targetY = 0.5;
  let currentX = 0.5, currentY = 0.5;
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX / window.innerWidth;
    targetY = 1.0 - e.clientY / window.innerHeight;
  });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.u_resolution.value.set(w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    uniforms.u_time.value = clock.getElapsedTime();
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    uniforms.u_mouse.value.set(currentX, currentY);
    renderer.render(scene, camera);
  }
  animate();
})();