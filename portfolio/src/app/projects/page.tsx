import { getSortedProjectsData } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard'; // Import our reusable card
import Link from 'next/link';

export default function AllProjectsPage() {
    // This Server Component fetches all project data directly
    const allProjects = getSortedProjectsData();

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">All My Work</h1>
                <p className="text-gray-400 mb-8">
                    A collection of my projects. You can also browse by category in the navigation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* We map over all projects and use the same card component */}
                    {allProjects.map((project: any) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                </div>
            </div>
        </main>
    );
}