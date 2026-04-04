/* ========================================
   MOTOWN LUXURY STORAGE - MAIN JAVASCRIPT
   Interactive Features & Data Visualizations
   ======================================== */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initCounters();
    initCharts();
    initContactForm();
    initScrollToTop();
});

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
                
                // Add staggered animation for grid items
                if (entry.target.parentElement.classList.contains('highlights-grid')) {
                    const delay = parseInt(entry.target.dataset.aosDelay) || 0;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.animation = 'fadeInUp 0.8s ease forwards';
        observer.observe(el);
    });
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const counterElements = document.querySelectorAll('[data-target]');
    
    const animateCounter = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                // Format number based on value
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString();
                } else if (target >= 10) {
                    element.textContent = Math.floor(current);
                } else {
                    element.textContent = current.toFixed(1);
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                // Final value
                if (target >= 1000) {
                    element.textContent = target.toLocaleString();
                } else if (target >= 10) {
                    element.textContent = Math.floor(target);
                } else {
                    element.textContent = target.toFixed(1);
                }
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => {
        counterObserver.observe(el);
    });
}

// ===== CHARTS INITIALIZATION =====
function initCharts() {
    // Chart.js default configuration
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.color = '#5a6c7d';
    
    // Population Growth Chart
    const populationCtx = document.getElementById('populationChart');
    if (populationCtx) {
        new Chart(populationCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Population',
                    data: [108000, 112000, 116000, 120000, 124000, 128000],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1a2332',
                        titleColor: '#d4af37',
                        bodyColor: '#ffffff',
                        padding: 12,
                        borderColor: '#d4af37',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return 'Population: ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000) + 'K';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // RV & Boat Ownership Comparison Chart
    const ownershipCtx = document.getElementById('ownershipChart');
    if (ownershipCtx) {
        new Chart(ownershipCtx, {
            type: 'bar',
            data: {
                labels: ['Spring Hill', 'Hernando County', 'Florida Average', 'US Average'],
                datasets: [{
                    label: 'RV/Boat Ownership %',
                    data: [35, 32, 28, 22],
                    backgroundColor: [
                        '#d4af37',
                        '#c99b2e',
                        '#2c3e50',
                        '#5a6c7d'
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1a2332',
                        titleColor: '#d4af37',
                        bodyColor: '#ffffff',
                        padding: 12,
                        borderColor: '#d4af37',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return 'Ownership: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // NOI Projections Chart
    const noiCtx = document.getElementById('noiChart');
    if (noiCtx) {
        new Chart(noiCtx, {
            type: 'bar',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [{
                    label: 'Annual NOI',
                    data: [862396, 931378, 1006087, 1086856, 1174138],
                    backgroundColor: 'rgba(212, 175, 55, 0.8)',
                    borderColor: '#d4af37',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1a2332',
                        titleColor: '#d4af37',
                        bodyColor: '#ffffff',
                        padding: 12,
                        borderColor: '#d4af37',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return 'NOI: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(2) + 'M';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Revenue Mix Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Enclosed Units', 'Covered Storage', 'Rental Income', 'Amenity Fees'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: [
                        '#d4af37',
                        '#c99b2e',
                        '#2c3e50',
                        '#5a6c7d'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a2332',
                        titleColor: '#d4af37',
                        bodyColor: '#ffffff',
                        padding: 12,
                        borderColor: '#d4af37',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                company: form.company.value,
                investorType: form.investorType.value,
                message: form.message.value,
                accredited: form.accredited.checked
            };
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (in production, this would send to a backend)
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success message
                formMessage.textContent = 'Thank you for your interest! We will contact you shortly with additional investment materials.';
                formMessage.className = 'form-message success';
                
                // Reset form
                form.reset();
                
                // Log to console (for demonstration)
                console.log('Investment Inquiry Submitted:', formData);
                
            } catch (error) {
                // Error message
                formMessage.textContent = 'An error occurred. Please try again or contact us directly.';
                formMessage.className = 'form-message error';
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Format percentage
function formatPercentage(value) {
    return value.toFixed(1) + '%';
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images (if any are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prefetch on hover for better UX
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            // Prefetch/prepare section content
            targetSection.style.willChange = 'transform';
        }
    });
    
    link.addEventListener('mouseleave', () => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.willChange = 'auto';
        }
    });
});

// ===== ANALYTICS & TRACKING =====

// Track section views (for analytics)
const sectionViewTracker = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            console.log(`Section viewed: ${sectionId}`);
            
            // In production, send to analytics service
            // trackEvent('section_view', { section: sectionId });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionViewTracker.observe(section);
});

// Track CTA clicks
document.querySelectorAll('.hero-cta, .contact-btn, .submit-btn').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        console.log(`CTA clicked: ${buttonText}`);
        
        // In production, send to analytics service
        // trackEvent('cta_click', { button: buttonText });
    });
});

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, send to error tracking service
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, send to error tracking service
});

// ===== VIDEO PLAY OVERLAY HANDLER =====
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.gallery-video video');
    
    console.log('Found videos:', videos.length);
    
    videos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, video.querySelector('source')?.src);
        
        // Safari-specific: Set explicit dimensions
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.display = 'block';
        
        // Safari-specific: Enable inline playback
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        
        // Safari-specific: Ensure video loads properly
        try {
            video.load();
            console.log(`Video ${index + 1} loaded successfully`);
        } catch (error) {
            console.error(`Video ${index + 1} load error:`, error);
        }
        
        // Log when video can play
        video.addEventListener('canplay', () => {
            console.log(`Video ${index + 1} can play`);
        });
        
        video.addEventListener('canplaythrough', () => {
            console.log(`Video ${index + 1} can play through`);
        });
        
        video.addEventListener('loadedmetadata', () => {
            console.log(`Video ${index + 1} metadata loaded - Duration: ${video.duration}s`);
        });
        
        video.addEventListener('loadeddata', () => {
            console.log(`Video ${index + 1} data loaded`);
        });
        
        // Safari-specific: Add click handler to ensure playback
        video.addEventListener('click', (e) => {
            if (video.paused) {
                video.play().then(() => {
                    console.log(`Video ${index + 1} playing via click`);
                }).catch(err => {
                    console.error(`Video ${index + 1} play error:`, err);
                });
            } else {
                video.pause();
            }
        });
        
        const overlay = video.parentElement.querySelector('.video-play-overlay');
        
        if (overlay) {
            // Hide overlay when video starts playing
            video.addEventListener('play', () => {
                overlay.style.opacity = '0';
                console.log(`Video ${index + 1} playing`);
            });
            
            // Show overlay when video is paused or ended
            video.addEventListener('pause', () => {
                overlay.style.opacity = '1';
            });
            
            video.addEventListener('ended', () => {
                overlay.style.opacity = '1';
            });
        }
        
        // Safari-specific: Handle video load errors with detailed logging
        video.addEventListener('error', (e) => {
            const source = video.querySelector('source');
            console.error(`Video ${index + 1} error:`, {
                error: e,
                videoError: video.error,
                errorCode: video.error?.code,
                errorMessage: video.error?.message,
                sourceSrc: source?.src,
                sourceType: source?.type
            });
            
            // Try to provide helpful error messages
            if (video.error) {
                switch(video.error.code) {
                    case 1:
                        console.error('MEDIA_ERR_ABORTED: Video loading was aborted');
                        break;
                    case 2:
                        console.error('MEDIA_ERR_NETWORK: Network error while loading video');
                        break;
                    case 3:
                        console.error('MEDIA_ERR_DECODE: Video decoding failed (codec issue)');
                        break;
                    case 4:
                        console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: Video format not supported');
                        break;
                }
            }
        });
    });
});

// ===== CONSOLE MESSAGE =====
console.log('%c🏢 MOTOWN LUXURY STORAGE', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cInvestment Offering Memorandum', 'font-size: 14px; color: #5a6c7d;');
console.log('%cFor investment inquiries, please use the contact form.', 'font-size: 12px; color: #5a6c7d;');