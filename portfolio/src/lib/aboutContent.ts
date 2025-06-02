import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// --- Type Definitions ---

export type ExperienceItem = {
    slug: string;
    companyName: string;
    role: string;
    duration: string;
    logo?: string;
    location?: string;
    contentHtml: string; // For responsibilities/achievements from Markdown body
};

export type EducationItem = {
    slug: string;
    institutionName: string;
    degree: string;
    graduationDate: string;
    logo?: string;
    location?: string;
    gpa?: string;
    contentHtml: string; // For relevant coursework/details from Markdown body
};

export type CertificationItem = {
    slug: string;
    certificationName: string;
    issuingBody: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
    logo?: string;
    contentHtml: string; // For description from Markdown body
};

// --- Helper Function to Read and Process a Directory ---

async function getDataForDirectory<T extends {slug: string}>(
    directoryName: string,
    itemTypeDefaults: Omit<T, 'slug' | 'contentHtml'> // For type casting frontmatter
): Promise<T[]> {
    const fullDirectoryPath = path.join(process.cwd(), 'content', directoryName);
    if (!fs.existsSync(fullDirectoryPath)) {
        console.warn(`Directory not found: ${fullDirectoryPath}`);
        return [];
    }

    const fileNames = fs.readdirSync(fullDirectoryPath);
    const allData = await Promise.all(
        fileNames
            .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
            .map(async (fileName) => {
                const slug = fileName.replace(/\.mdx?$/, '');
                const fullPath = path.join(fullDirectoryPath, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const matterResult = matter(fileContents);

                const processedContent = await remark()
                    .use(html)
                    .process(matterResult.content);
                const contentHtml = processedContent.toString();

                return {
                    slug,
                    contentHtml,
                    ...(matterResult.data as Omit<T, 'slug' | 'contentHtml'>),
                } as unknown as T;
            })
    );

    // Optional: Sort data if needed (e.g., by date for experience/education)
    // For now, they will be sorted by filename. We can add sorting later.
    return allData;
}

// --- Public Data Fetching Functions ---

export async function getExperienceData(): Promise<ExperienceItem[]> {
    // Provide default/expected types for ExperienceItem frontmatter
    return getDataForDirectory<ExperienceItem>('experience', {} as Omit<ExperienceItem, 'slug' | 'contentHtml'>);
}

export async function getEducationData(): Promise<EducationItem[]> {
    return getDataForDirectory<EducationItem>('education', {} as Omit<EducationItem, 'slug' | 'contentHtml'>);
}

export async function getCertificationData(): Promise<CertificationItem[]> {
    return getDataForDirectory<CertificationItem>('certifications', {} as Omit<CertificationItem, 'slug' | 'contentHtml'>);
}