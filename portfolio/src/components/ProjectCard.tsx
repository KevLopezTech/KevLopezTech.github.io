import Link from 'next/link';

type Project = {
    slug: string;
    title: string;
    summary: string; // <--- CHANGED from description to summary
};

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link href={`/project/${project.slug}`} key={project.slug}>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full flex flex-col shadow-xl hover:shadow-cyan-500/20">
                <h2 className="text-3xl font-semibold text-white mb-3">{project.title}</h2>
                <p className="text-gray-300 text-base leading-relaxed flex-grow">{project.summary}</p> {/* <--- CHANGED from project.description */}
            </div>
        </Link>
    );
}