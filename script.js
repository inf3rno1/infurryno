
function lerp(a, b, t) { return a + (b - a) * t; }

// ═══ MATRIX RAIN ═══
const matrixCv = document.getElementById('matrixCanvas');
const mctx = matrixCv.getContext('2d');
function resizeMatrix() { matrixCv.width = window.innerWidth; matrixCv.height = window.innerHeight; }
resizeMatrix();
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789INFERNO';
const matrixCols = Math.floor(window.innerWidth / 14);
const matrixDrops = Array.from({ length: matrixCols }, () => Math.random() * -100);
let matrixActive = true;

function drawMatrix() {
    if (!matrixActive) return;
    mctx.fillStyle = 'rgba(0,0,0,0.06)';
    mctx.fillRect(0, 0, matrixCv.width, matrixCv.height);
    mctx.font = '12px monospace';
    for (let i = 0; i < matrixDrops.length; i++) {
        const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 14;
        const y = matrixDrops[i] * 14;
        const colors = ['rgba(124,45,255,0.7)', 'rgba(0,212,255,0.5)', 'rgba(0,255,0,0.4)'];
        mctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        mctx.fillText(ch, x, y);
        if (y > matrixCv.height && Math.random() > 0.975) matrixDrops[i] = 0;
        matrixDrops[i] += 0.5 + Math.random() * 0.5;
    }
    requestAnimationFrame(drawMatrix);
}
drawMatrix();

// ═══ CLOCK ═══
function tick() {
    const n = new Date();
    document.getElementById('ch').textContent = String(n.getHours()).padStart(2, '0');
    document.getElementById('cm').textContent = String(n.getMinutes()).padStart(2, '0');
    document.getElementById('cd').textContent =
        n.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() + ' · ' +
        n.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}
setInterval(tick, 1000); tick();

// ═══ PHASE 0: BOOT SEQUENCE ═══
const blines = ['bl0', 'bl1', 'bl2', 'bl3', 'bl4', 'bl5', 'bl6', 'bl7'];
let bi = 0;
const bt = setInterval(() => {
    if (bi < blines.length) {
        const el = document.getElementById(blines[bi]);
        if (el) el.classList.add('show');
        bi++;
    } else {
        clearInterval(bt);
        setTimeout(p1start, 500);
    }
}, 180);

// ═══ PHASE 1: CID ═══
function p1start() {
    matrixActive = false;
    matrixCv.style.transition = 'opacity 0.8s';
    matrixCv.style.opacity = '0';
    document.getElementById('phase0').classList.add('out');
    setTimeout(() => {
        document.getElementById('phase0').style.display = 'none';
        document.getElementById('phase1').classList.add('on');
        runBar();
    }, 600);
}

let pct = 0, bt2;
function runBar() {
    bt2 = setInterval(() => {
        pct = Math.min(pct + Math.random() * 3.5 + 1.2, 100);
        document.getElementById('p1fill').style.width = pct + '%';
        document.getElementById('p1pct').textContent = Math.floor(pct) + '%';
        if (pct >= 100) {
            clearInterval(bt2);
            document.getElementById('p1pct').textContent = '100%';
            setTimeout(p2start, 500);
        }
    }, 50);
}

// Skip
document.getElementById('skipBtn').addEventListener('click', () => { clearInterval(bt2); skipToMain(); });
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === ' ') {
        clearInterval(bt2);
        skipToMain();
    }
});

function skipToMain() {
    // Skip all phases, go straight to main
    ['phase0', 'phase1', 'phase2', 'phase3S', 'phase4', 'phase5'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; }
    });
    matrixActive = false;
    matrixCv.style.display = 'none';
    showMainCard();
}

// ═══ PHASE 2: KIRITO ═══
function p2start() {
    // Flash transition
    createTransitionFlash();
    const p1 = document.getElementById('phase1');
    p1.classList.add('out');
    document.getElementById('phase2').classList.add('on');
    setTimeout(() => {
        document.getElementById('phase2').classList.add('out');
        createTransitionFlash();
        setTimeout(() => {
            p1.style.display = 'none';
            document.getElementById('phase2').style.display = 'none';
            p3Sstart();
        }, 700);
    }, 2600);
}

// ═══ PHASE 3: SAKUTA ═══
function p3Sstart() {
    document.getElementById('phase3S').classList.add('on');
    setTimeout(() => {
        document.getElementById('phase3S').classList.add('out');
        createTransitionFlash();
        setTimeout(() => {
            document.getElementById('phase3S').style.display = 'none';
            p4start();
        }, 800);
    }, 3000);
}

