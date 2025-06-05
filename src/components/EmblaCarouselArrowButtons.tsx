"use client";

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApiInstance: EmblaCarouselType) => {
        if (!emblaApiInstance) return;
        setPrevBtnDisabled(!emblaApiInstance.canScrollPrev());
        setNextBtnDisabled(!emblaApiInstance.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi); // Set initial state
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
        return () => { // Clean up listeners
            emblaApi.off('reInit', onSelect);
            emblaApi.off('select', onSelect);
        }
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    };
};

type PrevNextButtonPropType = PropsWithChildren<
    {
        className?: string; // Allow passing additional classes
    } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>
>;

const baseButtonClasses = "absolute top-1/2 transform -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition-all duration-300 z-10 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed";

export const PrevButton: React.FC<PrevNextButtonPropType> = (props) => {
    const { children, className, ...restProps } = props;
    return (
        <button
            className={`${baseButtonClasses} left-0 md:-left-0 ${className || ''}`}
            type="button"
            aria-label="Previous slide"
            {...restProps}
        >
            <FaChevronLeft size={20} />
            {children}
        </button>
    );
};

export const NextButton: React.FC<PrevNextButtonPropType> = (props) => {
    const { children, className, ...restProps } = props;
    return (
        <button
            className={`${baseButtonClasses} right-0 md:-right-0 ${className || ''}`}
            type="button"
            aria-label="Next slide"
            {...restProps}
        >
            <FaChevronRight size={20} />
            {children}
        </button>
    );
};