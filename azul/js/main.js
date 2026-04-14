/* ========================================
   AZUL AVE - MAIN JAVASCRIPT
   Interactive Features & Animations
   ======================================== */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initVideoBackground();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initExitStrategyToggle();
    initCharts();
    initContactForm();
    initScrollToTop();
    console.log('🏗️ AZUL AVE Loaded');
});

// ===== VIDEO BACKGROUND HANDLER =====
function initVideoBackground() {
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
        console.log('🎥 Initializing hero video:', heroVideo.querySelector('source').src);
        
        // Force load for Safari
        heroVideo.load();
        
        // Play promise handling
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Hero video playing successfully');
                })
                .catch(error => {
                    console.warn('⚠️ Autoplay blocked:', error);
                    console.log('💡 Video will play when user interacts with page');
                    
                    // Try to play on first user interaction
                    const playOnInteraction = () => {
                        heroVideo.play()
                            .then(() => {
                                console.log('✅ Video started after user interaction');
                            })
                            .catch(e => console.warn('Video play failed:', e));
                        
                        // Remove listeners after first attempt
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('scroll', playOnInteraction);
                    };
                    
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('scroll', playOnInteraction, { once: true });
                });
        }
        
        // Error handling
        heroVideo.addEventListener('error', (e) => {
            console.error('❌ Hero video error:', e);
            const error = heroVideo.error;
            if (error) {
                console.error('Error code:', error.code);
                switch(error.code) {
                    case 1:
                        console.error('⚠️ ABORTED: User aborted video loading');
                        break;
                    case 2:
                        console.error('⚠️ NETWORK: Network error loading video');
                        break;
                    case 3:
                        console.error('⚠️ DECODE: Video codec not supported - Please re-encode with H.264');
                        break;
                    case 4:
                        console.error('⚠️ NOT_SUPPORTED: Video format not supported');
                        break;
                }
            }
        });
        
        // Success handlers
        heroVideo.addEventListener('loadedmetadata', () => {
            console.log('📊 Video metadata loaded - Duration:', heroVideo.duration.toFixed(1) + 's');
        });
        
        heroVideo.addEventListener('canplay', () => {
            console.log('✅ Video ready to play');
        });
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                }
                
                // Smooth scroll to section
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== EXIT STRATEGY TOGGLE =====
function initExitStrategyToggle() {
    const tabs = document.querySelectorAll('.exit-tab');
    const contents = document.querySelectorAll('.exit-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0');
        const duration = 1800;
        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            el.textContent = current.toFixed(decimals);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

// ===== CHARTS =====
function initCharts() {
    const chartDefaults = {
        color: '#a0a0a0',
        gridColor: 'rgba(255,255,255,0.05)',
    };

    // ── Timeline Chart (unchanged) ──
    const timelineCtx = document.getElementById('timelineChart');
    if (timelineCtx) {
        new Chart(timelineCtx, {
            type: 'bar',
            data: {
                labels: ['Entitlement\n✓ COMPLETE', 'Construction', 'Lease-Up', 'Stabilization', 'Exit'],
                datasets: [{
                    label: 'Months',
                    data: [12, 18, 12, 6, 3],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.9)',
                        'rgba(74, 155, 174, 0.6)',
                        'rgba(74, 155, 174, 0.4)',
                        'rgba(74, 155, 174, 0.3)',
                        'rgba(74, 155, 174, 0.2)'
                    ],
                    borderColor: ['#4CAF50','#4A9BAE','#4A9BAE','#4A9BAE','#4A9BAE'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: chartDefaults.gridColor }, ticks: { color: chartDefaults.color } },
                    x: { grid: { color: chartDefaults.gridColor }, ticks: { color: chartDefaults.color } }
                }
            }
        });
    }

    // ── Revenue Mix Donut Chart (from Excel: STR $2,682,750 + Golf Cart $219,000) ──
    const donutCtx = document.getElementById('noiBreakdownChart');
    if (donutCtx) {
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['STR Revenue (21 units)', 'Golf Cart Rentals (10 carts)'],
                datasets: [{
                    data: [2682750, 219000],
                    backgroundColor: ['rgba(74,155,174,0.85)', 'rgba(76,175,80,0.85)'],
                    borderColor: ['#4A9BAE', '#4CAF50'],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#c0c0c0',
                            font: { size: 12 },
                            usePointStyle: true,
                            padding: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const val = ctx.parsed;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((val / total) * 100).toFixed(1);
                                return ` $${val.toLocaleString()} (${pct}%)`;
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'centerLabel',
                beforeDraw(chart) {
                    const { width, height, ctx } = chart;
                    ctx.save();
                    ctx.font = 'bold 1.1rem Inter, sans-serif';
                    ctx.fillStyle = '#e0e0e0';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('$2.9M', width / 2, height / 2 - 10);
                    ctx.font = '0.7rem Inter, sans-serif';
                    ctx.fillStyle = '#888';
                    ctx.fillText('Total Revenue', width / 2, height / 2 + 12);
                    ctx.restore();
                }
            }]
        });
    }

    // ── 5-Year NOI Projection Bar Chart (from Excel data, stabilized Year 3) ──
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        // Year 1: ramp-up (partial operations during construction wind-down)
        // Year 2: lease-up (~75% of stabilized)
        // Year 3: stabilized ($1,807,080 STR + $219,000 golf cart)
        // Year 4/5: 3% annual ADR growth applied to gross revenue
        const strNOI   = [600000, 1355310, 1807080, 1862292, 1919161];
        const cartNOI  = [0,      109500,  219000,  225570,  232337];

        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3\n(Stabilized)', 'Year 4', 'Year 5'],
                datasets: [
                    {
                        label: 'STR NOI',
                        data: strNOI,
                        backgroundColor: 'rgba(74,155,174,0.75)',
                        borderColor: '#4A9BAE',
                        borderWidth: 1.5,
                        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
                        stack: 'noi'
                    },
                    {
                        label: 'Golf Cart NOI',
                        data: cartNOI,
                        backgroundColor: 'rgba(76,175,80,0.75)',
                        borderColor: '#4CAF50',
                        borderWidth: 1.5,
                        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
                        stack: 'noi'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#c0c0c0',
                            font: { size: 12 },
                            usePointStyle: true,
                            padding: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const val = ctx.parsed.y;
                                return ` ${ctx.dataset.label}: $${(val / 1000).toFixed(0)}K`;
                            },
                            footer: function(items) {
                                const total = items.reduce((s, i) => s + i.parsed.y, 0);
                                return `Total NOI: $${(total / 1000000).toFixed(2)}M`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        grid: { color: chartDefaults.gridColor },
                        ticks: {
                            color: chartDefaults.color,
                            callback: v => '$' + (v / 1000000).toFixed(1) + 'M'
                        }
                    },
                    x: {
                        stacked: true,
                        grid: { color: chartDefaults.gridColor },
                        ticks: { color: chartDefaults.color }
                    }
                }
            }
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            // Only prevent default if form doesn't have action attribute
            // (Formspree/FormSubmit will handle submission if action is set)
            if (!form.hasAttribute('action') || form.getAttribute('action') === '') {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Basic validation
                if (!data.name || !data.email || !data.interest) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                if (!data.nda) {
                    alert('Please agree to NDA terms before submitting');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // Show message that form needs backend
                console.log('Form submitted:', data);
                alert('Thank you for your interest! We will send you NDA documentation shortly.');
                form.reset();
            }
            // If form has action attribute (Formspree/FormSubmit), let it submit normally
        });
    }
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CONSOLE MESSAGE =====
console.log('%c🏗️ AZUL AVE', 'font-size: 20px; font-weight: bold; color: #4A9BAE;');
console.log('%cLuxury Coastal Development', 'font-size: 14px; color: #a0a0a0;');
console.log('%cFor investment inquiries, please use the contact form.', 'font-size: 12px; color: #a0a0a0;');

// ===== IMAGE LIGHTBOX =====
function openLightbox(img, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (lightboxTitle) lightboxTitle.textContent = title || img.alt;
        if (lightboxDescription) lightboxDescription.textContent = description || '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        console.log('🖼️ Lightbox opened:', title);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        console.log('✖️ Lightbox closed');
    }
}

// Close lightbox on background click
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
});
