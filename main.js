// ============================================
// PARTICLE SYSTEM GENERATOR
// ============================================
class ParticleSystem {
    constructor(container, count = 200) {
        this.container = container;
        this.count = count;
        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < this.count; i++) {
            this.createParticle();
        }
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        const colors = [
            'rgba(255, 0, 128, 0.6)',
            'rgba(0, 255, 128, 0.6)',
            'rgba(128, 0, 255, 0.6)',
            'rgba(255, 128, 0, 0.6)'
        ];
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        
        // Random animation selection
        const animations = [
            'particleFloat1', 'particleFloat2', 'particleFloat3',
            'particlePulse', 'particleRotate', 'particleGlow',
            'particleColorShift', 'particleWave', 'particleSpiral',
            'particleBounce', 'particleFade', 'particleScale',
            'particleSlide', 'particleZoom', 'particleSpin',
            'particleOrbit', 'particleShimmer', 'particleTwinkle',
            'particleDrift', 'particleRain', 'particleRipple'
        ];
        
        const animation = animations[Math.floor(Math.random() * animations.length)];
        particle.style.animation = `${animation} ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = delay + 's';
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CHARACTER PARTICLE EFFECTS
// ============================================
class CharacterParticles {
    constructor(characterCard) {
        this.card = characterCard;
        this.particles = [];
        this.init();
    }

    init() {
        this.card.addEventListener('mouseenter', () => this.createExplosion());
        this.card.addEventListener('mousemove', (e) => this.createTrail(e));
    }

    createExplosion() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            const rect = this.card.getBoundingClientRect();
            const x = rect.width / 2;
            const y = rect.height / 2;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            this.card.appendChild(particle);
            
            let px = x;
            let py = y;
            let opacity = 1;
            
            const animate = () => {
                px += vx;
                py += vy;
                opacity -= 0.02;
                
                particle.style.left = px + 'px';
                particle.style.top = py + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }

    createTrail(e) {
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.borderRadius = '50%';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = '#ff0080';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.8';
        
        this.card.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transition = 'all 0.5s ease-out';
            particle.style.transform = 'scale(0)';
            particle.style.opacity = '0';
            setTimeout(() => particle.remove(), 500);
        }, 100);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.character-card, .showcase-item, .profile-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 1s ease forwards';
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
}

// ============================================
// BILLBOARD PARTICLE EFFECTS
// ============================================
class BillboardParticles {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        setInterval(() => this.createParticle(), 100);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        this.container.appendChild(particle);
        
        const duration = Math.random() * 3 + 2;
        const endY = -10;
        const horizontalDrift = (Math.random() - 0.5) * 100;
        
        particle.style.transition = `all ${duration}s linear`;
        particle.style.transform = `translate(${horizontalDrift}px, ${endY - startY}px)`;
        particle.style.opacity = '0';
        
        setTimeout(() => particle.remove(), duration * 1000);
    }
}

// ============================================
// 3D MOUSE INTERACTION
// ============================================
class Mouse3D {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.character-card, .showcase-item');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2;
                const cardY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - cardX) / window.innerWidth;
                const deltaY = (e.clientY - cardY) / window.innerHeight;
                
                card.style.transform = `perspective(1000px) rotateY(${deltaX * 10}deg) rotateX(${-deltaY * 10}deg) translateZ(0)`;
            });
        });
    }
}

// ============================================
// GLOW LINE ANIMATION CONTROLLER
// ============================================
class GlowLineController {
    constructor() {
        this.lines = document.querySelectorAll('.glow-line');
        this.init();
    }

    init() {
        this.lines.forEach((line, index) => {
            setInterval(() => {
                const pathLength = line.getTotalLength();
                line.style.strokeDasharray = pathLength;
                line.style.strokeDashoffset = pathLength;
                
                setTimeout(() => {
                    line.style.transition = 'stroke-dashoffset 3s ease-in-out';
                    line.style.strokeDashoffset = 0;
                }, 100);
            }, 8000 + (index * 2000));
        });
    }
}

// ============================================
// DRAGON INTERACTION
// ============================================
class DragonController {
    constructor() {
        this.dragons = document.querySelectorAll('.dragon');
        this.init();
    }

    init() {
        this.dragons.forEach((dragon, index) => {
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 200;
                const randomY = (Math.random() - 0.5) * 200;
                
                dragon.style.transition = 'all 5s ease-in-out';
                dragon.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }, 5000 + (index * 1000));
        });
    }
}

// ============================================
// ORB INTERACTION
// ============================================
class OrbController {
    constructor() {
        this.orbs = document.querySelectorAll('.orb');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.orbs.forEach((orb, index) => {
                const rect = orb.getBoundingClientRect();
                const orbX = rect.left + rect.width / 2;
                const orbY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - orbX) * 0.01;
                const deltaY = (e.clientY - orbY) * 0.01;
                
                orb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
        });
    }
}

// ============================================
// TEXT ANIMATION EFFECTS
// ============================================
class TextEffects {
    constructor() {
        this.init();
    }

    init() {
        const titles = document.querySelectorAll('.title-main, .profile-name, .character-name');
        
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                title.style.animation = 'textShadow 1s ease-in-out infinite';
            });
            
            title.addEventListener('mouseleave', () => {
                title.style.animation = '';
            });
        });
    }
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.className = 'particle';
            dot.style.position = 'fixed';
            dot.style.width = '6px';
            dot.style.height = '6px';
            dot.style.borderRadius = '50%';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            dot.style.background = '#ff0080';
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            dot.style.opacity = '0.8';
            
            document.body.appendChild(dot);
            
            setTimeout(() => {
                dot.style.transition = 'all 0.5s ease-out';
                dot.style.transform = 'scale(0)';
                dot.style.opacity = '0';
                setTimeout(() => dot.remove(), 500);
            }, 100);
        });
    }
}

// ============================================
// RIPPLE EFFECT
// ============================================
class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.style.position = 'fixed';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.borderRadius = '50%';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            ripple.style.border = '2px solid #ff0080';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '9999';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transition = 'all 1s ease-out';
                ripple.style.width = '200px';
                ripple.style.height = '200px';
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 1000);
            }, 10);
        });
    }
}

// ============================================
// BACKGROUND GRADIENT ANIMATION
// ============================================
class BackgroundGradient {
    constructor() {
        this.init();
    }

    init() {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            document.body.style.background = `
                radial-gradient(ellipse at top, hsl(${hue}, 70%, 20%), #0a0a0f),
                radial-gradient(ellipse at bottom, hsl(${(hue + 120) % 360}, 70%, 15%), #0a0a0f)
            `;
        }, 50);
    }
}

// ============================================
// CHARACTER IMAGE HANDLER WITH FALLBACKS
// ============================================
class CharacterImageLoader {
    constructor() {
        this.fallbacks = {
            'cid': [
                'https://media.tenor.com/images/8014732483619404483/cid-kagenou.gif',
                'https://i.imgur.com/placeholder-cid.gif',
                'https://cdn.myanimelist.net/images/characters/placeholder.jpg'
            ],
            'sakuta': [
                'https://media.tenor.com/images/19735392/anime-sakuta-azusagawa.gif',
                'https://i.imgur.com/placeholder-sakuta.gif',
                'https://cdn.myanimelist.net/images/characters/placeholder.jpg'
            ],
            'kirito': [
                'https://media.tenor.com/images/22905203/kirito-kirigaya-kazuto-kazuto-kirigaya-sword-art-online-sao.gif',
                'https://i.imgur.com/placeholder-kirito.gif',
                'https://cdn.myanimelist.net/images/characters/placeholder.jpg'
            ],
            'nasa': [
                'https://media.tenor.com/images/21029874/tonikaku-kawaii-nasa-yuzaki-tsukasa-yuzaki-yukata-cute-anime.gif',
                'https://i.imgur.com/placeholder-nasa.gif',
                'https://cdn.myanimelist.net/images/characters/placeholder.jpg'
            ]
        };
        this.init();
    }

    init() {
        document.querySelectorAll('.character-img').forEach(img => {
            const card = img.closest('.character-card');
            const character = card?.getAttribute('data-character');
            const imageContainer = img.closest('.character-image');
            
            // Add loading state
            if (imageContainer && !img.complete) {
                imageContainer.classList.add('loading');
            }
            
            if (character && this.fallbacks[character]) {
                img.addEventListener('error', () => this.handleError(img, character));
                img.addEventListener('load', () => {
                    this.handleLoad(img);
                    if (imageContainer) {
                        imageContainer.classList.remove('loading');
                        img.classList.add('loaded');
                    }
                });
            }
            
            // Handle already loaded images
            if (img.complete && img.naturalWidth > 0) {
                if (imageContainer) {
                    imageContainer.classList.remove('loading');
                    img.classList.add('loaded');
                }
            }
        });
    }

    handleError(img, character) {
        const fallbacks = this.fallbacks[character];
        const currentSrc = img.src;
        const currentIndex = fallbacks.indexOf(currentSrc);
        
        if (currentIndex < fallbacks.length - 1) {
            img.src = fallbacks[currentIndex + 1];
        } else {
            // If all fallbacks fail, use a gradient placeholder
            img.style.display = 'none';
            const card = img.closest('.character-card');
            const imageContainer = img.closest('.character-image');
            if (imageContainer && !imageContainer.querySelector('.fallback-gradient')) {
                const gradient = document.createElement('div');
                gradient.className = 'fallback-gradient';
                gradient.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(255, 0, 128, 0.3), rgba(0, 255, 128, 0.3));
                    border-radius: 15px;
                    z-index: 1;
                `;
                imageContainer.appendChild(gradient);
            }
        }
    }

    handleLoad(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    }
}

