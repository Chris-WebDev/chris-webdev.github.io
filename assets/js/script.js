document.addEventListener('DOMContentLoaded', function() {
  // Call nav
  fetch('assets/header/nav.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('nav-holder').innerHTML = data;
      // Call populateDropdown and loadNavHoverImage after the navigation is loaded
      loadProjectsForNav();
      loadNavHoverImage();

      // Check the current page URL
      if (window.location.href.includes("web-projects.html")) {
        populateWorkPage();
      }

    })
    .catch(error => console.error('Error loading nav:', error));

  // Call footer and populate it
  fetch('assets/footer/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-holder').innerHTML = data;
      populateFooterLinks();
    })
    .catch(error => console.error('Error loading footer:', error));
});

/* Populate Dropdown Menu */
function loadProjectsForNav() {
  fetch('assets/js/web-proj.json')
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
    const listItem = document.createElement('div');
    const link = document.createElement('a');
    link.href = `assets/pg-build-temp/project.html?id=${project.id}`;
    link.textContent = project.title;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const hoverImage = document.createElement('img');
    hoverImage.id = `project-hover-image-${project.id}`;
    hoverImage.src = '';

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
  fetch('assets/js/web-proj.json')
    .then(response => response.json())
    .then(data => {
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

function populateFooterLinks() {
  const webProjectsLinksContainer = document.getElementById('web-projects-links');
  const codeProjectsLinksContainer = document.getElementById('code-projects-links');

  // Fetch and populate Web Projects
  fetch('assets/js/web-proj.json')
    .then(response => response.json())
    .then(data => {
      const projects = data.projects;
      projects.forEach(project => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `assets/pg-build-temp/project.html?id=${project.id}`;
        link.textContent = project.title;
        listItem.appendChild(link);
        webProjectsLinksContainer.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading web projects for footer:', error));

  // Fetch and populate Code Projects
  fetch('assets/js/code-crsl-data.json')
    .then(response => response.json())
    .then(data => {
      const codeProjects = data.codeProjects;
      codeProjects.forEach(project => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = project.explore_url || '#';
        link.textContent = project.title;
        listItem.appendChild(link);
        codeProjectsLinksContainer.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading code projects for footer:', error));
}

function populateWorkPage() {
  const workContent = document.getElementById('work-content');

  // Clear existing content
  workContent.innerHTML = '';

  // Create the columns structure
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'work-columns-container';

  const webProjectsColumn = document.createElement('div');
  webProjectsColumn.className = 'work-column';
  webProjectsColumn.innerHTML = '<h3>Web Projects</h3><ul id="work-web-projects-links"></ul>';

  const codeProjectsColumn = document.createElement('div');
  codeProjectsColumn.className = 'work-column';
  codeProjectsColumn.innerHTML = '<h3>Code Projects</h3><ul id="work-code-projects-links"></ul>';

  columnsContainer.appendChild(webProjectsColumn);
  columnsContainer.appendChild(codeProjectsColumn);
  workContent.appendChild(columnsContainer);

  const webProjectsLinksContainer = document.getElementById('work-web-projects-links');
  const codeProjectsLinksContainer = document.getElementById('work-code-projects-links');

  // Fetch and populate Web Projects
  fetch('assets/js/web-proj.json')
    .then(response => response.json())
    .then(data => {
      const projects = data.projects;
      projects.forEach(project => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href =  `assets/pg-build-temp/project.html?id=${project.id}`;
        link.textContent = project.title;
        listItem.appendChild(link);
        webProjectsLinksContainer.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading web projects for work:', error));

  // Fetch and populate Code Projects
  fetch('assets/js/code-crsl-data.json')
    .then(response => response.json())
    .then(data => {
      const codeProjects = data.projects;
      codeProjects.forEach(project => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = project.explore_url || '#';
        link.textContent = project.title;
        listItem.appendChild(link);
        codeProjectsLinksContainer.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading code projects for work:', error));

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .work-columns-container {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        text-align: left;
      }
      .work-columns-container .work-column {
        flex: 1;
        padding: 0 20px;
      }
      .work-columns-container h3 {
        margin-top: 0;
      }
      .work-columns-container ul {
        list-style: none;
        padding: 0;
      }
      .work-columns-container ul li {
        margin-bottom: 5px;
      }
      .work-columns-container ul li a {
        color: #0078d7;
        text-decoration: none;
      }
      .work-columns-container ul li a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
}
