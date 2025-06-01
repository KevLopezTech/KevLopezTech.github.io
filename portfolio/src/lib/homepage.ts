import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const heroFilePath = path.join(process.cwd(), 'content/homepage/hero.md');

export type HeroContent = {
    name: string;
    title: string;
    intro: string;
    profileImage: string;
    // Add other fields here if you add them to hero.md, e.g.:
    // linkedInUrl?: string;
    // githubUrl?: string;
};

export function getHeroContent(): HeroContent {
    const fileContents = fs.readFileSync(heroFilePath, 'utf8');
    const { data } = matter(fileContents);
    return data as HeroContent;
}