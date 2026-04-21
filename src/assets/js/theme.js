/**
 * Theme: theme-kimi-101
 * Logic: Luxury Animations & Salla Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');

    // 1. Handle Intro Animation
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
        }
        if (mainContent) {
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('opacity-100');
        }
    }, 3200);

    // 2. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header?.classList.add('header-glass');
            header?.classList.remove('py-8');
            header?.classList.add('py-4');
        } else {
            header?.classList.remove('header-glass');
            header?.classList.add('py-8');
            header?.classList.remove('py-4');
        }
    });

    // 3. Simple Image Lazy Load Fallback
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});
