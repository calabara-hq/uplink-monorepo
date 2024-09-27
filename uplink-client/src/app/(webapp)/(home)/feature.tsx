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
import { RenderMintMedia } from '@/ui/Token/MintUtils';
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { PiInfinity } from "react-icons/pi";
import { TbLoader2 } from "react-icons/tb";
import { LuMinusSquare, LuPlusSquare } from "react-icons/lu";
import UplinkImage from "@/lib/UplinkImage";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper"
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

// export const ContestFeatureCard = () => {


//     return (
//         <div className="flex flex-col gap-6">
//             <h1 className="text-3xl font-bold text-t2 lg:max-w-[30vw] ">
//                 <span className="text-t1">Contests</span> to reward contributors, onboard new creatives, and unlock superusers.
//             </h1>

//             <div className="mockup-window bg-base-100 border border-border w-full p-4">
//                 <div className="w-full ">
//                     <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
//                         <div className="grid grid-cols-1 w-full gap-2">
//                             <div className="w-full ml-auto ">
//                                 <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
//                                     <div className="flex flex-col gap-2 break-word">
//                                         <h2 className="lg:text-3xl text-xl font-[600] text-t1">
//                                             TNS Anniversary art contest
//                                         </h2>
//                                         <div className="flex flex-row gap-2 items-center">
//                                             <div className="relative w-8 h-8">
//                                                 <UplinkImage
//                                                     src="https://uplink.mypinata.cloud/ipfs/QmWwP87gcwrpNxt3MJceooqvsq9LeRAkypCdkif9vwS5uR"
//                                                     alt="Org Avatar"
//                                                     fill
//                                                     className="rounded-full object-cover"
//                                                 />
//                                             </div>
//                                             <p className="card-title text-sm text-t2 hover:underline hover:text-t1">thenounsquare</p>
//                                             <CategoryLabel category="art" />
//                                             <p className={`badge border-none badge-md bg-green-300 text-green-300 bg-opacity-30`}>
//                                                 submitting
//                                             </p>
//                                         </div>
//                                         <div className="grid grid-cols-1">
//                                             <p >🥳 TNS Season 3 Art Contest Bonanza</p>
//                                             <p>We Love Your Art! </p>
//                                             <p>The passing of Prop 434 means 6 more months of TNS Art Contests! </p>
//                                             <p>Celebrate with us by submitting something Nounish.</p>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 items-start  w-full gap-2">
//                                         <ImageWrapper>
//                                             <UplinkImage
//                                                 src="https://uplink.mypinata.cloud/ipfs/QmbZXDcXcL3DKBMnSBht8witDCMissHdsb2BqW2vqvp2hE"
//                                                 alt="contest image"
//                                                 sizes="20vw"
//                                                 fill
//                                                 className="object-contain rounded-xl"
//                                             />
//                                         </ImageWrapper>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="w-full h-0.5 bg-base-200" />
//                         </div>

