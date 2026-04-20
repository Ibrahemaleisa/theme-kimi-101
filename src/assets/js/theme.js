document.addEventListener('DOMContentLoaded', () => {
    const brandName = document.getElementById('brand-name');
    const revealShield = document.getElementById('initial-reveal');
    const wrapper = document.getElementById('site-wrapper');

    // تفعيل أنيميشن الاسم بعد 500ms
    setTimeout(() => {
        brandName.parentElement.classList.add('active');
    }, 500);

    // كشف الموقع بعد 3 ثواني
    setTimeout(() => {
        revealShield.style.opacity = '0';
        revealShield.style.pointerEvents = 'none';
        wrapper.style.opacity = '1';
    }, 3500);

    // تتبع الماوس لإضافة لمسة تفاعلية خفيفة (اختياري)
    document.addEventListener('mousemove', (e) => {
        // يمكنك هنا إضافة Custom Cursor إذا أردت فخامة أعلى
    });
});
