"use client"; // This component needs to be a client component for useState and event handling

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi'; // Hamburger and close icons

const navLinks = [
  { name: "About", href: "/about" }, // Assuming #about is an ID on your homepage
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/#experience" }, // Assuming #experience is an ID on your homepage
  { name: "Education", href: "/#education" },   // Assuming #education is an ID on your homepage
  // Add { name: "Contact", href: "/#contact" } if you add a contact section to homepage
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu if escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
       }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
        window.removeEventListener('keydown', handleEsc);
    };
  }, []);


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Site Name */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
            Kevin Lopez {/* Replace with your name or logo */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg ${
                  pathname === link.href || (link.href.startsWith("/projects") && pathname.startsWith("/projects"))
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400 transition-colors'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:text-cyan-400 transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-800/95 backdrop-blur-md shadow-xl py-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                className={`text-xl py-2 ${
                  pathname === link.href || (link.href.startsWith("/projects") && pathname.startsWith("/projects"))
                    ? 'text-cyan-400 font-semibold'
                    : 'text-cyan-300 hover:text-cyan-200 transition-colors'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}