document.addEventListener('DOMContentLoaded', function() {
    const sliderImages = document.querySelectorAll('.slider-image');
    const sliderControls = document.querySelectorAll('.hp-poj');
    const scrollTimerDisplay = document.getElementById('scroll-timer');
    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const sliderHeight = document.querySelector('.hero-slider').offsetHeight;
    const bottomThreshold = sliderHeight; // Start counting after the slider
    const iterationInterval = 4000; // Time in milliseconds to change slide
    let currentIndex = 0;
    let timerInterval;
    let startTime;
    let isTracking = false;
    let autoSlideInterval;

    function activateSlide(index) {
        sliderImages.forEach(image => {
            image.classList.remove('active');
            image.style.transform = 'translateX(20px)';
        });
        sliderImages[index].classList.add('active');
        sliderImages[index].style.transform = 'translateX(0)';

        sliderControls.forEach(control => control.classList.remove('active-control'));
        sliderControls[index].classList.add('active-control');
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % sliderImages.length;
        activateSlide(nextIndex);
    }

    function startIteration() {
        autoSlideInterval = setInterval(nextSlide, iterationInterval);
    }

    function stopIteration() {
        clearInterval(autoSlideInterval);
    }

    function startTimer() {
        isTracking = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
        startIteration(); // Begin automatic sliding
    }

    function stopTimer() {
        isTracking = false;
        clearInterval(timerInterval);
        stopIteration(); // Stop automatic sliding
    }

    function updateTimer() {
        if (isTracking && startTime) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            scrollTimerDisplay.textContent = `Time on Screen: ${elapsedTime}s`;
        }
    }

    function checkScrollPosition() {
        const scrollTop = window.scrollY;
        const sliderTop = document.querySelector('.hero-slider').offsetTop;
        const sliderBottom = sliderTop + document.querySelector('.hero-slider').offsetHeight;
        const documentBottom = document.documentElement.scrollHeight - window.innerHeight;

        // User is within the slider's vertical bounds
        if (scrollTop >= sliderTop && scrollTop < documentBottom && !isTracking) {
            startTimer();
        } else if ((scrollTop < sliderTop || scrollTop >= documentBottom) && isTracking) {
            stopTimer();
            scrollTimerDisplay.textContent = `Time on Screen: Stopped`;
        }
    }

    sliderControls.forEach((control, index) => {
        control.addEventListener('click', function() {
            activateSlide(index);
            stopTimer(); // Stop automatic iteration on manual click
        });
    });

    // Initial check
    checkScrollPosition();

    window.addEventListener('scroll', checkScrollPosition);

    // Initialize the first slide as active
    activateSlide(currentIndex);
});