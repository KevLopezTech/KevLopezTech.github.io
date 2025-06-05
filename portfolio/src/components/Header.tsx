"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import {
  FaHome,
  FaUserAlt,
  FaThLarge,
  FaGithub, FaLinkedin, FaEnvelope // Ensure these are here if used in this component (e.g. if props for them are defined)
} from 'react-icons/fa';
import {
  LuGamepad2, // User added this
  LuBrainCog  // User added this
} from 'react-icons/lu';
import { GiArtificialHive } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import {JSX} from "react/jsx-dev-runtime"; // User added this for their environment

type NavLinkItem = {
  name: string;
  href: string;
  icon?: JSX.Element;
};

interface HeaderProps {
  githubUrl?: string;
  linkedinUrl?: string;
  emailAddress?: string;
}

const iconMargin = "mr-1.5";
const iconStyle = "inline-block relative -top-px align-middle";
const iconSize = 18;

const navLinks: NavLinkItem[] = [
  { name: "Home", href: "/", icon: <FaHome className={`${iconStyle} ${iconMargin}`} size={iconSize} /> },
  { name: "About", href: "/about", icon: <FaUserAlt className={`${iconStyle} ${iconMargin}`} size={iconSize*0.9} /> },
  { name: "Artificial Intelligence", href: "/projects/artificial-intelligence", icon: <LuBrainCog className={`${iconStyle} ${iconMargin}`} size={iconSize} /> },
  { name: "Game Development", href: "/projects/game-development", icon: <LuGamepad2 className={`${iconStyle} ${iconMargin}`} size={iconSize} /> },
  { name: "Internet of Things", href: "/projects/internet-of-things", icon: <GiArtificialHive className={`${iconStyle} ${iconMargin}`} size={iconSize} /> },
  { name: "All Projects", href: "/projects", icon: <FaThLarge className={`${iconStyle} ${iconMargin}`} size={iconSize*0.9} /> },
];

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", transition: { type: "tween", ease: "easeIn", duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

export default function Header({ githubUrl, linkedinUrl, emailAddress }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileMenuOpen]);

  const getLinkClassNames = (linkHref: string) => {
    let isActive = false;
    if (linkHref === "/projects") {
      isActive = pathname === "/projects";
    } else if (linkHref.startsWith("/projects/")) {
      isActive = pathname === linkHref || pathname.startsWith(linkHref + "/");
    } else {
      isActive = pathname === linkHref;
    }
    return {
      desktop: `px-3 py-2 text-lg transition-colors text-center ${isActive ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`,
      mobileButton: `w-full flex items-center justify-center rounded-2xl px-4 py-3 text-lg transition-all duration-200 ease-in-out transform ${isActive ? 'bg-cyan-500 text-white font-semibold shadow-md scale-105' : 'text-cyan-200 bg-gray-700/40 hover:bg-gray-600/80 hover:text-white hover:scale-[1.03]'}`
    };
  };

  return (
      <>
        <header className="fixed top-0 left-0 right-0 z-30 bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
                Kevin Lopez
              </Link>
              {/* === DESKTOP NAVIGATION - SPACING ADJUSTED HERE === */}
              <nav className="hidden md:flex items-center space-x-2 lg:space-x-4"> {/* Changed from space-x-4 lg:space-x-6 */}
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} className={getLinkClassNames(link.href).desktop} >
                      {link.icon} {link.name}
                    </Link>
                ))}
              </nav>
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:text-cyan-300 transition-colors relative z-50">
                  {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
              <>
                <motion.div
                    key="mobile-overlay"
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={toggleMobileMenu}
                />
                <motion.div
                    key="mobile-drawer"
                    className="fixed top-20 right-0 w-4/5 max-w-xs bg-gray-800 shadow-2xl p-4 z-50
                         flex flex-col rounded-l-2xl
                         max-h-[calc(100vh-5rem-2rem)] overflow-y-auto"
                    variants={drawerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                  <nav className="flex flex-col space-y-3 flex-shrink-0">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={toggleMobileMenu}
                            className={getLinkClassNames(link.href).mobileButton}
                        >
                          {link.icon}
                          {link.name}
                        </Link>
                    ))}
                  </nav>

                  <div className="flex-grow"></div>

                  <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <div className="flex justify-around items-center py-2">
                      {linkedinUrl && (
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-300 hover:text-cyan-300 transition-colors" title="LinkedIn">
                            <FaLinkedin size={26} />
                          </a>
                      )}
                      {githubUrl && (
                          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-300 hover:text-cyan-300 transition-colors" title="GitHub">
                            <FaGithub size={26} />
                          </a>
                      )}
                      {emailAddress && (
                          <a href={`mailto:${emailAddress}`} aria-label="Email" className="text-gray-300 hover:text-cyan-300 transition-colors" title="Email">
                            <FaEnvelope size={26} />
                          </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </>
  );
}