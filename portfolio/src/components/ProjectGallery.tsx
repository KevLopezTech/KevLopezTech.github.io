"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/projects';
import { FaChevronLeft, FaChevronRight, FaPlayCircle } from 'react-icons/fa';

type ProjectGalleryProps = {
    gallery: GalleryItem[];
};

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Wrap navigation functions in useCallback
    const goToPrevious = useCallback(() => {
        if (gallery.length === 0) return; // Guard against empty gallery
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? gallery.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, gallery.length]); // Dependencies of goToPrevious

    const goToNext = useCallback(() => {
        if (gallery.length === 0) return; // Guard against empty gallery
        const isLastSlide = currentIndex === gallery.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, gallery.length]); // Dependencies of goToNext

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gallery.length <= 1) return;
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
    }, [goToPrevious, goToNext, currentIndex, gallery.length]);

    if (!gallery || gallery.length === 0) {
        return null;
    }

    const currentItem = gallery[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Main Display Area */}
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl mb-4"> {/* REMOVED purple border */}
                {currentItem.type === 'image' ? (
                    <Image
                        src={currentItem.src}
                        alt={currentItem.altText || `Gallery image ${currentIndex + 1}`}
                        layout="fill"
                        objectFit="contain"
                        key={currentItem.src + currentIndex}
                        priority={currentIndex === 0}
                        className="transition-opacity duration-300 ease-in-out" // Added transition back
                    />
                ) : (
                    <video
                        key={currentItem.src + currentIndex}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                        playsInline
                        autoPlay={false}
                    >
                        <source src={currentItem.src} type={`video/${currentItem.src.split('.').pop()}`} />
                        Your browser does not support the video tag.
                    </video>
                )}

                {/* Navigation Arrows - NOW CORRECTLY POSITIONED */}
                {gallery.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full focus:outline-none transition-all duration-300 z-10"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full focus:outline-none transition-all duration-300 z-10"
                            aria-label="Next slide"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Preview Bar */}
            {gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-800/50 rounded-lg"> {/* Removed mt-8, as arrows are no longer below */}
                    {gallery.map((item, index) => (
                        <div
                            key={item.src + "-thumb-" + index}
                            onClick={() => goToSlide(index)}
                            className={`relative cursor-pointer w-20 h-14 md:w-24 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 hover:border-cyan-400 transition-all duration-200
                          ${currentIndex === index ? 'border-cyan-500 scale-105' : 'border-transparent'}`}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.src}
                                    alt={item.altText || `Thumbnail ${index + 1}`}
                                    width={96}
                                    height={64}
                                    objectFit="cover"
                                    className="w-full h-full"
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