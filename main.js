import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set up lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create group to hold all objects
const group = new THREE.Group();
scene.add(group);

// Load font for the letter S
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    // Create letter S
    const textGeometry = new TextGeometry('S', {
        font: font,
        size: 5,
        depth: 1,
        height: 0.3, // Reduced from 1.0 to 0.3 to make the letter thinner
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05, // Also reduced for a more subtle bevel
        bevelSize: 0.05, // Also reduced for a more subtle bevel
        bevelOffset: 0,
        bevelSegments: 5
    });
    textGeometry.computeBoundingBox();
    textGeometry.center();
    
    const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, // Gold color
        metalness: 0.7,
        roughness: 0.3
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    group.add(textMesh);

    
    // Animation is already set up in animate function
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the group slightly
    group.rotation.y += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
