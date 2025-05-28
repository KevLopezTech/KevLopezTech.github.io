import { getSortedProjectsData } from '@/lib/projects';
import Link from 'next/link';

export default function ProjectsPage() {
    const projects = getSortedProjectsData();

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">All Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(({ slug, title, description }: any) => (
                        <Link href={`/project/${slug}`} key={slug}>
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full">
                                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                                <p className="text-gray-400">{description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}