// ═══ PHASE 4: NASA YUZAKI ═══
function p4start() {
    document.getElementById('phase4').classList.add('on');
    setTimeout(() => {
        document.getElementById('phase4').classList.add('out');
        createTransitionFlash();
        setTimeout(() => {
            document.getElementById('phase4').style.display = 'none';
            p5start();
        }, 800);
    }, 3000);
}

// ═══ TRANSITION FLASH ═══
function createTransitionFlash() {
    const f = document.createElement('div');
    f.className = 'transitionFlash';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 500);
}

// ═══════════════════════════════════════
// PHASE 5: DRAGON CANVAS ANIMATION
// ═══════════════════════════════════════
const dragonCv = document.getElementById('dragonCanvas');
const dctx = dragonCv.getContext('2d');
dragonCv.width = window.innerWidth;
dragonCv.height = window.innerHeight;

const SEG = 42;
const dragon = {
    segments: [], angle: 0, orbitRadius: 280, orbitSpeed: 0.028,
    orbitAngle: Math.PI, cx: window.innerWidth / 2, cy: window.innerHeight / 2,
    phase: 'fly-in', flyInProgress: 0, circleCount: 0,
    convergeProgress: 0, alpha: 1, headX: 0, headY: 0,
};

for (let i = 0; i < SEG; i++) {
    dragon.segments.push({
        x: window.innerWidth / 2 + Math.cos(Math.PI + i * 0.22) * (320 + i * 4),
        y: window.innerHeight / 2 + Math.sin(Math.PI + i * 0.22) * (320 + i * 4),
        angle: 0
    });
}

function dragonColor(t, alpha) {
    const r = Math.floor(124 + 131 * t);
    const g = Math.floor(45 * t);
    const b = Math.floor(255 - 100 * t);
    return `rgba(${r},${g},${b},${alpha})`;
}

function drawDragonHead(x, y, angle, size, alpha) {
    dctx.save(); dctx.translate(x, y); dctx.rotate(angle); dctx.globalAlpha = alpha;
    const hg = dctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.5);
    hg.addColorStop(0, 'rgba(168,85,247,0.9)');
    hg.addColorStop(0.4, 'rgba(124,45,255,0.6)');
    hg.addColorStop(1, 'rgba(124,45,255,0)');
    dctx.beginPath(); dctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
    dctx.fillStyle = hg; dctx.fill();
    dctx.beginPath();
    dctx.moveTo(size * 1.8, 0); dctx.lineTo(size * 0.4, size * 0.7);
    dctx.lineTo(-size * 0.2, size * 0.5); dctx.lineTo(-size * 0.5, 0);
    dctx.lineTo(-size * 0.2, -size * 0.5); dctx.lineTo(size * 0.4, -size * 0.7);
    dctx.closePath();
    dctx.fillStyle = 'rgba(124,45,255,0.85)'; dctx.fill();
    dctx.strokeStyle = 'rgba(168,85,247,0.9)'; dctx.lineWidth = 1.5; dctx.stroke();
    dctx.beginPath(); dctx.arc(size * 0.7, -size * 0.35, size * 0.22, 0, Math.PI * 2);
    dctx.fillStyle = 'rgba(0,212,255,1)'; dctx.fill();
    dctx.beginPath(); dctx.arc(size * 0.7, -size * 0.35, size * 0.1, 0, Math.PI * 2);
    dctx.fillStyle = '#fff'; dctx.fill();
    dctx.beginPath(); dctx.moveTo(size * 0.2, -size * 0.5); dctx.lineTo(size * 0.6, -size * 1.2);
    dctx.strokeStyle = 'rgba(0,212,255,0.9)'; dctx.lineWidth = 2; dctx.stroke();
    dctx.beginPath(); dctx.moveTo(-size * 0.1, -size * 0.4); dctx.lineTo(size * 0.2, -size * 1.1); dctx.stroke();
    for (let i = 0; i < 6; i++) {
        const bx = size * (1.8 + Math.random() * 2.5), by = (Math.random() - 0.5) * size * 1.5;
        const bs = Math.random() * size * 0.5 + size * 0.1;
        dctx.beginPath(); dctx.arc(bx, by, bs, 0, Math.PI * 2);
        dctx.fillStyle = (Math.random() > 0.5 ? 'rgba(124,45,255,' : 'rgba(0,212,255,') + (Math.random() * 0.7 + 0.2) + ')';
        dctx.fill();
    }
    dctx.restore();
}

