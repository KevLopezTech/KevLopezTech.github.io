import {
    getAllProjectSlugs,
    getProjectPageDetails,
    ProjectFrontmatter,
    GalleryItem,
    getProjectData
} from '@/lib/projects';
import Link from 'next/link';
import Image from 'next/image';
import ProjectGallery from '@/components/ProjectGallery';

// Type for the resolved params after awaiting
interface ResolvedProjectParams {
    slug: string[];
}

// Type for the props received by the page component
interface ProjectPageProps {
    params: Promise<ResolvedProjectParams>;
    // searchParams?: { [key: string]: string | string[] | undefined }; // Example if you ever use searchParams
}

// Type for the data structure of a single project
type ProjectPageData = {
    slug: string; // This is the reconstructed slug string like "category/project-name"
    contentHtml: string;
    gallery: GalleryItem[];
} & ProjectFrontmatter;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> { // Ensure return type matches expected params shape
    const paths = getAllProjectSlugs(); // getAllProjectSlugs should return { params: { slug: string[] } }[]
    return paths.map(p => p.params); // Extract just the array of slug objects
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    // THE FIX: Await the params Promise to get the actual parameters
    const resolvedParams = await params;
    const slugArray = resolvedParams.slug; // slugArray is string[]

    // Reconstruct the slug string from the array
    const slugString = slugArray.join('/');

    const projectData = await getProjectData(slugString) as ProjectPageData; // Assuming getProjectData is your direct fetcher

    // Optional: console.log for debugging in dev server
    // console.log(`--- Data for Project Page: ${slugString} ---`, projectData);

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <Link href="/projects" className="text-cyan-400 hover:underline mb-8 inline-block text-sm">
                    ← Back to All Projects
                </Link>

                <article className="prose prose-invert lg:prose-xl max-w-none">
                    {projectData.heroImage && (
                        <div className="mb-8">
                            <Image
                                src={projectData.heroImage}
                                alt={`${projectData.title} cover image`}
                                width={800}
                                height={600}
                                className="rounded-2xl shadow-xl w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    )}

                    <h1 className="text-cyan-400 mb-3 !text-5xl md:!text-6xl">{projectData.title}</h1>

                    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {projectData.specialty && (
                            <span className="bg-cyan-700 text-cyan-100 text-sm font-semibold px-3 py-1.5 rounded-full">
                {projectData.specialty}
              </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {projectData.tags.map(tag => (
                                <span key={tag} className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    {projectData.summary && (
                        <div className={`leading-relaxed ${projectData.heroImage ? 'md:w-1/2 lg:w-3/5' : 'w-full'}`}> {/* This div was from a previous layout, check if still intended */}
                            <h3 className="text-3xl font-semibold text-cyan-400 mb-3 !mt-0 text-center md:text-left">
                                Summary
                            </h3>
                            <p className="text-lg md:text-xl text-gray-300 m-0 text-center md:text-left">
                                {projectData.summary}
                            </p>
                        </div>
                    )}

                    <h3 className="text-3xl font-semibold text-cyan-400 mb-4 !mt-10">
                        Details
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} />

                    {projectData.gallery && projectData.gallery.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-3xl font-semibold text-cyan-400 mb-8 !mt-0">
                                Gallery
                            </h2>
                            <ProjectGallery gallery={projectData.gallery} />
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
}