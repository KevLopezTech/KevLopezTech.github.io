import React from 'react'; // Import React when using JSX in a .tsx file
import {
    FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaPython, FaGitAlt, FaDocker, FaFigma, FaJava, FaNpm, FaYarn, FaGrunt, FaRegBuilding
} from 'react-icons/fa';
import {
    SiTypescript,
    SiNextdotjs,
    SiTailwindcss,
    SiMongodb,
    SiPostgresql,
    SiFirebase,
    SiPandas,
    SiScikitlearn,
    SiAmazonec2,
    SiGooglecloud,
    SiGradle,
    SiApachemaven,
    SiJetbrains,
    SiArduino,
    SiNvidia,
    SiRaspberrypi
} from 'react-icons/si';
import { TbBrandVscode, TbSettingsAutomation, TbBrandKotlin } from 'react-icons/tb'; // Tabler icons
import { AiOutlineSolution, AiOutlineAreaChart } from 'react-icons/ai';
import {JSX} from "react/jsx-dev-runtime";
import {FaCode, FaCircleNodes, FaUnity, FaWindows, FaLinux, FaAndroid} from "react-icons/fa6";
import { BiNetworkChart } from "react-icons/bi";
import { IoLanguage } from "react-icons/io5";
import { GrNodes } from "react-icons/gr";
import { MdNetworkWifi } from "react-icons/md";

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
            { name: "React", icon: <FaReact size={20} /> },
            { name: "React Native", icon: <FaReact size={20} /> },
            { name: "TypeScript", icon: <SiTypescript size={20} /> },
            { name: "JavaScript", icon: <FaJsSquare size={20} /> },
            { name: "Next.js", icon: <SiNextdotjs size={20} /> },
            { name: "HTML5", icon: <FaHtml5 size={20} /> },
            { name: "CSS3", icon: <FaCss3Alt size={20} /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss size={20} /> },
        ]
    },
    {
        categoryName: "Backend Development",
        skills: [
            { name: "Java", icon: <FaJava size={20} /> },
            { name: "C/C++", icon: <FaCode size={20} /> },
            { name: "C#", icon: <FaCode size={20} /> },
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Node.js", icon: <FaNodeJs size={20} /> },
            { name: "Kotlin", icon: <TbBrandKotlin size={20} /> },
        ]
    },
    {
        categoryName: "IoT & Embedded Systems",
        skills: [
            { name: "Java", icon: <FaJava size={20} /> },
            { name: "C/C++", icon: <FaCode size={20} /> },
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Assembly", icon: <FaCode size={20} /> },
            { name: "Arduino", icon: <SiArduino size={20} /> },
            { name: "Nvidia", icon: <SiNvidia size={20} /> },
            { name: "Raspberry Pi", icon: <SiRaspberrypi size={20} /> },
            { name: "Niagara", icon: <FaRegBuilding size={20} /> },
            { name: "Comm. Protocols", icon: <MdNetworkWifi size={20} /> },
        ]
    },
    {
        categoryName: "Game Development",
        skills: [
            { name: "Unity", icon: <FaUnity size={20} /> },
            { name: "C#", icon: <FaCode size={20} /> },
            { name: "C/C++", icon: <FaCode size={20} /> },
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Artificial Intelligence", icon: <GrNodes size={20} /> },
        ]
    },
    {
        categoryName: "AI & Machine Learning",
        skills: [
            { name: "Python", icon: <FaPython size={20} /> },
            { name: "Java", icon: <FaJava size={20} /> },
            { name: "Scikit-learn", icon: <SiScikitlearn size={20} /> },
            { name: "pandas", icon: <SiPandas size={20} /> },
            { name: "Deep Learning", icon: <FaCircleNodes size={20} /> },
            { name: "Neural Networks", icon: <BiNetworkChart size={20} /> },
            { name: "Natural Language Proocessing", icon: <IoLanguage size={20} /> },
        ]
    },
    {
        categoryName: "Cloud & Databases",
        skills: [
            { name: "AWS (EC2 Basics)", icon: <SiAmazonec2 size={20} />},
        ]
    },
    {
        categoryName: "Tools & Platforms",
        skills: [
            { name: "Git & GitHub", icon: <FaGitAlt size={20} /> },
            { name: "Gradle", icon: <SiGradle size={20} /> },
            { name: "Maven", icon: <SiApachemaven size={20} /> },
            { name: "npm", icon: <FaNpm size={20} /> },
            { name: "yarn", icon: <FaYarn size={20} /> },
            { name: "grunt", icon: <FaGrunt size={20} /> },
            { name: "JetBrains IDEs", icon: <SiJetbrains size={20} /> },
            { name: "Windows", icon: <FaWindows size={20} /> },
            { name: "Linux", icon: <FaLinux size={20} /> },
            { name: "Android", icon: <FaAndroid size={20} /> },
            { name: "Figma", icon: <FaFigma size={20} /> }
        ]
    },
    {
        categoryName: "Soft Skills & Others",
        skills: [
            { name: "Adaptability", icon: <AiOutlineSolution size={20} /> },
            { name: "Agile Methodologies", icon: <AiOutlineSolution size={20} /> },
            { name: "CI/CD", icon: <AiOutlineSolution size={20} /> },
            { name: "SDLC", icon: <AiOutlineSolution size={20} /> },
            { name: "Problem Solving", icon: <AiOutlineSolution size={20} /> },
        ]
    }
];