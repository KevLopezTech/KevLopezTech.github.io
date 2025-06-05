"use client";

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';

type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onInit = useCallback((emblaApiInstance: EmblaCarouselType) => {
        if (!emblaApiInstance) return;
        setScrollSnaps(emblaApiInstance.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApiInstance: EmblaCarouselType) => {
        if (!emblaApiInstance) return;
        setSelectedIndex(emblaApiInstance.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onInit(emblaApi); // Set initial snaps
        onSelect(emblaApi); // Set initial selected dot
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
        return () => { // Clean up listeners
            emblaApi.off('reInit', onInit);
            emblaApi.off('reInit', onSelect);
            emblaApi.off('select', onSelect);
        }
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    };
};

type DotButtonPropType = PropsWithChildren<
    {
        selected?: boolean; // To style the selected dot
    } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>
>;

export const DotButton: React.FC<DotButtonPropType> = (props) => {
    const { children, selected, className, ...restProps } = props;
    return (
        <button
            className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-200 ease-in-out focus:outline-none
                  ${selected ? 'bg-cyan-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'} 
                  ${className || ''}`}
            type="button"
            aria-label={`Go to slide ${props['aria-posinset'] || ''}`} // For accessibility
            {...restProps}
        >
            {children}
        </button>
    );
};