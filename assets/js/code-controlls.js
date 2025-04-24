document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.code-carousel');
    let cards = [];
    let numCards = 0;
    let angleStep = 0;
    let currentIndex = 0;
    const expandedHeightVh = 56;
    const baseCardHeightPx = 150;
    const mobileBreakpointPx = 1348;
    let isMobile = window.innerWidth < mobileBreakpointPx;
    let mobileActiveTranslateZ = '';

    async function fetchCarouselData() {
        try {
            const response = await fetch('https://chris-webdev.github.io/assets/js/code-crsl-data.json');
            const data = await response.json();
            return data.codeProjects;
        } catch (error) {
            console.error('Error fetching carousel data:', error);
            return [];
        }
    }

    async function fetchCodeContent(filePath) {
        console.log('Fetching code from:', filePath);
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error(`Failed to fetch code from: ${filePath} - Status: ${response.status}`);
                return '';
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error(`Error fetching code from ${filePath}:`, error);
            return '';
        }
    }

    async function createCarouselCards(data) {
        carousel.innerHTML = '';
        cards = await Promise.all(
            data.map(async (item, index) => {
                const card = document.createElement('div');
                card.classList.add('code-card', 'flex-col');
                card.dataset.cardIndex = index;
                card.dataset.exploreUrl = item.explore_url;

                const titleElement = document.createElement('h3');
                titleElement.textContent = item.title;

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                const imageElement = document.createElement('img');
                imageElement.classList.add('project-image');
                imageElement.src = item.image_url;
                imageElement.alt = item.title + ' Image';

                imageContainer.appendChild(imageElement);
                card.appendChild(imageContainer);

                const infoWrapper = document.createElement('div');
                infoWrapper.classList.add('info-wrapper');

                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = item.description;

                const technologiesElement = document.createElement('p');
                technologiesElement.textContent =
                    'Technologies: ' + item.technologies.join(', ');

                infoWrapper.appendChild(descriptionElement);
                infoWrapper.appendChild(technologiesElement);

                const codeBlock = document.createElement('pre');
                codeBlock.classList.add('code-block');
                let codeText = 'Loading...';
                card.dataset.code = '';

                try {
                    console.log(`Fetching code from: ${item.code_file}`);
                    const response = await fetch(item.code_file);
                    if (!response.ok) {
                        console.error(
                            `Failed to fetch code from: ${item.code_file} - Status: ${response.status}`
                        );
                        codeText = `Error loading code from ${item.code_file} (Status: ${response.status})`;
                    } else {
                        codeText = await response.text();
                        card.dataset.code = codeText;
                        const codeElement = document.createElement('code');
                        codeElement.textContent = codeText;
                        codeBlock.appendChild(codeElement);
                    }
                } catch (error) {
                    console.error(`Error fetching code from ${item.code_file}:`, error);
                    codeText = `Error loading code.`;
                    const codeElement = document.createElement('code');
                    codeElement.textContent = codeText;
                    codeBlock.appendChild(codeElement);
                }

                codeBlock.innerHTML = codeText;

                const copyButton = document.createElement('button');
                copyButton.classList.add('copy-button', 'pos-right');
                copyButton.textContent = 'Copy';

                const exploreButton = document.createElement('button');
                exploreButton.classList.add('explore-button');
                exploreButton.textContent = 'Explore';
                exploreButton.dataset.exploreUrl = item.explore_url || '#';

                card.appendChild(imageContainer);
                card.appendChild(titleElement);
                card.appendChild(infoWrapper);
                card.appendChild(codeBlock);
                card.appendChild(copyButton);
                card.appendChild(exploreButton);
                carousel.appendChild(card);
                return card;
            })
        );
        numCards = cards.length;
        angleStep = isMobile ? 360 / (numCards - 1 || 1) : 360 / numCards;
    }

    function updateCardStyles() {
        if (!cards || cards.length === 0) return;

        angleStep = isMobile ? 360 / (numCards - 1 || 1) : 360 / numCards;

        cards.forEach((card, index) => {
            const offset = (index - currentIndex + numCards) % numCards;
            const angle = isMobile ? offset * angleStep - 90 : offset * angleStep;
            const isActive = offset === 0;
            const distanceFactor = isMobile ? 1.5 : 2;
            const zTranslation = 200 * distanceFactor;
            const opacityFactor = 0.6;
            const opacity = isActive ? 1 : opacityFactor + (1 - opacityFactor) * (1 - Math.abs(offset) / (numCards / 2));

            let transformValue = `rotateY(${angle}deg) translateZ(${zTranslation}px)`;
            if (isActive && isMobile) {
                transformValue += ` translateZ(100px)`;
                card.style.transform = 'translateX(-100px)'
            }
            card.style.transform = transformValue;
            card.style.opacity = opacity;
            card.style.zIndex = isActive ? 10 : 5;
            card.style.transformOrigin = isMobile ? 'center bottom 0' : 'center bottom -300px';
            clearTimeout(card.expandTimeout);
            card.classList.remove('expanding-up');
            card.classList.remove('active-expanded');
            card.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out, z-index 0.5s ease-in-out, height 0.5s ease-in-out, transform-origin 0.5s ease-in-out, translate 0.5s ease-in-out, overflow-y 0.5s ease-in-out';

            const titleElement = card.querySelector('h3');
            const descriptionElement = card.querySelector('p');
            const technologiesElement = card.querySelector('p:nth-child(3)');
            const codeBlock = card.querySelector('.code-block');
            const copyButton = card.querySelector('.copy-button');
            const exploreButton = card.querySelector('.explore-button');
            const shouldShowDetails = isActive;

            if (titleElement) titleElement.style.display = shouldShowDetails ? 'block' : 'none';
            if (descriptionElement) descriptionElement.style.display = shouldShowDetails ? 'block' : 'none';
            if (technologiesElement) technologiesElement.style.display = shouldShowDetails ? 'block' : 'none';
            if (codeBlock) codeBlock.style.display = shouldShowDetails ? 'block' : 'none';
            if (copyButton) copyButton.style.display = shouldShowDetails ? 'block' : 'none';
            if (exploreButton) exploreButton.style.display = shouldShowDetails ? 'block' : 'none';

            if (isActive) {
                card.classList.add('active');
                card.classList.add('active-expanded');
                card.expandTimeout = setTimeout(() => {
                    card.classList.add('expanding-up');
                    card.style.height = `${expandedHeightVh}vh`;
                    card.style.overflowY = 'auto';
                    if (isMobile) {
                        card.style.transform = `${transformValue} translateY(20px)`;
                        card.style.height = "400px";
                    }
                }, 500);
            } else {
                card.classList.remove('active');
                card.classList.remove('expanding-up');
                card.style.height = `${baseCardHeightPx}px`;
                card.style.overflow = 'hidden';
                card.style.transform = transformValue;
            }
        });

        if (isMobile) {
            carousel.style.transform = `translateY(15%) translateX(-4%) rotateY(90deg)  scale(0.6)`;
            carousel.style.perspectiveOrigin = '50% 50%';
        } else {
            carousel.style.transform = `translateY(15%) translateX(39.8%) translateZ(-400px)`;
            carousel.style.perspectiveOrigin = '50% 50%';
        }
    }

    function handleResize() {
        const currentWidth = window.innerWidth;
        const wasMobile = isMobile;
        isMobile = currentWidth < mobileBreakpointPx;

        if (currentWidth === 601) {
            carousel.style.transform = `translateY(15%) translateX(0%) rotateY(80deg)`;
            carousel.style.perspectiveOrigin = '55% 60%';
            angleStep = 180 / (numCards - 1 || 1);
            if (numCards > 0) {
                currentIndex = 1;
            }
        } else if (isMobile) {
            carousel.style.transform = `translateY(25%) translateX(-10%) rotateY(90deg)`;
            carousel.style.perspectiveOrigin = '50% 50%';
            angleStep = 180 / (numCards - 1 || 1);
            if (numCards > 0) {
                if (currentWidth <= 600) {
                    currentIndex = 1;
                } else if (currentWidth > 600) {
                    currentIndex = 2;
                }
            }
        } else {
            carousel.style.transform = `translateY(15%) translateX(39.8%) translateZ(-400px)`;
            carousel.style.perspectiveOrigin = '50% 50%';
            angleStep = 420 / numCards;
            currentIndex = 0;
        }

        updateCardStyles();
    }

    window.addEventListener('resize', handleResize);

    function initializeCarousel() {
        fetchCarouselData().then(data => {
            createCarouselCards(data).then(() => {
                if (isMobile && numCards > 0) {
                    if (window.innerWidth <= 601) {
                        currentIndex = 1;
                    } else if (window.innerWidth > 601 && window.innerWidth < mobileBreakpointPx) {
                        currentIndex = 2;
                    }
                }
                updateCardStyles();
            });
        });
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % numCards;
        updateCardStyles();
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + numCards) % numCards;
        updateCardStyles();
    }

    document.getElementById('left-cntrl').addEventListener('click', prevCard);
    document.getElementById('right-cntrl').addEventListener('click', nextCard);

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('copy-button')) {
            const card = event.target.closest('.code-card');
            if (card) {
                const code = card.dataset.code;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        alert('Code copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            }
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('explore-button')) {
            const button = event.target;
            const exploreUrl = button.dataset.exploreUrl;
            if (exploreUrl) {
                window.open(exploreUrl, '_blank');
            }
        }
    });

    window.addEventListener('resize', handleResize);

    initializeCarousel();
});
