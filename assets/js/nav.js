function applyScrollEffects() {
    window.addEventListener("scroll", function () {
        const nav = document.querySelector("nav");
        const mynav = document.getElementById("myNav");
        const navUl = nav.querySelector("ul");
        const navFlexCol = nav.querySelector(".flex-col");
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollFromBottom = documentHeight - windowHeight - scrollY;

        const switchThreshold = 150;
        const scaleStart = 50;
        const scaleEnd = 10;
        const bottomShrinkStart = 200;
        const bottomShrinkEnd = 50;

        if (scrollY < switchThreshold) {
            nav.classList.remove("scrolled");
            nav.classList.remove("shrinking");
            nav.style.position = "relative";
            nav.style.top = "auto";
            nav.style.left = "auto";
            nav.style.transform = `translateX(-50%) scale(1)`;
            nav.style.marginLeft = "50%";
            if (window.innerWidth > 900) { // Check screen width before applying width
                nav.style.width = `calc(100% - 200px)`;
            }
            nav.style.opacity = 1;
            navUl.style.opacity = 1;
            navFlexCol.style.opacity = 1;

            if (scrollY > scaleStart) {
                const scaleFactor = Math.max(0, 1 - (scrollY - scaleStart) / (switchThreshold - scaleStart));
                nav.style.transform = `translateX(-50%) scale(${scaleFactor})`;
                nav.style.opacity = scaleFactor;
            } else {
                nav.style.transform = `translateX(-50%) scale(1)`;
                nav.style.opacity = 1;
            }
        } else if (scrollY >= switchThreshold) {
            nav.classList.add("scrolled");
            nav.classList.remove("shrinking");
            nav.style.position = "fixed";
            nav.style.top = "50px";
            nav.style.left = "50%";
            nav.style.transform = "translateX(-50%) scale(1)";
            nav.style.marginLeft = "0";
            if (window.innerWidth < 900) { // Check screen width before applying width
                nav.style.top = "0px";
            }
            nav.style.opacity = 1;
            navUl.style.opacity = 1;
            navFlexCol.style.opacity = 1;

            if (scrollFromBottom <= bottomShrinkStart && scrollFromBottom > bottomShrinkEnd) {
                nav.classList.add("shrinking");
                const shrinkFactorBottom = (bottomShrinkStart - scrollFromBottom) / (bottomShrinkStart - bottomShrinkEnd);
                const opacity = 1 - shrinkFactorBottom;
                const scale = 1 - (shrinkFactorBottom * 0.5);

                nav.style.transform = `translateX(-45%) scale(${scale})`;
                nav.style.opacity = opacity;
                if (window.innerWidth > 900) { // Check screen width before applying width
                    nav.style.width = `calc(100% - 100px)`;
                    mynav.style.top = "0";
                }
                nav.style.marginLeft = `0`;
            } else if (scrollFromBottom <= bottomShrinkEnd) {
                nav.classList.add("shrinking");
                nav.style.transform = `translateX(-50%) scale(0)`;
                nav.style.opacity = 0;
            } else {
                nav.classList.remove("shrinking");
                nav.style.transform = `translateX(-50%) scale(1)`;
                nav.style.opacity = 1;
            }
        }
    });
}

// Conditionally apply scroll effects on larger screens
if (window.innerWidth > 300) {
    applyScrollEffects();
}

function myFunction() {
    var x = document.getElementById("myNav");
    if (x.className === "nav") {
        x.className += " responsive";
    } else {
        x.className = "nav";
    }
}