//                         <div className="flex flex-col gap-4 w-full">
//                             <div className="flex w-full justify-evenly items-center">
//                                 <div className="w-10/12 sm:w-full m-auto grid gap-4 homepage-sub-columns auto-rows-fr">
//                                     <CardSubmission
//                                         handleCardClick={() => { }}
//                                         submission={
//                                             {
//                                                 "id": "7733",
//                                                 "contestId": "263",
//                                                 "totalVotes": "73",
//                                                 "rank": "1",
//                                                 "created": "2023-11-23T08:33:53.022Z",
//                                                 "type": "twitter",
//                                                 "url": "https://uplink.mypinata.cloud/ipfs/QmZJV7cojpmPEXDK45txvaSqfSzcqj4X5oSdfvxYhkDJam",
//                                                 "version": "uplink-v1",
//                                                 "edition": null,
//                                                 /*@ts-ignore*/
//                                                 "author": {
//                                                     "id": "554",
//                                                     "address": "0x72D4e991040e3B65FdDbE5f340f65Cf03C506e6F",
//                                                     "userName": null,
//                                                     "displayName": null,
//                                                     "profileAvatar": null
//                                                 },
//                                                 "data": {
//                                                     "title": "TNS S3",
//                                                     "thread": [
//                                                         {
//                                                             "text": "Season 3 with TNS lezgoooo!!! 🥳",
//                                                             "previewAsset": "https://uplink.mypinata.cloud/ipfs/QmRDw9wkBDtSbHYFdRjruWgdMD8uVhUqx5wo3JnA49oQU6",
//                                                             "assetType": "image/png",
//                                                             "assetSize": 4505009
//                                                         }
//                                                     ],
//                                                     "type": "image"
//                                                 }
//                                             }
//                                         }
//                                     />
//                                     <CardSubmission
//                                         handleCardClick={() => { }}
//                                         submission={
//                                             {
//                                                 "id": "7714",
//                                                 "contestId": "263",
//                                                 "totalVotes": "49",
//                                                 "rank": "2",
//                                                 "created": "2023-11-22T03:27:50.542Z",
//                                                 "type": "twitter",
//                                                 "url": "https://uplink.mypinata.cloud/ipfs/QmWxJ5nJd14uEnHVvRpmmzLPHbaHukN1pm9TBLWHrQ41SU",
//                                                 "version": "uplink-v1",
//                                                 "edition": null,
//                                                 /*@ts-ignore*/
//                                                 "author": {
//                                                     "id": "147",
//                                                     "address": "0xe851ED2a5816dC03887dFD2713dcD4217425DFe5",
//                                                     "userName": null,
//                                                     "displayName": null,
//                                                     "profileAvatar": null
//                                                 },
//                                                 "data": {
//                                                     "title": "N:O:U:N:2:D",
//                                                     "thread": [
//                                                         {
//                                                             "text": "Finished my @thenounsquare\n Art contest entry! \n\nFrame by frame 2D animation done live on twitch.\n\nThanks for tuning in and sharing.",
//                                                             "previewAsset": "https://uplink.mypinata.cloud/ipfs/QmNgPbgipKyh5Cu4igtuXYkF8rszunNo17upJQXUPsWEnH",
//                                                             "assetType": "image/gif",
//                                                             "assetSize": 1854450
//                                                         }
//                                                     ],
//                                                     "type": "image"
//                                                 }
//                                             }

//                                         }
//                                     />
//                                     <CardSubmission
//                                         handleCardClick={() => { }}
//                                         submission={
//                                             {
//                                                 "id": "7728",
//                                                 "contestId": "263",
//                                                 "totalVotes": "47",
//                                                 "rank": "3",
//                                                 "created": "2023-11-22T22:21:51.873Z",
//                                                 "type": "twitter",
//                                                 "url": "https://uplink.mypinata.cloud/ipfs/QmdH1gmW3fvzj3Zj1RTWrFzf6CoPj2SFQVyyDYVYf9KLae",
//                                                 "version": "uplink-v1",
//                                                 "edition": null,
//                                                 /*@ts-ignore*/
//                                                 "author": {
//                                                     "id": "552",
//                                                     "address": "0x7ce294D2Bcb2dE76a15fcf7055b0B14253Dd3B33",
//                                                     "userName": null,
//                                                     "displayName": null,
//                                                     "profileAvatar": null
//                                                 },
//                                                 "data": {
//                                                     "title": "Congratulations!",
//                                                     "thread": [
//                                                         {
//                                                             "text": " @thenounsquare\nBen o’ Clock at your desktop celebrating the proposal approved! 🎉 💛 ⌐◨-◨ \n",
//                                                             "previewAsset": "https://uplink.mypinata.cloud/ipfs/QmaTT5w1qMH1fui6kTgJHZYwPjZdmLzunye2aVkfkEgjBr",
//                                                             "assetType": "image/jpeg",
//                                                             "assetSize": 845756
//                                                         }
//                                                     ],
//                                                     "type": "image"
//                                                 }
//                                             }
//                                         }
//                                     />
//                                     <CardSubmission
//                                         handleCardClick={() => { }}
//                                         submission={
//                                             {
//                                                 "id": "7710",
//                                                 "contestId": "263",
//                                                 "totalVotes": "38",
//                                                 "rank": "4",
//                                                 "created": "2023-11-21T00:39:13.119Z",
//                                                 "type": "twitter",
//                                                 "url": "https://uplink.mypinata.cloud/ipfs/QmX4s19s1Xr6tzG9nyVyiR4JrUUrWBHA6Z8hWs6Mz1zTs3",
//                                                 "version": "uplink-v1",
//                                                 "edition": null,
//                                                 /*@ts-ignore*/
//                                                 "author": {
//                                                     "id": "235",
//                                                     "address": "0xA09AA75da763D4aEB692672897C057786Cdd258B",
//                                                     "userName": null,
//                                                     "displayName": null,
//                                                     "profileAvatar": null
//                                                 },
//                                                 "data": {
//                                                     "title": "gm☕☀ awesome fellas!",
//                                                     "thread": [
//                                                         {
//                                                             "text": "something NOUNISH! ⌐◨-◨",
//                                                             "previewAsset": "https://uplink.mypinata.cloud/ipfs/QmbxaKBrDz7cXvsZmo85giQr1upZKk6dqC1JJpVJqDvNFw",
//                                                             "videoAsset": "https://uplink.mypinata.cloud/ipfs/QmW2eNthEddhEHzuGfy1sgNVocYTgcq1Bjy5rUMGju5msW",
//                                                             "assetType": "video/mp4",
//                                                             "assetSize": 4054436
//                                                         }
//                                                     ],
//                                                     "type": "video"
//                                                 }
//                                             }
//                                         }
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


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

