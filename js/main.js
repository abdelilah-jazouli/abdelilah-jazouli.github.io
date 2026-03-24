/* =============================================
   AZEKA CONSULTING — Main JavaScript
   Particle network, animations, form, navigation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initParticleNetwork();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initSmoothScroll();
});

/* =============================================
   PARTICLE NETWORK CANVAS
   ============================================= */
function initParticleNetwork() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Palette officielle V2 : Bleu IA Électrique, Cyan IA, Violet IA
            const r = Math.random();
            this.color = r > 0.66 ? '28, 92, 255' : r > 0.33 ? '0, 212, 255' : '140, 61, 255';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    const opacity = (1 - dist / 160) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    // Gradient line between particles
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(${particles[i].color}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${particles[j].color}, ${opacity})`);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Recreate on resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        createParticles();
        animate();
    });
}

/* =============================================
   NAVBAR SCROLL EFFECT
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* =============================================
   MOBILE MENU TOGGLE
   ============================================= */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================= */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.hero-stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const suffix = '+';

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.floor(eased * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(update);
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* =============================================
   CONTACT FORM VALIDATION
   ============================================= */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Reset errors
        form.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
        form.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));

        let isValid = true;

        // Name validation
        const name = form.querySelector('#name');
        if (!name.value.trim()) {
            showError('name', 'nameError');
            isValid = false;
        }

        // Email validation
        const email = form.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            showError('email', 'emailError');
            isValid = false;
        }

        // Subject validation
        const subject = form.querySelector('#subject');
        if (!subject.value) {
            showError('subject', 'subjectError');
            isValid = false;
        }

        // Message validation
        const message = form.querySelector('#message');
        if (!message.value.trim()) {
            showError('message', 'messageError');
            isValid = false;
        }

        if (isValid) {
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showSuccess();
                } else {
                    throw new Error('Erreur serveur');
                }
            })
            .catch(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showSubmitError();
            });
        }
    });

    function showError(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.add('error');
        if (error) error.classList.add('visible');
    }

    function showSuccess() {
        form.style.display = 'none';
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) successMsg.classList.add('visible');
    }

    function showSubmitError() {
        let errEl = form.querySelector('.form-submit-error');
        if (!errEl) {
            errEl = document.createElement('p');
            errEl.className = 'form-submit-error';
            errEl.style.cssText = 'color:#ef4444;font-size:0.85rem;margin-top:12px;text-align:center;';
            form.querySelector('.form-submit').insertAdjacentElement('afterend', errEl);
        }
        errEl.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
