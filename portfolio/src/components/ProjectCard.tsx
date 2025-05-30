import Link from 'next/link';

type Project = {
    slug: string;
    title: string;
    description: string;
};

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link href={`/project/${project.slug}`} key={project.slug}>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full">
                <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-400">{project.description}</p>
            </div>
        </Link>
    );
}