window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");
    const navUl = nav.querySelector("ul");
    const navFlexCol = nav.querySelector(".flex-col");
    const scrollY = window.scrollY;
    const windowWidth = window.innerWidth; // Get window width
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollFromBottom = documentHeight - windowHeight - scrollY;

    const switchThreshold = 150;     // Threshold for the instant switch
    const scaleStart = 50.3;         // ScrollY to start scaling the nav
    const scaleEnd = 10;           // ScrollY to be fully scaled (either 0 or 1)
    const bottomShrinkStart = 200; // Distance from bottom to start shrinking/fading
    const bottomShrinkEnd = 50;     // Distance from bottom to be fully gone/shrunk

    let scrolledTranslateX = "-50%"; // Default translateX for scrolled state

    // Update translateX based on window width
    if (windowWidth <= 1367 && windowWidth > 700) {
        scrolledTranslateX = "-31%";
    }

    if (scrollY < switchThreshold) {
        // Initial full-width nav - ENSURE ALL SCROLLED STYLES ARE RESET
        nav.classList.remove("scrolled");
        nav.classList.remove("shrinking");
        nav.style.position = "relative";
        nav.style.top = "auto";
        nav.style.left = "auto";
        nav.style.transform = `translateX(0) scale(1)`;
        nav.style.marginLeft = "0";
        nav.style.opacity = 1;
        navUl.style.opacity = 1;
        navFlexCol.style.opacity = 1;

        // Control scaling of nav at the top
        if (scrollY > scaleStart) {
            const scaleFactor = Math.max(0, 1 - (scrollY - scaleStart) / (switchThreshold - scaleStart));
            nav.style.transform = `translateX(-54%) scale(${scaleFactor})`;
            nav.style.opacity = scaleFactor; // Optionally fade out with scale
            nav.style.width = `calc(100% - 200px)`; // Shrink width as it scales
            nav.style.marginLeft = "50%"; // Maintain center as it shrinks
        } else {
            nav.style.marginLeft = "0";
            nav.style.opacity = 1;
            if (windowWidth === 1367) {
                scrolledTranslateX = "-56%";
                scrolledWidth = `1450px`;
            }
            if (windowWidth < 750) {
                nav.style.width = 'auto';
                nav.style.transform = `translateX(0px) scale(${scale})`;
                nav.style.opacity = opacity;
                nav.style.width = `auto`; // Maintain original scrolled width
                nav.style.marginLeft = `0`; // Ensure centering via transform
            }
            if (scrollY <= scaleEnd) {
                // Optionally set initial scale if you want it to start smaller
                // nav.style.transform = `translateX(-50%) scale(0)`;
                // nav.style.opacity = 0;
            }
        }
    } else if (scrollY >= switchThreshold) {
        // Instant switch to scrolled nav
        nav.classList.add("scrolled");
        nav.classList.remove("shrinking");
        nav.style.position = "fixed";
        nav.style.top = "50px";
        nav.style.left = "50%";
        nav.style.transform = `translateX(${scrolledTranslateX}) scale(1)`; // Use dynamic translateX
        nav.style.marginLeft = "0";
        nav.style.width = `calc(100% - 312px)`;
        nav.style.opacity = 1;
        navUl.style.opacity = 1;
        navFlexCol.style.opacity = 1;

        // Bottom shrinking logic remains the same
        if (scrollFromBottom <= bottomShrinkStart && scrollFromBottom > bottomShrinkEnd) {
            nav.classList.add("shrinking");
            const shrinkFactorBottom = (bottomShrinkStart - scrollFromBottom) / (bottomShrinkStart - bottomShrinkEnd);
            const opacity = 1 - shrinkFactorBottom;
            const scale = 1 - (shrinkFactorBottom * 0.5); // Scale down towards center

            nav.style.transform = `translateX(-50%) scale(${scale})`;
            nav.style.opacity = opacity;
            nav.style.width = `calc(100% - 300px)`; // Maintain original scrolled width
            nav.style.marginLeft = `0`; // Ensure centering via transform
        } else if (scrollFromBottom <= bottomShrinkEnd) {
            nav.classList.add("shrinking");
            nav.style.transform = `translateX(-50%) scale(0)`; // Fully scale down
            nav.style.opacity = 0;
        } else {
            nav.classList.remove("shrinking");
            nav.style.transform = `translateX(-50%) scale(1)`; // Reset scale
            nav.style.opacity = 1;
        }

    }
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('.dropdown-content').classList.toggle('active');
    });
});

const navLinks = document.querySelector('.nav-content');

function toggleMenu() {
    navLinks.classList.toggle('open');
}