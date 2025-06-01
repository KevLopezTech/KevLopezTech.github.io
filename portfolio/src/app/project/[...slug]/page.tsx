import { getAllProjectSlugs, getProjectPageDetails, ProjectFrontmatter } from '@/lib/projects';
import Link from 'next/link';
import Image from 'next/image'; // Make sure Image is imported
import ProjectGallery from '@/components/ProjectGallery';

// Define a type for the expected shape of projectData from getProjectPageDetails
// This should match the return type of getProjectPageDetails
type ProjectPageData = {
    slug: string;
    contentHtml: string;
} & ProjectFrontmatter; // Assuming ProjectFrontmatter is exported from lib/projects.ts

export async function generateStaticParams() {
    const paths = getAllProjectSlugs();
    return paths;
}

export default async function ProjectPage({ params: routeParams }: { params: { slug: string[] } }) {
    const { slug: slugArray } = await routeParams;
    const slugString = slugArray.join('/');

    // Assuming getProjectPageDetails returns the full project data including frontmatter
    const projectData = await getProjectPageDetails(slugArray) as ProjectPageData;

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-3xl mx-auto">
                <Link href="/projects" className="text-cyan-400 hover:underline mb-8 inline-block text-sm">
                    ← Back to All Projects
                </Link>

                <article className="prose prose-invert lg:prose-xl max-w-none"> {/* Added max-w-none for prose to take full width of its parent */}

                    {/* Title */}
                    <h1 className="text-cyan-400 mb-2 !text-4xl md:!text-5xl">{projectData.title}</h1> {/* Overriding prose heading styles for main title */}

                    {/* Specialty & Tags */}
                    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {projectData.specialty && (
                            <span className="bg-cyan-700 text-cyan-100 text-xs font-semibold px-3 py-1 rounded-full">
                {projectData.specialty}
              </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {projectData.tags.map(tag => (
                                <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hero Image (Cover Image) */}
                    {projectData.heroImage && (
                        <div className="mb-8"> {/* Added div for better image spacing */}
                            <Image
                                src={projectData.heroImage}
                                alt={`${projectData.title} cover image`}
                                width={1200} // Provide appropriate width
                                height={675} // Provide appropriate height for aspect ratio (e.g., 16:9)
                                className="rounded-lg shadow-xl w-full object-cover" // Ensure it's responsive
                                priority
                            />
                        </div>
                    )}

                    {/* Brief Summary */}
                    {projectData.summary && (
                        <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-8 border-l-4 border-cyan-500 pl-4">
                            {projectData.summary}
                        </p>
                    )}

                    {/* Detailed Summary (Main Markdown Content) */}
                    {/* This div will be styled by the 'prose' classes on the article tag */}
                    <div dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} />

                    {/* Image Gallery - REPLACED WITH NEW COMPONENT */}
                    {projectData.gallery && projectData.gallery.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-cyan-400 mb-6 !mt-0">Gallery</h2>
                            <ProjectGallery gallery={projectData.gallery} /> {/* <--- USE THE NEW COMPONENT HERE */}
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
}