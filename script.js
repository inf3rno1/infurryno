/* ═══════════════════════════════════════════
   I AM ATOMIC — RYZEN FELIX
   Timing Engine + Particle Explosion System
   ═══════════════════════════════════════════ */

const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], trails = [];

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── PARTICLE CLASS ── */
class Particle {
    constructor(x, y, type) {
        this.x = x; this.y = y;
        this.type = type; // 'burst','ember','spark','ring'
        const angle = Math.random() * Math.PI * 2;
        const speed = type === 'burst' ? (8 + Math.random() * 25) :
            type === 'ember' ? (2 + Math.random() * 6) :
                type === 'spark' ? (15 + Math.random() * 35) :
                    (4 + Math.random() * 8);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = type === 'burst' ? (0.008 + Math.random() * 0.015) :
            type === 'ember' ? (0.003 + Math.random() * 0.008) :
                type === 'spark' ? (0.02 + Math.random() * 0.03) :
                    (0.005 + Math.random() * 0.01);
        this.size = type === 'burst' ? (2 + Math.random() * 5) :
            type === 'ember' ? (1 + Math.random() * 3) :
                type === 'spark' ? (1 + Math.random() * 2) :
                    (3 + Math.random() * 6);
        this.hue = 260 + Math.random() * 40; // purple range
        if (Math.random() > 0.7) this.hue = 190 + Math.random() * 20; // cyan accent
        if (Math.random() > 0.95) this.hue = 45; // gold rare
        this.trail = type === 'spark';
    }

    update() {
        if (this.trail && this.life > 0.3) {
            trails.push({
                x: this.x, y: this.y, size: this.size * 0.5,
                life: 0.5, hue: this.hue, decay: 0.04
            });
        }
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.97;
        this.vy *= 0.97;
        if (this.type === 'ember') this.vy -= 0.1; // float up
        this.life -= this.decay;
        this.size *= 0.995;
    }

    draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 + this.life * 30}%)`;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/* ── ENERGY RING ── */
let rings = [];
class EnergyRing {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.radius = 0;
        this.maxRadius = Math.max(W, H) * 1.2;
        this.speed = 18;
        this.life = 1;
        this.lineWidth = 4;
    }
    update() {
        this.radius += this.speed;
        this.speed *= 0.98;
        this.life = 1 - (this.radius / this.maxRadius);
        this.lineWidth = 4 * this.life;
    }
    draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        ctx.strokeStyle = `rgba(168, 85, 247, ${this.life})`;
        ctx.lineWidth = this.lineWidth;
        ctx.shadowColor = 'rgba(124, 45, 255, 0.8)';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        // Second ring
        ctx.globalAlpha = this.life * 0.3;
        ctx.strokeStyle = `rgba(0, 212, 255, ${this.life * 0.5})`;
        ctx.lineWidth = this.lineWidth * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

/* ── ANIMATION LOOP ── */
function animate() {
    ctx.clearRect(0, 0, W, H);

    // Draw trails
    for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.life -= t.decay;
        if (t.life <= 0) { trails.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = t.life * 0.4;
        ctx.fillStyle = `hsl(${t.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    // Draw rings
    for (let i = rings.length - 1; i >= 0; i--) {
        rings[i].update();
        rings[i].draw();
        if (rings[i].life <= 0) rings.splice(i, 1);
    }

    requestAnimationFrame(animate);
}
animate();

/* ── EXPLOSION FUNCTION ── */
function explode() {
    const cx = W / 2, cy = H / 2;

    // Massive burst
    for (let i = 0; i < 200; i++) particles.push(new Particle(cx, cy, 'burst'));
    // Sparks
    for (let i = 0; i < 100; i++) particles.push(new Particle(cx, cy, 'spark'));
    // Embers (float up slowly)
    for (let i = 0; i < 80; i++) particles.push(new Particle(cx, cy, 'ember'));

    // Energy rings
    rings.push(new EnergyRing(cx, cy));
    setTimeout(() => rings.push(new EnergyRing(cx, cy)), 100);
    setTimeout(() => rings.push(new EnergyRing(cx, cy)), 250);
}

/* ── AMBIENT EMBER SPAWNER ── */
function spawnAmbientEmbers() {
    if (nameRevealed) {
        for (let i = 0; i < 3; i++) {
            const p = new Particle(
                W * 0.3 + Math.random() * W * 0.4,
                H * 0.4 + Math.random() * H * 0.2,
                'ember'
            );
            p.decay = 0.002 + Math.random() * 0.004;
            p.size = 1 + Math.random() * 2;
            particles.push(p);
        }
    }
}
setInterval(spawnAmbientEmbers, 200);

/* ══════════════════════════════
   TIMING SEQUENCE
   ══════════════════════════════ */
let nameRevealed = false;
const preText = document.getElementById('preText');
const nameReveal = document.getElementById('nameReveal');
const mainName = document.getElementById('mainName');
const nameGlitch = document.getElementById('nameGlitch');
const subText = document.getElementById('subText');
const impactFlash = document.getElementById('impactFlash');
const shockwave = document.getElementById('shockwave');
const shakeWrap = document.getElementById('shakeWrap');
const chromatic = document.getElementById('chromatic');
const afterGlitch = document.getElementById('afterGlitch');
const replayHint = document.getElementById('replayHint');
const burstLines = document.querySelectorAll('.burstLine');
const letters = document.querySelectorAll('.letter');

function runSequence() {
    nameRevealed = false;

    // Reset everything
    preText.className = '';
    nameReveal.className = '';
    mainName.className = '';
    nameGlitch.className = '';
    subText.className = '';
    impactFlash.className = '';
    shockwave.className = '';
    shakeWrap.className = '';
    chromatic.className = '';
    afterGlitch.className = '';
    replayHint.className = '';
    burstLines.forEach(b => b.className = b.className.replace(' fire', ''));
    letters.forEach(l => l.classList.remove('pop'));
    particles = []; trails = []; rings = [];

    // Reset GIF by reloading src
    const gif = document.getElementById('cidGif');
    const src = gif.src;
    gif.src = '';
    gif.src = src;

    /* ── PHASE 1: "I AM..." text (appears early, building tension) ── */
    setTimeout(() => {
        preText.classList.add('show');
    }, 800);

    /* ── small shake — energy building ── */
    setTimeout(() => {
        shakeWrap.classList.add('shake2');
        setTimeout(() => shakeWrap.classList.remove('shake2'), 300);
    }, 1500);

    /* ── PHASE 2: Hide "I AM", show the NAME ── */
    /* This is THE MOMENT — Cid says "ATOMIC" and RYZEN FELIX explodes */
    setTimeout(() => {
        // Hide pretext
        preText.classList.add('hide');

        // IMPACT FLASH
        impactFlash.classList.add('fire');

        // MEGA SHAKE
        shakeWrap.classList.add('megaShake');

        // SHOCKWAVE
        shockwave.classList.add('expand');

        // BURST LINES
        burstLines.forEach(b => b.classList.add('fire'));

        // CHROMATIC ABERRATION
        chromatic.classList.add('fire');

        // PARTICLE EXPLOSION
        explode();

        // Reveal the name
        nameReveal.classList.add('go');

        // Pop each letter with stagger
        letters.forEach(l => l.classList.add('pop'));

        // Glitch the name container
        nameGlitch.classList.add('glitching');

        // Sub text "A T O M I C"
        subText.classList.add('show');

        nameRevealed = true;

    }, 2200);

    /* ── PHASE 3: After-effects ── */
    setTimeout(() => {
        shakeWrap.classList.remove('megaShake');
        shakeWrap.classList.add('shake');
        afterGlitch.classList.add('fire');
    }, 2500);

    setTimeout(() => {
        shakeWrap.classList.remove('shake');
        nameGlitch.classList.remove('glitching');
        mainName.classList.add('live');
    }, 3000);

    /* ── Second shockwave ── */
    setTimeout(() => {
        rings.push(new EnergyRing(W / 2, H / 2));
        shakeWrap.classList.add('shake2');
        setTimeout(() => shakeWrap.classList.remove('shake2'), 300);
    }, 3200);

    /* ── Third burst of particles ── */
    setTimeout(() => {
        for (let i = 0; i < 50; i++) particles.push(new Particle(W / 2, H / 2, 'burst'));
        for (let i = 0; i < 30; i++) particles.push(new Particle(W / 2, H / 2, 'ember'));
    }, 3500);

    /* ── Show replay hint ── */
    setTimeout(() => {
        replayHint.classList.add('show');
    }, 5000);
}

/* ── START ── */
window.addEventListener('load', () => {
    setTimeout(runSequence, 300);
});

/* ── REPLAY ON CLICK ── */
document.addEventListener('click', () => {
    if (nameRevealed) runSequence();
});

/* ── REPLAY ON SPACE ── */
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && nameRevealed) {
        e.preventDefault();
        runSequence();
    }
});
