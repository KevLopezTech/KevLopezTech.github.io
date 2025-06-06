import {
    getAllProjectSlugs,
    getProjectData,
    ProjectFrontmatter,
    GalleryItem
} from '@/lib/projects';
import Link from 'next/link';
import Image from 'next/image';
import EmblaProjectGallery from '@/components/EmblaProjectGallery';

// Type for the resolved params after awaiting
interface ResolvedProjectParams {
    slug: string[];
}

// Type for the props received by the page component
interface ProjectPageProps {
    params: Promise<ResolvedProjectParams>;
}

// Type for the data structure of a single project
type ProjectPageData = {
    slug: string; // This is the reconstructed slug string like "category/project-name"
    contentHtml: string;
    gallery: GalleryItem[];
} & ProjectFrontmatter;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const paths = getAllProjectSlugs();
    return paths.map(p => p.params); // Extract just the array of slug objects
}

// Helper function if you prefer to use getProjectPageDetails
// async function fetchDataForPage(slugArray: string[]): Promise<ProjectPageData> {
//   return await getProjectPageDetails(slugArray) as ProjectPageData;
// }

export default async function ProjectPage({ params }: ProjectPageProps) {
    const resolvedParams = await params;
    const slugArray = resolvedParams.slug;
    const slugString = slugArray.join('/');

    // Using getProjectData directly as per your current structure.
    // Ensure getProjectData itself is async if it wasn't before, or that getProjectPageDetails calls it.
    // My lib/projects.ts has getProjectData as async.
    const projectData = await getProjectData(slugString) as ProjectPageData;

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto"> {/* Content container with increased max-width */}
                <Link href="/projects" className="text-cyan-400 hover:underline mb-8 inline-block text-sm">
                    ← Back to All Projects
                </Link>

                <article className="prose prose-invert lg:prose-xl max-w-none">
                    {/* Page Title */}
                    <h1 className="text-cyan-400 mb-3 !text-5xl md:!text-6xl">{projectData.title}</h1>

                    {/* Specialty & Tags */}
                    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {projectData.specialty && (
                            <span className="bg-cyan-700 text-cyan-100 text-sm font-semibold px-3 py-1.5 rounded-full">
                                {projectData.specialty}
                            </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {projectData.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-600 hover:text-white hover:scale-105 hover:-translate-y-1 cursor-default"
                                >
                                {tag}
                                 </span>
                            ))}
                        </div>
                    </div>

                    {/* --- NEW LAYOUT FOR HERO IMAGE AND SUMMARY --- */}
                    <div className="flex flex-col md:flex-row md:gap-10 my-10 md:items-center">
                        {/* Image Column */}
                        {projectData.heroImage && (
                            <div className="w-full max-w-sm mx-auto md:mx-0 md:w-2/5 lg:w-1/3 flex-shrink-0 mb-6 md:mb-0">
                                <Image
                                    src={projectData.heroImage}
                                    alt={`${projectData.title} cover image`}
                                    width={600} // Base width for optimization
                                    height={450} // Base height for a 4:3 aspect ratio (adjust if needed)
                                    className="rounded-2xl shadow-xl w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Summary Column */}
                        {projectData.summary && (
                            <div className={`leading-relaxed ${projectData.heroImage ? 'md:w-3/5 lg:w-2/3' : 'w-full'}`}>
                                <h3 className="text-3xl font-semibold text-cyan-400 mb-3 !mt-0 text-center md:text-left">
                                    Summary
                                </h3>
                                <p className="text-lg md:text-xl text-gray-300 m-0 text-center md:text-left">
                                    {projectData.summary}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* --- END OF HERO IMAGE AND SUMMARY LAYOUT --- */}

                    {/* Details Section Header */}
                    <h3 className="text-3xl font-semibold text-cyan-400 mb-4 !mt-10">
                        Details
                    </h3>
                    {/* Main Markdown Content (Detailed Summary) */}
                    <div dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} />

                    {/* Gallery Section */}
                    {projectData.gallery && projectData.gallery.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-3xl font-semibold text-cyan-400 mb-8 !mt-0">
                                Gallery
                            </h2>
                            <EmblaProjectGallery gallery={projectData.gallery} />
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
}