import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// --- Type Definitions ---

export type ProjectFrontmatter = {
    title: string;
    specialty: string;
    summary: string;
    details?: string; // Optional text field in frontmatter
    tags: string[];
    heroImage?: string;
    gallery?: string; // Path to the gallery image/video folder relative to /public
};

export type GalleryItem = {
    type: 'image' | 'video';
    src: string;
    altText?: string;
};

// --- Constants ---

const projectsDirectory = path.join(process.cwd(), 'content/projects');

// --- Data Fetching Functions ---

/**
 * Gets and sorts metadata for all projects.
 * This function reads the frontmatter from all project markdown files.
 */
export function getSortedProjectsData(): ({ slug: string } & ProjectFrontmatter)[] {
    const categories = fs.readdirSync(projectsDirectory);
    let allProjectsData: ({ slug: string } & ProjectFrontmatter)[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const fileNames = fs.readdirSync(categoryPath);
            const categoryProjects = fileNames
                .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx')) // Ensure only md/mdx files
                .map(fileName => {
                    const slug = `${category}/${fileName.replace(/\.mdx?$/, '')}`;
                    const fullPath = path.join(categoryPath, fileName);
                    const fileContents = fs.readFileSync(fullPath, 'utf8');
                    const matterResult = matter(fileContents);

                    return {
                        slug,
                        ...(matterResult.data as ProjectFrontmatter), // Cast frontmatter to our defined type
                    };
                });
            allProjectsData = [...allProjectsData, ...categoryProjects];
        }
    });

    // Sort projects by title alphabetically (ascending)
    return allProjectsData.sort((a, b) => {
        if (a.title && b.title) {
            return a.title.localeCompare(b.title);
        }
        if (a.title) return -1;
        if (b.title) return 1;
        return 0;
    });
}

/**
 * Gets all project slugs for generating static paths.
 */
export function getAllProjectSlugs() {
    const categories = fs.readdirSync(projectsDirectory);
    let paths: { params: { slug: string[] } }[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const fileNames = fs.readdirSync(categoryPath);
            fileNames
                .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
                .forEach(fileName => {
                    paths.push({
                        params: {
                            slug: [category, fileName.replace(/\.mdx?$/, '')],
                        },
                    });
                });
        }
    });
    return paths;
}

/**
 * Gets full data for a single project, including processed Markdown content
 * and dynamically populated gallery items (images and videos).
 */
export async function getProjectData(slug: string): Promise<{
    slug: string;
    contentHtml: string;
    gallery: GalleryItem[];
} & ProjectFrontmatter> {
    const fullPath = path.join(projectsDirectory, `${slug}.md`); // Assuming .md, adjust if .mdx
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as ProjectFrontmatter;

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    let resolvedGalleryItems: GalleryItem[] = [];

    if (frontmatter.gallery) {
        const directoryPathInPublic = frontmatter.gallery.startsWith('/')
            ? frontmatter.gallery.substring(1)
            : frontmatter.gallery;

        const fullSystemDirectoryPath = path.join(process.cwd(), 'public', directoryPathInPublic);

        try {
            if (fs.existsSync(fullSystemDirectoryPath)) {
                const files = fs.readdirSync(fullSystemDirectoryPath);
                resolvedGalleryItems = files
                    .filter(file => /\.(jpe?g|png|gif|webp|mp4|webm|ogg)$/i.test(file)) // Common image & video extensions
                    .map(file => {
                        let publicPath = path.join(frontmatter.gallery!, file).replace(/\\/g, '/');
                        if (!publicPath.startsWith('/')) {
                            publicPath = '/' + publicPath;
                        }

                        const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
                        return {
                            type: isVideo ? 'video' : 'image',
                            src: publicPath,
                            altText: isVideo
                                ? `${frontmatter.title} video: ${file}`
                                : `${frontmatter.title} gallery image: ${file}`,
                        };
                    });
            } else {
                console.warn(`[${slug}] Gallery directory not found: ${fullSystemDirectoryPath}`);
            }
        } catch (error) {
            console.error(`[${slug}] Error reading gallery directory ${fullSystemDirectoryPath}:`, error);
        }
    }

    return {
        slug,
        contentHtml,
        ...frontmatter,
        gallery: resolvedGalleryItems,
    };
}

/**
 * Helper function called by project detail pages.
 */
export async function getProjectPageDetails(slugArray: string[]) {
    const slugString = slugArray.join('/');
    return getProjectData(slugString);
}

/**
 * Gets all unique category names for generating static paths for category pages.
 */
export function getAllCategories() {
    const projects = getSortedProjectsData(); // This returns { slug: string, ...frontmatter }[]
    const allCategories = projects.map(project => project.slug.split('/')[0]);
    const uniqueCategories = [...new Set(allCategories)];

    return uniqueCategories.map(category => {
        return {
            // This structure is for generateStaticParams in app/projects/[category]/page.tsx
            category: category,
        };
    });
}