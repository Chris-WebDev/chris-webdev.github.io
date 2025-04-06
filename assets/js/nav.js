window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");
    const navUl = nav.querySelector("ul");
    const navFlexCol = nav.querySelector(".flex-col");
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollFromBottom = documentHeight - windowHeight - scrollY;

    const switchThreshold = 150;     // Threshold for the instant switch
    const scaleStart = 50;         // ScrollY to start scaling the nav
    const scaleEnd = 10;           // ScrollY to be fully scaled (either 0 or 1)
    const bottomShrinkStart = 200; // Distance from bottom to start shrinking/fading
    const bottomShrinkEnd = 50;      // Distance from bottom to be fully gone/shrunk

    if (scrollY < switchThreshold) {
        // Initial full-width nav - ENSURE ALL SCROLLED STYLES ARE RESET
        nav.classList.remove("scrolled");
        nav.classList.remove("shrinking");
        nav.style.position = "relative";
        nav.style.top = "auto";
        nav.style.left = "auto";
        nav.style.transform = `translateX(0) scale(1)`;
        nav.style.marginLeft = "0";
        nav.style.width = `100%`;
        nav.style.opacity = 1;
        navUl.style.opacity = 1;
        navFlexCol.style.opacity = 1;

        // Control scaling of nav at the top
        if (scrollY > scaleStart) {
            const scaleFactor = Math.max(0, 1 - (scrollY - scaleStart) / (switchThreshold - scaleStart));
            nav.style.transform = `translateX(-50%) scale(${scaleFactor})`;
            nav.style.opacity = scaleFactor; // Optionally fade out with scale
            nav.style.width = `calc(100% - 200px)`; // Shrink width as it scales
            nav.style.marginLeft = "50%"; // Maintain center as it shrinks
        } else {
            nav.style.transform = `translateX(0) scale(1)`; // Fully scaled in
            nav.style.marginLeft = "0";
            nav.style.width = `90%`;
            nav.style.opacity = 1;
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
        nav.style.transform = "translateX(-50%) scale(1)"; // Reset scale for scrolled
        nav.style.marginLeft = "0";
        nav.style.width = `calc(100% - 300px)`;
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
});