varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);

  vUv = uv;
}