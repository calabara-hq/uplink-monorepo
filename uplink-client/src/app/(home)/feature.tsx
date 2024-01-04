"use client";

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
import { UsernameDisplay, UserAvatar } from "@/ui/AddressDisplay/AddressDisplay";
import { BiPlusCircle } from "react-icons/bi";
import { HiPhoto } from "react-icons/hi2";
import { HiCheckBadge, HiOutlineLockClosed, HiOutlineTrash } from "react-icons/hi2";
import { AddFundsButton, RenderMintMedia, SwitchNetworkButton } from "@/ui/Zora/common";
import { getChainName } from "@/lib/chains/supportedChains";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { TokenContractApi } from "@/lib/contract";
import { PiInfinity } from "react-icons/pi";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import { Decimal } from "decimal.js";
import { LuMinusSquare, LuPlusSquare } from "react-icons/lu";
import UplinkImage from "@/lib/UplinkImage";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper"
import { useInView } from "react-intersection-observer";
import { Boundary } from "@/ui/Boundary/Boundary";
import uplinkLogo from "@/../public/uplink-logo.svg";

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
            className="animated-feature-cards relative w-full shadow-lg"
            onMouseMove={handleMouseMove}
            style={
                {
                    '--x': useMotionTemplate`${mouseX}px`,
                    '--y': useMotionTemplate`${mouseY}px`,
                } as WrapperStyle
            }
        >
            <div className='group w-full rounded-xl border border-base-100 bg-gradient-to-b transition duration-300 bg-base-100 bg-opacity-80'>
                {children}
            </div>
        </motion.div>
    );
}

export const ContestFeatureCard = () => {

    return (
        <FeatureCard>
            <div className="p-6 min-h-[750px] w-full sm:p-10 md:min-h-[450px] grid grid-cols-1 grid-rows-[25%_auto] md:grid-rows-1 md:grid-cols-[45%_auto] gap-4">
                <div className="flex flex-col w-full h-full justify-center">
                    <p className="text-2xl font-bold leading-7 text-t2 max-w-[80%]">
                        <span className="text-t1">Contests</span> to reward contributors, onboard new creatives, and unlock superusers.
                    </p>
                </div>
                {/* <div className="relative flex flex-col h-full">
                    <DelayedGridLayout gridStyle="absolute top-0 left-0 md:right-0 w-[600px] h-full grid grid-cols-3 auto-rows-fr gap-2 !rotate-[-20deg]">
                        {steps.map((step, idx) => {
                            return (
                                <DelayedGridItem
                                    key={idx}
                                    gridItemStyle="box border border-border p-2 rounded-xl flex flex-col gap-2 items-center justify-evenly"
                                    delay={idx * 0.2}
                                >
                                    <h2 className="font-bold text-t1 text-xl text-center">
                                        {step.name}
                                    </h2>
                                    {step.icon}
                                </DelayedGridItem>
                            );
                        })}
                    </DelayedGridLayout>
                </div> */}
            </div>
        </FeatureCard>
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
            <div className="min-h-[450px] w-full md:min-h-[450px] grid grid-cols-1 grid-rows-[25%_auto] gap-4">
                <p className="p-6 sm:p-10 text-2xl font-bold leading-7 text-t2">
                    <span className="text-t1">Ultimate flexibility</span> to reward contributors, onboard new creatives, and unlock superusers.
                </p>
                <div className="relative flex flex-col overflow-hidden">
                    <DelayedGridLayout gridStyle="absolute top-0 left-0 md:right-0 w-[600px] h-[400px] h-full grid grid-cols-3 auto-rows-fr gap-2 !rotate-[-20deg]">
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
        threshold: 0.17,
        triggerOnce: false,
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (inView) setIsVisible(true);
        else setIsVisible(false);
    }, [inView]);

    return (
        <FeatureCard>
            <div className="p-6 min-h-[350px] w-full sm:p-10 md:min-h-[450px] flex flex-col gap-4">
                <p className="text-2xl font-bold leading-7 text-t2">
                    <span className="text-t1">Twitter mode</span> for max proliferation.
                </p>
                <div className="relative flex flex-col h-full" ref={inViewRef}>
                    {isVisible ? children : null}
                </div>
            </div>
        </FeatureCard>
    );
}

