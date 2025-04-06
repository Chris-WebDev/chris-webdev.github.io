document.addEventListener('DOMContentLoaded', function() {
    //call nav
    fetch('https://chris-webdev.github.io/assets/header/nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-holder').innerHTML = data;
        // Call populateDropdown after the navigation is loaded
        loadProjectsForNav();
    })
    .catch(error => console.error('Error loading nav:', error));
});

/* Populate Dropdown Menu */
function loadProjectsForNav() {
    fetch('https://chris-webdev.github.io/assets/js/code-crsl-data.json') // Adjust path if needed
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
        const link = document.createElement('a'); // create a link
        link.href = `https://chris-webdev.github.io/assets/pg-build-temp/project.html?id=${project.id}`; // Use explore_url for the link
        link.textContent = project.title;
        dropdown.appendChild(link);
    });
}