// export const MintboardCard = () => {
//     return (
//         <div className="w-full grid grid-cols-1 xl:grid-cols-[70%_30%] items-center gap-4 mt-36 sm:mt-24">
//             <FeatureCard>
//                 <div className="flex flex-col gap-2 relative w-full  bg-base-100 rounded-xl p-4 shadow-base shadow-lg">
//                     <h2 className="text-t1 text-xl font-bold">Mint Drop</h2>
//                     <div className="p-2" />
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="items-center justify-center">
//                             <RenderMintMedia imageURI="https://uplink.mypinata.cloud/ipfs/QmTzwdiWEbgo2AmRMtn1AsHQed4XyJvieYsaNwYEDY8ivP" animationURI="" />
//                         </div>
//                         <div className="bg-black items-start flex flex-col gap-8 relative">
//                             <div className="flex flex-col gap-2">
//                                 <p className="line-clamp-3 font-bold text-lg break-all">Based Management</p>
//                                 <div className="flex items-center text-sm text-t2 bg-base rounded-lg p-1 pr-2 w-fit">
//                                     <div style={{ width: '28px' }}>
//                                         <ImageWrapper>
//                                             <UplinkImage src="https://uplink.mypinata.cloud/ipfs/QmP4anosdNmt4PdGTF134UxUrxcJq9TCWbTSaMy98jubPP" alt="avatar" className="rounded-lg" fill blur sizes="5vw" />
//                                         </ImageWrapper>
//                                     </div>
//                                     <span className="font-bold italic">LGHT</span>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col gap-2 w-full">
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <div className="flex flex-col justify-start">
//                                         <p className="text-t2">Network</p>
//                                         <div className="flex gap-2 items-center">
//                                             <p className="text-t1 font-bold">Base</p>
//                                             <ChainLabel chainId={8453} px={16} />
//                                         </div>

//                                     </div>
//                                     <div className="flex flex-col justify-start m-auto">
//                                         <p className="text-t2">Minting</p>
//                                         <div className="flex gap-2 items-center">
//                                             <p className="font-bold text-t1">Now</p>
//                                             <span className="relative flex h-3 w-3">
//                                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
//                                                 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col">
//                                         <p className="text-t2">Until</p>
//                                         <p className="font-bold text-t1">Forever</p>
//                                     </div>
//                                     <div className="flex flex-col">
//                                         <p className="text-t2">Price</p>
//                                         <p className="font-bold text-t1">Free</p>
//                                     </div>
//                                     <div className="flex flex-col justify-start m-auto">
//                                         <p className="text-t2">Minted</p>
//                                         <div className="flex gap-1 items-center">
//                                             <p className="text-t1 font-bold">100</p>
//                                             <p className="text-t1">/</p>
//                                             <PiInfinity className="w-6 h-6 text-t1" />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="p-1" />
//                                 <div className="w-full bg-base-100 h-[1px]" />

