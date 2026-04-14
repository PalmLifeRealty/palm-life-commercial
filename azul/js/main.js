/* ========================================
   AZUL AVE - MAIN JAVASCRIPT
   Interactive Features & Animations
   ======================================== */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initVideoBackground();
    initNavigation();
    initScrollAnimations();
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

// ===== CHARTS =====
function initCharts() {
    // Timeline Chart
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
                        'rgba(76, 175, 80, 0.9)',  // Green for complete
                        'rgba(74, 155, 174, 0.6)',
                        'rgba(74, 155, 174, 0.4)',
                        'rgba(74, 155, 174, 0.3)',
                        'rgba(74, 155, 174, 0.2)'
                    ],
                    borderColor: [
                        '#4CAF50',  // Green border for complete
                        '#4A9BAE',
                        '#4A9BAE',
                        '#4A9BAE',
                        '#4A9BAE'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a0a0a0'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a0a0a0'
                        }
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [
                    {
                        label: 'Build-Out Costs',
                        data: [4400000, 8800000, 8800000, 8800000, 8800000],
                        borderColor: '#d4af37',
                        backgroundColor: 'rgba(212, 175, 55, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#d4af37'
                    },
                    {
                        label: 'STR Hold NOI',
                        data: [1000000, 1600000, 2000000, 2000000, 2000000],
                        borderColor: '#4A9BAE',
                        backgroundColor: 'rgba(74, 155, 174, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Fee-Simple Sellout (Net)',
                        data: [0, 5123000, 11251800, null, null],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        spanGaps: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + (context.parsed.y / 1000000).toFixed(2) + 'M';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a0a0a0',
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a0a0a0'
                        }
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