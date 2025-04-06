document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.querySelector('.project-details-container');
  
    // --- Overflow Check ---
    function checkOverflow() {
      detailsContainer.classList.toggle('no-overflow', detailsContainer.scrollHeight <= detailsContainer.clientHeight);
    }
  
    checkOverflow();
  
    const titleElement = document.getElementById('project-title');
    const descriptionElement = document.getElementById('project-description');
  
    const observer = new MutationObserver(checkOverflow);
    const config = { childList: true, subtree: true, characterData: true };
  
    if (titleElement) observer.observe(titleElement, config);
    if (descriptionElement) observer.observe(descriptionElement, config);
  
    // --- Slider Functionality ---
    const sliderWrapper = document.querySelector('.cust-slider-wrapper');
    const slider = document.querySelector('.cust-slider');
    let projectItems = [];
    let currentIndex = 0;
    let numItems = 0;
    let projectData = [];
  
    function updateSlider() {
      projectItems.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.image-overlay')?.remove();
        item.querySelector('.active-image-button')?.remove();
      });
  
      if (projectItems[currentIndex]) {
        const currentItem = projectItems[currentIndex];
        currentItem.classList.add('active');
  
        const overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
        currentItem.appendChild(overlay);
  
        const activeButton = document.createElement('button');
        activeButton.classList.add('active-image-button');
        activeButton.textContent = 'Explore';
        currentItem.appendChild(activeButton);
  
        const scrollPosition = currentItem.offsetLeft - (sliderWrapper.offsetWidth / 2) + (currentItem.offsetWidth / 2);
        sliderWrapper.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  
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
        fetch(projectData[index].descriptionFile)
          .then(response => response.text())
          .then(text => descriptionElement.textContent = text || "No description available.")
          .catch(error => {
            console.error('Error loading description file:', projectData[index].descriptionFile, error);
            descriptionElement.textContent = "Error loading description.";
          });
        readMoreLink.href = projectData[index].link || "#";
      } else {
        titleElement.textContent = "Project Details";
        descriptionElement.textContent = "No data available.";
        readMoreLink.href = "#";
      }
    }
  
    function loadProjectData() {
      fetch('https://chris-webdev.github.io/assets/js/web-proj.json')
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
      projectItems = projectData.map(project => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
  
        const img = document.createElement('img');
        img.src = project.imageSrc;
        img.alt = project.title;
  
        projectItem.appendChild(img);
        projectItem.addEventListener('click', () => goToSlide(projectItems.indexOf(projectItem)));
        slider.appendChild(projectItem);
        return projectItem;
      });
    }
  
    loadProjectData();
  });