// Ha van korábban elmentett szög, onnan indulunk; különben 0-val kezdi.
let currentAngle = parseFloat(localStorage.getItem('savedAngle')) || 0;

// Ha korábban módosított torus szín mentésre került, azt használjuk.
let savedTorusColor = localStorage.getItem('torusColor') || null;

// Three.js alapbeállítások: jelenet, kamera, renderer
const container = document.getElementById('container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Világítás beállítása
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffa95c, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// TorusKnot objektum létrehozása
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: savedTorusColor ? parseInt(savedTorusColor) : 0x00ffcc,
  roughness: 0.5,
  metalness: 0.1
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Részecske rendszer, extra vizuális hatásként
const particlesCount = 500;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Ablakméret változásakor a kamera és renderer frissítése
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Szög értékének frissítése – itt szimuláljuk azt, amit korábban a szerver küldött volna.
setInterval(() => {
  currentAngle += Math.PI / 180;
}, 16);

// A jelenlegi szögértéket mentjük a localStorage-ba másodpercenként,
// így újratöltéskor folytatódik az animáció az előző állapottal.
setInterval(() => {
  localStorage.setItem('savedAngle', currentAngle);
}, 1000);

// Animációs ciklus
function animate() {
  requestAnimationFrame(animate);
  
  // Az objektum forgatása a currentAngle értéke alapján
  torusKnot.rotation.x += 0.01 + Math.sin(currentAngle) * 0.005;
  torusKnot.rotation.y += 0.01 + Math.cos(currentAngle) * 0.005;
  
  // Részecske rendszer finom animációja
  particles.rotation.y += 0.001 * Math.cos(currentAngle);
  
  renderer.render(scene, camera);
}

animate();

// Extra interaktivitás: klikkelésre változtassa meg a torusKnot színét,
// majd mentse az új színt a localStorage-ba.
window.addEventListener('click', () => {
  const randomColor = Math.floor(Math.random() * 16777215);
  torusKnot.material.color.setHex(randomColor);
  localStorage.setItem('torusColor', randomColor);
});
