document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const projectTitleElement = document.getElementById('project-title');
    const projectDescriptionElement = document.getElementById('project-description');
    const projectTechnologiesElement = document.getElementById('project-technologies');
    const projectCodeElement = document.getElementById('project-code');
    const copyButton = document.querySelector('.copy-button');

    // Function to get query parameters from the URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Fetch project data
    async function fetchProjectData() {
        try {
            const response = await fetch('http://localhost/git2025/assets/js/carousel-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.projects; // Assuming projects are in the 'projects' array
        } catch (error) {
            console.error('Error fetching project data:', error);
            return [];
        }
    }
    function populateProjectDropdown(projects) {
        const projectDropdownMenu = document.getElementById('projectDropdownMenu'); // Ensure this exists
        if (!projectDropdownMenu) {
            console.error('Dropdown menu element not found!');
            return;
        }
    
        projectDropdownMenu.innerHTML = ''; // Clear existing items
        projects.forEach(project => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `/git2025/assets/templates/page-builder.html?project=${project.explore_url}`;
            link.textContent = project.title;
            listItem.appendChild(link);
            projectDropdownMenu.appendChild(listItem);
            console.log('Added link for project:', project.title);
        });
    }


    // Load project details based on query parameter
    async function loadProject() {
        const projectId = getQueryParam('project'); // Extract 'project' query parameter
        console.log('Project ID extracted from URL:', projectId);
    
        if (!projectId) {
            console.error('No project ID found in URL.');
            projectTitleElement.textContent = 'Project Not Found';
            return;
        }
    
        const projects = await fetchProjectData(); // Fetch all projects
        console.log('Projects fetched:', projects);
    
        // Find project by comparing the query parameter with explore_url
        const selectedProject = projects.find(project => project.explore_url === projectId.trim().toLowerCase());
    
        if (selectedProject) {
            // Populate project details
            projectTitleElement.textContent = selectedProject.title;
            projectDescriptionElement.textContent = selectedProject.description;
            projectTechnologiesElement.textContent = selectedProject.technologies.join(', ');
    
            // Fetch and display the project code file
            try {
                const codeResponse = await fetch(selectedProject.code_file);
                if (codeResponse.ok) {
                    const codeText = await codeResponse.text();
                    projectCodeElement.textContent = codeText;
                    projectCodeElement.classList.add('language-javascript'); // Update the language class if needed
                } else {
                    projectCodeElement.textContent = `Error loading code from ${selectedProject.code_file}`;
                }
            } catch (error) {
                console.error('Error fetching project code file:', error);
                projectCodeElement.textContent = 'Error loading code.';
            }
    
            document.title = `Work - ${selectedProject.title}`; // Update the document title
        } else {
            console.error(`Project with ID "${projectId}" not found.`);
            projectTitleElement.textContent = 'Project Not Found';
        }
    }
    // Copy-to-clipboard functionality
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const code = projectCodeElement.textContent;
            navigator.clipboard.writeText(code)
                .then(() => {
                    alert('Code copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy text:', err);
                });
        });
    }

    // Initialize project loading
    loadProject();
});