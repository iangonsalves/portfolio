// Theme storage key
const THEME_KEY = 'portfolio-theme';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Theme Toggle Setup
    setupThemeToggle();

    // Filter functionality with enhanced animations
    setupProjectFilters();

    // Smooth scroll for navigation
    setupSmoothScroll();

    // Typing effect for header
    setupTypingEffect();

    // Project image preview
    setupImagePreviews();
});

function setupThemeToggle() {
    // Add theme toggle button to nav
    const nav = document.querySelector('nav');
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.innerHTML = '🌙';
    themeBtn.classList.add('theme-toggle');
    nav.appendChild(themeBtn);

    // Check for saved theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeBtn.innerHTML = savedTheme === 'dark-theme' ? '☀️' : '🌙';
    }

    // Theme toggle handler
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem(THEME_KEY, isDark ? 'dark-theme' : '');
        themeBtn.innerHTML = isDark ? '☀️' : '🌙';
    });
}

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('#filter button');
    const projects = document.querySelectorAll('.project');
    
    // Set initial state
    filterButtons[0]?.classList.add('active');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Animate projects
            projects.forEach(project => {
                const categories = project.dataset.category || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    project.style.display = 'block';
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, 100));
}

function setupTypingEffect() {
    const text = document.querySelector('.header-content div p'); // More specific selector
    if (!text) return;

    const originalText = text.textContent;
    text.textContent = '';
    let i = 0;

    function type() {
        if (i < originalText.length) {
            text.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    type();
}

function setupImagePreviews() {
    const projectImages = document.querySelectorAll('.project-image');
    
    projectImages.forEach(img => {
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            setTimeout(() => modal.classList.add('show'), 10);
            
            modal.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });
    });
}

// Utility function for debouncing scroll events
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