export const MintboardCard = () => {
    return (
        <div className="w-full flex flex-col gap-4 mt-24">
            {/* <div className="wavy w-[200px] h-[75px]" data-text="aaaaaaaaaaaaaaaaaaa" /> */}
            {/* <div className="w-1 h-[150px] bg-base-200 rounded-xl"/> */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-[450px_auto] items-center gap-2">
                <p className="text-2xl font-bold leading-7 text-t2 ">
                    <span className="text-t1">The Mintboard.</span> <br /> A collective canvas for onchain creation.
                </p>
                <FeatureCard>
                    <div className="flex flex-col gap-2 relative w-full  bg-black opacity-70 rounded-xl p-4 ">
                        <h2 className="text-t1 text-xl font-bold">Mint Drop</h2>
                        <div className="p-2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="items-center justify-center">
                                <RenderMintMedia imageURI="https://uplink.mypinata.cloud/ipfs/QmTzwdiWEbgo2AmRMtn1AsHQed4XyJvieYsaNwYEDY8ivP" animationURI="" />
                            </div>
                            <div className="bg-black-200 items-start flex flex-col gap-8 relative">
                                <div className="flex flex-col gap-2">
                                    <p className="line-clamp-3 font-bold text-lg break-all">Based Management</p>
                                    <div className="flex items-center text-sm text-t2 bg-base rounded-lg p-1 pr-2 w-fit">
                                        <div style={{ width: '28px' }}>
                                            <ImageWrapper>
                                                <UplinkImage src="https://uplink.mypinata.cloud/ipfs/QmP4anosdNmt4PdGTF134UxUrxcJq9TCWbTSaMy98jubPP" alt="avatar" className="rounded-lg" fill blur sizes="5vw" />
                                            </ImageWrapper>
                                        </div>
                                        <span className="font-bold italic">LGHT</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col justify-start">
                                            <p className="text-t2">Network</p>
                                            <div className="flex gap-2 items-center">
                                                <p className="text-t1 font-bold">Base</p>
                                                <ChainLabel chainId={8453} px={16} />
                                            </div>

                                        </div>
                                        <div className="flex flex-col justify-start m-auto">
                                            <p className="text-t2">Minting</p>
                                            <div className="flex gap-2 items-center">
                                                <p className="font-bold text-t1">Now</p>
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-t2">Until</p>
                                            <p className="font-bold text-t1">Forever</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-t2">Price</p>
                                            <p className="font-bold text-t1">Free</p>
                                        </div>
                                        <div className="flex flex-col justify-start m-auto">
                                            <p className="text-t2">Minted</p>
                                            <div className="flex gap-1 items-center">
                                                <p className="text-t1 font-bold">100</p>
                                                <p className="text-t1">/</p>
                                                <PiInfinity className="w-6 h-6 text-t1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1" />
                                    <div className="w-full bg-base-100 h-[1px]" />

                                    <div className="flex flex-col w-full md:max-w-[250px] ml-auto mt-auto gap-2">
                                        <div className="flex items-center w-full">
                                            <button className="btn bg-base rounded-r-none border-none normal-case m-auto" onClick={() => { }}><LuMinusSquare className="w-4 h-4" /></button>
                                            <div className="w-full">
                                                <input
                                                    readOnly
                                                    type="number"
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    value={1}
                                                    className="input w-[1px] min-w-full rounded-none focus:ring-0 focus:border-none focus:outline-none text-center"
                                                />
                                            </div>
                                            <button className="btn rounded-l-none bg-base border-none normal-case ml-auto" onClick={() => { }}><LuPlusSquare className="w-4 h-4" /></button>
                                        </div>
                                        <button className="btn btn-primary normal-case w-full" disabled onClick={() => { }}>
                                            <div className="flex gap-2 items-center">
                                                <p className="text-sm">Minting</p>
                                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                            </div>
                                        </button>
                                        < div className="relative w-full" >
                                            <button className="flex items-center w-full"
                                                onClick={() => { }}
                                            >
                                                <p className="text-t2">{`Fee: 0.000777 ETH`}</p>
                                                <span className="ml-auto"><LuPlusSquare className="w-4 h-4" /></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </FeatureCard>
            </div>
        </div>
    )
}

export const MintboardSubCardA = () => {
    return (
        <FeatureCard>
            <div className="p-6 min-h-[350px] w-full sm:p-10 md:min-h-[450px] flex flex-col gap-4">
                <p className="text-2xl font-bold leading-7 text-t2">
                    Brain to <span className="text-t1">onchain</span> in 2 clicks.
                </p>
                <Boundary size="small">
                    <div className="flex flex-col gap-6 w-full m-auto">
                        <div className="bg-base-200 p-4 rounded-lg">
                            <p className="text-t1">Post to the Based Management mintboard and earn 0.000333 ETH for every mint!</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <button
                                        className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
                                        onClick={() => { }}
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                    <UplinkImage
                                        src="https://uplink.mypinata.cloud/ipfs/QmTzwdiWEbgo2AmRMtn1AsHQed4XyJvieYsaNwYEDY8ivP"
                                        alt="Media"
                                        width={300}
                                        height={300}
                                        className="rounded-lg object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary normal-case">
                            Post
                        </button>
                    </div>
                </Boundary>
            </div>
        </FeatureCard>
    )
}

export const MintboardSubCardB = () => {
    return (
        <div className="flex flex-col gap-4">
            <FeatureCard>
                <div className="p-6 w-full sm:p-10  flex flex-col gap-4">
                    <p className="text-2xl font-bold leading-7 text-t2 ">
                        Split <span className="text-t1">protocol rewards</span> with your users on every mint.
                    </p>
                    <div className="flex flex-row gap-6 items-center m-auto">

                        <UplinkImage
                            src={uplinkLogo}
                            alt="logo"
                            width={75}
                            height={75}
                            style={{ filter: "grayscale(100%)" }}
                        />

                        <div className="flex flex-col gap-2 mt-6">
                            <div className="flex flex-row gap-6">
                                <div className="wavy edge-mask w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
                                <div className="font-bold text-xl">Creator</div>
                            </div>
                            <div className="flex flex-row gap-6">
                                <div className="wavy edge-mask w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
                                <div className="font-bold text-xl">Referrer</div>
                            </div>
                            <div className="flex flex-row gap-6">
                                <div className="wavy edge-mask w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
                                <div className="font-bold text-xl">Treasury</div>
                            </div>
                        </div>

                    </div>
                </div>
            </FeatureCard>
            <div className="grid grid-cols-3 gap-2 text-t2">
                <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
                    <p>Smooth as butter, wow.</p>
                </div>
                <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
                    <p>{`I've minted on mint.fun, Source, Zora & OpenSea - this was the best experience yet.`}</p>
                </div>
                <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
                    <p>Congrats on easiest minting experience on the planet. So minty.</p>
                </div>
            </div>
        </div>
    )
}


