"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Define a type for our project data
type Project = {
    slug: string;
    title: string;
    summary: string; // <--- CHANGED from description to summary
};

export default function ProjectList({ allProjects }: { allProjects: Project[] }) {
    const params = useParams();
    const category = params.category as string;

    const filteredProjects = allProjects.filter(project =>
        project.slug.startsWith(category)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map(({ slug, title, summary }) => ( // Destructure summary
                <Link href={`/project/${slug}`} key={slug}>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full">
                        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                        {/* Use project.summary here if not destructuring, or just summary if destructured */}
                        <p className="text-gray-400">{summary}</p> {/* <--- CHANGED from description to summary */}
                    </div>
                </Link>
            ))}
        </div>
    );
}