// ============================================
// PRELOADER HANDLER
// ============================================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }

    init() {
        // Create explosion particles on preloader
        this.createPreloaderParticles();
        
        // Remove preloader after animation
        setTimeout(() => {
            if (this.preloader) {
                this.preloader.style.display = 'none';
                this.createEntranceExplosion();
            }
        }, 3500);
    }

    createPreloaderParticles() {
        const container = document.querySelector('.preloader-particles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.background = ['#ff0080', '#00ff80', '#8000ff', '#ff8000'][Math.floor(Math.random() * 4)];
            particle.style.pointerEvents = 'none';
            
            const angle = (Math.PI * 2 * i) / 50;
            const distance = 100 + Math.random() * 200;
            const duration = 1 + Math.random() * 2;
            
            particle.style.animation = `preloaderParticleFloat ${duration}s ease-out forwards`;
            particle.style.setProperty('--angle', angle);
            particle.style.setProperty('--distance', distance + 'px');
            
            container.appendChild(particle);
        }
    }

    createEntranceExplosion() {
        // Create massive explosion effect when preloader finishes
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 8 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.background = ['#ff0080', '#00ff80', '#8000ff', '#ff8000'][Math.floor(Math.random() * 4)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9998';
            particle.style.transform = 'translate(-50%, -50%)';
            
            const angle = (Math.PI * 2 * i) / 100;
            const velocity = 3 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;
            let opacity = 1;
            
            const animate = () => {
                x += vx * 10;
                y += vy * 10;
                opacity -= 0.02;
                
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = opacity;
                particle.style.transform = `translate(-50%, -50%) scale(${1 + (1 - opacity)})`;
                
                if (opacity > 0 && x > 0 && x < window.innerWidth && y > 0 && y < window.innerHeight) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            setTimeout(() => animate(), i * 10);
        }
    }
}

