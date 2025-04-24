document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.p-hero');
    const aboutWrapper = document.querySelector('.about-wrapper');
    const aboutImageContainer = document.getElementById('about-image-container');
    const aboutTextContainer = document.createElement('div');
    const imageGridContainer = document.createElement('div'); // Create imageGridContainer
    const projectLogoContainer = document.createElement('div'); // Create logo container
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null; // Initialize lightboxImg

    if (aboutWrapper) {
        const imageLogoContainer = document.createElement('div'); // Create flex container
        imageLogoContainer.classList.add('image-logo-container');
        aboutWrapper.appendChild(imageLogoContainer);
        imageLogoContainer.appendChild(aboutImageContainer);
        imageLogoContainer.appendChild(projectLogoContainer);
        projectLogoContainer.id = 'project-logo-container';

        aboutWrapper.appendChild(aboutTextContainer);
        aboutTextContainer.id = 'about-text-container';
        aboutWrapper.appendChild(imageGridContainer);
        imageGridContainer.id = 'image-grid-container';
        imageGridContainer.classList.add('image-grid-lightbox');
    }

    // Function to get query parameters from the URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    async function fetchProjectData() {
        try {
            const response = await fetch('https://chris-webdev.github.io/assets/js/web-proj.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.projects;
        } catch (error) {
            console.error('Error fetching project data:', error);
            if (aboutWrapper) aboutWrapper.innerHTML = '<p>Failed to load project data.</p>';
            return [];
        }
    }

    async function fetchTemplate(templateName) {
        try {
            const response = await fetch(`https://chris-webdev.github.io/uploads/pages/web/${templateName}.html`);
            if (!response.ok) {
                console.error(`Error fetching template: https://chris-webdev.github.io/uploads/pages/web/${templateName}.html`, response.status);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching template:', error);
            return null;
        }
    }

    async function fetchTextFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error fetching text file: ${url}`, response.status);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching text file:', error);
            return null;
        }
    }

    function attachLightboxListeners(imageGrid, lightboxElement, lightboxImageElement) {
        if (imageGrid && lightboxElement && lightboxImageElement) {
            imageGrid.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    lightboxImageElement.src = e.target.src;
                    lightboxElement.classList.add('active');
                }
            });

            lightboxElement.addEventListener('click', (e) => {
                if (e.target === lightboxElement) {
                    lightboxElement.classList.remove('active');
                }
            });
        }
    }

    async function renderProject(project, templateHtml, heroSection, aboutImageContainer, aboutTextContainer, imageGridContainer, projectLogoContainer) {
        // **UPDATE HERO SECTION**
        if (heroSection && project.imageHero && project.title) {
            heroSection.style.backgroundImage = `url('${project.imageHero}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundRepeat = 'no-repeat';
            heroSection.style.backgroundAttachment = 'fixed';
            heroSection.style.backgroundPosition = 'center center';
            heroSection.innerHTML = `
                <div class="hero-content-overlay">
                    <h1>${project.title}</h1>
                </div>
            `;
            const overlay = heroSection.querySelector('.hero-content-overlay');
            if (overlay) {
                overlay.style.color = 'black';
                overlay.style.padding = '20px';
                overlay.style.textAlign = 'center';
            }
        }

        // **UPDATE ABOUT SECTION (Square Image)**
        if (aboutImageContainer && project.imageUrl) {
            aboutImageContainer.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">`;
        } else if (aboutImageContainer) {
            aboutImageContainer.innerHTML = '';
        }

        // **UPDATE PROJECT LOGO**
        if (projectLogoContainer && project.logoUrl) {
            projectLogoContainer.innerHTML = `<img src="${project.logoUrl}" alt="${project.title} Logo">`;
        } else if (projectLogoContainer) {
            projectLogoContainer.innerHTML = '';
        }

        // **UPDATE ABOUT SECTION (Text)**
        if (aboutTextContainer && project.descriptionFile) {
            const descriptionText = await fetchTextFile(project.descriptionFile);
            if (descriptionText !== null) {
                aboutTextContainer.innerHTML = `<p>${descriptionText.replaceAll('\n', '<br>')}</p>`;
                if (project.technologies && project.technologies.length > 0) {
                    aboutTextContainer.innerHTML += `<h3>Technologies:</h3><ul>${project.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul>`;
                }
                if (project.explore_url) {
                    aboutTextContainer.innerHTML += `<p style="height: 100px"></p><hr><p style="height: 100px"></p>`;
                }
            }
        } else if (aboutTextContainer) {
            aboutTextContainer.innerHTML = '';
        }

        // **UPDATE IMAGE GRID SECTION**
        if (imageGridContainer && project.horizontalImages && Array.isArray(project.horizontalImages)) {
            imageGridContainer.innerHTML = project.horizontalImages.map(imageUrl => `<img src="${imageUrl}" alt="Project Image">`).join('');
            // Attach listeners AFTER the grid is populated
            attachLightboxListeners(imageGridContainer, lightbox, lightboxImg);
        } else if (imageGridContainer) {
            imageGridContainer.innerHTML = '';
        }
    }

    async function loadProjectDetails() {
        const projectId = getQueryParam('id');
        const projects = await fetchProjectData();

        if (projectId && projects.length > 0) {
            const selectedProject = projects.find(project => project.id === projectId);

            if (selectedProject) {
                await renderProject(selectedProject, '', heroSection, aboutImageContainer, aboutTextContainer, imageGridContainer, projectLogoContainer);
            } else {
                if (aboutWrapper) aboutWrapper.innerHTML = '<p>Project not found.</p>';
            }
        } else {
            // Display a list of all projects if no ID is in the URL
            if (projects && projects.length > 0) {
                let allProjectsHTML = '';
                projects.forEach(project => {
                    allProjectsHTML += `
                        <div class="project-item">
                            <h2>${project.title}</h2>
                            <img src="${project.imageUrl || ''}" alt="${project.title}" style="max-width: 80px; margin-right: 10px; vertical-align: middle;">
                            <p>${project.description ? project.description.substring(0, 100) + '...' : ''} <a href="?id=${project.id}">View Details</a></p>
                        </div>
                    `;
                });
                if (aboutWrapper) aboutWrapper.innerHTML = `<div id="project-list-container">${allProjectsHTML}</div>`;
                heroSection.style.backgroundImage = '';
                heroSection.innerHTML = '';
                if (aboutImageContainer) aboutImageContainer.innerHTML = '';
                if (aboutTextContainer) aboutTextContainer.innerHTML = '';
                if (imageGridContainer) imageGridContainer.innerHTML = '';
                if (projectLogoContainer) projectLogoContainer.innerHTML = '';
            } else {
                if (aboutWrapper) aboutWrapper.innerHTML = '<p>No projects found.</p>';
                heroSection.style.backgroundImage = '';
                heroSection.innerHTML = '';
                if (aboutImageContainer) aboutImageContainer.innerHTML = '';
                if (aboutTextContainer) aboutTextContainer.innerHTML = '';
                if (imageGridContainer) imageGridContainer.innerHTML = '';
                if (projectLogoContainer) projectLogoContainer.innerHTML = '';
            }
        }
    }

    loadProjectDetails();
});