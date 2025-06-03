import { getAllProjectSlugs, getProjectPageDetails, ProjectFrontmatter, GalleryItem } from '@/lib/projects';
import Link from 'next/link';
import Image from 'next/image';
import ProjectGallery from '@/components/ProjectGallery';

type ProjectPageData = {
    slug: string;
    contentHtml: string;
    gallery: GalleryItem[];
} & ProjectFrontmatter;

export async function generateStaticParams() {
    const paths = getAllProjectSlugs();
    return paths;
}

export default async function ProjectPage({ params: routeParams }: { params: { slug: string[] } }) {
    const { slug: slugArray } = await routeParams;
    const projectData = await getProjectPageDetails(slugArray) as ProjectPageData;

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <Link href="/projects" className="text-cyan-400 hover:underline mb-8 inline-block text-sm">
                    ← Back to All Projects
                </Link>

                <article className="prose prose-invert lg:prose-xl max-w-none">
                    <h1 className="text-cyan-400 mb-3 !text-5xl md:!text-6xl">{projectData.title}</h1>

                    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2"> {/* Increased bottom margin */}
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

                    {/* Layout for Hero Image and Summary */}
                    <div className="flex flex-col md:flex-row md:gap-10 my-10 md:items-center">
                        {projectData.heroImage && (
                            // --- UPDATED CLASSES FOR IMAGE CONTAINER ---
                            <div className="w-full max-w-md mx-auto md:mx-0 md:w-2/5 lg:w-1/3 flex-shrink-0 mb-6 md:mb-0">
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

                        {projectData.summary && (
                            <div className={`leading-relaxed ${projectData.heroImage ? 'md:w-1/2 lg:w-3/5' : 'w-full'}`}>
                                <h3 className="text-3xl font-semibold text-cyan-400 mb-3 !mt-0 text-center md:text-left"> {/* Ensured text-center for mobile for heading */}
                                    Summary
                                </h3>
                                <p className="text-lg md:text-xl text-gray-300 m-0 text-center md:text-left"> {/* Ensured text-center for mobile for paragraph */}
                                    {projectData.summary}
                                </p>
                            </div>
                        )}
                    </div>

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