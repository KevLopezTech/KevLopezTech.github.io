"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import {
    EmblaCarouselType as EmblaApiType,
    EmblaEventType,
    EmblaOptionsType, EmblaCarouselType
} from 'embla-carousel';
import useEmblaCarousel, {
    EmblaViewportRefType
} from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import { GalleryItem } from '@/lib/projects';
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButtons';

const TWEEN_FACTOR_BASE = 0.2; // Parallax intensity factor from your example

interface ProjectGalleryProps {
    gallery: GalleryItem[];
    options?: EmblaOptionsType; // Make Embla options optional from props
}

const defaultOptions: EmblaOptionsType = {
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
};
const autoplayOptions = {
    delay: 3000, // Time in ms between slides
    stopOnInteraction: true, // Autoplay will resume after user interaction (swipes)
    stopOnMouseEnter: true, // Autoplay will pause when the mouse is over the carousel
    playOnInit: true, // Start autoplay when the carousel is initialized
};

export default function EmblaProjectGallery({ gallery, options: propOptions }: ProjectGalleryProps) {
    const mergedOptions = { ...defaultOptions, ...propOptions };
    const emblaHookResult: [EmblaViewportRefType, EmblaApiType | undefined] = useEmblaCarousel(mergedOptions, [Autoplay(autoplayOptions)]);
    const emblaRef = emblaHookResult[0];
    const emblaApi = emblaHookResult[1];

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);

    // Parallax logic functions (adapted from your provided code)
    const setTweenNodes = useCallback((emblaApiInstance: EmblaCarouselType): void => {
        if (!emblaApiInstance) return;
        tweenNodes.current = emblaApiInstance.slideNodes().map((slideNode) => {
            // Ensure we target the correct layer for parallax
            return slideNode.querySelector('.embla__parallax__layer') as HTMLElement;
        });
    }, []);

    const setTweenFactor = useCallback((emblaApiInstance: EmblaCarouselType) => {
        if (!emblaApiInstance) return;
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApiInstance.scrollSnapList().length;
    }, []);

    const tweenParallax = useCallback(
        (emblaApiInstance: EmblaCarouselType, eventName?: EmblaEventType) => {
            if (!emblaApiInstance || tweenNodes.current.length === 0) return;

            const engine = emblaApiInstance.internalEngine();
            const scrollProgress = emblaApiInstance.scrollProgress();
            const slidesInView = emblaApiInstance.slidesInView();
            const isScrollEvent = eventName === 'scroll';

            emblaApiInstance.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.slideRegistry[snapIndex];

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target();
                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);
                                if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                                if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        });
                    }
                    const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
                    const tweenNode = tweenNodes.current[slideIndex];
                    if (tweenNode) {
                        tweenNode.style.transform = `translateX(${translate}%)`;
                    }
                });
            });
        },
        [] // tweenFactor.current is a ref, tweenNodes.current is a ref, no need to list in deps for this callback
    );

    // useEffect to setup and run parallax
    useEffect(() => {
        if (!emblaApi) return;

        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenParallax(emblaApi); // Apply initial parallax

        const handleReInit = () => {
            setTweenNodes(emblaApi);
            setTweenFactor(emblaApi);
            tweenParallax(emblaApi);
        };

        const handleScroll = () => tweenParallax(emblaApi, 'scroll');

        emblaApi.on('reInit', handleReInit);
        emblaApi.on('scroll', handleScroll);
        // Removed 'slideFocus' as we are not implementing dot/arrow controls yet

        return () => {
            emblaApi.off('reInit', handleReInit);
            emblaApi.off('scroll', handleScroll);
        };
    }, [emblaApi, setTweenNodes, setTweenFactor, tweenParallax]);

const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

    const onVideoPlay = useCallback(() => {
        // Get the autoplay plugin instance
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (autoplay) {
            // Stop the autoplay when a video is played
            autoplay.stop();
            console.log("Autoplay stopped for video.");
        }
    }, [emblaApi]);

    const onVideoPauseOrEnd = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (autoplay) {
            // Resume autoplay when a video is paused or ends
            autoplay.play();
            console.log("Autoplay resumed.");
        }
    }, [emblaApi]);

    // Effect to ensure autoplay restarts when user navigates away from a video slide
    useEffect(() => {
        if (emblaApi) {
            const autoplay = emblaApi.plugins().autoplay;
            const onSelect = () => {
                if (autoplay && !autoplay.isPlaying()) {
                    autoplay.play();
                }
            };
            emblaApi.on('select', onSelect);
            return () => { emblaApi.off('select', onSelect) };
        }
    }, [emblaApi]);

    if (!gallery || gallery.length === 0) {
        return <p className="text-center text-gray-400">Gallery is empty.</p>;
    }

    return (
        <div className="embla w-full max-w-3xl mx-auto" ref={emblaRef}>
            <div className="embla__container">
                {gallery.map((item, index) => (
                    // Each slide needs an aspect ratio, e.g., aspect-video or fixed height
                    <div className="embla__slide aspect-video bg-gray-700" key={item.src + index}>
                        <div className="embla__parallax h-full">
                            <div className="embla__parallax__layer h-full w-full">
                                {item.type === 'image' ? (
                                    <Image
                                        src={item.src}
                                        alt={item.altText || `Gallery image ${index + 1}`}
                                        layout="fill"
                                        objectFit="contain" // Or "cover"
                                        className="embla__slide__img block h-full w-full" // Ensure image fills layer
                                    />
                                ) : (
                                    <video
                                        controls
                                        className="embla__slide__vid w-full h-full object-contain block"
                                        preload="metadata"
                                        playsInline
                                        autoPlay={false}
                                        onPlay={onVideoPlay}
                                        onPause={onVideoPauseOrEnd}
                                        onEnded={onVideoPauseOrEnd}
                                    >
                                        <source src={item.src} type={`video/${item.src.split('.').pop()}`} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {gallery.length > 1 && (
                <>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled && !mergedOptions.loop} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled && !mergedOptions.loop} />

                    <div className="flex justify-center space-x-2 mt-6 pb-2"> {/* Container for dots */}
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                selected={index === selectedIndex}
                                aria-posinset={index + 1} // For accessibility
                                aria-setsize={scrollSnaps.length} // For accessibility
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}