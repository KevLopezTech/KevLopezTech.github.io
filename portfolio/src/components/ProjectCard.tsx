import Link from 'next/link';
import Image from 'next/image';
import { BsCardImage } from 'react-icons/bs'; // Import a placeholder icon

type Project = {
    slug: string;
    title: string;
    summary: string;
    heroImage?: string;
};

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link href={`/project/${project.slug}`} className="block h-full group">
            <div className="bg-gray-800 rounded-2xl border border-gray-700
                      group-hover:border-cyan-400 transition-all duration-300 h-full
                      flex flex-col shadow-xl group-hover:shadow-cyan-500/30
                      overflow-hidden"> {/* Keep overflow-hidden */}

                {/* Image container - This div will always exist to maintain card structure */}
                <div className="relative w-full h-36 flex-shrink-0 bg-gray-700 rounded-t-2xl"> {/* Added bg-gray-700 for placeholder bg and rounded-t-2xl for top part of the card */}
                    {project.heroImage ? (
                        <Image
                            src={project.heroImage}
                            alt={`${project.title} thumbnail`}
                            layout="fill"
                            objectFit="cover"
                        />
                    ) : (
                        // Placeholder shown if no heroImage
                        <div className="w-full h-full flex items-center justify-center">
                            <BsCardImage className="text-5xl text-gray-500" /> {/* Placeholder icon styling */}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col items-center text-center flex-grow">
                    <h2
                        className={`text-2xl font-semibold text-white mt-0 mb-3`} // Removed conditional margin, top rounding on image div handles it
                    >
                        {project.title}
                    </h2>
                    <p
                        className="text-gray-300 text-base leading-relaxed flex-grow mb-4"
                    >
                        {project.summary}
                    </p>
                </div>
            </div>
        </Link>
    );
}