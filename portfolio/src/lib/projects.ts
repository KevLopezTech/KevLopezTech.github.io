export type ProjectFrontmatter = {
    title: string;
    description: string;
    publishDate: string;
    tags: string[];
    heroImage?: string;
    gallery?: string[];
};

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

// This is the main function our pages will use for now.
// It reads all project files and returns their data, sorted by date.
export function getSortedProjectsData() {
    const categories = fs.readdirSync(projectsDirectory);
    let allProjectsData: any[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const fileNames = fs.readdirSync(categoryPath);
            const categoryProjects = fileNames.map(fileName => {
                const slug = `${category}/${fileName.replace(/\.md$/, '')}`;
                const fullPath = path.join(categoryPath, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const matterResult = matter(fileContents);

                return {
                    slug,
                    ...matterResult.data,
                };
            });
            allProjectsData = [...allProjectsData, ...categoryProjects];
        }
    });

    // Sort projects by date
    return allProjectsData.sort((a, b) => {
        if (a.publishDate < b.publishDate) {
            return 1;
        } else {
            return -1;
        }
    });
}

// We will need these two functions for the individual project detail pages later.
export function getAllProjectSlugs() {
    const categories = fs.readdirSync(projectsDirectory);
    let paths: { params: { slug: string[] } }[] = [];

    categories.forEach(category => {
        const categoryPath = path.join(projectsDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const fileNames = fs.readdirSync(categoryPath);
            fileNames.forEach(fileName => {
                paths.push({
                    params: {
                        slug: [category, fileName.replace(/\.md$/, '')],
                    },
                });
            });
        }
    });

    return paths;
}

export async function getProjectData(slug: string): Promise<{
    slug: string;
    contentHtml: string;
} & ProjectFrontmatter> { // <-- MODIFIED: Add ProjectFrontmatter to the return type
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Assert the type of matterResult.data to our defined shape
    const frontmatter = matterResult.data as ProjectFrontmatter;

    return {
        slug,
        contentHtml,
        ...frontmatter, // Spread the typed frontmatter
    };
}

export async function getProjectPageDetails(slugArray: string[]) {
    // Reconstruct the slug from the URL parts inside this function
    const slug = slugArray.join('/');

    // Call the existing getProjectData function
    const projectData = await getProjectData(slug);
    return projectData;
}