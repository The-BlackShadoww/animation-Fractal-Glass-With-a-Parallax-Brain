import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

// Configuration object for controlling various effect parameters
const config = {
  lerpFactor: 0.035, // how much interpolation to apply
  parallaxStrength: 0.1, // strength of parallax effect
  distortionMultiplier: 10, // how much distortion to multiply by
  glassStrength: 2.0, // strength of “glass” refraction
  glassSmoothness: 0.0001, // smoothness for glass effect
  stripesFrequency: 35, // frequency of the stripes in the shader
  edgePadding: 0.1, // padding around the edges
};

// DOM elements
const container = document.querySelector(".hero"); // main container for the scene
const imageElement = document.getElementById("glassTexture"); // the image / texture used in shader

// Three.js scene setup
const scene = new THREE.Scene();

// Use an orthographic camera (2D-like) — left, right, top, bottom, near, far
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// WebGL renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Append the renderer’s canvas DOM element to the container
container.appendChild(renderer.domElement);

const mouse = { x: 0.5, y: 0.5 }; // normalized mouse coordinates
const targetMouse = { x: 0.5, y: 0.5 }; // target mouse coordinates for interpolation

const lerp = (start, end, factor) => start * (end - start) * factor;

const textureSize = { x: 1, y: 1 }; // size of the loaded texture

