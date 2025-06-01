"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/projects'; // Assuming GalleryItem is exported from lib/projects.ts
import { FaChevronLeft, FaChevronRight, FaPlayCircle } from 'react-icons/fa';

type ProjectGalleryProps = {
    gallery: GalleryItem[];
};

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!gallery || gallery.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? gallery.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === gallery.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    const currentItem = gallery[currentIndex];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPrevious();
            } else if (event.key === 'ArrowRight') {
                goToNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, gallery.length]); // Added gallery.length to dependencies

    return (
        <div className="w-full max-w-3xl mx-auto"> {/* Root container for the gallery component */}

            {/* THIS IS THE MAIN DISPLAY AREA CONTAINER I WAS REFERRING TO: */}
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl mb-4">
                {currentItem.type === 'image' ? (
                    <Image
                        src={currentItem.src}
                        alt={currentItem.altText || `Gallery image ${currentIndex + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="transition-opacity duration-500 ease-in-out"
                        key={currentItem.src + currentIndex} // Changed key to update on index change if src is the same
                        priority={currentIndex === 0} // Prioritize loading the first image
                    />
                ) : (
                    <video
                        key={currentItem.src + currentIndex} // Changed key
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                        playsInline
                        autoPlay={false} // Ensure autoplay is explicitly false
                    >
                        <source src={currentItem.src} type={`video/${currentItem.src.split('.').pop()}`} />
                        Your browser does not support the video tag.
                    </video>
                )}

                {/* Navigation Arrows */}
                {gallery.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full focus:outline-none transition-opacity duration-300 z-10"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full focus:outline-none transition-opacity duration-300 z-10"
                            aria-label="Next slide"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Preview Bar */}
            {gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-800/50 rounded-md">
                    {gallery.map((item, index) => (
                        <div
                            key={item.src + index} // Changed key
                            onClick={() => goToSlide(index)}
                            className={`cursor-pointer w-20 h-14 md:w-24 md:h-16 flex-shrink-0 rounded-md overflow-hidden border-2 hover:border-cyan-400 transition-all duration-200
                          ${currentIndex === index ? 'border-cyan-500 scale-105' : 'border-transparent'}`}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.src}
                                    alt={item.altText || `Thumbnail ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white" title={item.altText || `Video thumbnail ${index + 1}`}>
                                    <FaPlayCircle size={24} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}