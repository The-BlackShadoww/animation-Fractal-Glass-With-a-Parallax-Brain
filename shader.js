// This file exports vertex and fragment shader code as JS strings

export const vertexShader = `
precision mediump float;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform vec2 uMouse;
uniform float uParallaxStrength;
uniform float uDistortionIntensity;
uniform float uStripeCount;

varying vec2 vUv;

vec2 coverUV(vec2 uv, vec2 resolution, vec2 imageResolution) {
  float screenRatio = resolution.x / resolution.y;
  float imageRatio = imageResolution.x / imageResolution.y;

  vec2 newUV = uv;

  if (screenRatio > imageRatio) {
    float scale = screenRatio / imageRatio;
    newUV.y = uv.y * scale - (scale - 1.0) / 2.0;
  } else {
    float scale = imageRatio / screenRatio;
    newUV.x = uv.x * scale - (scale - 1.0) / 2.0;
  }

  return newUV;
}

float displacement(float x, float numStripes) {
  return sin(x * numStripes * 3.141592) * 0.02;
}

float fractalGlass(float x, float numStripes) {
  float total = 0.0;
  float totalWeight = 0.0;
  float weight = 1.0;

  for (int i = 1; i <= 5; i++) {
    float freq = float(i) * numStripes;
    total += displacement(x * freq, numStripes) * weight;
    totalWeight += weight;
    weight *= 0.5;
  }

  return total / totalWeight;
}

void main() {
  vec2 uv = coverUV(vUv, uResolution, uImageResolution);

  float distortion = fractalGlass(uv.x, uStripeCount) * uDistortionIntensity;

  float edgeFactor = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);

  uv.x += distortion * edgeFactor;

  float parallax = (uMouse.x - 0.5) * uParallaxStrength * edgeFactor;

  uv.x += parallax;

  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
}
`;
