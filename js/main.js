// ── THREE.JS 3D VISUALIZATION (Your Original Code) ──
let scene, camera, renderer, bloch_sphere, indicator_vector, axes;
const container = document.getElementById('visualization-container');

// Initialize 3D scene (unchanged from your original)
function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0d1117);
    container.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x161b22, wireframe: true, transparent: true, opacity: 0.5
    });
    bloch_sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(bloch_sphere);

    axes = new THREE.AxesHelper(1.5);
    scene.add(axes);

    indicator_vector = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0),
        1, 0x58a6ff, 0.2, 0.1
    );
    scene.add(indicator_vector);

    camera.position.z = 2.5;
    camera.position.y = 1;
}

// ── TONE.JS SONIFICATION (Your Original Code) ──
let ruberSynth, kuberSynth;

function initAudio() {
    ruberSynth = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.5 }
    }).toDestination();
    ruberSynth.volume.value = -10;

    kuberSynth = new Tone.MembraneSynth({
        pitchDecay: 0.005, octaves: 1,
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.8 }
    }).toDestination();
    kuberSynth.volume.value = -15;
    console.log("Audio Context Initialized (Tone.js Ready)");
}

// ── WEBSOCKET CLIENT (New Connection Layer) ──
const engine = new WebSocket('ws://localhost:8080');

engine.onopen = () => {
    console.log("🔗 Connected to GPU Engine");
    // Send initial 3-body configuration
    engine.send(JSON.stringify({
        type: 'INIT_ORBS',
        bodies: [
            {pos: [0.97000436, -0.24308753, 0], vel: [0.46620368, 0.43236573, 0], mass: 1},
            {pos: [-0.97000436, 0.24308753, 0], vel: [0.46620368, 0.43236573, 0], mass: 1},
            {pos: [0, 0, 0], vel: [-0.93240737, -0.86473146, 0], mass: 1}
        ]
    }));
};

// ── UI HANDLERS (Your Original Code) ──
const thetaControl = document.getElementById('theta-control');
const phiControl = document.getElementById('phi-control');
const coherenceControl = document.getElementById('coherence-control');

function handleInput() {
    const theta = parseFloat(thetaControl.value);
    const phi = parseFloat(phiControl.value);
    const coherence = parseFloat(coherenceControl.value);

    document.getElementById('theta-value').textContent = `${theta}°`;
    document.getElementById('phi-value').textContent = `${phi}°`;
    document.getElementById('coherence-value').textContent = `${coherence}%`;
    
    // Update local visualization
    updateBlochVector(theta, phi, coherence);
    
    // Send to GPU engine
    if (engine.readyState === WebSocket.OPEN) {
        engine.send(JSON.stringify({
            type: 'PARAM_UPDATE',
            theta_rad: theta * Math.PI / 180,
            phi_rad: phi * Math.PI / 180,
            fold_omega: (100 - coherence) / 100
        }));
    }
}

// ── ANIMATION LOOP (Your Original Code) ──
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// ── INITIALIZATION (Your Original Code) ──
window.onload = function() {
    initThree();
    initAudio();
    animate();
    
    thetaControl.addEventListener('input', handleInput);
    phiControl.addEventListener('input', handleInput);
    coherenceControl.addEventListener('input', handleInput);
    handleInput(); // Initial draw

    // Audio context resume on user interaction
    document.body.addEventListener('click', () => {
        if (Tone.context.state !== 'running') Tone.context.resume();
    }, { once: true });
};
