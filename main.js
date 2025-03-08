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

// Create a crown mesh with a rectangular base and 3 triangle spikes
function createCrown(width, depth) {
    const crownGroup = new THREE.Group();
    
    // Crown base - a box that matches S dimensions
    const baseGeometry = new THREE.BoxGeometry(width, 0.3, depth);
    const goldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, // Gold color
        metalness: 0.7, 
        roughness: 0.3 
    });
    const base = new THREE.Mesh(baseGeometry, goldMaterial);
    crownGroup.add(base);
    
    // Create 3 triangle spikes for the crown using rectangular triangles (triangular prisms)
    const spikesMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,  // Gold color
        metalness: 0.8, 
        roughness: 0.2 
    });
    
    // Position the 3 spikes evenly across the width of the base
    const spikePositions = [
        { x: -width/3, z: 0 },  // left
        { x: 0, z: 0 },          // center
        { x: width/3, z: 0 }     // right
    ];
    
    spikePositions.forEach((pos, index) => {
        // Center spike is taller
        const height = index === 1 ? 2.0 : 1.5;
        const baseWidth = 1.2; // Wider base for the spikes
        const spikeDepth = depth * 0.8; // Make the depth of the spike slightly less than the S depth
        
        // Create a triangular prism using BufferGeometry
        const vertices = new Float32Array([
            // Front face (triangle)
            -baseWidth/2, 0, spikeDepth/2,
            baseWidth/2, 0, spikeDepth/2,
            0, height, 0,
            
            // Back face (triangle)
            baseWidth/2, 0, -spikeDepth/2,
            -baseWidth/2, 0, -spikeDepth/2,
            0, height, 0,
            
            // Bottom face (rectangle)
            -baseWidth/2, 0, -spikeDepth/2,
            baseWidth/2, 0, -spikeDepth/2,
            baseWidth/2, 0, spikeDepth/2,
            -baseWidth/2, 0, spikeDepth/2,
            
            // Left face (triangle)
            -baseWidth/2, 0, -spikeDepth/2,
            -baseWidth/2, 0, spikeDepth/2,
            0, height, 0,
            
            // Right face (triangle)
            baseWidth/2, 0, spikeDepth/2,
            baseWidth/2, 0, -spikeDepth/2,
            0, height, 0
        ]);
        
        // Define indices for the triangular faces
        const indices = new Uint16Array([
            0, 1, 2, // Front
            3, 4, 5, // Back
            6, 7, 8, 8, 9, 6, // Bottom (2 triangles)
            10, 11, 12, // Left
            13, 14, 15 // Right
        ]);
        
        // Create the buffer geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals(); // Important for proper lighting
        
        // Create the mesh
        const spike = new THREE.Mesh(geometry, spikesMaterial);
        
        // Position the spike at the appropriate location
        spike.position.set(pos.x, 0.15, 0); // Position on top of the base
        
        crownGroup.add(spike);
    });
    
    return crownGroup;
}

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
    
    // Get the bounding box to position the crown properly
    textGeometry.computeBoundingBox();
    const boundingBox = textGeometry.boundingBox;
    const height = boundingBox.max.y - boundingBox.min.y;
    const width = boundingBox.max.x - boundingBox.min.x;
    const depth = boundingBox.max.z - boundingBox.min.z;
    
    // Create and add the crown above the letter S with matching width/depth
    const crown = createCrown(width, depth);
    crown.position.y = height / 2 + 0.3; // Position right above the S
    group.add(crown);
    
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
