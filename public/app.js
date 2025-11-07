// State
let terpenes = {};
let currentTerpene = null;
let audioContext = null;
let oscillator = null;
let gainNode = null;
let animationId = null;

// Canvas setup
const canvas = document.getElementById('visualCanvas');
const ctx = canvas.getContext('2d');

// Initialize the application
async function init() {
    try {
        // Fetch terpene data from API
        const response = await fetch('/api/terpenes');
        terpenes = await response.json();

        // Generate terpene selector buttons
        generateTerpeneButtons();

        // Initialize audio context on first user interaction
        document.body.addEventListener('click', initAudio, { once: true });

        // Draw initial state
        drawWelcomeScreen();
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function generateTerpeneButtons() {
    const selector = document.getElementById('terpeneSelector');

    Object.keys(terpenes).forEach(key => {
        const button = document.createElement('button');
        button.className = 'terpene-btn';
        button.textContent = terpenes[key].name;
        button.onclick = () => selectTerpene(key);
        selector.appendChild(button);
    });
}

function selectTerpene(key) {
    currentTerpene = terpenes[key];

    // Update button states
    document.querySelectorAll('.terpene-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === currentTerpene.name) {
            btn.classList.add('active');
        }
    });

    // Update info panel
    updateInfoPanel();

    // Enable audio controls
    document.getElementById('playAudio').disabled = false;

    // Start visualization
    startVisualization();
}

function updateInfoPanel() {
    document.getElementById('terpeneName').textContent = currentTerpene.name;
    document.getElementById('molecular').textContent = currentTerpene.molecular;
    document.getElementById('scent').textContent = currentTerpene.scent;
    document.getElementById('frequency').textContent = currentTerpene.frequency + ' Hz';
    document.getElementById('effects').textContent = currentTerpene.effects.join(', ');
}

function drawWelcomeScreen() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#60efff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Select a terpene to visualize', canvas.width / 2, canvas.height / 2);
}

function startVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    let time = 0;

    function animate() {
        drawVisualization(time);
        time += 0.02;
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

function drawVisualization(time) {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const color = currentTerpene.color;
    const freq = currentTerpene.frequency / 100;

    // Draw molecular-inspired patterns
    ctx.save();
    ctx.translate(centerX, centerY);

    // Create multiple layers of geometric patterns
    for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 100;
        const numPoints = 6 + layer * 2;

        // Draw connecting lines
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2 + time * freq * 0.1;
            const radius = 100 + layerOffset + Math.sin(time * freq * 0.2 + layer) * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Gradient stroke
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
        gradient.addColorStop(0, color + 'ff');
        gradient.addColorStop(0.5, color + 'aa');
        gradient.addColorStop(1, color + '33');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + layer;
        ctx.stroke();

        // Draw nodes
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2 + time * freq * 0.1;
            const radius = 100 + layerOffset + Math.sin(time * freq * 0.2 + layer) * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.arc(x, y, 5 + Math.sin(time + i) * 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // Glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Draw center point
    ctx.beginPath();
    ctx.arc(0, 0, 15 + Math.sin(time * freq) * 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw frequency waves
    ctx.beginPath();
    for (let x = -canvas.width / 2; x < canvas.width / 2; x += 5) {
        const y = Math.sin(x * 0.02 + time * freq) * 30;
        if (x === -canvas.width / 2) {
            ctx.moveTo(x, y + 200);
        } else {
            ctx.lineTo(x, y + 200);
        }
    }
    ctx.strokeStyle = color + '66';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();

    // Draw terpene name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentTerpene.name, centerX, 40);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#60efff';
    ctx.fillText(currentTerpene.frequency + ' Hz', centerX, 70);
}

// Audio functions
document.getElementById('playAudio').addEventListener('click', playTone);
document.getElementById('stopAudio').addEventListener('click', stopTone);

function playTone() {
    if (!audioContext) {
        initAudio();
    }

    if (oscillator) {
        stopTone();
    }

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = currentTerpene.frequency;

    gainNode.gain.value = 0.3;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    document.getElementById('playAudio').disabled = true;
    document.getElementById('stopAudio').disabled = false;
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }

    if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
    }

    document.getElementById('playAudio').disabled = false;
    document.getElementById('stopAudio').disabled = true;
}

// Initialize on page load
init();