const material = new THREE.ShaderMaterial({
  uniforms: {
    // The main texture (image) that the shader will sample from
    uTexture: { value: null },

    // Screen resolution (used for correct aspect ratio and pixel calculations)
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },

    // The size of the texture (image) used for the glass effect
    uTextureSize: {
      value: new THREE.Vector2(textureSize.x, textureSize.y),
    },

    // Mouse position, usually normalized between -1..1 or 0..1 depending on the shader
    uMouse: { value: new THREE.Vector2(mouse.x, mouse.y) },

    // Parallax effect amount—how much the image shifts when the mouse moves
    uParallaxStrength: { value: config.parallaxStrength },

    // Multiplier for distortion values inside the shader
    uDistortionMultiplier: { value: config.distortionMultiplier },

    // Strength of the “glass refraction” effect
    uGlassStrength: { value: config.glassStrength },

    // Frequency of the diagonal/vertical/horizontal stripes (depends on shader)
    uStripesFrequency: { value: config.stripesFrequency },

    // Controls smoothness of edges/refraction transitions
    uGlassSmoothness: { value: config.glassSmoothness },

    // Padding for edges to avoid stretching or edge artifacts
    uEdgePadding: { value: config.edgePadding },
  },

  // Vertex shader imported from "./shaders"
  vertexShader,

  // Fragment shader imported from "./shaders"
  fragmentShader,
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function loadImage() {
  if (!imageElement.complete) {
    imageElement.onload = loadImage;
    return;
  }

  const texture = new THREE.Texture(imageElement);
  textureSize.x = imageElement.naturalWidth || imageElement.width;
  textureSize.y = imageElement.naturalHeight || imageElement.height;
  texture.needsUpdate = true;
  material.uniforms.uTexture.value = texture;
  material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
}

if (imageElement.complete) {
  loadImage();
} else {
  imageElement.onload = loadImage;
}

window.addEventListener("mousemove", (event) => {
  targetMouse.x = event.clientX / window.innerWidth;
  targetMouse.y = 1.0 - event.clientY / window.innerHeight;
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.uResolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
});

function animate() {
  requestAnimationFrame(animate);

  mouse.x = lerp(mouse.x, targetMouse.x, config.lerpFactor);
  mouse.y = lerp(mouse.y, targetMouse.y, config.lerpFactor);
  material.uniforms.uMouse.value.set(mouse.x, mouse.y);

  renderer.render(scene, camera);
}

animate();

//! code v-2
// import * as THREE from "three";
// // import { vertexShader, fragmentShader } from "./shader.js";
// import { vertexShader, fragmentShader } from "./shader.js";

// // Configuration parameters controlling the effect
// const config = {
//   parallaxStrength: 0.1,
//   distortionIntensity: 0.15,
//   stripeCount: 5,
// };

// const hero = document.querySelector(".hero");
// const img = document.getElementById("glass-texture");

// const scene = new THREE.Scene();

// const camera = new THREE.OrthographicCamera(
//   window.innerWidth / -2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   window.innerHeight / -2,
//   0.1,
//   1000
// );
// camera.position.z = 1;

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// hero.appendChild(renderer.domElement);

// const uniforms = {
//   uTexture: { value: null },
//   uResolution: {
//     value: new THREE.Vector2(window.innerWidth, window.innerHeight),
//   },
//   uImageResolution: { value: new THREE.Vector2(0, 0) },
//   uMouse: { value: new THREE.Vector2(0.5, 0.5) },
//   uParallaxStrength: { value: config.parallaxStrength },
//   uDistortionIntensity: { value: config.distortionIntensity },
//   uStripeCount: { value: config.stripeCount },
// };

// let texture;
// const imageSize = new THREE.Vector2(0, 0);

// function loadTexture() {
//   const loader = new THREE.TextureLoader();
//   loader.load(img.src, (tex) => {
//     texture = tex;
//     uniforms.uTexture.value = texture;
//     imageSize.set(tex.image.width, tex.image.height);
//     uniforms.uImageResolution.value = imageSize;
//     animate();
//   });
// }

// const mouse = {
//   current: new THREE.Vector2(0.5, 0.5),
//   target: new THREE.Vector2(0.5, 0.5),
// };

// function lerp(a, b, n) {
//   return (1 - n) * a + n * b;
// }

// const material = new THREE.ShaderMaterial({
//   vertexShader,
//   fragmentShader,
//   uniforms,
// });

// let geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
// let mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// window.addEventListener("mousemove", (ev) => {
//   mouse.target.x = ev.clientX / window.innerWidth;
//   mouse.target.y = 1 - ev.clientY / window.innerHeight;
// });

// window.addEventListener("resize", () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;

//   renderer.setSize(width, height);
//   uniforms.uResolution.value.set(width, height);

//   camera.left = width / -2;
//   camera.right = width / 2;
//   camera.top = height / 2;
//   camera.bottom = height / -2;
//   camera.updateProjectionMatrix();

//   mesh.geometry.dispose();
//   mesh.geometry = new THREE.PlaneGeometry(width, height);
// });

// function animate() {
//   requestAnimationFrame(animate);

//   mouse.current.x = lerp(mouse.current.x, mouse.target.x, 0.1);
//   mouse.current.y = lerp(mouse.current.y, mouse.target.y, 0.1);

//   uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

//   renderer.render(scene, camera);
// }

// loadTexture();

//! ------ old v-1
// // Main JavaScript: Initialize Three.js scene and handle animation logic

// // Import Three.js components (assumed loaded via CDN)
// const {
//   Scene,
//   OrthographicCamera,
//   WebGLRenderer,
//   PlaneGeometry,
//   ShaderMaterial,
//   Mesh,
//   TextureLoader,
//   Vector2,
// } = THREE;

// // Configuration for effect behavior, tweak these values to adjust effect
// const config = {
//   parallaxStrength: 0.1, // How much mouse movement offsets the distortion
//   distortionIntensity: 0.15, // Strength of fractal distortion effect
//   stripeCount: 5.0, // Number of horizontal stripes in fractal
// };

// // Grab DOM elements: hero section and hidden glass texture image
// const hero = document.querySelector(".hero");
// const img = document.getElementById("glass-texture");

// // Create a new Three.js scene
// const scene = new Scene();

// // Set up an orthographic camera to render 2D flat plane without perspective distortion
// const camera = new OrthographicCamera(
//   window.innerWidth / -2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   window.innerHeight / -2,
//   0.1,
//   1000
// );
// camera.position.z = 1;

// // Set up WebGL renderer, size matches window
// const renderer = new WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// hero.appendChild(renderer.domElement);

// // Variables to store image texture and original size for scaling
// let texture;
// const imageSize = new Vector2(0, 0);

// // Uniforms for shader - dynamic values passed to GLSL
// const uniforms = {
//   uTexture: { value: null }, // Texture from image element
//   uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) }, // Screen size
//   uImageResolution: { value: new Vector2(0, 0) }, // Image original resolution
//   uMouse: { value: new Vector2(0.5, 0.5) }, // Mouse position normalized [0..1]
//   uParallaxStrength: { value: config.parallaxStrength },
//   uDistortionIntensity: { value: config.distortionIntensity },
//   uStripeCount: { value: config.stripeCount },
// };

// // Load the texture from hidden image once loaded
// function loadTexture() {
//   const loader = new TextureLoader();

//   loader.load(img.src, (loadedTexture) => {
//     // Set texture and image size uniform to shader
//     texture = loadedTexture;
//     uniforms.uTexture.value = texture;
//     imageSize.set(loadedTexture.image.width, loadedTexture.image.height);
//     uniforms.uImageResolution.value = imageSize;

//     // Start animation/rendering loop now texture is ready
//     animate();
//   });
// }

// // Mouse position tracking: current and target positions for smooth easing
// const mouse = {
//   current: new Vector2(0.5, 0.5),
//   target: new Vector2(0.5, 0.5),
// };

// // Linear interpolation helper for smoothing mouse movement
// function lerp(start, end, t) {
//   return start * (1 - t) + end * t;
// }

// // Shader material using provided vertex and fragment shaders
// const material = new ShaderMaterial({
//   uniforms: uniforms,
//   vertexShader:
//     document.getElementById("vertexShader")?.textContent ||
//     `
//     precision mediump float;
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   fragmentShader:
//     document.getElementById("fragmentShader")?.textContent ||
//     `
//     precision mediump float;
//     uniform sampler2D uTexture;
//     uniform vec2 uResolution;
//     uniform vec2 uImageResolution;
//     uniform vec2 uMouse;
//     uniform float uParallaxStrength;
//     uniform float uDistortionIntensity;
//     uniform float uStripeCount;
//     varying vec2 vUv;

//     vec2 coverUV(vec2 uv, vec2 resolution, vec2 imageResolution) {
//       float screenRatio = resolution.x / resolution.y;
//       float imageRatio = imageResolution.x / imageResolution.y;

//       vec2 newUV = uv;

//       if (screenRatio > imageRatio) {
//         float scale = screenRatio / imageRatio;
//         newUV.y = uv.y * scale - (scale - 1.0) / 2.0;
//       } else {
//         float scale = imageRatio / screenRatio;
//         newUV.x = uv.x * scale - (scale - 1.0) / 2.0;
//       }

//       return newUV;
//     }

//     float displacement(float x, float numStripes) {
//       return sin(x * numStripes * 3.141592) * 0.02;
//     }

//     float fractalGlass(float x, float numStripes) {
//       float total = 0.0;
//       float totalWeight = 0.0;
//       float weight = 1.0;
//       for (int i = 1; i <= 5; i++) {
//         float freq = float(i) * numStripes;
//         total += displacement(x * freq, numStripes) * weight;
//         totalWeight += weight;
//         weight *= 0.5;
//       }
//       return total / totalWeight;
//     }

//     void main() {
//       vec2 uv = coverUV(vUv, uResolution, uImageResolution);

//       float distortion = fractalGlass(uv.x, uStripeCount) * uDistortionIntensity;

//       float edgeFactor = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);

//       uv.x += distortion * edgeFactor;

//       float parallax = (uMouse.x - 0.5) * uParallaxStrength * edgeFactor;

//       uv.x += parallax;

//       vec4 color = texture2D(uTexture, uv);

//       gl_FragColor = color;
//     }
//   `,
// });

// // Create full screen plane geometry and apply shader material
// const geometry = new PlaneGeometry(window.innerWidth, window.innerHeight);
// const mesh = new Mesh(geometry, material);
// scene.add(mesh);

// // Handle mouse movement event updating target mouse position normalized [0..1]
// window.addEventListener("mousemove", (event) => {
//   mouse.target.x = event.clientX / window.innerWidth;
//   mouse.target.y = 1 - event.clientY / window.innerHeight; // Flip Y coordinate for shader
// });

// // Handle window resizing: update renderer, camera, and uniforms accordingly
// window.addEventListener("resize", () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;

//   renderer.setSize(width, height);
//   uniforms.uResolution.value.set(width, height);

//   // Update camera frustum for new size
//   camera.left = width / -2;
//   camera.right = width / 2;
//   camera.top = height / 2;
//   camera.bottom = height / -2;
//   camera.updateProjectionMatrix();

//   // Update geometry size for new viewport
//   mesh.geometry.dispose();
//   mesh.geometry = new PlaneGeometry(width, height);
// });

// // Animate loop: update mouse position smoothly and render the scene
// function animate() {
//   requestAnimationFrame(animate);

//   // Smoothly interpolate the current mouse position toward target
//   mouse.current.x = lerp(mouse.current.x, mouse.target.x, 0.1);
//   mouse.current.y = lerp(mouse.current.y, mouse.target.y, 0.1);

//   // Update uniform with current mouse position
//   uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

//   // Render scene with updated uniforms and mesh
//   renderer.render(scene, camera);
// }

// // Start texture loading and animation
// loadTexture();
