import React from 'react';
import Image from 'next/image';

type InfoCardProps = {
    logoUrl?: string;
    mainTitle: string;
    subtitle: string;
    dateOrDuration?: string;
    location?: string;
    detailsHtml: string;
    link?: {
        href: string;
        text: string;
    };
};

export default function InfoCard({
                                     logoUrl,
                                     mainTitle,
                                     subtitle,
                                     dateOrDuration,
                                     location,
                                     detailsHtml,
                                     link,
                                 }: InfoCardProps) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-600/50 items-center md:items-start">
            {logoUrl && (
                <div className="w-full md:w-20 flex-shrink-0 text-center md:text-left">
                    <div className="relative w-20 h-20 md:w-full md:h-auto md:aspect-[4/3] mx-auto md:mx-0 overflow-hidden rounded-md">
                        <Image
                            src={logoUrl}
                            alt={`${mainTitle} logo`}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            )}

            {/* Text Content div already has text-center md:text-left */}
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{mainTitle}</h3>
                <p className="text-lg text-cyan-400 mb-1">{subtitle}</p>
                {dateOrDuration && (
                    <p className="text-sm text-gray-400 mb-1">{dateOrDuration}</p>
                )}
                {location && (
                    <p className="text-sm text-gray-500 mb-3">{location}</p>
                )}

                {/* Details from Markdown body */}
                <div
                    // ADDED text-center md:text-left HERE
                    // REMOVED [&_ul]:pl-0 [&_li]:text-left for now to see default centering effect
                    className="prose prose-sm prose-invert text-gray-300 max-w-none text-center md:text-left"
                    dangerouslySetInnerHTML={{ __html: detailsHtml }}
                />

                {link && link.href && link.text && (
                    <div className="mt-4"> {/* This will also be centered on mobile due to parent */}
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200"
                        >
                            {link.text} &rarr;
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}