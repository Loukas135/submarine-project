#include <common>

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
  vec4 t = texture2D(tDiffuse, vUv);

  float g = clamp(t.g + 0.15, 0.0, 1.0);
  float b = clamp(t.b + 0.3, 0.0, 1.0);

  gl_FragColor = vec4(t.r, g, b, t.w);
}