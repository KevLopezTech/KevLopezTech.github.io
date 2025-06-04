import { getSortedProjectsData, getAllCategories, ProjectFrontmatter } from '@/lib/projects';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryDisplayName } from '@/lib/categoryDisplayMap';

type ProjectData = { slug: string } & ProjectFrontmatter;

// Type for the resolved params after awaiting
interface ResolvedCategoryParams {
    category?: string[]; // category is an optional array of strings for [[...category]]
}

// Type for the props received by the page component
interface ProjectsListingPageProps {
    params: Promise<ResolvedCategoryParams>;
}

export async function generateStaticParams(): Promise<ResolvedCategoryParams[]> {
    const categories = getAllCategories(); // This returns [{ category: 'ai' }, { category: 'web-dev' }, ...]
    return [
        { category: [] }, // Represents the /projects route (params.category will be an empty array)
        ...categories.map(cat => ({ category: [cat.category] })) // Represents /projects/ai (params.category will be ['ai'])
    ];
}

const normalizeString = (str: string | undefined): string => {
    if (!str) return "";
    return str.toLowerCase().replace(/[-\s_]/g, '');
};

export default async function ProjectsListingPage({ params }: ProjectsListingPageProps) {
    // THE FIX: Await the params Promise to get the actual parameters
    const resolvedParams = await params;
    const currentCategorySlug = resolvedParams.category?.[0]; // Get the first segment if it exists

    const allProjects = getSortedProjectsData() as ProjectData[];

    let filteredProjects: ProjectData[];
    let pageTitle: string;
    let pageDescription: string;

    // Console logs for debugging (can be removed once confirmed working)
    console.log("-----------------------------------------------------");
    console.log("DEBUGGING PROJECTS LISTING PAGE (after await):", `/projects/${currentCategorySlug || 'all'}`);
    console.log("1. currentCategorySlug (after await):", currentCategorySlug);
    console.log("2. Total projects fetched:", allProjects.length);

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
        // This is the "All Projects" page (currentCategorySlug is undefined)
        filteredProjects = allProjects;
        pageTitle = "All Projects";
        pageDescription = "Here is a collection of all my work.";
    }

    console.log("3. Filtered projects count:", filteredProjects.length);
    if (filteredProjects.length > 0 && currentCategorySlug) {
        console.log("   Example filtered project titles:", filteredProjects.slice(0,3).map(p=>p.title).join(', '));
    } else if (allProjects.length > 0 && currentCategorySlug) {
        console.log("   No projects matched the filter criteria for normalized slug:", normalizeString(currentCategorySlug));
    }
    console.log("-----------------------------------------------------");

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