import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// --- Type Definitions ---

export type ProjectFrontmatter = {
    title: string;
    specialty: string; // e.g., "AI", "Web Development", matches category slug
    summary: string;
    details?: string; // Optional additional text field in frontmatter
    tags: string[];
    heroImage?: string;
    galleryDirectory?: string; // Path to the gallery image/video folder relative to /public
    featured?: boolean;
    featuredOrder?: number;
};

export type GalleryItem = {
    type: 'image' | 'video';
    src: string;
    altText?: string;
};

// --- Constants ---

const projectsDirectory = path.join(process.cwd(), 'content/projects');

// --- Data Fetching Functions ---
export function getFeaturedProjects(): ({ slug: string } & ProjectFrontmatter)[] {
    const allProjects = getSortedProjectsData(); // Gets all projects

    const featured = allProjects
        .filter(project => project.featured === true) // Filter for featured projects
        .sort((a, b) => {
            // Sort by featuredOrder if present, otherwise keep original sort (title)
            if (a.featuredOrder && b.featuredOrder) {
                return a.featuredOrder - b.featuredOrder;
            }
            if (a.featuredOrder) return -1; // Projects with order come first
            if (b.featuredOrder) return 1;
            return 0; // Fallback to existing title sort if no order specified
        });

    return featured;
}
/**
 * Gets and sorts metadata for all projects.
 * This function reads the frontmatter from all project markdown files.
 */
export function getSortedProjectsData(): ({ slug: string } & ProjectFrontmatter)[] {
    if (!fs.existsSync(projectsDirectory)) {
        console.warn(`Projects directory not found: ${projectsDirectory}. Returning empty array.`);
        return [];
    }
    const categories = fs.readdirSync(projectsDirectory);
    let allProjectsData: ({ slug: string } & ProjectFrontmatter)[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        // Ensure categoryPath is a directory before trying to read it
        if (fs.existsSync(categoryPath) && fs.statSync(categoryPath).isDirectory()) {
            const fileNames = fs.readdirSync(categoryPath);
            const categoryProjects = fileNames
                .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
                .map(fileName => {
                    const slug = `${category}/${fileName.replace(/\.mdx?$/, '')}`;
                    const fullPath = path.join(categoryPath, fileName);
                    const fileContents = fs.readFileSync(fullPath, 'utf8');
                    const { data } = matter(fileContents); // matterResult.data is the frontmatter

                    return {
                        slug,
                        ...(data as ProjectFrontmatter), // Cast frontmatter to our defined type
                    };
                });
            allProjectsData = [...allProjectsData, ...categoryProjects];
        } else {
            console.warn(`Category path is not a directory or does not exist: ${categoryPath}`);
        }
    });

    // Sort projects by title alphabetically (ascending)
    return allProjectsData.sort((a, b) => {
        if (a.title && b.title) {
            return a.title.localeCompare(b.title);
        }
        // Basic fallback if one title is missing (shouldn't happen with TypeScript if type is enforced)
        if (a.title) return -1;
        if (b.title) return 1;
        return 0;
    });
}

/**
 * Gets all project slugs for generating static paths.
 */
export function getAllProjectSlugs() {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }
    const categories = fs.readdirSync(projectsDirectory);
    const paths: { params: { slug: string[] } }[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        if (fs.existsSync(categoryPath) && fs.statSync(categoryPath).isDirectory()) {
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
    const fullPath = path.join(projectsDirectory, `${slug}.md`); // Assuming .md, adjust if .mdx is primary
    if (!fs.existsSync(fullPath)) {
        // Handle case where markdown file doesn't exist
        console.error(`Markdown file not found for slug: ${slug} at path: ${fullPath}`);
        // Return a default or throw an error, depending on desired behavior
        // For now, let's throw to make it obvious during development
        throw new Error(`Markdown file not found for slug: ${slug}`);
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as ProjectFrontmatter;

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    let resolvedGalleryItems: GalleryItem[] = [];

    // Check if galleryDirectory exists AND is a string
    if (frontmatter.galleryDirectory && typeof frontmatter.galleryDirectory === 'string') {
        // Ensure leading slash and remove it for joining with 'public' correctly
        const directoryPathInPublic = frontmatter.galleryDirectory.startsWith('/')
            ? frontmatter.galleryDirectory.substring(1)
            : frontmatter.galleryDirectory;

        const fullSystemDirectoryPath = path.join(process.cwd(), 'public', directoryPathInPublic);

        try {
            if (fs.existsSync(fullSystemDirectoryPath) && fs.statSync(fullSystemDirectoryPath).isDirectory()) {
                const files = fs.readdirSync(fullSystemDirectoryPath);
                resolvedGalleryItems = files
                    .filter(file => /\.(jpe?g|png|gif|webp|mp4|webm|ogg)$/i.test(file)) // Common image & video extensions
                    .map(file => {
                        // Construct the public path, ensuring forward slashes and leading slash
                        let publicPath = path.join(frontmatter.galleryDirectory!, file).replace(/\\/g, '/');
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
                console.warn(`[${slug}] Gallery directory specified ("${frontmatter.galleryDirectory}") but path not found or not a directory: ${fullSystemDirectoryPath}`);
            }
        } catch (error) {
            console.error(`[${slug}] Error reading gallery directory ${fullSystemDirectoryPath}:`, error);
        }
    } else if (frontmatter.galleryDirectory) {
        // This 'else if' catches cases where galleryDirectory exists but is NOT a string
        console.warn(`[${slug}] 'galleryDirectory' field in frontmatter is not a string. Value:`, frontmatter.galleryDirectory);
    }

    return {
        slug,
        contentHtml,
        ...frontmatter,
        gallery: resolvedGalleryItems,
    };
}

/**
 * Helper function called by project detail pages to fetch project data.
 */
export async function getProjectPageDetails(slugArray: string[]) {
    const slugString = slugArray.join('/');
    return getProjectData(slugString);
}

/**
 * Gets all unique category names (folder names) for generating static paths for category pages.
 */
export function getAllCategories(): { category: string }[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }
    const categories = fs.readdirSync(projectsDirectory).filter(categoryName => {
        const categoryPath = path.join(projectsDirectory, categoryName);
        return fs.existsSync(categoryPath) && fs.statSync(categoryPath).isDirectory();
    });

    return categories.map(category => {
        return {
            category: category,
        };
    });
}