import { getSortedProjectsData } from '@/lib/projects';
import ProjectGrid from '@/components/ProjectList'; // Our client component
import Link from 'next/link';

// This function tells Next.js which category pages to build
export async function generateStaticParams() {
    const projects = getSortedProjectsData();
    const uniqueCategories = [...new Set(projects.map(p => p.slug.split('/')[0]))];
    return uniqueCategories.map(category => ({
        // The 'params' object for generateStaticParams should have the key 'category'
        // and Next.js will expect this shape, so no change needed here:
        category: category,
    }));
}

// This is the main Server Component for the page
export default async function CategoryPage({ params: routeParams }: { params: { category: string } }) {
    // THE FIX: Await the params object and destructure 'category'
    const { category } = await routeParams;

    // Now use the resolved 'category' variable
    const allProjects = getSortedProjectsData();
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <main className="p-4 sm:p-8 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">
                    <span className="text-gray-500">Category:</span> {categoryName}
                </h1>
                <p className="text-gray-400 mb-8">
                    A collection of my projects related to {categoryName}.
                    <Link href="/projects" className="text-cyan-400 hover:underline ml-4">
                        ← View All Projects
                    </Link>
                </p>

                {/* We pass all projects to the Client Component, which handles filtering */}
                <ProjectGrid allProjects={allProjects} />
            </div>
        </main>
    );
}