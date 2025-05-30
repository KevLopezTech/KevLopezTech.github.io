import React from 'react'; // Added for good measure with JSX
import Link from 'next/link';
import Image from 'next/image';
import { getSortedProjectsData } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import { skillCategories } from '@/data/skills'; // Ensure this points to your skills.tsx file

import { FaReact, FaPython } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript } from 'react-icons/si';
import { AiOutlineHighlight } from 'react-icons/ai';

export default function HomePage() {
    const allProjects = getSortedProjectsData();
    const featuredProjects = allProjects.slice(0, 2);

    const topSkills = [
        { name: "Next.js", icon: <SiNextdotjs className="text-xl" /> }, // className for size
        { name: "React", icon: <FaReact className="text-xl" /> },
        { name: "TypeScript", icon: <SiTypescript className="text-xl" /> },
        { name: "Python", icon: <FaPython className="text-xl" /> },
        { name: "AI/ML", icon: <AiOutlineHighlight className="text-xl" /> } // Example conceptual icon
    ];

    return (
        <main className="bg-gray-900 text-white min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center p-8 pt-20 md:pt-8"> {/* Added padding-top for mobile */}
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-4xl mx-auto">

                        {/* Image Column */}
                        <div className="w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 relative flex-shrink-0 order-1 md:order-none"> {/* Added order for mobile */}
                            <Image
                                src="/images/portrait.png" // Path to your image in the public folder
                                alt="Kevin Lopez - Profile"      // Replace with your name
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full shadow-2xl border-4 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300" // Example styling
                                priority // Add priority if this image is above the fold
                            />
                        </div>

                        {/* Text Column */}
                        <div className="text-center md:text-left order-2 md:order-none"> {/* Added order for mobile */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                Kevin Lopez {/* Replace with your name */}
                            </h1>
                            <p className="text-xl md:text-2xl text-cyan-400 mb-6">
                                Software Developer & AI Enthusiast {/* Replace with your title/tagline */}
                            </p>
                            <p className="text-md sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-md md:max-w-none mx-auto md:mx-0">
                                I build modern, responsive web applications and explore the frontiers of Artificial Intelligence. Passionate about clean code and innovative solutions.
                                {/* Replace with your brief intro */}
                            </p>

                            <div className="mb-8 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                                {topSkills.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="flex items-center bg-gray-700/80 text-cyan-300/90 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm cursor-pointer transform hover:scale-105 hover:bg-cyan-600 hover:text-white transition-all duration-200 ease-in-out"
                                    >
                                        <span className="mr-1.5 sm:mr-2">{skill.icon}</span>
                                        {skill.name}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center md:justify-start space-x-4">
                                <Link
                                    href="/projects"
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-md sm:text-lg transition duration-300"
                                >
                                    View My Work
                                </Link>
                                {/* Example Social Link:
                        <a
                          href="https://github.com/yourusername"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 border-2 border-gray-600 hover:border-cyan-500 rounded-lg py-3 px-6 sm:px-8 text-md sm:text-lg transition duration-300"
                        >
                          GitHub
                        </a>
                      */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Me Section (Brief) */}
            <section className="py-16 md:py-24 bg-gray-800 text-center"> {/* Corrected bg-gray-850 to bg-gray-800 */}
                <div className="max-w-3xl mx-auto px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">About Me</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Hi, I'm Kevin. I am a dedicated software developer with a strong interest in machine learning and AI.
                        I thrive on solving complex problems and continuously learning new technologies to create impactful digital experiences.
                        My journey in tech is driven by a curiosity to understand how things work and a desire to build tools that make a difference.
                        {/* Customize this text */}
                    </p>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Featured Projects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredProjects.map((project: any) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>
                    {allProjects.length > featuredProjects.length && (
                        <div className="text-center mt-12">
                            <Link
                                href="/projects"
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
                            >
                                View My Work
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* My Skills Section */}
            <section className="py-16 md:py-24 bg-gray-900">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400">
                        My Skills
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillCategories.map((category) => (
                            <div key={category.categoryName} className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col">
                                <h3 className="text-xl font-semibold text-white mb-4">{category.categoryName}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {category.skills.map((skill) => (
                                        <span
                                            key={skill.name}
                                            className="flex items-center bg-gray-700 text-cyan-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                                        >
                                            <span className="mr-2 text-lg">{skill.icon}</span>
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="text-center py-10 text-gray-500 border-t border-gray-700 mt-16 md:mt-24">
                <p>&copy; {new Date().getFullYear()} Kevin Lopez. All rights reserved.</p>
                {/* Add social links here if you like */}
            </footer>
        </main>
    );
}