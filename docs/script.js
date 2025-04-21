// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme from localStorage or default
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    toggleSwitch.addEventListener('change', switchTheme, false);
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for the fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navigation highlight based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Scroll animations for installation steps
    const steps = document.querySelectorAll('.step');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    steps.forEach(step => {
        animationObserver.observe(step);
    });
    
    // Animate stat counters
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.round(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentSlide = index;
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-advance testimonials
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(nextSlide);
    }, 5000);
    
    // Video play placeholder
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            const videoWrapper = this.parentElement;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            
            this.remove();
            videoWrapper.appendChild(iframe);
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Nav shrink on scroll
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Cursor glow effect
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });
    
    document.addEventListener('mouseout', function() {
        cursorGlow.style.opacity = '0';
    });
    
    // Parallax effects
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    const slothMascot = document.querySelector('.sloth-mascot');
    const circles = document.querySelectorAll('.circle');
    const heroContent = document.querySelector('.hero-content');
    
    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', function(e) {
            let mouseX = e.clientX / window.innerWidth;
            let mouseY = e.clientY / window.innerHeight;
            
            // Move hero content slightly based on mouse position
            if (heroContent) {
                heroContent.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
            }
            
            // Move circles in parallax effect
            circles.forEach(circle => {
                let depth = parseFloat(circle.getAttribute('data-depth') || 0.1);
                let moveX = (mouseX * 50) * depth;
                let moveY = (mouseY * 50) * depth;
                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // Move sloth mascot based on mouse position (if exists)
            if (slothMascot) {
                slothMascot.style.transform = `translate(${mouseX * -30}px, ${mouseY * -20}px)`;
            }
        });
        
        // Parallax on scroll
        window.addEventListener('scroll', function() {
            let scrollPosition = window.pageYOffset;
            
            parallaxContainers.forEach(container => {
                let speed = container.getAttribute('data-speed') || 0.5;
                let yPos = -(scrollPosition * speed);
                container.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }
    
    // Initialize all event listeners
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();
}); 