"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { register } from "swiper/element/bundle";
import { Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export const Swiper = (props: {
  children: React.ReactNode;
  spaceBetween?: number;
  slidesPerView?: number;
  slidesPerGroup?: number;
  breakpoints?: any;

}) => {
  const swiperRef = useRef(null);
  const { children, ...rest } = props;
  const [isReady, setIsReady] = useState(false);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const handlePrev = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    // swiperRef.current.addEventListener("init", function () {
    //   setIsReady(true);
    // });

    // Register Swiper web component
    register();

    // pass component props to parameters
    const params = {
      ...rest,
      preventClicks: true,
      preventClicksPropagation: true,
      on: {
        init: () => {
          setIsReady(true);
        },
        slideChange: (data) => {
          setDisablePrev(data.isBeginning);
          setDisableNext(data.isEnd);
        },
      },
    };

    // Assign it to swiper element
    Object.assign(swiperRef.current, params);

    // initialize swiper
    swiperRef.current.initialize();
  }, []);

  useEffect(() => {
    console.log(swiperRef.current);
  }, [swiperRef.current]);

  return (
    <div className="mx-auto w-full px-12 relative">
      {/* @ts-expect-error */}
      <swiper-container init="false" ref={swiperRef}>
        {!isReady && <SwiperSkeleton/>}
        {isReady && children}
        {/* @ts-expect-error */}
      </swiper-container>
      {!disablePrev && (
        <div
          className="absolute flex flex-col justify-center items-center hover:bg-base-100 opacity-60 h-full w-8 left-0 top-0 cursor-pointer transition-all duration-300 ease-in-out rounded-lg"
          onClick={handlePrev}
        >
          <HiChevronLeft className="h-10 w-10 text-t1" />
        </div>
      )}
      {!disableNext && (
        <div
          className="absolute flex flex-col justify-center items-center hover:bg-base-100 opacity-60 h-full w-8 right-0 top-0 cursor-pointer transition-all duration-300 ease-in-out rounded-lg"
          onClick={handleNext}
        >
          <HiChevronRight className="h-10 w-10 text-t1" />
        </div>
      )}
    </div>
  );
};

export const SwiperSlide = (props) => {
  const { children, ...rest } = props;

  return (
    <>
      {/* @ts-expect-error */}
      <swiper-slide {...rest}>{children}</swiper-slide>
    </>
  );
};

const SwiperSkeleton = () => {
  return (
    <div className="mx-auto w-full px-12 relative">
      <div className="flex flex-row gap-4">
        <div className="w-full shimmer h-96 bg-base-100 rounded-lg" />
        <div className="w-full shimmer h-96 bg-base-100 rounded-lg" />
        <div className="w-full shimmer h-96 bg-base-100 rounded-lg" />
        <div className="w-full shimmer h-96 bg-base-100 rounded-lg" />
      </div>
    </div>
  );
};
