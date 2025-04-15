document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.cust-slider-wrapper');
    const slider = document.querySelector('.cust-slider');
    let projectItems = [];
    let numItems = 0;
    let projectData = { projects: [] };
    let currentIndex = 0;
    let isScrolling = false;
    const scrollDebounceDelay = 50; // Adjust debounce as needed
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
    const isWorkPage = window.location.pathname.includes('https://chris-webdev.github.io/web-projects.html'); // Adjust if your work page URL is different
  
    function loadProjectData() {
      fetch('https://chris-webdev.github.io/assets/js/web-proj.json')
        .then(response => response.json())
        .then(data => {
            
          projectData = data;
          let projectsToDisplay = [];

          if (isHomePage) {
            projectsToDisplay = data.projects.slice(0, 3); // Only load the first 3 projects on the homepage
          } else if (isWorkPage) {
            projectsToDisplay = data.projects; // Load all projects on the work page
          } else {
            projectsToDisplay = data.projects; // Load all projects on the work page
          }

          numItems = projectsToDisplay.length;
          renderSlider(projectsToDisplay);
          updateActiveCard(currentIndex);
        })
        .catch(error => console.error('Error loading project data:', error));
    }
  
    function renderSlider(projects) {
      slider.innerHTML = '';
      projectItems = projects.map(project => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        projectItem.dataset.projectId = project.id;
  
        projectItem.innerHTML = `
          <div class="card-image">
            <img src="${project.imageHero}" alt="${project.title}">
            <img src="${project.imageUrl}" alt="${project.title}">
          </div>
          <div class="card-content">
            <h3 class="krona-one-regular">${project.title}</h3>
            <p id="card-description-${project.id}"></p>
            <a id="read-more-link" href="https://chris-webdev.github.io/assets/pg-build-temp/project.html?id=${project.id}" class="read-more-link">
              Read More <span class="arrow-icon"></span>
            </a>
          </div>
        `;
        slider.appendChild(projectItem);
        return projectItem;
      });
    }
  
    function updateActiveCard(newIndex) {
      if (newIndex < 0 || newIndex >= numItems) return;
  
      projectItems.forEach((item, i) => {
        item.classList.remove('active');
      });
  
      currentIndex = newIndex;
      const activeItem = projectItems[currentIndex];
      activeItem.classList.add('active');
      loadDescription(currentIndex);
  
      // Optional: Smooth scroll to center the active item vertically
      const itemRect = activeItem.getBoundingClientRect();
      const wrapperRect = sliderWrapper.getBoundingClientRect();
      const scrollAmount = itemRect.top - wrapperRect.top - (wrapperRect.height - itemRect.height) / 2;
  
      sliderWrapper.scrollTo({
        top: sliderWrapper.scrollTop + scrollAmount,
        behavior: 'smooth'
      });
    }
  
    function loadDescription(index) {
      const item = projectItems[index];
      const projectId = item.dataset.projectId;
      const project = projectData.projects.find(p => p.id === projectId);
  
      if (project && !item.dataset.descriptionLoaded) {
        fetch(project.descriptionFile)
          .then(response => response.text())
          .then(text => {
            const descriptionElement = item.querySelector(`#card-description-${projectId}`);
            if (descriptionElement) {
              descriptionElement.textContent = text.substring(0, 150) + "...";
              item.dataset.descriptionLoaded = 'true';
            }
          })
          .catch(error => console.error('Error loading description:', error));
      }
    }
  
    function handleScroll() {
      if (isScrolling) return;
      isScrolling = true;
  
      const wrapperHeight = window.innerHeight;
      const wrapperCenterY = wrapperHeight / 2;
  
      let closestIndex = -1;
      let minDistance = Infinity;
  
      projectItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(wrapperCenterY - itemCenterY);
  
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
  
      if (closestIndex !== currentIndex) {
        updateActiveCard(closestIndex);
      }
  
      setTimeout(() => {
        isScrolling = false;
      }, scrollDebounceDelay);
    }
  
    // Check if the slider elements exist before adding event listeners
    if (sliderWrapper && slider) {
      window.addEventListener('scroll', handleScroll);
      loadProjectData();
    } else {
      console.error('Slider wrapper or slider element not found.');
    }
});