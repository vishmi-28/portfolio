document.addEventListener('DOMContentLoaded', () => {
    
    // --- THEME TOGGLE LOGIC ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeBtn.querySelector('i');
    
    // Check local storage for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark'; // default to dark mode
    if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    } else {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // --- STICKY NAVBAR SCROLL BEHAVIOR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE DRAWER NAVIGATION ---
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    const openMenu = () => mobileNav.classList.add('open');
    const closeMenu = () => mobileNav.classList.remove('open');

    menuToggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- TYPING ANIMATION ---
    const typingText = document.getElementById('typing-text');
    const roles = ['Web Developer | Student', 'Problem Solver', 'CSE Student @ SKCET'];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // faster deletion
        } else {
            typingText.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // standard typing
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at the end of the word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 400; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing after a short delay
    setTimeout(typeEffect, 800);

    // --- CANVAS FLOATING PARTICLES ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = {
        light: ['rgba(2, 132, 199, 0.2)', 'rgba(147, 51, 234, 0.15)', 'rgba(56, 189, 248, 0.2)'],
        dark: ['rgba(56, 189, 248, 0.25)', 'rgba(192, 132, 252, 0.2)', 'rgba(14, 165, 233, 0.15)']
    };

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 8 + 2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * -0.6 - 0.1; // Float upwards
            
            // Choose color based on theme
            const themeColors = body.classList.contains('dark-mode') ? colors.dark : colors.light;
            this.color = themeColors[Math.floor(Math.random() * themeColors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Recolor if theme changes
            const themeColors = body.classList.contains('dark-mode') ? colors.dark : colors.light;
            if (!themeColors.includes(this.color)) {
                this.color = themeColors[Math.floor(Math.random() * themeColors.length)];
            }

            // Reset particle if it floats off-screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
                this.size = Math.random() * 8 + 2;
                this.speedY = Math.random() * -0.6 - 0.1;
                this.speedX = Math.random() * 0.4 - 0.2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(Math.floor(window.innerWidth / 15), 80);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    // Reinitialize particles on resize for better density control
    window.addEventListener('resize', () => {
        initParticles();
    });

    // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                elementObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => elementObserver.observe(el));

    // --- ANIMATE SKILLS PROGRESS BARS ON SCROLL ---
    const skillsSection = document.getElementById('skills');
    const progressFillers = document.querySelectorAll('.progress-bar-fill');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When skills section becomes visible, animate progress bars
                progressFillers.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress');
                    bar.style.width = targetWidth;
                });
                skillsObserver.unobserve(entry.target); // Run once
            }
        });
    }, {
        threshold: 0.15
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // --- ACTIVE NAV LINK INDICATOR TRACKING ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-20% 0px -60% 0px' // offset triggers to match viewport scrolling
    });

    sections.forEach(section => navObserver.observe(section));

    // Handle scroll back to top home section nav highlight
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            const homeLink = document.querySelector('.nav-links a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });

});