function drawDragonBody(segs, alpha) {
    if (segs.length < 2) return;
    for (let i = 0; i < segs.length - 1; i++) {
        const s = segs[i], s2 = segs[i + 1], t = i / segs.length;
        const size = Math.max(2, (1 - t) * 14 + 2);
        dctx.beginPath(); dctx.moveTo(s.x, s.y); dctx.lineTo(s2.x, s2.y);
        dctx.strokeStyle = dragonColor(t, alpha * (1 - t * 0.4));
        dctx.lineWidth = size; dctx.lineCap = 'round'; dctx.stroke();
        dctx.beginPath(); dctx.moveTo(s.x, s.y); dctx.lineTo(s2.x, s2.y);
        dctx.strokeStyle = `rgba(168,85,247,${alpha * 0.4 * (1 - t)})`;
        dctx.lineWidth = size * 2.5; dctx.stroke();
        if (i % 4 === 0 && i > 0) {
            const ang = Math.atan2(s2.y - s.y, s2.x - s.x) + Math.PI / 2;
            dctx.beginPath(); dctx.moveTo(s.x, s.y);
            dctx.lineTo(s.x + Math.cos(ang) * size * 1.6, s.y + Math.sin(ang) * size * 1.6);
            dctx.strokeStyle = `rgba(0,212,255,${alpha * 0.7 * (1 - t)})`;
            dctx.lineWidth = 1.5; dctx.stroke();
        }
    }
}

let dragonRaf, dragonDone = false, lastOA = Math.PI;

function p5start() {
    document.getElementById('phase5').classList.add('on');
    dragon.cx = window.innerWidth / 2; dragon.cy = window.innerHeight / 2;
    dragonRaf = requestAnimationFrame(dragonLoop);
}

const dParticles = [];
function spawnDragonParticle(x, y) {
    dParticles.push({
        x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
        life: 1, size: Math.random() * 4 + 1, col: Math.random() > 0.5 ? '124,45,255' : '0,212,255'
    });
    for (let i = dParticles.length - 1; i >= 0; i--) {
        const p = dParticles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.06; p.vx *= 0.92; p.vy *= 0.92;
        if (p.life <= 0) { dParticles.splice(i, 1); continue; }
        dctx.beginPath(); dctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        dctx.fillStyle = `rgba(${p.col},${p.life * 0.8})`; dctx.fill();
    }
}

