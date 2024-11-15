"use client";;
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    type MotionStyle,
    type MotionValue,
} from 'framer-motion';
import { useState, useEffect, MouseEvent } from 'react';
import { useIsMobile } from "@/hooks/useIsMobile";
import dynamic from 'next/dynamic'
import { BiCategoryAlt, BiTime } from "react-icons/bi";
import { LuCoins, LuSettings2, LuVote } from "react-icons/lu";
import { HiOutlineDocument } from "react-icons/hi2";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { useInView } from "react-intersection-observer";
import Autoplay from "embla-carousel-autoplay"
import { Carousel } from '@/ui/DesignKit/Carousel';


const DelayedGridLayout = dynamic(
    () => import("@/ui/DelayedGrid/DelayedGridLayout"),
    {
        ssr: false,
    }
);

const DelayedGridItem = dynamic(
    () => import("@/ui/DelayedGrid/DelayedGridItem"),
    {
        ssr: false,
    }
);


type WrapperStyle = MotionStyle & {
    '--x': MotionValue<string>;
    '--y': MotionValue<string>;
};



export const AutoplayCarousel = ({ children }: { children: React.ReactNode }) => {
    return (
        <Carousel
            opts={{
                align: 'start',
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 2000,
                })
            ]}>
            {children}
        </Carousel>
    )
}

export const FeatureCard = ({ children }: { children: React.ReactNode }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isMobile = useIsMobile();

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        if (isMobile) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }


    return (
        <motion.div
            className="animated-feature-cards relative w-full h-full shadow-lg"
            onMouseMove={handleMouseMove}
            style={
                {
                    '--x': useMotionTemplate`${mouseX}px`,
                    '--y': useMotionTemplate`${mouseY}px`,
                } as WrapperStyle
            }
        >
            <div className='group w-full h-full rounded-xl bg-gradient-to-b transition duration-300 bg-base-100 bg-opacity-80 border border-border'>
                {children}
            </div>
        </motion.div>
    );
}

export const ContestSubCardA = () => {

    const steps = [
        {
            name: "Contest Type",
            background: "bg-primary",
            icon: <BiCategoryAlt className="w-16 h-16 text-primary" />,
        },

        {
            name: "Deadlines",
            background: "bg-error",
            icon: <BiTime className="w-16 h-16 text-error" />,
        },

        {
            name: "Prompt",
            background: "bg-purple-500",
            icon: <HiOutlineDocument className="w-16 h-16 text-purple-500" />,
        },
        {
            name: "Voting Policy",
            background: "bg-warning",
            icon: <LuVote className="w-16 h-16 text-warning" />,
        },

        {
            name: "Submitter Rewards",
            background: "bg-green-400",
            icon: <LuCoins className="w-16 h-16 text-green-400" />,
        },

        {
            name: "Voter Rewards",
            background: "bg-purple-500",
            icon: <LuCoins className="w-16 h-16 text-purple-500" />,
        },
        {
            name: "Submitter Restrictions",
            background: "bg-orange-600",
            icon: <HiOutlineLockClosed className="w-16 h-16 text-orange-600" />,
        },

        {
            name: "Extras",
            background: "bg-gray-500",
            icon: <LuSettings2 className="w-16 h-16 text-t2" />,
        },
    ];

    return (
        <FeatureCard>
            <div className="min-h-[450px] w-full md:min-h-[450px] grid grid-cols-1  gap-4">
                {/* <div /> */}
                {/* <p className="p-6 sm:p-10 text-2xl font-bold leading-7 text-t2">
                    <span className="text-t1">Ultimate flexibility</span> for rewards, entry requirements, and more.
                </p> */}
                <div className="relative flex flex-col overflow-hidden">
                    <DelayedGridLayout gridStyle="absolute top-0 left-0 md:right-0 w-[650px] h-[450px] h-full grid grid-cols-3 auto-rows-fr gap-2 !rotate-[-20deg]">
                        {steps.map((step, idx) => {
                            return (
                                <DelayedGridItem
                                    key={idx}
                                    gridItemStyle="box border border-border p-2 rounded-lg flex flex-col gap-2 items-center justify-evenly "
                                    delay={idx * 0.2}
                                >
                                    <h2 className="font-bold text-t1 text-sm text-center">
                                        {step.name}
                                    </h2>
                                    {step.icon}
                                </DelayedGridItem>
                            );
                        })}
                    </DelayedGridLayout>
                </div>
            </div>
        </FeatureCard>
    );
}

export const ContestSubCardB = ({ children }: { children: React.ReactNode }) => {

    const [inViewRef, inView] = useInView({
        threshold: 1,
        triggerOnce: false,
    });

    const [isVisible, setIsVisible] = useState(false);
    const type = "twitter";
    useEffect(() => {
        if (inView) setIsVisible(true);
        else setIsVisible(false);
    }, [inView]);

    return (
        <FeatureCard>
            <div className="p-6 min-h-[350px] w-full sm:p-10 md:min-h-[450px] flex flex-col gap-4">
                <p className="text-2xl font-bold leading-7 text-t2">
                    Sync submissions to <span className="text-t1">Twitter</span> for max proliferation.
                </p>
                <div className="relative flex flex-col mt-6">
                    {isVisible ? children : null}
                </div>
                <div className="mt-auto" ref={inViewRef} />
            </div>
        </FeatureCard>
    );
}
