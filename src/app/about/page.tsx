import React from 'react';
import Image from 'next/image';
import { getHeroContent } from '@/lib/homepage';
import {
    getExperienceData,
    getEducationData,
    getCertificationData,
} from '@/lib/aboutContent';
import InfoCard from '@/components/InfoCard';

export default async function AboutPage() {
    const heroContent = getHeroContent(); // For profile image and intro
    const experienceItems = await getExperienceData();
    const educationItems = await getEducationData();
    const certificationItems = await getCertificationData();

    // Helper function to create a link object for InfoCard if URL exists
    const createLinkObject = (url?: string, text: string = "View Details") => {
        return url ? { href: url, text: text } : undefined;
    };

    return (
        <main className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20"> {/* Consistent page padding */}

                {/* Top "About Me" Introduction Section */}
                <section className="mb-16 md:mb-20">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                        {heroContent.profileImage && (
                            <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 relative">
                                <Image
                                    src={heroContent.profileImage}
                                    alt={`${heroContent.name} - Profile`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full shadow-xl border-2 border-cyan-500/60"
                                />
                            </div>
                        )}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                                About {heroContent.name.split(' ')[0]} {/* Just first name for title */}
                            </h1>
                            {/* Using the intro from hero.md. You might want a more detailed one here later */}
                            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                                {heroContent.intro}
                            </p>
                            <div className="my-8 h-px w-full bg-gray-600 hidden sm:block"></div>
                            {/* You can add more paragraphs here for a more detailed "About Me" narrative */}
                            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                                {heroContent.detailedIntro}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                {experienceItems && experienceItems.length > 0 && (
                    <section className="mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8 text-center md:text-left">Experience</h2>
                        <div className="space-y-8">
                            {experienceItems.map((item) => (
                                <InfoCard
                                    key={item.slug}
                                    logoUrl={item.logo}
                                    mainTitle={item.companyName}
                                    subtitle={item.role}
                                    dateOrDuration={item.duration}
                                    location={item.location}
                                    detailsHtml={item.contentHtml}
                                    // link={createLinkObject(item.companyUrl, "Visit Company")} // Example if you add companyUrl to frontmatter
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {educationItems && educationItems.length > 0 && (
                    <section className="mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8 text-center md:text-left">Education</h2>
                        <div className="space-y-8">
                            {educationItems.map((item) => (
                                <InfoCard
                                    key={item.slug}
                                    logoUrl={item.logo}
                                    mainTitle={item.institutionName}
                                    subtitle={item.degree}
                                    dateOrDuration={item.graduationDate}
                                    location={item.location}
                                    detailsHtml={item.contentHtml}
                                    // gpa={item.gpa} // InfoCard doesn't have GPA prop, could add to detailsHtml or subtitle2
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications Section */}
                {certificationItems && certificationItems.length > 0 && (
                    <section>
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8 text-center md:text-left">Certifications</h2>
                        <div className="space-y-8">
                            {certificationItems.map((item) => (
                                <InfoCard
                                    key={item.slug}
                                    logoUrl={item.logo}
                                    mainTitle={item.certificationName}
                                    subtitle={item.issuingBody}
                                    dateOrDuration={item.issueDate}
                                    detailsHtml={item.contentHtml}
                                    link={createLinkObject(item.credentialUrl, "View Credential")}
                                />
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </main>
    );
}