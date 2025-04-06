document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

function loadProjects() {
    fetch('http://localhost/chris-webdev.github.io/assets/js/carousel-data.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects;
            populateDropdown(projects);
        })
        .catch(error => console.error('Error loading project data:', error));
}

