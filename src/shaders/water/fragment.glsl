#define WATER_LEVEL 0.0

/* Uniforms */
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uColorOpacity;

/* Varyings */
varying float vElevation;

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier + 0.8;

  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  gl_FragColor = vec4(color, uColorOpacity);
}