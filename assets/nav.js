<script>
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  const navUl = nav.querySelector("ul");
  const navFlexCol = nav.querySelector(".flex-col");
  const navScroll = nav.querySelector(".scrolled");
  const scrollY = window.scrollY;
  const windowWidth = window.innerWidth;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollFromBottom = documentHeight - windowHeight - scrollY;

  // --- Thresholds ---
  const switchThreshold = 150;
  const scaleStart = 50.3;
  const scaleEnd = 10;
  const bottomShrinkStart = 200;
  const bottomShrinkEnd = 50;

  let scrolledTranslateX = "0%";
  let translateXValue = 0;
  const translateXIncrease = 0.7;
  const scrollDecreaseStep = 100;
  const minScrollY = 1900;
  const maxScrollY = 2560;

  // --- Helper Functions ---
  function applyInitialNavStyles() {
    nav.classList.remove("scrolled", "shrinking");
    nav.style.position = "relative";
    nav.style.top = "auto";
    nav.style.left = "-98px";
    nav.style.transform = `translateX(0pc) scale(1)`;
    nav.style.marginLeft = `calc(-40vw + 20px)`;
    nav.style.opacity = 1;
    navUl.style.opacity = 1;
    navFlexCol.style.opacity = 1;
    nav.style.width = "calc(100% - 40px)";
    if (windowWidth > 1364) {
      nav.style.width = "";
      nav.style.left = "";
      nav.style.marginLeft = "";
    } else if (windowWidth < 1364) {
      nav.style.left = "";
      nav.style.marginLeft = "";
    } else {
      nav.style.width = "calc(100% - 40px);";
    }
  }

  function applyScrolledNavStyles() {
    nav.classList.add("scrolled");
    nav.classList.remove("shrinking");
    nav.style.position = "fixed";
    nav.style.top = "-100px"; /* Start off-screen */
    nav.style.left = "50%";
    nav.style.marginLeft = `calc(-40vw + 20px)`;
    nav.style.opacity = 1;
    navUl.style.opacity = 1;
    navFlexCol.style.opacity = 1;
    nav.style.padding = "0px 20px";
    nav.style.width = `100%`;
    if (windowWidth > 2201) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowHeight < 2200 && windowWidth >= 2101) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowWidth < 2100 && windowWidth >= 2000) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowWidth < 1999 && windowWidth >= 1741) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowWidth < 1740 && windowWidth >= 1681) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowWidth < 1680 && windowWidth >= 1365) {
      nav.style.width = "calc(100% - 40px)";
    } else if (windowWidth > 1364 && windowWidth <= 1490) {
      nav.style.top = "30px";
      nav.style.marginLeft = "calc(40px - 40vw)";
      nav.style.width = `calc(100% - 200px)`;
    } else if (windowWidth > 1260 && windowWidth <= 1363) {
      nav.style.width = "100%";
      nav.style.transform = "translateX(-10%) scale(1)";
    } else if (windowWidth > 600 && windowWidth <= 1263) {
      nav.style.width = "100%";
    } else {
      nav.style.padding = "0px 20px";
      nav.style.width = "100%";
    }
  }

  function applyShrinkingNavStyles(opacity, scale) {
    nav.classList.add("shrinking");
    nav.style.transform = `translateX(-50%) scale(${scale})`;
    nav.style.opacity = opacity;
    nav.style.width = `calc(80vw - 5px)`;
    nav.style.marginLeft = `0`;
  }

  function getTranslateXByWidth(width) {
    const breakpoints = [{
        minWidth: 2500,
        translateX: "-10.3%"
      },
      {
        minWidth: 2400,
        translateX: "-10.2%"
      },
      {
        minWidth: 2100,
        translateX: "-10.1%"
      },
      {
        minWidth: 2000,
        translateX: "-10.2%"
      },
      {
        minWidth: 1800,
        translateX: "-10.2%"
      },
      {
        minWidth: 1800,
        translateX: "-10.2%"
      },
      {
        minWidth: 1700,
        translateX: "-10.2%"
      },
      {
        minWidth: 1600,
        translateX: "-10.2%"
      },
      {
        minWidth: 1500,
        translateX: "-10.2%"
      },
      {
        minWidth: 1300,
        translateX: "-10.2%"
      },
      {
        minWidth: 1200,
        translateX: "-10.2%"
      },
      {
        minWidth: 1179,
        translateX: "-10.2%"
      },
      {
        minWidth: 900,
        translateX: "-15.5%"
      },
      {
        minWidth: 800,
        translateX: "-16.5%"
      },
      {
        minWidth: 700,
        translateX: "-17.5%"
      },
      {
        minWidth: 600,
        translateX: "-18%"
      },
    ];

    for (const breakpoint of breakpoints) {
      if (width >= breakpoint.minWidth) {
        return breakpoint.translateX;
      }
    }
    return "-10.5%"; // Default fallback
  }

  // --- 1. Handle Initial State ---
  if (scrollY < switchThreshold) {
    applyInitialNavStyles();
  }
  // --- 2. Handle Scrolled State ---
  else if (scrollY >= switchThreshold) {
    applyScrolledNavStyles();  // Apply scrolled styles (including top)

    // * Add this line to bring it into view *
    nav.style.top = "15px"; //  "Pop" it in, use 15px from your CSS

    const translateX = getTranslateXByWidth(windowWidth);
    nav.style.transform = `translateX(${translateX}) scale(1)`;

    // --- 3. Custom translateX adjustment ---
    if (scrollY >= minScrollY && scrollY <= maxScrollY) {
      for (let i = maxScrollY; i >= minScrollY; i -= scrollDecreaseStep) {
        if (scrollY <= i) {
          translateXValue = 0 + ((maxScrollY - i) / scrollDecreaseStep) * translateXIncrease;
          scrolledTranslateX = `-${translateXValue}%`;
          break;
        }
      }
      nav.style.transform = `translateX(${scrolledTranslateX}) scale(1)`;
    }

    if (scrollFromBottom <= bottomShrinkStart && scrollFromBottom > bottomShrinkEnd) {
      const shrinkFactorBottom = (bottomShrinkStart - scrollFromBottom) / (bottomShrinkStart - bottomShrinkEnd);
      const opacity = 1 - shrinkFactorBottom;
      const scale = 1 - (shrinkFactorBottom * 0.5);
      applyShrinkingNavStyles(opacity, scale);
    } else if (scrollFromBottom <= bottomShrinkEnd) {
      applyShrinkingNavStyles(0, 0);
    } else {
      nav.classList.remove("shrinking");
      nav.style.transform = `translateX(${getTranslateXByWidth(windowWidth)}) scale(1)`;
      nav.style.opacity = 1;
    }
  }
});

// --- 5. Mobile Menu Function ---
const navLinks = document.querySelector('.nav-content');

function toggleMenu() {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  document.body.style.touchAction = navLinks.classList.contains('open') ? 'none' : '';
}
</script>
