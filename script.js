/* ===== BIRTHDAY WEBSITE - INTERACTIVE JAVASCRIPT ===== */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(random(min, max + 1));

    // ===== STATE =====
    const state = {
        wishes: [],
        currentWishIndex: 0,
        candlesLit: 3,
        cakeBlown: false,
        audioContext: null,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // ===== AUDIO HELPERS =====
    function initAudio() {
        if (!state.audioContext) {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return state.audioContext;
    }

    function playTone(freq, duration, type = 'sine', volume = 0.1) {
        if (state.reducedMotion) return;
        const ctx = initAudio();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.stop(ctx.currentTime + duration);
    }

    function playCelebrationSound() {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((note, i) => setTimeout(() => playTone(note, 0.3, 'sine', 0.15), i * 100));
    }

    function playPopSound() {
        playTone(800, 0.1, 'square', 0.08);
        setTimeout(() => playTone(1200, 0.08, 'square', 0.06), 50);
    }

    function playBlowSound() {
        const ctx = initAudio();
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2) * 0.3;
        }
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 800;
        gain.gain.value = 0.2;
        source.connect(filter).connect(gain).connect(ctx.destination);
        source.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    }

    // ===== CONFETTI SYSTEM =====
    const confettiCanvas = $('#confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnimationId = null;

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function createConfettiParticle(x, y, colors) {
        const color = colors[randomInt(0, colors.length - 1)];
        const shapes = ['circle', 'square', 'triangle', 'heart'];
        return {
            x: x || random(0, confettiCanvas.width),
            y: y || random(-50, 0),
            vx: random(-3, 3),
            vy: random(2, 6),
            rotation: random(0, Math.PI * 2),
            rotationSpeed: random(-0.1, 0.1),
            size: random(6, 14),
            color,
            shape: shapes[randomInt(0, shapes.length - 1)],
            opacity: 1,
            gravity: 0.15,
            drag: 0.99
        };
    }

    function launchConfetti(x, y, count = 80, colors = ['#ff6b9d', '#4ecdc4', '#ffe66d', '#c471ed', '#ff9f43', '#fff']) {
        if (state.reducedMotion) return;
        for (let i = 0; i < count; i++) {
            confettiParticles.push(createConfettiParticle(x, y, colors));
        }
        if (!confettiAnimationId) animateConfetti();
    }

    function drawConfettiParticle(p) {
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation);
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.fillStyle = p.color;

        switch (p.shape) {
            case 'circle':
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                confettiCtx.fill();
                break;
            case 'square':
                confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                break;
            case 'triangle':
                confettiCtx.beginPath();
                confettiCtx.moveTo(0, -p.size / 2);
                confettiCtx.lineTo(p.size / 2, p.size / 2);
                confettiCtx.lineTo(-p.size / 2, p.size / 2);
                confettiCtx.closePath();
                confettiCtx.fill();
                break;
            case 'heart':
                const s = p.size / 2;
                confettiCtx.beginPath();
                confettiCtx.moveTo(0, s / 2);
                confettiCtx.bezierCurveTo(-s, -s, -s * 2, s, 0, s * 1.5);
                confettiCtx.bezierCurveTo(0, s, s * 2, s, s, -s);
                confettiCtx.bezierCurveTo(s, -s, 0, -s, 0, s / 2);
                confettiCtx.fill();
                break;
        }
        confettiCtx.restore();
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles = confettiParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.008;
            if (p.opacity > 0 && p.y < confettiCanvas.height + 50) {
                drawConfettiParticle(p);
                return true;
            }
            return false;
        });
        if (confettiParticles.length > 0) {
            confettiAnimationId = requestAnimationFrame(animateConfetti);
        } else {
            confettiAnimationId = null;
        }
    }

    // ===== AGE COUNTER ANIMATION =====
    function animateCounters() {
        const counters = $$('.counter-number[data-target]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        el.textContent = current.toLocaleString();
                        if (progress < 1) requestAnimationFrame(updateCounter);
                        else el.textContent = target.toLocaleString();
                    }
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // ===== WISHES CAROUSEL =====
    const wishCards = $$('.wish-card');
    const navDots = $('#nav-dots');
    const prevBtn = $('#prev-wish');
    const nextBtn = $('#next-wish');

    function initWishCarousel() {
        wishCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Go to wish ${i + 1}`);
            dot.addEventListener('click', () => goToWish(i));
            navDots.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => goToWish(state.currentWishIndex - 1));
        nextBtn.addEventListener('click', () => goToWish(state.currentWishIndex + 1));

        // Touch swipe support
        let touchStartX = 0;
        const carousel = $('#wishes-carousel');
        carousel.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
        carousel.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) {
                goToWish(state.currentWishIndex + (dx > 0 ? -1 : 1));
            }
        }, { passive: true });

        // Keyboard navigation
        carousel.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') goToWish(state.currentWishIndex - 1);
            else if (e.key === 'ArrowRight') goToWish(state.currentWishIndex + 1);
        });
    }

    function goToWish(index) {
        const len = wishCards.length;
        index = (index + len) % len;
        wishCards[state.currentWishIndex].classList.remove('active');
        $$('.nav-dot')[state.currentWishIndex].classList.remove('active');
        state.currentWishIndex = index;
        wishCards[index].classList.add('active');
        $$('.nav-dot')[index].classList.add('active');
        playPopSound();
    }

    // ===== INTERACTIVE CAKE =====
    const cakeContainer = $('#cake-container');
    const candles = $$('.candle');
    const flames = $$('.flame');
    const cakeInstruction = $('#cake-instruction');
    const celebrationMessage = $('#celebration-message');

    function initCake() {
        cakeContainer.addEventListener('click', blowCandles);
        cakeContainer.addEventListener('keydown', e => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                blowCandles();
            }
        });

        // Blow detection via microphone (optional, fallback to click)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            cakeContainer.addEventListener('pointerdown', requestMicAccess, { once: true });
        }
    }

    async function requestMicAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ctx = initAudio();
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            function detectBlow() {
                if (state.cakeBlown) return;
                const data = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((a, b) => a + b, 0) / data.length;
                if (avg > 30) {
                    blowCandles();
                    stream.getTracks().forEach(t => t.stop());
                } else {
                    requestAnimationFrame(detectBlow);
                }
            }
            detectBlow();
        } catch (e) {
            // Mic access denied, click/tap still works
        }
    }

    function blowCandles() {
        if (state.cakeBlown) return;
        state.cakeBlown = true;
        playBlowSound();
        playCelebrationSound();
        launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);

        flames.forEach((flame, i) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
                playPopSound();
            }, i * 200);
        });

        cakeInstruction.style.display = 'none';
        setTimeout(() => {
            celebrationMessage.classList.remove('hidden');
            launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
        }, 1000);
    }

    // Relight candles on double-click (for fun)
    cakeContainer.addEventListener('dblclick', () => {
        if (state.cakeBlown) {
            state.cakeBlown = false;
            flames.forEach(flame => flame.classList.remove('extinguished'));
            cakeInstruction.style.display = 'block';
            celebrationMessage.classList.add('hidden');
        }
    });

    // ===== CELEBRATE BUTTON =====
    const celebrateBtn = $('#celebrate-btn');
    celebrateBtn.addEventListener('click', () => {
        playCelebrationSound();
        launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 150);
        celebrateBtn.style.animation = 'none';
        setTimeout(() => celebrateBtn.style.animation = '', 10);
    });

    // ===== GALLERY INTERACTION =====
    $$('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            playPopSound();
            item.style.animation = 'none';
            item.offsetHeight; // force reflow
            item.style.animation = 'galleryPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            launchConfetti(
                item.getBoundingClientRect().left + item.offsetWidth / 2,
                item.getBoundingClientRect().top + item.offsetHeight / 2,
                30
            );
        });
        item.addEventListener('keydown', e => {
            if (e.key === ' ' || e.key === 'Enter') item.click();
        });
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    function initScrollAnimations() {
        const animatedElements = $$('.section-title, .counter-card, .wish-card, .gallery-item, .wish-form, .cake-container');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ===== KEYBOARD ACCESSIBILITY =====
    document.addEventListener('keydown', e => {
        // Space/Enter on interactive elements
        if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('[role="button"]:not(button)')) {
            e.preventDefault();
            e.target.click();
        }
    });

    // ===== INITIALIZATION =====
    function init() {
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);

        animateCounters();
        initWishCarousel();
        initCake();
        loadWishes();
        initScrollAnimations();

        // Welcome confetti on load
        setTimeout(() => {
            launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
            playCelebrationSound();
        }, 800);

        // Register service worker for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Add gallery pop animation dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes galleryPop {
    0% { transform: scale(1) rotate(0deg); }
    30% { transform: scale(1.15) rotate(-5deg); }
    60% { transform: scale(0.95) rotate(3deg); }
    100% { transform: scale(1) rotate(0deg); }
}`;
document.head.appendChild(style);