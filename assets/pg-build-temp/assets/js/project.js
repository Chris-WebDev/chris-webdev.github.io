document.addEventListener('DOMContentLoaded', function() {
    const projectDetailsContainer = document.getElementById('project-details');

    // Function to get query parameters from the URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    async function fetchProjectData() {
        try {
            const response = await fetch('https://chris-webdev.github.io/assets/js/code-crsl-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.projects;
        } catch (error) {
            console.error('Error fetching project data:', error);
            projectDetailsContainer.innerHTML = '<p>Failed to load project data.</p>';
            return [];
        }
    }

    async function fetchTemplate(templateName) {
        try {
            const response = await fetch(`https://chris-webdev.github.io/uploads/pages/${templateName}.html`);
            if (!response.ok) {
                console.error(`Error fetching template: https://chris-webdev.github.io/uploads/pages/${templateName}.html`, response.status);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching template:', error);
            return null;
        }
    }

    function renderProject(project, templateHtml, container) {
        let renderedHtml = templateHtml;
        // Simple string replacement for data placeholders
        for (const key in project) {
            const placeholder = `{{${key}}}`;
            renderedHtml = renderedHtml.replaceAll(placeholder, project[key] || '');
        }

        // Handle technologies array
        const technologiesPlaceholder = `{{#each technologies}}<li>{{this}}</li>{{/each}}`;
        if (project.technologies && Array.isArray(project.technologies)) {
            const technologiesList = project.technologies.map(tech => `<li>${tech}</li>`).join('');
            renderedHtml = renderedHtml.replaceAll(technologiesPlaceholder, `<ul>${technologiesList}</ul>`);
        } else {
            renderedHtml = renderedHtml.replaceAll(technologiesPlaceholder, '');
        }

        container.innerHTML = renderedHtml;
    }

    async function loadProjectDetails() {
        const projectId = getQueryParam('id');
        const projects = await fetchProjectData();

        if (projectId && projects.length > 0) {
            const selectedProject = projects.find(project => project.id === projectId);

            if (selectedProject && selectedProject.template) {
                const templateHtml = await fetchTemplate(selectedProject.template);
                if (templateHtml) {
                    renderProject(selectedProject, templateHtml, projectDetailsContainer);
                } else {
                    projectDetailsContainer.innerHTML = '<p>Error loading project template.</p>';
                }
            } else if (selectedProject) {
                // Fallback to a default display if no template is specified
                projectDetailsContainer.innerHTML = `
                    <div class="project-detail">
                        <h2>${selectedProject.title}</h2>
                        <p>${selectedProject.description}</p>
                        <h3>Technologies:</h3>
                        <ul>${selectedProject.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul>
                        <div>${selectedProject.content || ''}</div>
                        <img src="${selectedProject.imageUrl || ''}" alt="${selectedProject.title}">
                        <p><a href="${selectedProject.explore_url}" target="_blank">Explore</a></p>
                    </div>
                `;
            } else {
                projectDetailsContainer.innerHTML = '<p>Project not found.</p>';
            }
        } else {
            // Display a list of all projects if no ID is in the URL
            if (projects && projects.length > 0) {
                projects.forEach(project => {
                    const projectLink = document.createElement('a');
                    projectLink.href = `?id=${project.id}`;
                    projectLink.classList.add('project-item-link');

                    const projectDiv = document.createElement('div');
                    projectDiv.classList.add('project-item');
                    projectDiv.innerHTML = `
                        <h2>${project.title}</h2>
                        <p>${project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                        <p><a href="${project.explore_url}" target="_blank">Explore</a></p>
                    `;

                    projectLink.appendChild(projectDiv);
                    projectDetailsContainer.appendChild(projectLink);
                });
            } else {
                projectDetailsContainer.innerHTML = '<p>No projects found.</p>';
            }
        }
    }

    loadProjectDetails();
});