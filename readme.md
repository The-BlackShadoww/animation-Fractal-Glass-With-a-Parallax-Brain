Fractal Glass Parallax Effect
Project Overview
This project is a WebGL-based interactive fractal glass distortion effect with a parallax animation, built using Three.js and custom GLSL shaders. It creates a dynamic glass-like warping effect on an image that responds smoothly to mouse movement, providing an engaging visual experience.

Features
Fullscreen glass distortion effect using fragment shaders

Parallax interaction responding to cursor movements

Precision control with adjustable parameters for distortion intensity, parallax strength, and number of fractal stripes

Responsive design adapting to window resizing

Lightweight implementation with Three.js and minimal dependencies

Technologies Used
Three.js: A JavaScript 3D library for creating and displaying animated 3D graphics in the browser

GLSL Shaders: Custom vertex and fragment shaders to implement fractal glass distortion and parallax

JavaScript (ES6 Modules): Modular code with separate shader and script files

HTML5 & CSS3: Page structure and styling

File Structure
index.html: Main HTML file containing the page structure and references to scripts and styles

styles.css: Styling for layout, typography, and responsive adjustments

shader.js: Exports GLSL vertexShader and fragmentShader code strings used by Three.js ShaderMaterial

script.js: Main JavaScript logic — sets up Three.js scene, loads texture, manages mouse input, and the animation loop

How It Works
The hidden image element in the DOM is used as a texture source, loaded asynchronously by Three.js TextureLoader.

Custom shaders run on the GPU to create a fractal glass distortion effect via sine wave displacements and weighted layering.

Mouse position is tracked and passed as a uniform to the fragment shader, producing a parallax horizontal offset that reacts fluidly to cursor movements.

The orthographic camera ensures the image is rendered flat without perspective distortion.

The animation loop continuously updates the mouse uniforms and re-renders the scene to keep the effect interactive and smooth.

The system listens for window resizing to adjust camera, renderer, and geometry accordingly to maintain correct aspect ratio.

Getting Started
Prerequisites
A modern web browser with WebGL support (Chrome, Firefox, Edge, Safari)

A local or remote server environment to serve the files (necessary due to browser security restrictions on loading local files)

Installation
Clone or download the repository.

Replace the src attribute of the hidden image in index.html with the path or URL to your chosen texture image.

Serve the files using a local development server, e.g.:

Use Live Server extension in VSCode

Or run npx http-server in the project directory

Open the served URL in your browser.

Usage
Move your mouse cursor over the screen to see the parallax and fractal distortion react.

Resize the browser window to test responsiveness.

Adjust parameters like parallaxStrength, distortionIntensity, and stripeCount inside script.js for different visual effects.

Troubleshooting
Ensure the texture image loads correctly; check browser console for 404 or CORS errors.

Verify that your development environment serves files over HTTP/HTTPS (not via file://).

Confirm WebGL is supported and enabled in your browser.

Check the console for any shader compilation errors or runtime exceptions.

License
This project is provided for educational and demonstration purposes. You are free to modify and use the code in your own projects