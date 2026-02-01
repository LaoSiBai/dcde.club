// projects/renderer.js
// Renders project detail page from mock data

(async function () {
    // Get project ID from URL path
    // Expected URL: /projects/[project-id]/
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const projectsIndex = pathParts.indexOf('projects');
    const projectId = projectsIndex !== -1 ? pathParts[projectsIndex + 1] : null;

    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const contentEl = document.getElementById('content');

    if (!projectId) {
        showError();
        return;
    }

    try {
        const project = await fetchProjectById(projectId);

        if (!project) {
            showError();
            return;
        }

        renderProject(project);
    } catch (error) {
        console.error('Failed to load project:', error);
        showError();
    }

    function showError() {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }

    function renderProject(project) {
        // Update page title
        document.getElementById('page-title').textContent = `${project.title} - DCDE`;

        // Update meta info
        if (project.meta) {
            document.getElementById('meta-collaborator').textContent = project.meta.collaborator || '—';
            document.getElementById('meta-designer').textContent = project.meta.designer || '—';
            document.getElementById('meta-date').textContent = project.meta.date || '—';
        }

        // Update project title
        const titleEl = document.getElementById('project-title');
        titleEl.innerHTML = project.title + (project.subtitle ? '<br>' + project.subtitle : '');

        // Update description
        const descEl = document.getElementById('project-description');
        if (Array.isArray(project.description)) {
            descEl.innerHTML = project.description.map(p => `<p>${p}</p>`).join('');
        } else {
            descEl.innerHTML = `<p>${project.description}</p>`;
        }

        // Update gallery
        const galleryEl = document.getElementById('gallery');
        if (project.images && project.images.length > 0) {
            galleryEl.innerHTML = project.images.map(img =>
                `<img src="${img}" alt="${project.title}">`
            ).join('');
        }

        // Show content, hide loading
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    }
})();
