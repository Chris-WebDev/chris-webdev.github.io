document.addEventListener('DOMContentLoaded', function() {
    // Call nav
    fetch('https://chris-webdev.github.io/assets/header/nav.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('nav-holder').innerHTML = data;
        // Call populateDropdown and loadNavHoverImage after the navigation is loaded
        loadProjectsForNav();
        loadNavHoverImage();
      })
      .catch(error => console.error('Error loading nav:', error));
  });
  
  /* Populate Dropdown Menu */
  function loadProjectsForNav() {
    fetch('https://chris-webdev.github.io/assets/js/web-proj.json') // Adjust path if needed
      .then(response => response.json())
      .then(data => {
        const projects = data.projects;
        populateDropdown(projects);
      })
      .catch(error => console.error('Error loading project data for nav:', error));
  }
  
function populateDropdown(projects) {
    const dropdown = document.getElementById('project-dropdown');
    projects.forEach(project => {
        const listItem = document.createElement('div'); // This 'div' is the key
        const link = document.createElement('a');
        link.href = `https://chris-webdev.github.io/assets/pg-build-temp/project.html?id=${project.id}`;
        link.textContent = project.title;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const hoverImage = document.createElement('img');
        hoverImage.id = `project-hover-image-${project.id}`;
        hoverImage.src = ''; // Initially no image

        imageContainer.appendChild(hoverImage);
        listItem.appendChild(link);
        listItem.appendChild(imageContainer);
        dropdown.appendChild(listItem);

        listItem.addEventListener('mouseenter', () => {
        const hoverImageElement = document.getElementById(`project-hover-image-${project.id}`);
        if (hoverImageElement && project.imageUrl) {
            hoverImageElement.src = project.imageUrl;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }
        });

        listItem.addEventListener('mouseleave', () => {
        imageContainer.style.display = 'none';
        const hoverImageElement = document.getElementById(`project-hover-image-${project.id}`);
        if (hoverImageElement) {
            hoverImageElement.src = '';
        }
        });
    });
}
  
/* Load Navigation Hover Image */
function loadNavHoverImage() {
  fetch('https://chris-webdev.github.io/assets/js/web-proj.json')
    .then(response => response.json())
    .then(data => {
      // Assuming you want to load the image from the *first* project in the 'projects' array
      if (data && data.projects && data.projects.length > 0 && data.projects[0].imageUrl) {
        const hoverImageElement = document.getElementById('project-hover-image');
        if (hoverImageElement) {
          hoverImageElement.src = data.projects[0].imageUrl;
        } else {
          console.error('Element with ID "project-hover-image" not found.');
        }
      } else {
        console.warn('No project data or imageUrl found in web-proj.json for the navigation hover image.');
      }
    })
    .catch(error => console.error('Error loading web-proj.json:', error));
}