//                                 <div className="flex flex-col w-full md:max-w-[250px] ml-auto mt-auto gap-2">
//                                     <div className="flex items-center w-full">
//                                         <button className="btn bg-base rounded-r-none border-none normal-case m-auto" onClick={() => { }}><LuMinusSquare className="w-4 h-4" /></button>
//                                         <div className="w-full">
//                                             <input
//                                                 readOnly
//                                                 type="number"
//                                                 onWheel={(e) => e.currentTarget.blur()}
//                                                 value={1}
//                                                 className="input w-[1px] min-w-full rounded-none focus:ring-0 focus:border-none focus:outline-none text-center"
//                                             />
//                                         </div>
//                                         <button className="btn rounded-l-none bg-base border-none normal-case ml-auto" onClick={() => { }}><LuPlusSquare className="w-4 h-4" /></button>
//                                     </div>
//                                     <button className="btn btn-primary normal-case w-full" disabled onClick={() => { }}>
//                                         <div className="flex gap-2 items-center">
//                                             <p className="text-sm">Minting</p>
//                                             <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
//                                         </div>
//                                     </button>
//                                     < div className="relative w-full" >
//                                         <button className="flex items-center w-full"
//                                             onClick={() => { }}
//                                         >
//                                             <p className="text-t2">{`Fee: 0.000777 ETH`}</p>
//                                             <span className="ml-auto"><LuPlusSquare className="w-4 h-4" /></span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div >
//                 </div >
//             </FeatureCard>
//             <h1 className="text-3xl font-bold text-t2 lg:max-w-[30vw] ">
//                 <span className="text-t1">The Mintboard.</span> <br /> A collective canvas for onchain creation.
//             </h1>
//         </div>
//     )
// }

// export const MintboardSubCardA = () => {
//     return (
//         <FeatureCard>
//             <div className="p-6 min-h-[350px] w-full sm:p-10 md:min-h-[450px] flex flex-col gap-4">
//                 <p className="text-2xl font-bold leading-7 text-t2">
//                     Brain to <span className="text-t1">onchain</span> in 2 clicks.
//                 </p>
//                 <Boundary size="small">
//                     <div className="flex flex-col gap-6 w-full m-auto">
//                         <div className="bg-base-200 p-4 rounded-lg">
//                             <p className="text-t1">Post to the Based Management mintboard and earn 0.000333 ETH for every mint!</p>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                             <div className="flex flex-col items-center">
//                                 <div className="relative">
//                                     <button
//                                         className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
//                                         onClick={() => { }}
//                                     >
//                                         <HiOutlineTrash className="w-5 h-5" />
//                                     </button>
//                                     <UplinkImage
//                                         src="https://uplink.mypinata.cloud/ipfs/QmTzwdiWEbgo2AmRMtn1AsHQed4XyJvieYsaNwYEDY8ivP"
//                                         alt="Media"
//                                         width={300}
//                                         height={300}
//                                         className="rounded-lg object-contain"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <button className="btn btn-primary normal-case">
//                             Post
//                         </button>
//                     </div>
//                 </Boundary>
//             </div>
//         </FeatureCard>
//     )
// }

// export const MintboardSubCardB = () => {
//     return (
//         <div className="flex flex-col gap-4">
//             <FeatureCard>
//                 <div className="p-6 w-full sm:p-10  flex flex-col gap-4">
//                     <p className="text-2xl font-bold leading-7 text-t2 ">
//                         Split <span className="text-t1">protocol rewards</span> with your users on every mint.
//                     </p>
//                     <div className="flex flex-row gap-6 items-center m-auto">

//                         <Image
//                             src={uplinkLogo}
//                             alt="logo"
//                             width={75}
//                             height={75}
//                             className="grayscale"
//                         />

//                         <div className="flex flex-col gap-2 mt-6 w-full">
//                             <div className="flex flex-row gap-6">
//                                 <div className="wavy edge-mask w-[100px] md:w-[200px] lg:w-[100px] xl:w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
//                                 <div className="font-bold text-xl">Creator</div>
//                             </div>
//                             <div className="flex flex-row gap-6">
//                                 <div className="wavy edge-mask w-[100px] md:w-[200px] lg:w-[100px] xl:w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
//                                 <div className="font-bold text-xl">Referrer</div>
//                             </div>
//                             <div className="flex flex-row gap-6">
//                                 <div className="wavy edge-mask w-[100px] md:w-[200px] lg:w-[100px] xl:w-[200px] h-[60px] rotate-180" data-text="aaaaaaaaaaaaaaaaaaa" />
//                                 <div className="font-bold text-xl">Treasury</div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </FeatureCard>
//             <div className="grid grid-cols-3 gap-2 text-t2 testimonial-columns auto-rows-fr">
//                 <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
//                     <p>Smooth as butter, wow.</p>
//                 </div>
//                 <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
//                     <p>{`I've minted on mint.fun, Source, Zora & OpenSea - this was the best experience yet.`}</p>
//                 </div>
//                 <div className="border border-border rounded-xl p-4 shadow-black shadow-lg">
//                     <p>Congrats on easiest minting experience on the planet. So minty.</p>
//                 </div>
//             </div>
//         </div>
//     )
// }


