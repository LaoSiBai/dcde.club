import { getProjectById, getAllProjects } from '@/lib/api';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';

interface PageProps {
    params: Promise<{
        id: string;
    }>
}

// Generate static params for SSG (optional, but good for performance)
export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((project) => ({
        id: project.id,
    }));
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params;  // Next.js 15+ requires await
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    // Helper to resolve image path
    const getImagePath = (img: string) => {
        return img.startsWith('http') ? img : `/projects/${project.id}/${img}`;
    };

    return (
        <>
            <Header position="relative" />
            <div className="page-content subpage-container project-detail-layout">
                {/* Meta Section (Col 1) */}
                <div className="project-meta">
                <div>
                    <div className="meta-label">合作方</div>
                    <div className="meta-value">{project.meta.collaborator}</div>
                </div>
                <div>
                    <div className="meta-label">设计师</div>
                    <div className="meta-value">{project.meta.designer}</div>
                </div>
                <div>
                    <div className="meta-label">时间</div>
                    <div className="meta-value">{project.meta.date}</div>
                </div>
            </div>

            {/* Content Wrapper (Col 2-4) */}
            <div className="project-content-wrapper">
                <h1 className="project-title">{project.title}</h1>
                {project.subtitle && <h2 className="project-subtitle">{project.subtitle}</h2>}

                <div className="project-body">
                    <div className="project-description">
                        {project.description.map((para, i) => (
                            <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery (Col 1-4) */}
            <div className="gallery">
                {project.images.map((img, i) => (
                    <img
                        key={i}
                        src={getImagePath(img)}
                        alt={`${project.title} - ${i}`}
                        style={{ width: '100%', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}
                    />
                ))}
            </div>
        </>
    );
}