// Add preloader particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes preloaderParticleFloat {
        0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
            ) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Preloader
    new Preloader();
    // Initialize Character Image Loader
    new CharacterImageLoader();
    
    // Initialize Particle System
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        new ParticleSystem(particleContainer, 200);
    }
    
    // Initialize Character Particles
    document.querySelectorAll('.character-card').forEach(card => {
        new CharacterParticles(card);
    });
    
    // Initialize Scroll Animations
    new ScrollAnimations();
    
    // Initialize Billboard Particles
    const billboardParticles = document.querySelector('.billboard-particles');
    if (billboardParticles) {
        new BillboardParticles(billboardParticles);
    }
    
    // Initialize 3D Mouse Interaction
    new Mouse3D();
    
    // Initialize Glow Line Controller
    new GlowLineController();
    
    // Initialize Dragon Controller
    new DragonController();
    
    // Initialize Orb Controller
    new OrbController();
    
    // Initialize Text Effects
    new TextEffects();
    
    // Initialize Cursor Trail
    new CursorTrail();
    
    // Initialize Ripple Effect
    new RippleEffect();
    
    // Initialize Background Gradient
    new BackgroundGradient();
    
    // Add random sparkle effects
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.background = '#ffffff';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.boxShadow = '0 0 10px #ffffff';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.style.transition = 'all 1s ease-out';
            sparkle.style.transform = 'scale(3)';
            sparkle.style.opacity = '0';
            setTimeout(() => sparkle.remove(), 1000);
        }, 100);
    }, 500);
    
    // Console message
    console.log('%c🔥 INFERNO - Animation System Loaded 🔥', 'color: #ff0080; font-size: 20px; font-weight: bold;');
    console.log('%c200+ Animations Active | Performance Optimized', 'color: #00ff80; font-size: 14px;');
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        if (fps < 30) {
            console.warn(`Performance warning: ${fps} FPS`);
        }
    }
    
    requestAnimationFrame(measureFPS);
}

requestAnimationFrame(measureFPS);

// ============================================
// RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    // Recalculate particle positions on resize
    const particles = document.querySelectorAll('.particle-container .particle');
    particles.forEach(particle => {
        if (parseFloat(particle.style.left) > window.innerWidth) {
            particle.style.left = Math.random() * window.innerWidth + 'px';
        }
        if (parseFloat(particle.style.top) > window.innerHeight) {
            particle.style.top = Math.random() * window.innerHeight + 'px';
        }
    });
});

// ============================================
// KEYBOARD INTERACTIONS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        // Create explosion effect on spacebar
        const explosion = document.createElement('div');
        explosion.style.position = 'fixed';
        explosion.style.width = '100px';
        explosion.style.height = '100px';
        explosion.style.borderRadius = '50%';
        explosion.style.left = window.innerWidth / 2 + 'px';
        explosion.style.top = window.innerHeight / 2 + 'px';
        explosion.style.background = 'radial-gradient(circle, #ff0080, transparent)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '9999';
        explosion.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(explosion);
        
        setTimeout(() => {
            explosion.style.transition = 'all 1s ease-out';
            explosion.style.width = '500px';
            explosion.style.height = '500px';
            explosion.style.opacity = '0';
            setTimeout(() => explosion.remove(), 1000);
        }, 10);
    }
});

// ============================================
// TOUCH SUPPORT
// ============================================
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.left = touch.clientX + 'px';
        ripple.style.top = touch.clientY + 'px';
        ripple.style.border = '2px solid #ff0080';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transition = 'all 1s ease-out';
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
            setTimeout(() => ripple.remove(), 1000);
        }, 10);
    });
}
