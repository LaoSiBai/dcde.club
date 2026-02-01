// services/api.js
// Mock API service layer - simulates async API calls
// Future: Replace fetch URLs with real API endpoints

const API_BASE = '';  // Empty for local, will be API URL in production

/**
 * Fetch all projects
 * @returns {Promise<Array>} List of projects
 */
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE}/mock/projects.json`);
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

/**
 * Fetch a single project by ID
 * @param {string} projectId - The project ID
 * @returns {Promise<Object|null>} Project data or null if not found
 */
async function fetchProjectById(projectId) {
    try {
        const projects = await fetchProjects();
        return projects.find(p => p.id === projectId) || null;
    } catch (error) {
        console.error('Failed to fetch project:', error);
        return null;
    }
}

/**
 * Fetch site configuration
 * @returns {Promise<Object>} Site config
 */
async function fetchSiteConfig() {
    try {
        const response = await fetch(`${API_BASE}/mock/site.json`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch site config:', error);
        return {};
    }
}

// Export for module usage (future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchProjects, fetchProjectById, fetchSiteConfig };
}
