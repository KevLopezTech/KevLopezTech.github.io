import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSortedProjectsData, type ProjectFrontmatter } from '@/lib/projects';
import { getHeroContent } from "@/lib/homepage"; // Ensure this path is correct
import { skillCategories } from '@/data/skills'; // Ensure this path is correct

// Import icons
import { FaReact, FaPython, FaLinkedin, FaGithub, FaEnvelope, FaJava, FaUnity, FaDownload } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6'
import { SiNextdotjs, SiTypescript } from 'react-icons/si';
import FeaturedProjectsCarousel from "@/components/FeaturedProjectsCarousel";

type FeaturedProjectType = { slug: string } & ProjectFrontmatter;

export default function HomePage() {
    const allProjects = getSortedProjectsData();

    console.log("--- DEBUGGING FEATURED PROJECTS ---");
    // Let's inspect the raw data of a few projects to see what the 'featured' tag looks like
    console.log(
        "Raw data check:",
        allProjects.slice(0, 5).map(p => ({ title: p.title, featured: p.featured }))
    );

    const featuredProjectsInCarousel: FeaturedProjectType[] = allProjects
        .filter(project => project.featured === true)
        .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

    console.log(
        "Projects remaining after filter:",
        featuredProjectsInCarousel.map(p => ({ title: p.title, featured: p.featured }))
    );
    console.log("--- END OF DEBUGGING ---");

    const heroContent = getHeroContent();

    const topSkills = [
        { name: "Java", icon: <FaJava className="text-xl md:text-2xl" /> },
        { name: "C/C++", icon: <FaCode className="text-xl md:text-2xl" /> },
        { name: "C#", icon: <FaCode className="text-xl md:text-2xl" /> },
        { name: "TypeScript", icon: <SiTypescript className="text-xl md:text-2xl" /> },
        { name: "Python", icon: <FaPython className="text-xl md:text-2xl" /> },
        { name: "React", icon: <FaReact className="text-xl md:text-2xl" /> },
        { name: "React Native", icon: <FaReact className="text-xl md:text-2xl" /> },
        { name: "Next.js", icon: <SiNextdotjs className="text-xl md:text-2xl" /> },
        { name: "Unity", icon: <FaUnity className="text-xl md:text-2xl" /> },
    ];

    // Define your social/contact links (REPLACE WITH YOUR ACTUAL URLS)
    const linkedInUrl = heroContent.linkedInUrl || "#"; // Use from heroContent or fallback
    const githubUrl = heroContent.githubUrl || "#";   // Use from heroContent or fallback
    const emailAddress = heroContent.emailAddress || "contact@example.com"; // Use from heroContent or fallback


    return (
        <main className="bg-gray-900 text-white min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center p-6 sm:p-10 pt-24 md:pt-10">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl mx-auto">
                        <div className="w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 relative flex-shrink-0 order-1 md:order-none">
                            <Image
                                src={heroContent.profileImage}
                                alt={`${heroContent.name} - Profile`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full shadow-2xl border-4 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300"
                                priority
                            />
                        </div>
                        <div className="text-center md:text-center order-2 md:order-none">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                                {heroContent.name}
                            </h1>
                            <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 mb-8">
                                {heroContent.title}
                            </p>
                            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg md:max-w-none mx-auto md:mx-0">
                                {heroContent.intro}
                            </p>
                            <div className="mb-10 flex flex-wrap justify-center md:justify-center gap-3 sm:gap-4">
                                {topSkills.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="flex items-center bg-gray-700/80 text-cyan-300/90 text-sm sm:text-base font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-sm cursor-pointer transform hover:scale-105 hover:bg-cyan-600 hover:text-white transition-all duration-200 ease-in-out"
                                    >
                                        <span className="mr-2">{skill.icon}</span>
                                        {skill.name}
                                    </div>
                                ))}
                            </div>

                            {/* ===== CORRECTED CTA / SOCIAL LINKS ===== */}
                            <div className="flex justify-center md:justify-center space-x-6 mt-10"> {/* mt-10 for spacing after the top skills bar */}

                                {/* LinkedIn Icon Link */}
                                {linkedInUrl && linkedInUrl !== "#" && (
                                    <a
                                        href={linkedInUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn Profile"
                                        className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                                        title="LinkedIn"
                                    >
                                        <FaLinkedin size={32} /> {/* Adjust size as needed */}
                                    </a>
                                )}

                                {/* GitHub Icon Link */}
                                {githubUrl && githubUrl !== "#" && (
                                    <a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub Profile"
                                        className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                                        title="GitHub"
                                    >
                                        <FaGithub size={32} /> {/* Adjust size as needed */}
                                    </a>
                                )}

                                {/* Email Icon Link */}
                                {emailAddress && emailAddress !== "contact@example.com" && (
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        aria-label="Send an Email"
                                        className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                                        title="Email Me"
                                    >
                                        <FaEnvelope size={32} /> {/* Adjust size as needed */}
                                    </a>
                                )}

                                {/* Optional Separator */}
                                <div className="h-8 w-px bg-gray-600 hidden sm:block"></div>

                                {/* Download Buttons */}
                                <a
                                    href="/documents/KevinLopez-Resume.pdf" // <-- REPLACE with your file name
                                    download
                                    className="inline-flex items-center text-sm font-semibold border-2 border-gray-600 hover:border-cyan-400 text-gray-200 hover:text-cyan-400 py-2 px-5 rounded-lg transition-colors duration-300"
                                >
                                    <FaDownload className="mr-2" />
                                    Download Resume
                                </a>
                                <a
                                    href="/documents/CoverLetter_KevinLopez.pdf" // <-- REPLACE with your file name
                                    download
                                    className="inline-flex items-center text-sm font-semibold border-2 border-gray-600 hover:border-cyan-400 text-gray-200 hover:text-cyan-400 py-2 px-5 rounded-lg transition-colors duration-300"
                                >
                                    <FaDownload className="mr-2" />
                                    Download CV
                                </a>
                            </div>
                            {/* ===== END OF CORRECTED CTA / SOCIAL LINKS ===== */}
                        </div>
                    </div>
                </div>
            </section>

            {/* About Me Section */}
            <section className="py-20 md:py-28 bg-gray-800 text-center">
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-cyan-400">About Me</h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-4">
                        Hello! I&aposm Kevin Lopez, a software engineer with a deep-seated passion for research and development and over six years of experience creating sophisticated applications.
                        My journey in tech has been driven by a curiosity to solve complex problems, leading me to specialize in IoT ecosystems (Java & C/C++), interactive Game Development (Unity & C#), and the application of Artificial Intelligence.
                    </p>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        These specializations come to life in my projects,
                        reflecting my commitment to innovation. I&aposm driven to continuously learn and apply my skills in software development to create technologies that truly make a difference.
                    </p>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-20 md:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Featured Projects
                    </h2>
                    {featuredProjectsInCarousel.length > 0 ? (
                        <FeaturedProjectsCarousel featuredProjects={featuredProjectsInCarousel} />
                    ) : (
                        <p className="text-center text-xl text-gray-400">More projects coming soon!</p>
                    )}
                    {allProjects.length > featuredProjectsInCarousel.length && (
                        <div className="text-center mt-16">
                            <Link
                                href="/projects"
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 px-10 rounded-2xl text-xl transition duration-300"
                            >
                                View All Projects
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* My Skills Section */}
            <section className="py-20 md:py-28 bg-gray-900">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-cyan-400">
                        My Skills
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {skillCategories.map((category) => (
                            <div key={category.categoryName} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg flex flex-col">
                                <h3 className="text-2xl font-semibold text-white mb-6">{category.categoryName}</h3>
                                <div className="flex flex-wrap gap-4">
                                    {category.skills.map((skill) => (
                                        <span
                                            key={skill.name}
                                            className="flex items-center bg-gray-700 text-cyan-300 text-base font-medium px-4 py-2 rounded-full cursor-default transition-all duration-300 ease-in-out hover:bg-cyan-600 hover:text-white hover:scale-105 hover:-translate-y-1"
                                        >
                                            <span className="mr-2 text-xl">{skill.icon}</span>
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer is handled by layout.tsx */}
        </main>
    );
}