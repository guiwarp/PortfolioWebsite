// Vertex shader de référence — utilisé pour le rendu plein écran.
// Un simple quad qui couvre tout l'écran.
// La position est déjà en NDC (-1 à 1), donc pas de projection caméra nécessaire.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}