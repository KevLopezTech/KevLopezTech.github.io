import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { getHeroContent, type HeroContent } from '@/lib/homepage';
import {JSX} from "react/jsx-dev-runtime";

type SocialLink = {
    name: string;
    href: string;
    icon: JSX.Element;
};

export default function Footer() {
    // Fetch heroContent which now includes social links
    const siteData = getHeroContent();
    const currentYear = new Date().getFullYear();

    const socialLinks: SocialLink[] = [];

    if (siteData.linkedInUrl) {
        socialLinks.push({
            name: 'LinkedIn',
            href: siteData.linkedInUrl,
            icon: <FaLinkedin />
        });
    }
    if (siteData.githubUrl) {
        socialLinks.push({
            name: 'GitHub',
            href: siteData.githubUrl,
            icon: <FaGithub />
        });
    }
    if (siteData.emailAddress) {
        socialLinks.push({
            name: 'Email',
            href: `mailto:${siteData.emailAddress}`,
            icon: <FaEnvelope />
        });
    }
    // Add more conditions here if you add more links to hero.md

    return (
        <footer className="bg-gray-800 border-t border-gray-700 text-gray-400">
            <div className="container mx-auto px-6 py-10 sm:py-12">
                <div className="flex flex-col items-center">
                    <Link href="/" className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors mb-6">
                        {siteData.name} {/* Using name from hero.md for consistency */}
                    </Link>

                    <p className="mb-6 text-center max-w-md">
                        Interested in collaborating or have a question? Feel free to reach out.
                    </p>

                    {socialLinks.length > 0 && (
                        <div className="flex justify-center space-x-6 mb-8">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    aria-label={link.name}
                                    className="text-gray-400 hover:text-cyan-400 transition-colors text-2xl sm:text-3xl"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    )}

                    <p className="text-sm">
                        &copy; {currentYear} {siteData.name}. All Rights Reserved. {/* Using name from hero.md */}
                    </p>
                </div>
            </div>
        </footer>
    );
}