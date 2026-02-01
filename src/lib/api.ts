
import projectsData from '@/data/projects.json';

// Types
export interface Project {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    summary?: string;
    description: string[];
    thumbnail: string;
    meta: {
        collaborator: string;
        designer: string;
        date: string;
    };
    images: string[];
    visible?: boolean; // Added visibility control
}

// Helper to filter sensitive data
function filterProjectData(project: Project): Project {
    // Create a shallow copy to avoid mutating original data
    // In a real database scenario, you would select specific columns.
    // Here we just ensure we don't return projects that are marked as not visible.
    // If you have secret fields like "internal_notes", you should delete them here.
    // const { internal_notes, ...publicData } = project;
    // return publicData;
    return project;
}

export async function getProjectById(id: string): Promise<Project | null> {
    // Simulate async
    return new Promise((resolve) => {
        const project = (projectsData.projects as Project[]).find((p) => p.id === id);
        
        // Security check: if project exists but is hidden, return null (act as if it doesn't exist)
        if (project && project.visible === false) {
            resolve(null);
            return;
        }

        resolve(project ? filterProjectData(project) : null);
    });
}

export async function getAllProjects(): Promise<Project[]> {
    // Filter out hidden projects
    const visibleProjects = (projectsData.projects as Project[]).filter(p => p.visible !== false);
    return visibleProjects.map(filterProjectData);
}
