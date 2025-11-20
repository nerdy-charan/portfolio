// --- 0. CUSTOM CURSOR TRAIL ---
let lastTrailTime = 0;
let isHoveringClickable = false;

// Track mouse position and create trail
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 25) { // Create trail every 25ms
        createTrail(e.clientX, e.clientY, isHoveringClickable);
        lastTrailTime = now;
    }
});

// Create trail particles
function createTrail(x, y, inverted) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail' + (inverted ? ' inverted' : '');
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);

    // Remove after animation
    setTimeout(() => trail.remove(), 500);
}

// Track hover state for color inversion
const hoverElements = document.querySelectorAll('a, button, .project-card, .nav-link, [data-magnetic]');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        isHoveringClickable = true;
    });
    el.addEventListener('mouseleave', () => {
        isHoveringClickable = false;
    });
});

// --- 1. INTERACTIVE ORBIT & HOLOGRAPHIC PANEL ---
const centerStar = document.getElementById('center-star');
const orbitContainer = document.querySelector('.orbit-container');
const holoPanel = document.getElementById('holo-panel');
const closeHolo = document.getElementById('close-holo');

// Open Panel
centerStar.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent immediate close
    orbitContainer.classList.add('expanded');
    holoPanel.classList.add('active');
});

// Close Panel
function closePanel() {
    orbitContainer.classList.remove('expanded');
    holoPanel.classList.remove('active');
}

closeHolo.addEventListener('click', closePanel);

// Close on Outside Click
document.addEventListener('click', (e) => {
    if (holoPanel.classList.contains('active') &&
        !holoPanel.contains(e.target) &&
        !centerStar.contains(e.target)) {
        closePanel();
    }
});

// --- 2. DATA LOG TIMELINE ANIMATIONS ---
const timelineItems = document.querySelectorAll('.timeline-item');

// Set initial states
timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
});

// Intersection Observer for scroll-triggered animations
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transition = 'all 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// --- 3. SMOOTH SCROLL NAVIGATION ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- 4. NEURAL NETWORK CANVAS (NO EXTERNAL LIBRARY) ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let nodes = [];

// Configuration
const config = {
    nodeCount: 60,
    connectionDistance: 150,
    mouseDistance: 200,
    speed: 0.5
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Node {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = '#00FF9D'; // Accent Color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Init Nodes
for (let i = 0; i < config.nodeCount; i++) nodes.push(new Node());

// Animation Loop
function animateNetwork() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node, index) => {
        node.update();
        node.draw();

        // Connect nodes
        for (let j = index + 1; j < nodes.length; j++) {
            let other = nodes[j];
            let dx = node.x - other.x;
            let dy = node.y - other.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.connectionDistance) {
                ctx.strokeStyle = `rgba(0, 255, 157, ${1 - dist / config.connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateNetwork);
}
animateNetwork();

// --- 3. HORIZONTAL SCROLL (GSAP) ---
gsap.registerPlugin(ScrollTrigger);

const container = document.querySelector('.horizontal-wrapper');
const section = document.querySelector('.projects-section');

if (window.innerWidth > 768) {
    // Calculate total scroll distance based on container width
    const scrollDistance = container.scrollWidth - window.innerWidth;

    let scrollTween = gsap.to(container, {
        x: -scrollDistance,
        ease: "power2.inOut", // Smooth easing to prevent bumps
        scrollTrigger: {
            trigger: ".projects-section",
            pin: true,
            scrub: 2, // Higher scrub for smoother, more gradual movement
            end: () => "+=" + (scrollDistance + 500), // Extra padding for smooth exit
            invalidateOnRefresh: true
        }
    });
}

// --- 4. 3D TILT EFFECT FOR CARDS ---
const cards = document.querySelectorAll('.project-card.glass');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max rotation deg
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Instant update for smoothness
        card.style.transition = 'none';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        // Smooth reset
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
});

// --- 5. INTERACTIVE TERMINAL (TYPEWRITER EFFECT) ---
const runBtn = document.getElementById('run-btn');
const typeOutput = document.getElementById('typewriter');

runBtn.addEventListener('click', () => {
    if (runBtn.classList.contains('running')) return;

    runBtn.classList.add('running');
    runBtn.innerText = "EXECUTING...";
    runBtn.style.background = "#333";
    runBtn.style.color = "#fff";
    typeOutput.innerHTML = ""; // Clear previous

    // Simulate processing delay
    setTimeout(() => {
        // Create resume display container
        const resumeContainer = document.createElement('div');
        resumeContainer.className = 'resume-display';

        // Add "Output:" label like in Colab
        const outputLabel = document.createElement('div');
        outputLabel.className = 'output-label';
        outputLabel.textContent = '> Output:';
        resumeContainer.appendChild(outputLabel);

        // Create PDF embed (using object tag for better display)
        const pdfEmbed = document.createElement('object');
        pdfEmbed.data = 'resume.pdf';
        pdfEmbed.type = 'application/pdf';
        pdfEmbed.className = 'resume-pdf-embed';

        // Fallback for browsers that can't display PDF
        const fallback = document.createElement('div');
        fallback.className = 'pdf-fallback';
        fallback.innerHTML = '<p>Resume preview not available in this browser.</p>';
        pdfEmbed.appendChild(fallback);

        resumeContainer.appendChild(pdfEmbed);

        // Add download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = 'resume.pdf';
        downloadBtn.download = 'SaiCharan_Resume.pdf';
        downloadBtn.className = 'terminal-download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> DOWNLOAD RESUME.PDF';
        resumeContainer.appendChild(downloadBtn);

        typeOutput.appendChild(resumeContainer);

        runBtn.innerText = "COMPLETED";
        runBtn.style.background = "var(--accent)";
        runBtn.style.color = "#000";
    }, 1000);
});

// --- 6. GLITCH TEXT EFFECT (HERO) ---
const glitchText = document.querySelector('.glitch-text');
const originalText = glitchText.getAttribute('data-text');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

glitchText.onmouseover = event => {
    let iteration = 0;
    clearInterval(event.target.interval);

    event.target.interval = setInterval(() => {
        event.target.innerText = event.target.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iteration >= originalText.length) {
            clearInterval(event.target.interval);
        }

        iteration += 1 / 3;
    }, 30);
};
