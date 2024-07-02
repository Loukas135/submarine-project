uniform sampler2D tDiffuse;
uniform bool isUnderWater;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  if (isUnderWater) {
    color.g += 0.15;
    color.b += 0.3;
    gl_FragColor = color;
  } else {
    gl_FragColor = sRGBTransferOETF(color);
  }
}