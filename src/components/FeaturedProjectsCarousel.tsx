"use client";

import React, { useRef, useEffect } from 'react'; // Added useRef
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'; // Import SwiperCore for type
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// We don't need 'swiper/css/navigation' as we are providing all button styling.

import ProjectCard from './ProjectCard';
import { type ProjectFrontmatter } from '@/lib/projects';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type FeaturedProjectType = { slug: string } & ProjectFrontmatter;

interface FeaturedProjectsCarouselProps {
    featuredProjects: FeaturedProjectType[];
}

export default function FeaturedProjectsCarousel({ featuredProjects }: FeaturedProjectsCarouselProps) {
    const swiperInstanceRef = useRef<SwiperCore | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (swiperInstanceRef.current && prevButtonRef.current && nextButtonRef.current) {
            const swiper = swiperInstanceRef.current;
            // Assign the button elements to Swiper's navigation parameters
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevButtonRef.current;
                swiper.params.navigation.nextEl = nextButtonRef.current;
            }
            // Reinitialize and update the navigation
            swiper.navigation.destroy(); // Destroy old (if any)
            swiper.navigation.init();    // Initialize with new elements
            swiper.navigation.update();  // Update UI state of arrows
        }
        // Run this effect only once after the component mounts and refs are set.
        // Or if featuredProjects changes, as swiper might need re-init or update.
    }, [featuredProjects]); // Re-run if featuredProjects array changes

    if (!featuredProjects || featuredProjects.length === 0) {
        return <p className="text-center text-gray-400">No featured projects to display at the moment.</p>;
    }

    const enableLoop = featuredProjects.length > 3;

    return (
        <div className="relative group/carousel">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                onSwiper={(swiper) => {
                    swiperInstanceRef.current = swiper; // Store swiper instance
                }}
                slidesPerView={1.2}
                spaceBetween={16}
                centeredSlides={true}
                loop={enableLoop}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                // We will configure navigation programmatically via useEffect
                // So, we can set navigation to true here just to enable the module,
                // or even false if the useEffect completely takes over. Let's use true.
                navigation={true} // Enable the navigation module, elements are set via refs
                breakpoints={{
                    640: { slidesPerView: 2.3, spaceBetween: 20, centeredSlides: true },
                    768: { slidesPerView: 2.5, spaceBetween: 24, centeredSlides: true },
                    1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
                }}
                className="myFeaturedProjectsSwiper pb-16"
            >
                {featuredProjects.map((project) => (
                    <SwiperSlide key={project.slug} className="h-auto pb-2 self-stretch">
                        <div className="h-full">
                            <ProjectCard project={project} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows - Now with refs */}
            <button
                ref={prevButtonRef} // Assign ref
                // Removed custom-swiper-button class, not strictly needed if using refs
                className="absolute top-1/2 left-0 md:-left-4 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
                aria-label="Previous project"
            >
                <FaChevronLeft size={20} />
            </button>
            <button
                ref={nextButtonRef} // Assign ref
                // Removed custom-swiper-button class
                className="absolute top-1/2 right-0 md:-right-4 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
                aria-label="Next project"
            >
                <FaChevronRight size={20} />
            </button>
        </div>
    );
}