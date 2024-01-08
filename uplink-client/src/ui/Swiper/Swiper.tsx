"use client";
import React, { useState, useEffect, useRef } from 'react';
import { isMobile } from "@/lib/isMobile";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useDebounce } from '@/hooks/useDebounce';

const Swiper = ({ listSize, children }) => {
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const scrollContainerRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  const calculateButtonVisibility = (timeout: number) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setTimeout(() => {
        setIsStart(scrollLeft === 0)
        setIsEnd(scrollLeft + clientWidth >= scrollWidth)
      },timeout)
    }
  };

  useEffect(() => {
    setIsMobileDevice(isMobile());
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener('scroll', () => calculateButtonVisibility(500));

      calculateButtonVisibility(0);

      // Remove the event listener when the component unmounts
      return () => {
        container.removeEventListener('scroll', () => calculateButtonVisibility(500) );
      };
    }
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollAmount = direction === 'next' ? containerWidth : -containerWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mx-auto -px-2 -sm:px-8 w-full h-full flex gap-2 relative">
      {!isMobileDevice && !isStart && (
        <div className="absolute -left-10 top-0 h-full rounded-lg bg-base-200 bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition-all duration-200 flex flex-col items-center justify-center p-1 animate-fadeIn" onClick={() => handleScroll('prev')}>
          <MdKeyboardArrowLeft className="w-6 h-6"/>
        </div>
       )}
        {/* : (<span className="w-7" />): null } */}
      <div
        className="no-scrollbar m-auto h-full w-full snap-x snap-mandatory flex flex-row gap-4 overflow-auto px-0 py-2"
        ref={scrollContainerRef}
      >
        {children}
      </div>
      {!isMobileDevice && !isEnd && ( 
        <div className="absolute -right-10 top-0 h-full rounded-lg bg-base-200 bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition-all duration-200 flex flex-col items-center justify-center p-1 animate-fadeIn" onClick={() => handleScroll('next')}>
          <MdKeyboardArrowRight className="w-6 h-6"/>
        </div>
      )}
       {/* : (<span className="w-7" />) : null } */}
    </div>
  );
};

export default Swiper