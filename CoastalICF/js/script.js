/**
 * Coastal ICF Construction Services
 * 265 Causeway Blvd Project Qualification
 * Interactive Features & Animations
 */

(function() {
    'use strict';

    // ============================================
    // Progress Bar
    // ============================================
    function updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('.nav-menu').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navLinksContainer = document.querySelector('.nav-links');
                    if (navLinksContainer) {
                        navLinksContainer.classList.remove('active');
                    }
                }
            });
        });
    }

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });
        }
    }

    // ============================================
    // Fade In Animation on Scroll
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation (excluding portfolio items to prevent image issues)
        const animatedElements = document.querySelectorAll(
            '.pillar-card, .competency-card, .benefit-card, ' +
            '.alignment-card, .process-step, ' +
            '.control-card, .reference-card, .affirmation-item'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // Hero Parallax Effect
    // ============================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.backgroundPositionY = (scrolled * parallaxSpeed) + 'px';
            }
        });
    }

    // ============================================
    // Sticky Navigation
    // ============================================
    function initStickyNav() {
        const nav = document.querySelector('.nav-menu');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                nav.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Number Counter Animation
    // ============================================
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number
            let displayValue;
            if (element.textContent.includes('$')) {
                displayValue = '$' + Math.floor(current) + 'M+';
            } else if (element.textContent.includes('%')) {
                displayValue = Math.floor(current) + '%';
            } else if (element.textContent.includes('+')) {
                displayValue = Math.floor(current) + '+';
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue;
        }, 16);
    }

    function initNumberCounters() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    
                    // Extract number from text
                    let targetNumber;
                    if (text.includes('$14M+')) {
                        targetNumber = 14;
                    } else if (text.includes('%')) {
                        targetNumber = parseInt(text);
                    } else if (text.includes('+')) {
                        targetNumber = parseInt(text);
                    } else {
                        targetNumber = parseInt(text);
                    }

                    if (!isNaN(targetNumber)) {
                        animateNumber(element, targetNumber);
                        observer.unobserve(element);
                    }
                }
            });
        }, observerOptions);

        // Observe stat numbers
        const statNumbers = document.querySelectorAll('.stat-number, .perf-number');
        statNumbers.forEach(el => observer.observe(el));
    }

    // ============================================
    // Portfolio Image Lazy Loading
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('.portfolio-images img');
        
        images.forEach(img => {
            // Ensure images are always visible
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            
            // Add error handling for debugging
            img.onerror = function() {
                console.error('Image failed to load:', img.src);
                console.log('Alt text:', img.alt);
            };
            
            img.onload = function() {
                console.log('Image loaded successfully:', img.alt);
                img.style.opacity = '1';
                img.style.visibility = 'visible';
            };
        });
    }

    // ============================================
    // Highlight Current Section in Viewport
    // ============================================
    function initSectionHighlight() {
        const sections = document.querySelectorAll('section[id]');
        
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.3s ease';
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ============================================
    // Add Hover Effects to Cards
    // ============================================
    function initCardHoverEffects() {
        const cards = document.querySelectorAll(
            '.pillar-card, .competency-card, .benefit-card, ' +
            '.portfolio-item, .control-card, .cert-card'
        );

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    // ============================================
    // Print/PDF Export Functionality
    // ============================================
    function initPDFExport() {
        // The export button uses window.print() which is already in HTML
        // This function can add additional PDF export preparations if needed
        
        window.addEventListener('beforeprint', function() {
            // Ensure all images are loaded
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.opacity = '1';
            });

            // Expand all sections for printing
            document.body.classList.add('printing');
        });

        window.addEventListener('afterprint', function() {
            document.body.classList.remove('printing');
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    function initKeyboardNav() {
        document.addEventListener('keydown', function(e) {
            // Arrow down - scroll to next section
            if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                const currentSection = getCurrentSection();
                const nextSection = currentSection ? currentSection.nextElementSibling : null;
                if (nextSection && nextSection.tagName === 'SECTION') {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Arrow up - scroll to previous section
            if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                const currentSection = getCurrentSection();
                const prevSection = currentSection ? currentSection.previousElementSibling : null;
                if (prevSection && prevSection.tagName === 'SECTION') {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Home - scroll to top
            if (e.key === 'Home' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // End - scroll to bottom
            if (e.key === 'End' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
    }

    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 200;
        
        let currentSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        return currentSection;
    }

    // ============================================
    // Performance Optimization
    // ============================================
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

    // ============================================
    // Initialize All Features
    // ============================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        console.log('Coastal ICF Presentation: Initializing...');

        // Initialize smooth scrolling
        initSmoothScroll();
        
        // Initialize mobile navigation
        initMobileNav();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Initialize parallax effect
        initParallax();
        
        // Initialize sticky navigation
        initStickyNav();
        
        // Initialize number counters
        initNumberCounters();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize section highlighting
        initSectionHighlight();
        
        // Initialize card hover effects
        initCardHoverEffects();
        
        // Initialize PDF export
        initPDFExport();
        
        // Initialize keyboard navigation
        initKeyboardNav();

        // Add scroll event listeners (debounced for performance)
        const debouncedScroll = debounce(function() {
            updateProgressBar();
            updateActiveNavLink();
        }, 10);

        window.addEventListener('scroll', debouncedScroll);
        
        // Initial calls
        updateProgressBar();
        updateActiveNavLink();

        console.log('Coastal ICF Presentation: Ready!');
    }

    // Start initialization
    init();

})();