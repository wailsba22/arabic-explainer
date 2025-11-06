// ===================================
// Arabic Explainer - Main JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initLanguageToggle();
    initMobileMenu();
    initSmoothScroll();
    
    console.log('Arabic Explainer initialized successfully!');
});

// ===================================
// Language Toggle Functionality
// ===================================

function initLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Get saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Add click event listener to language toggle button
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = htmlElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });
    }
}

function setLanguage(lang) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Update HTML lang and dir attributes
    htmlElement.setAttribute('lang', lang);
    
    if (lang === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        bodyElement.setAttribute('dir', 'rtl');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
        bodyElement.setAttribute('dir', 'ltr');
    }
    
    // Show/hide content based on language
    const enElements = document.querySelectorAll('.lang-en');
    const arElements = document.querySelectorAll('.lang-ar');
    
    if (lang === 'ar') {
        enElements.forEach(el => el.style.display = 'none');
        arElements.forEach(el => el.style.display = '');
    } else {
        enElements.forEach(el => el.style.display = '');
        arElements.forEach(el => el.style.display = 'none');
    }
}

// ===================================
// Mobile Menu Functionality
// ===================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ===================================
// Smooth Scroll Functionality
// ===================================

function initSmoothScroll() {
    // Add smooth scrolling to all links with hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate scroll position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll to Top Functionality
// ===================================

// Add scroll to top button (optional enhancement)
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 999;
        font-size: 1.5rem;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
        } else {
            scrollButton.style.opacity = '0';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll to top button is disabled by default. Uncomment to enable:
// addScrollToTopButton();

// ===================================
// Animation on Scroll (Optional)
// ===================================

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
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.feature-card, .code-example');
    animatedElements.forEach(el => observer.observe(el));
}

// Scroll animations are disabled by default for better performance. Uncomment to enable:
// initScrollAnimations();
