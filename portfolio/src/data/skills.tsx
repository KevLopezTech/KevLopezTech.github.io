import React from 'react'; // Import React when using JSX in a .tsx file
import {
    FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaPython, FaGitAlt, FaDocker, FaFigma, FaJava
} from 'react-icons/fa';
import {
    SiTypescript, SiNextdotjs, SiTailwindcss, SiExpress,
    SiGraphql, SiMongodb, SiPostgresql, SiFirebase, SiJupyter, SiAmazons3, SiGooglecloud
} from 'react-icons/si';
import { TbBrandVscode, TbSettingsAutomation } from 'react-icons/tb'; // Tabler icons
import { AiOutlineSolution, AiOutlineAreaChart } from 'react-icons/ai';
import {JSX} from "react/jsx-dev-runtime"; // Ant Design Icons

// Define the types
export type Skill = {
    name: string;
    icon: JSX.Element; // The icon will be a React component (JSX.Element)
};

export type SkillCategory = {
    categoryName: string;
    skills: Skill[];
};

// Note: I've re-checked these icon names and imports for common usage.
// You can find more at react-icons.github.io/react-icons
export const skillCategories: SkillCategory[] = [
    {
        categoryName: "Frontend Development",
        skills: [
            { name: "HTML5", icon: <FaHtml5 size={20} /> },
            { name: "CSS3", icon: <FaCss3Alt size={20} /> },
            { name: "JavaScript (ES6+)", icon: <FaJsSquare size={20} /> },
            { name: "TypeScript", icon: <SiTypescript size={20} /> },
            { name: "React", icon: <FaReact size={20} /> },
            { name: "Next.js", icon: <SiNextdotjs size={20} /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss size={20} /> },
        ]
    },
    {
        categoryName: "Backend Development",
        skills: [
            { name: "Node.js", icon: <FaNodeJs size={20} /> },
            { name: "Express.js", icon: <SiExpress size={20} /> },
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Java", icon: <FaJava size={20} /> }, // Example new skill
            { name: "GraphQL (Basic)", icon: <SiGraphql size={20} /> }
        ]
    },
    {
        categoryName: "AI & Machine Learning",
        skills: [
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Scikit-learn", icon: <TbSettingsAutomation size={20} /> },
            { name: "Jupyter Notebooks", icon: <SiJupyter size={20} /> },
            { name: "Data Analysis", icon: <AiOutlineAreaChart size={20} /> }
        ]
    },
    {
        categoryName: "Databases & Cloud",
        skills: [
            { name: "MongoDB", icon: <SiMongodb size={20} /> },
            { name: "PostgreSQL", icon: <SiPostgresql size={20} /> },
            { name: "Firebase", icon: <SiFirebase size={20} /> },
            { name: "AWS (S3, EC2 Basics)", icon: <SiAmazons3 size={20} />}, // Example
            { name: "Google Cloud (Basic)", icon: <SiGooglecloud size={20} />} // Example
        ]
    },
    {
        categoryName: "Tools & Platforms",
        skills: [
            { name: "Git & GitHub", icon: <FaGitAlt size={20} /> },
            { name: "Docker (Basic)", icon: <FaDocker size={20} /> },
            { name: "VS Code", icon: <TbBrandVscode size={20} /> },
            { name: "Vercel", icon: <SiNextdotjs size={20} /> },
            { name: "Figma", icon: <FaFigma size={20} /> }
        ]
    },
    {
        categoryName: "Soft Skills & Others",
        skills: [
            { name: "Agile Methodologies", icon: <AiOutlineSolution size={20} /> },
            { name: "Problem Solving", icon: <AiOutlineSolution size={20} /> },
        ]
    }
];