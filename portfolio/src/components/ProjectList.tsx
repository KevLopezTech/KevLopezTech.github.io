"use client";

import { useParams } from 'next/navigation';
import ProjectCard from './ProjectCard'; // Import the new component

// ... (keep the type Project definition)
type Project = { slug: string; title: string; description: string; };

export default function ProjectList({ allProjects }: { allProjects: Project[] }) {
    const params = useParams();
    const category = params.category as string;
    const filteredProjects = allProjects.filter(project =>
        project.slug.startsWith(category)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Use the new component here */}
            {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
    );
}