import { getSortedProjectsData, getAllCategories, ProjectFrontmatter } from '@/lib/projects';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryDisplayName } from '@/lib/categoryDisplayMap';
import { categoryTagMap } from '@/lib/tagMap'; // << NEW: Import the tag map

type ProjectData = { slug: string } & ProjectFrontmatter;

interface ResolvedCategoryParams {
    category?: string[];
}

interface ProjectsListingPageProps {
    params: Promise<ResolvedCategoryParams>;
}

export async function generateStaticParams(): Promise<ResolvedCategoryParams[]> {
    const categories = getAllCategories();
    return [
        { category: [] },
        ...categories.map(cat => ({ category: [cat.category] }))
    ];
}

const normalizeString = (str: string | undefined): string => {
    if (!str) return "";
    return str.toLowerCase().replace(/[-\s_]/g, '');
};

export default async function ProjectsListingPage({ params }: ProjectsListingPageProps) {
    const resolvedParams = await params;
    const currentCategorySlug = resolvedParams.category?.[0];

    const allProjects = getSortedProjectsData() as ProjectData[];

    let filteredProjects: ProjectData[];
    let pageTitle: string;
    let pageDescription: string;

    if (currentCategorySlug) {
        const normalizedSlugToCompare = normalizeString(currentCategorySlug);
        pageTitle = getCategoryDisplayName(currentCategorySlug);
        pageDescription = `A collection of my projects related to ${pageTitle}.`;

        // 1. Find the correct group of search tags.
        // Instead of a direct lookup, we find which category group our current slug belongs to.
        let searchTagsForCategory: string[] = [normalizedSlugToCompare]; // Default to the slug itself

        for (const groupKey in categoryTagMap) {
            const normalizedGroupTags = categoryTagMap[groupKey].map(normalizeString);
            if (normalizedGroupTags.includes(normalizedSlugToCompare)) {
                // Success! The current slug (e.g., "machinelearning") was found in a group (the "ai" group).
                // We'll use the full list of tags from that group for our search.
                searchTagsForCategory = categoryTagMap[groupKey];
                break; // Stop searching once we've found the correct group
            }
        }

        const normalizedSearchTags = searchTagsForCategory.map(normalizeString);


        // 2. Filter projects using the full, correct list of search tags.
        filteredProjects = allProjects.filter(project => {
            // Check specialty
            const normalizedSpecialty = normalizeString(project.specialty);
            if (normalizedSearchTags.includes(normalizedSpecialty)) {
                return true;
            }

            // Check tags array
            if (project.tags && Array.isArray(project.tags)) {
                return project.tags.some(tag =>
                    normalizedSearchTags.includes(normalizeString(tag))
                );
            }

            return false;
        });

        // --- END OF CORRECTED LOGIC ---

    } else {
        // This is the "All Projects" page
        filteredProjects = allProjects;
        pageTitle = "All Projects";
        pageDescription = "Here is a collection of all my work.";
    }


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