import { getAllProjectSlugs, getProjectData, ProjectFrontmatter } from '@/lib/projects'; // Assuming ProjectFrontmatter is exported from lib/projects
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllProjectSlugs();
    return paths;
}

// Define a type for the expected shape of projectData
// This should include slug, contentHtml, and all properties from ProjectFrontmatter
type ProjectPageData = {
    slug: string;
    contentHtml: string;
} & ProjectFrontmatter;

// The page component is async
export default async function ProjectPage({ params: routeParams }: { params: { slug: string[] } }) {
    // THE FIX: Await the params object to get its resolved values
    const { slug: slugArray } = await routeParams;

    // Reconstruct the slug string from the array
    const slugString = slugArray.join('/');

    // Fetch the project data using the resolved slug string
    const projectData = await getProjectData(slugString) as ProjectPageData;

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-3xl mx-auto">
                <Link href="/projects" className="text-cyan-400 hover:underline mb-8 inline-block">
                    ← Back to All Projects
                </Link>
                <article className="prose prose-invert lg:prose-xl">
                    {projectData.heroImage && (
                        <img src={projectData.heroImage} alt={projectData.title} className="rounded-lg" />
                    )}
                    <h1 className="text-cyan-400 mb-2">{projectData.title}</h1>
                    <div className="flex flex-wrap gap-2 my-4">
                        {projectData.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full no-underline">
                {tag}
              </span>
                        ))}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} />
                </article>
            </div>
        </main>
    );
}