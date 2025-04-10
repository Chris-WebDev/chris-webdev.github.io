document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

function loadProjects() {
    fetch('https://chris-webdev.github.io/assets/js/code-crsl-data.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects;
            populateDropdown(projects);
        })
        .catch(error => console.error('Error loading project data:', error));
}