function dragonLoop() {
    if (dragonDone) return;
    dctx.clearRect(0, 0, dragonCv.width, dragonCv.height);
    const cg = dctx.createRadialGradient(dragon.cx, dragon.cy, 0, dragon.cx, dragon.cy, 350);
    cg.addColorStop(0, 'rgba(124,45,255,0.12)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.beginPath(); dctx.arc(dragon.cx, dragon.cy, 350, 0, Math.PI * 2);
    dctx.fillStyle = cg; dctx.fill();

    if (dragon.phase === 'fly-in') {
        dragon.flyInProgress = Math.min(dragon.flyInProgress + 0.025, 1);
        const ease = 1 - Math.pow(1 - dragon.flyInProgress, 3);
        dragon.orbitAngle += dragon.orbitSpeed;
        const tx = dragon.cx + Math.cos(dragon.orbitAngle) * dragon.orbitRadius;
        const ty = dragon.cy + Math.sin(dragon.orbitAngle) * dragon.orbitRadius;
        dragon.headX = lerp(dragon.headX || window.innerWidth * 1.4, tx, 0.04 + ease * 0.06);
        dragon.headY = lerp(dragon.headY || window.innerHeight * 0.1, ty, 0.04 + ease * 0.06);
        if (dragon.flyInProgress >= 1) dragon.phase = 'circle';
    } else if (dragon.phase === 'circle') {
        dragon.orbitAngle += dragon.orbitSpeed;
        if (dragon.orbitAngle > Math.PI + (Math.PI * 2 * 2)) dragon.phase = 'converge';
        dragon.headX = dragon.cx + Math.cos(dragon.orbitAngle) * dragon.orbitRadius;
        dragon.headY = dragon.cy + Math.sin(dragon.orbitAngle) * dragon.orbitRadius;
    } else if (dragon.phase === 'converge') {
        dragon.convergeProgress = Math.min(dragon.convergeProgress + 0.018, 1);
        const ease = 1 - Math.pow(1 - dragon.convergeProgress, 3);
        const shrink = dragon.orbitRadius * (1 - ease * 0.75);
        dragon.orbitAngle += dragon.orbitSpeed * (1 + ease * 2);
        dragon.headX = dragon.cx + Math.cos(dragon.orbitAngle) * shrink;
        dragon.headY = dragon.cy + Math.sin(dragon.orbitAngle) * shrink;
        dragon.alpha = 1 - ease * 0.9;
        if (dragon.convergeProgress >= 1) {
            dragonDone = true; cancelAnimationFrame(dragonRaf);
            createTransitionFlash();
            document.getElementById('phase5').classList.add('out');
            setTimeout(() => { document.getElementById('phase5').style.display = 'none'; showMainCard(); }, 800);
            return;
        }
    }

    dragon.segments[0].x = lerp(dragon.segments[0].x, dragon.headX, 0.22);
    dragon.segments[0].y = lerp(dragon.segments[0].y, dragon.headY, 0.22);
    for (let i = 1; i < dragon.segments.length; i++) {
        const prev = dragon.segments[i - 1], cur = dragon.segments[i];
        const d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
        const segLen = 16 - (i * 0.2);
        if (d > segLen) {
            const ang = Math.atan2(cur.y - prev.y, cur.x - prev.x);
            cur.x = prev.x + Math.cos(ang) * segLen;
            cur.y = prev.y + Math.sin(ang) * segLen;
        }
    }

    const hAngle = Math.atan2(dragon.segments[0].y - (dragon.segments[1]?.y || dragon.segments[0].y + 1),
        dragon.segments[0].x - (dragon.segments[1]?.x || dragon.segments[0].x + 1));
    drawDragonBody(dragon.segments, dragon.alpha);
    drawDragonHead(dragon.segments[0].x, dragon.segments[0].y, hAngle, 12, dragon.alpha);
    spawnDragonParticle(dragon.segments[0].x, dragon.segments[0].y);

    if (dragon.phase !== 'converge') {
        dctx.beginPath(); dctx.arc(dragon.cx, dragon.cy, dragon.orbitRadius, 0, Math.PI * 2);
        dctx.strokeStyle = 'rgba(124,45,255,0.08)'; dctx.lineWidth = 1; dctx.stroke();
    }
    dragonRaf = requestAnimationFrame(dragonLoop);
}

// ═══ SHOW MAIN CARD ═══
function showMainCard() {
    document.getElementById('main').classList.add('on');
    setTimeout(() => {
        document.getElementById('cw').classList.add('on');
        document.querySelectorAll('.s').forEach((el, i) =>
            setTimeout(() => el.classList.add('go'), 50 + i * 80));
        startCardDragon();
        spawnKanji();
    }, 100);
}

// ═══ CARD DRAGON ═══
const d2cv = document.getElementById('dragon2');
const d2ctx = d2cv.getContext('2d');
d2cv.width = window.innerWidth; d2cv.height = window.innerHeight;

const d2 = { segs: [], angle: 0, speed: 0.018, alpha: 0 };
for (let i = 0; i < 36; i++) d2.segs.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

function startCardDragon() {
    d2.alpha = 0;
    const fi = setInterval(() => { d2.alpha = Math.min(d2.alpha + 0.02, 0.75); if (d2.alpha >= 0.75) clearInterval(fi); }, 30);
    requestAnimationFrame(cardDragonLoop);
}

function cardDragonLoop() {
    d2ctx.clearRect(0, 0, d2cv.width, d2cv.height);
    d2.angle += d2.speed;
    const cw = document.getElementById('cw');
    if (!cw) return;
    const cr = cw.getBoundingClientRect();
    const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
    const rx = cr.width / 2 + 45, ry = cr.height / 2 + 45;
    const hx = cx + Math.cos(d2.angle) * rx, hy = cy + Math.sin(d2.angle) * ry * 0.7;

    d2.segs[0].x = lerp(d2.segs[0].x, hx, 0.25);
    d2.segs[0].y = lerp(d2.segs[0].y, hy, 0.25);
    for (let i = 1; i < d2.segs.length; i++) {
        const prev = d2.segs[i - 1], cur = d2.segs[i];
        const dist = Math.hypot(cur.x - prev.x, cur.y - prev.y);
        const sl = 14 - (i * 0.18);
        if (dist > sl) {
            const a = Math.atan2(cur.y - prev.y, cur.x - prev.x);
            cur.x = prev.x + Math.cos(a) * sl; cur.y = prev.y + Math.sin(a) * sl;
        }
    }

    for (let i = 0; i < d2.segs.length - 1; i++) {
        const s = d2.segs[i], s2 = d2.segs[i + 1], t = i / d2.segs.length;
        const sz = Math.max(1.5, (1 - t) * 10 + 1.5), a = d2.alpha * (1 - t * 0.5);
        d2ctx.beginPath(); d2ctx.moveTo(s.x, s.y); d2ctx.lineTo(s2.x, s2.y);
        d2ctx.strokeStyle = `rgba(${Math.floor(124 + 80 * t)},${Math.floor(45 * t)},255,${a})`;
        d2ctx.lineWidth = sz; d2ctx.lineCap = 'round'; d2ctx.stroke();
        d2ctx.beginPath(); d2ctx.moveTo(s.x, s.y); d2ctx.lineTo(s2.x, s2.y);
        d2ctx.strokeStyle = `rgba(168,85,247,${a * 0.35 * (1 - t)})`; d2ctx.lineWidth = sz * 2.8; d2ctx.stroke();
    }

    const ha = Math.atan2(d2.segs[0].y - (d2.segs[1]?.y || d2.segs[0].y + 1), d2.segs[0].x - (d2.segs[1]?.x || d2.segs[0].x + 1));
    d2ctx.save(); d2ctx.translate(d2.segs[0].x, d2.segs[0].y); d2ctx.rotate(ha); d2ctx.globalAlpha = d2.alpha;
    const hg2 = d2ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
    hg2.addColorStop(0, 'rgba(168,85,247,0.9)'); hg2.addColorStop(1, 'rgba(124,45,255,0)');
    d2ctx.beginPath(); d2ctx.arc(0, 0, 18, 0, Math.PI * 2); d2ctx.fillStyle = hg2; d2ctx.fill();
    d2ctx.beginPath(); d2ctx.moveTo(12, 0); d2ctx.lineTo(3, 5); d2ctx.lineTo(-4, 3);
    d2ctx.lineTo(-5, 0); d2ctx.lineTo(-4, -3); d2ctx.lineTo(3, -5); d2ctx.closePath();
    d2ctx.fillStyle = 'rgba(124,45,255,0.9)'; d2ctx.fill();
    d2ctx.strokeStyle = 'rgba(168,85,247,1)'; d2ctx.lineWidth = 1; d2ctx.stroke();
    d2ctx.beginPath(); d2ctx.arc(5, -3, 2.5, 0, Math.PI * 2);
    d2ctx.fillStyle = 'rgba(0,212,255,1)'; d2ctx.fill();
    for (let i = 0; i < 3; i++) {
        d2ctx.beginPath(); d2ctx.arc(14 + Math.random() * 14, (Math.random() - 0.5) * 8, Math.random() * 3 + 1, 0, Math.PI * 2);
        d2ctx.fillStyle = `rgba(168,85,247,${Math.random() * 0.6 + 0.2})`; d2ctx.fill();
    }
    d2ctx.restore();
    requestAnimationFrame(cardDragonLoop);
}

// ═══ BANNER CAROUSEL ═══
const bnames = ['// shadow garden //', '// cid kagenou //', '// sakuta azusagawa //', '// tonikawa //'];
let cb = 0;
setInterval(() => setBanner((cb + 1) % 4), 4000);
function setBanner(n) {
    document.querySelectorAll('.bslide').forEach((s, i) => s.classList.toggle('active', i === n));
    document.querySelectorAll('.bdot').forEach((d, i) => d.classList.toggle('on', i === n));
    const lbl = document.getElementById('blbl');
    if (lbl) lbl.textContent = bnames[n];
    cb = n;
}

// ═══ PARALLAX + TILT ═══
const mbg = document.getElementById('mbg'), card = document.getElementById('card'), halo = document.getElementById('halo'), haloRing = document.getElementById('haloRing');
let mx = window.innerWidth / 2, my = window.innerHeight / 2, cx2 = mx, cy2 = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tiltLoop() {
    cx2 = lerp(cx2, mx, 0.055); cy2 = lerp(cy2, my, 0.055);
    const rx = (cx2 / window.innerWidth - 0.5), ry = (cy2 / window.innerHeight - 0.5);
    if (mbg) mbg.style.transform = `translate(${rx * -22}px,${ry * -22}px)`;
    if (card) card.style.transform = `perspective(900px) rotateX(${ry * -9}deg) rotateY(${rx * 9}deg)`;
    if (halo) { halo.style.left = mx + 'px'; halo.style.top = my + 'px'; }
    if (haloRing) { haloRing.style.left = mx + 'px'; haloRing.style.top = my + 'px'; }
    requestAnimationFrame(tiltLoop);
})();

