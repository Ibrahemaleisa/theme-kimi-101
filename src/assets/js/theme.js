// Splash fade out
window.addEventListener("load", () => {
    const splash = document.getElementById("splash");

    setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.pointerEvents = "none";
    }, 2000);
});

// Header scroll effect
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
