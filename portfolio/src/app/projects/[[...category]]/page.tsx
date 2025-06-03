import { getSortedProjectsData, getAllCategories, ProjectFrontmatter } from '@/lib/projects';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryDisplayName } from '@/lib/categoryDisplayMap';

type ProjectData = { slug: string } & ProjectFrontmatter;

export async function generateStaticParams() {
    const categories = getAllCategories();
    return [
        { category: [] }, // Represents the /projects route
        ...categories.map(cat => ({ category: [cat.category] }))
    ];
}

const normalizeString = (str: string | undefined): string => {
    if (!str) return "";
    return str.toLowerCase().replace(/[-\s_]/g, '');
};

export default async function ProjectsListingPage({ params: routeParams }: { params: { category?: string[] } }) { // Renamed params to routeParams for clarity
                                                                                                                  // --- CONSOLE LOGS FROM PREVIOUS DEBUGGING (can be removed if no longer needed) ---
                                                                                                                  // console.log("-----------------------------------------------------");
                                                                                                                  // console.log("DEBUGGING CATEGORY PAGE:", `/projects/${routeParams.category?.join('/') || ''}`);
                                                                                                                  // console.log("1. routeParams.category from URL:", routeParams.category);
                                                                                                                  // --- END PREVIOUS DEBUG LOGS ---

    // THE FIX: Await routeParams before accessing its properties
    const resolvedParams = await routeParams;
    const currentCategorySlug = resolvedParams.category?.[0]; // Get the first segment if it exists

    // --- NEW CONSOLE LOGS FOR VERIFICATION ---
    console.log("-----------------------------------------------------");
    console.log("DEBUGGING CATEGORY PAGE (after await):", `/projects/${currentCategorySlug || 'all'}`);
    console.log("1. currentCategorySlug (after await):", currentCategorySlug);
    // --- END NEW CONSOLE LOGS ---

    const allProjects = getSortedProjectsData() as ProjectData[];
    // ... (console logs for allProjects can remain if helpful, or be removed)

    let filteredProjects: ProjectData[];
    let pageTitle: string;
    let pageDescription: string;

    if (currentCategorySlug) {
        const normalizedSlugToCompare = normalizeString(currentCategorySlug);
        filteredProjects = allProjects.filter(project => {
            if (!project.specialty) return false;
            const normalizedSpecialty = normalizeString(project.specialty);
            return normalizedSpecialty === normalizedSlugToCompare;
        });
        pageTitle = getCategoryDisplayName(currentCategorySlug);
        pageDescription = `A collection of my projects related to ${pageTitle}.`;
    } else {
        filteredProjects = allProjects;
        pageTitle = "All Projects";
        pageDescription = "Here is a collection of all my work.";
    }

    // ... (console logs for filteredProjects can remain if helpful) ...

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    {currentCategorySlug ? <span className="text-gray-500">Category: </span> : null}
                    {pageTitle}
                </h1>
                <p className="text-gray-400 mb-8">
                    {pageDescription}
                    {currentCategorySlug && (
                        <Link href="/projects" className="text-cyan-400 hover:underline ml-4 text-sm">
                            ← View All Projects
                        </Link>
                    )}
                </p>

                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-400">
                        {currentCategorySlug ? "No projects found in this category yet." : "No projects found yet."}
                    </p>
                )}
            </div>
        </main>
    );
}