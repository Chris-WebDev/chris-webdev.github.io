

document.addEventListener('DOMContentLoaded', function() {
    //call nav
    fetch('assets/header/nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-holder').innerHTML = data;
    })
    .catch(error => console.error('Error loading nav:', error));

    // Hide scroll sections
    const detailsContainer = document.querySelector('.project-details-container');

    function checkOverflow() {
        if (detailsContainer.scrollHeight <= detailsContainer.clientHeight) {
            detailsContainer.classList.add('no-overflow');
        } else {
            detailsContainer.classList.remove('no-overflow');
        }
    }

    // Call checkOverflow initially
    checkOverflow();

    // You might need to call checkOverflow again if the content of
    // the details container changes dynamically after the initial load.
    // For example, if the text content updates with different lengths.
    const titleElement = document.getElementById('project-title');
    const descriptionElement = document.getElementById('project-description');

    const observer = new MutationObserver(checkOverflow);
    const config = { childList: true, subtree: true, characterData: true };

    observer.observe(titleElement, config);
    observer.observe(descriptionElement, config);
// end of scroll hide

    const sliderWrapper = document.querySelector('.cust-slider-wrapper');
    const slider = document.querySelector('.cust-slider');
    let projectItems = [];
    let currentIndex = 0;
    let numItems = 0;
    let projectData = [];

    function updateSlider() {
        projectItems.forEach(item => {
            item.classList.remove('active');
            const overlay = item.querySelector('.image-overlay');
            if (overlay) {
                item.removeChild(overlay);
            }
            // Remove any existing active image button
            const existingButton = item.querySelector('.active-image-button');
            if (existingButton) {
                item.removeChild(existingButton);
            }
        });

        if (projectItems[currentIndex]) {
            const currentItem = projectItems[currentIndex];
            currentItem.classList.add('active');

            const overlay = document.createElement('div');
            overlay.classList.add('image-overlay');
            currentItem.appendChild(overlay);

            // Create and add the button for the active image
            const activeButton = document.createElement('button');
            activeButton.classList.add('active-image-button');
            activeButton.textContent = 'Explore'; // Or your desired text
            currentItem.appendChild(activeButton);

            const activeItemWidth = currentItem.offsetWidth;
            const wrapperWidth = sliderWrapper.offsetWidth;
            const scrollPosition = currentItem.offsetLeft - (wrapperWidth / 2) + (activeItemWidth / 2);

            sliderWrapper.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });

            updateProjectContent(currentIndex);
        }
    }

    function goToSlide(index) {
        if (index >= 0 && index < numItems) {
            currentIndex = index;
            updateSlider();
        }
    }

    function updateProjectContent(index) {
        const titleElement = document.getElementById('project-title');
        const descriptionElement = document.getElementById('project-description');
        const readMoreLink = document.getElementById('read-more-link');

        if (projectData[index]) {
            titleElement.textContent = projectData[index].title || "Project Details";
            const descriptionFile = projectData[index].descriptionFile;
            const projectLink = projectData[index].link || "#";

            fetch(descriptionFile)
                .then(response => response.text())
                .then(text => {
                    descriptionElement.textContent = text || "No description available.";
                })
                .catch(error => {
                    console.error('Error loading description file:', descriptionFile, error);
                    descriptionElement.textContent = "Error loading description.";
                });

            readMoreLink.href = projectLink;
        } else {
            titleElement.textContent = "Project Details";
            descriptionElement.textContent = "No data available.";
            readMoreLink.href = "#";
        }
    }

    function loadProjectData() {
        fetch('projects.json')
            .then(response => response.json())
            .then(data => {
                projectData = data;
                numItems = projectData.length;
                renderSlider();
                updateSlider();
            })
            .catch(error => console.error('Error loading project data:', error));
    }

    function renderSlider() {
        slider.innerHTML = '';
        projectItems = [];

        projectData.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');

            const img = document.createElement('img');
            img.src = project.imageSrc;
            img.alt = project.title;

            projectItem.appendChild(img);
            slider.appendChild(projectItem);
            projectItems.push(projectItem);

            projectItem.addEventListener('click', () => {
                goToSlide(projectItems.indexOf(projectItem));
            });
        });
    }

    loadProjectData();
});