// ═══ PARTICLES ═══
const fxcv = document.getElementById('fx'), fxc = fxcv.getContext('2d');
function rsz() {
    fxcv.width = window.innerWidth; fxcv.height = window.innerHeight;
    d2cv.width = window.innerWidth; d2cv.height = window.innerHeight;
    dragonCv.width = window.innerWidth; dragonCv.height = window.innerHeight;
    matrixCv.width = window.innerWidth; matrixCv.height = window.innerHeight;
}
window.addEventListener('resize', rsz); rsz();

const cols = { p: '124,45,255', c: '0,212,255', r: '255,45,85' };
const pts = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    s: Math.random() * 2 + .2, a: Math.random() * .35 + .04,
    t: ['p', 'c', 'r'][Math.floor(Math.random() * 3)]
}));
(function fx() {
    fxc.clearRect(0, 0, fxcv.width, fxcv.height);
    pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > fxcv.width) p.vx *= -1;
        if (p.y < 0 || p.y > fxcv.height) p.vy *= -1;
        fxc.beginPath(); fxc.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        fxc.fillStyle = `rgba(${cols[p.t]},${p.a})`; fxc.fill();
        for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 120) {
                fxc.beginPath(); fxc.strokeStyle = `rgba(124,45,255,${(120 - d) / 120 * .055})`;
                fxc.lineWidth = .4; fxc.moveTo(p.x, p.y); fxc.lineTo(q.x, q.y); fxc.stroke();
            }
        }
    });
    requestAnimationFrame(fx);
})();

