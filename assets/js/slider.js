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
  let projectData = { projects: [] }; // Initialize to hold the 'projects' array

  function updateSlider() {
    projectItems.forEach(item => {
      item.classList.remove('active');
      item.querySelector('.image-overlay')?.remove();
      const button = item.querySelector('.active-image-button');
      if (button) {
        button.remove(); // Ensure any leftover button is removed
      }
    });

    if (projectItems[currentIndex]) {
      const currentItem = projectItems[currentIndex];
      currentItem.classList.add('active');

      const overlay = document.createElement('div');
      overlay.classList.add('image-overlay');
      currentItem.appendChild(overlay);

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
    const arrowSpan = readMoreLink.querySelector('.arrow-icon'); // Get the existing span
  
    if (projectData.projects && projectData.projects[index]) {
      titleElement.textContent = projectData.projects[index].title || "Project Details";
      fetch(projectData.projects[index].descriptionFile)
        .then(response => response.text())
        .then(text => descriptionElement.textContent = text || "No description available.")
        .catch(error => {
          console.error('Error loading description file:', projectData.projects[index].descriptionFile, error);
          descriptionElement.textContent = "Error loading description.";
        });
      readMoreLink.href = `https://chris-webdev.github.io/assets/pg-build-temp/project.html?id=${projectData.projects[index].id}`; // Link to page builder
      readMoreLink.textContent = "Explore Project "; // Add space before the span
  
      // Create the image element
      const readMoreImage = document.createElement('img');
      readMoreImage.src = 'https://chris-webdev.github.io/uploads/images/icon/light-cntrl.png';
      readMoreImage.alt = 'Explore Project Icon';
      readMoreImage.classList.add('read-more-icon'); // Add a class for styling
  
      // Clear the span and append the image
      arrowSpan.innerHTML = '';
      arrowSpan.appendChild(readMoreImage);
  
    } else {
      titleElement.textContent = "Project Details";
      descriptionElement.textContent = "No data available.";
      readMoreLink.href = "#";
      readMoreLink.textContent = "Read More "; // Add space before the span
  
      // Clear the span
      if (arrowSpan) {
        arrowSpan.innerHTML = '';
      }
    }
  }

  function loadProjectData() {
    fetch('https://chris-webdev.github.io/assets/js/web-proj.json')
      .then(response => response.json())
      .then(data => {
        projectData = data;
        numItems = projectData.projects.length;
        renderSlider();
        updateSlider();
      })
      .catch(error => console.error('Error loading project data:', error));
  }

  function renderSlider() {
    slider.innerHTML = '';
    projectItems = projectData.projects.map(project => {
      const projectItem = document.createElement('div');
      projectItem.classList.add('project-item');

      const img = document.createElement('img');
      img.src = project.imageUrl;
      img.alt = project.title;

      projectItem.appendChild(img);
      projectItem.addEventListener('click', () => goToSlide(projectItems.indexOf(projectItem))); // Click image to update slide
      slider.appendChild(projectItem);
      return projectItem;
    });
  }

  loadProjectData();
});