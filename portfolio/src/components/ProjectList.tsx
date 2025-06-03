"use client";

import { useParams } from 'next/navigation';
// REMOVE Link import if ProjectCard handles its own linking
// import Link from 'next/link';
import ProjectCard from './ProjectCard'; // <--- IMPORT ProjectCard

// Update this type to match ProjectCard's expectations and your data
type Project = {
    slug: string;
    title: string;
    summary: string; // <--- CHANGED from description to summary
    // Include any other fields ProjectCard might need directly from allProjects
    // For example, if ProjectCard eventually uses heroImage, specialty, tags, etc.
    // you'd add them here if allProjects contains them.
    // For now, ProjectCard only uses slug, title, summary.
};

export default function ProjectGrid({ allProjects }: { allProjects: Project[] }) {
    const params = useParams();
    const category = params.category as string;

    const filteredProjects = allProjects.filter(project =>
        project.slug.startsWith(category)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"> {/* Matched gap from homepage featured projects */}
            {/* Use the ProjectCard component for rendering */}
            {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
    );
}