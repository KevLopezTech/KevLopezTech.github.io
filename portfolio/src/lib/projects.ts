import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

// Function to get all projects, sorted by date
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

// Function to get all possible slugs for static path generation
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

// Function to get a single project's data, including rendered HTML content
export async function getProjectData(slug: string) {
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the slug and contentHtml
    return {
        slug,
        contentHtml,
        ...matterResult.data,
    };
}