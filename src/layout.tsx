import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getHeroContent } from '@/lib/homepage'; // <--- IMPORT getHeroContent

export const metadata: Metadata = {
    title: 'Kevin Lopez - Portfolio',
    description: 'The software development and AI portfolio of Kevin Lopez, showcasing modern web projects and skills.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const heroContent = getHeroContent(); // <--- FETCH HERO CONTENT

    return (
        <html lang="en">
        <body className="bg-gray-900 text-white flex flex-col min-h-screen">
        <Header
            githubUrl={heroContent.githubUrl}     // <--- PASS PROPS
            linkedinUrl={heroContent.linkedInUrl} // <--- PASS PROPS
            emailAddress={heroContent.emailAddress} // <--- PASS PROPS
        />
        <div className="flex-grow pt-20">
            {children}
        </div>
        <Footer />
        </body>
        </html>
    );
}