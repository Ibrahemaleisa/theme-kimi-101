/**
 * Theme: theme-kimi-101
 * Version: 1.0.0
 * Description: Integrated Logic for Luxury Animations & Salla API
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. تعريف العناصر الأساسية ===
    const loader = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const header = document.getElementById('site-header');

    // === 2. إدارة تجربة الدخول (Luxury Loader) ===
    // ننتظر انتهاء أنميشن الـ CSS (3.2 ثانية) ثم نخفي الطبقة
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

    // === 3. تأثير الهيدر عند التمرير (Scroll Performance) ===
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header?.classList.add('header-glass', 'py-4');
            header?.classList.remove('py-8');
        } else {
            header?.classList.remove('header-glass', 'py-4');
            header?.classList.add('py-8');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // === 4. التكامل مع Salla SDK (Cart & Events) ===
    
    // تحديث عداد السلة فوراً عند إضافة أي منتج
    salla.cart.event.onUpdated((res) => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.innerText = res.count;
            // إضافة نبضة بسيطة للفت الانتباه عند التحديث
            el.classList.add('animate-pulse');
            setTimeout(() => el.classList.remove('animate-pulse'), 1000);
        });
        
        // إعادة تحميل محتوى صفحة السلة إذا كان العميل بداخلها حالياً
        if (window.location.pathname.includes('/cart')) {
            window.location.reload(); 
        }
    });

    // إرسال تنبيه ناعم (Notification) عند الإضافة للسلة
    salla.event.on('cart::add-item', (res) => {
        // يمكنك استخدام Salla Notify الافتراضي أو بناء واحد مخصص
        salla.notify.success("Product added to bag");
    });

    // === 5. معالجة الصور (Lazy Loading Fallback) ===
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

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
});