// ═══ SPARKLES ═══
const spc = document.getElementById('sparkles');
const scols = ['rgba(168,85,247,', 'rgba(0,212,255,', 'rgba(255,255,255,', 'rgba(255,45,85,', 'rgba(255,215,0,'];
function spawnSp() {
    const s = document.createElement('div'); s.className = 'spk';
    s.style.left = Math.random() * 100 + 'vw'; s.style.bottom = '0';
    const dur = Math.random() * 3 + 2;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = Math.random() * 1.5 + 's';
    const c = scols[Math.floor(Math.random() * scols.length)];
    s.style.background = c + '1)';
    s.style.boxShadow = `0 0 5px ${c}0.8)`;
    spc.appendChild(s);
    setTimeout(() => s.remove(), (dur + 1.5) * 1000);
}
setInterval(spawnSp, 250);

// ═══ FLOATING KANJI ═══
const kanjiChars = ['影', '闇', '炎', '刀', '魔', '龍', '星', '月', '風', '雷', '光', '夢', '剣', '鬼', '神', '花', '愛', '絆'];
function spawnKanji() {
    setInterval(() => {
        const k = document.createElement('div');
        k.className = 'kanji';
        k.textContent = kanjiChars[Math.floor(Math.random() * kanjiChars.length)];
        k.style.left = Math.random() * 100 + 'vw';
        k.style.fontSize = (Math.random() * 20 + 12) + 'px';
        k.style.animationDuration = (Math.random() * 10 + 10) + 's';
        document.body.appendChild(k);
        setTimeout(() => k.remove(), 25000);
    }, 2000);
}

// ═══ CLICK RIPPLE ═══
document.addEventListener('click', e => {
    for (let i = 0; i < 3; i++) {
        const r = document.createElement('div');
        r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:1px solid rgba(168,85,247,0.6);pointer-events:none;z-index:9995;transform:translate(-50%,-50%);animation:clickRipple ${0.6 + i * 0.15}s ease-out forwards;`;
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 1000);
    }
});

// Add click ripple keyframes dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes clickRipple{0%{width:0;height:0;opacity:1}100%{width:200px;height:200px;opacity:0}}`;
document.head.appendChild(rippleStyle);

// ═══ MOUSE TRAIL ═══
let lastTrailTime = 0;
document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrailTime < 30) return;
    lastTrailTime = now;
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;border-radius:50%;background:rgba(124,45,255,0.5);pointer-events:none;z-index:9994;transform:translate(-50%,-50%);transition:all 0.5s ease;`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%,-50%) scale(0)'; });
    setTimeout(() => t.remove(), 600);
});
