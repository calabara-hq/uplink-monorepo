"use client"
import useLiveMintBoard from "@/hooks/useLiveMintBoard"
import { useTicks } from "@/hooks/useTicks";
import { parseIpfsUrl } from "@/lib/ipfs";
import { isMobile } from "@/lib/isMobile";
import { useSession } from "@/providers/SessionProvider";
import { MintBoardPost } from "@/types/mintBoard";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import { RenderInteractiveVideoWithLoader } from "@/ui/VideoPlayer";
import MintEdition from "@/ui/Zora/MintEdition";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useInView } from "react-intersection-observer";


const MintBoardPost = ({ post, footer }: { post: MintBoardPost, footer: React.ReactNode }) => {

    const { name, description, imageURI, animationURI } = post.edition;

    const siteImageURI = parseIpfsUrl(imageURI);
    const siteAnimationURI = parseIpfsUrl(animationURI);

    return (
        <div className="bg-base-100 relative flex flex-col gap-2 rounded-lg w-full p-2 ">
            <h2 className="text-lg font-semibold">{name}</h2>
            <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
                <UserAvatar user={post.author} size={28} />
                <h3 className="break-all italic text-sm">
                    <UsernameDisplay user={post.author} />
                </h3>
                {post.totalMints > 0 ? (
                    <span className="ml-auto text-t2 text-sm font-medium">
                        {post.totalMints} mints
                    </span>
                ) : (
                    <span />
                )}
            </div>
            {animationURI ? (
                <RenderInteractiveVideoWithLoader videoUrl={siteAnimationURI.gateway} posterUrl={siteAnimationURI.gateway} isActive={true} />
            ) : (
                <ImageWrapper>
                    <Image
                        src={siteImageURI.gateway}
                        draggable={false}
                        alt="submission image"
                        fill
                        sizes="30vw"
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out rounded-xl"
                    />
                </ImageWrapper>
            )
            }
            {footer}
        </div >
    )

}


export const MintButton = ({ onClick, styleOverride }: { onClick: (event?) => void, styleOverride?: string }) => {
    const now = Date.now();
    return (
        <button
            className={styleOverride ?? "btn btn-md normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300"}
            onClick={onClick}>
            Mint
        </button>
    )
}

export const ShareModalContent = ({ spaceName, post, handleClose }: { spaceName: string, post: MintBoardPost, handleClose: () => void }) => {
    const { status, data: session } = useSession();
    const [success, setSuccess] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/post/${post.id}?referrer=${session?.user?.address}`);
        setSuccess(true)
        setTimeout(() => {
            handleClose();
        }, 2000)
    };

    useEffect(() => {
        if (status === 'authenticated') {
            handleShare();
        }
    }, [status])


    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <div className="flex justify-between">
                <h2 className="text-t1 text-xl font-bold">Share</h2>
                <button className="btn btn-ghost btn-sm  ml-auto" onClick={handleClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
            </div>
            {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
                {success && (
                    <div className="flex flex-col gap-2 items-center text-center animate-springUp">
                        <HiCheckBadge className="w-16 h-16 text-success" />
                        <p className="text-t1 text-lg font-bold">Link Copied!</p>
                    </div>
                )}
            </WalletConnectButton>
        </div>
    )
}

export const ShareButton = ({ spaceName, post, onClick, styleOverride }: { spaceName: string, post: MintBoardPost, onClick: (event?) => void, styleOverride?: string }) => {
    const { data: session, status } = useSession();
    const [shareText, setShareText] = useState("Share");

    const handleShare = (event, baseLink) => {
        event.stopPropagation();
        event.preventDefault();
        setShareText("Copied Link");
        navigator.clipboard.writeText(baseLink);
        setTimeout(() => {
            setShareText("Share");
        }, 2000);
    };
    const handleShareClick = (event) => {

        if (status === 'authenticated') {
            handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/post/${post.id}?referrer=${session?.user?.address}`)
        }
        else {
            onClick(event);
        }
    }

    return (
        <button
            className={styleOverride ?? "btn normal-case bg-t2 bg-opacity-5 border-none btn-sm hover:bg-opacity-20 text-t2 hover:text-t1"}
            onClick={handleShareClick}
        >
            {shareText}
        </button>
    )
}




export const PostSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full justify-evenly items-center">
                <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
                    <div className="space-y-2 border-border border p-2 rounded-xl h-[318px] shimmer">
                        <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                        <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                        <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                    </div>
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer">
                        <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                        <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                        <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                    </div>
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer">
                        <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                        <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                        <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                    </div>
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer">
                        <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                        <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                        <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}


export const useMintTimer = (post: MintBoardPost) => {
    const [remainingTime, setRemainingTime] = useState<string | null>(null);
    const mintEnd = Number(post.edition.saleConfig.publicSaleEnd) * 1000;


    useTicks(() => {
        const now = Date.now();
        if (now > mintEnd) return null;

        const seconds = differenceInSeconds(mintEnd, now);
        const minutes = differenceInMinutes(mintEnd, now);
        const hours = differenceInHours(mintEnd, now);
        const days = differenceInDays(mintEnd, now);

        if (days > 0) {
            setRemainingTime(`${days} days`)
        } else if (hours > 0) {
            setRemainingTime(`${hours} hrs`)
        } else if (minutes > 0) {
            setRemainingTime(`${minutes} mins`)
        } else {
            setRemainingTime(seconds > 0 ? `${seconds} s` : null)
        }
    })

    return remainingTime;

}

const PostFooter = ({ post, spaceName, handleMint, handleShare }) => {
    const remainingTime = useMintTimer(post);
    return (
        <div className="flex flex-col w-full">
            <div className="p-2 w-full" />
            <div className="grid grid-cols-[auto_1fr_auto] w-full items-center">
                <div className="w-[60px]">
                    <ShareButton spaceName={spaceName} post={post} onClick={(event) => handleShare(event, post)} />
                </div>
                <div className="m-auto">
                    {remainingTime && <MintButton
                        styleOverride="btn btn-sm w-full normal-case m-auto btn-ghost hover:bg-primary bg-gray-800 text-primary hover:text-black 
                                                                hover:rounded-xl rounded-3xl transition-all duration-300"
                        onClick={(event) => handleMint(event, post)}
                    />
                    }
                </div>
                <div className="ml-auto w-[80px]">
                    {remainingTime && (
                        <div className="flex flex-row gap-2 items-center bg-t2 bg-opacity-5 text-t2 p-2 rounded-lg ">
                            <FaRegClock className="w-4 h-4 text-t2" />
                            <p className="text-sm">{remainingTime}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export const RenderPosts = ({ spaceName, isPopular }: { spaceName: string, isPopular: boolean }) => {
    const { liveBoard, isBoardLoading, optimisticMintUpdate } = useLiveMintBoard(spaceName);
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [focusedSubmission, setFocusedSubmission] = useState(null);
    const isMobileDevice = isMobile();

    const boardPosts = isPopular ? liveBoard?.posts?.sort((a, b) => b.totalMints - a.totalMints) : liveBoard?.posts?.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    useEffect(() => {
        if (window) window.sessionStorage.setItem('nav', 'true')
    }, [])

    const { ref, inView } = useInView({
        threshold: 1,
    });

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (inView && isMobileDevice) {
            setIsActive(true);
        }
    }, [inView, isMobileDevice]);


    const openMintModal = (submission) => {
        setIsMintModalOpen(true)
        setFocusedSubmission(submission)
    }

    const openShareModal = (submission) => {
        setIsShareModalOpen(true)
        setFocusedSubmission(submission)
    }

    const handleMint = (event, submission) => {
        event.stopPropagation();
        event.preventDefault();
        openMintModal(submission);
    }

    const handleShare = (event, submission) => {
        event.stopPropagation();
        event.preventDefault();
        openShareModal(submission);
    }

    const handleModalClose = () => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
        setFocusedSubmission(null);
    }


    if (isBoardLoading) return <PostSkeleton />
    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8 w-full p-4 submission-columns auto-rows-fr ">
        <div className="w-10/12 sm:w-full m-auto grid gap-4 xl:gap-8 submission-columns auto-rows-fr ">

            {boardPosts.map((post) => {
                return (
                    <div className="cursor-pointer hover:shadow-lg hover:shadow-blue-600 rounded-lg "
                        key={post.id}
                        ref={ref}
                        onMouseEnter={() => !isMobileDevice && setIsActive(true)}
                        onMouseLeave={() => !isMobileDevice && setIsActive(false)}
                        onClick={() => openMintModal(post)}
                    >
                        <MintBoardPost
                            post={post}
                            footer={
                                <PostFooter
                                    post={post}
                                    spaceName={spaceName}
                                    handleMint={handleMint}
                                    handleShare={handleShare}
                                />
                            }
                        />
                    </div>
                )
            })}
            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleModalClose} >
                {isMintModalOpen && focusedSubmission && (
                    <MintEdition edition={focusedSubmission.edition} author={focusedSubmission.author} setIsModalOpen={setIsMintModalOpen} referrer={liveBoard.referrer} onMintCallback={(editionId, mintAmount) => optimisticMintUpdate(editionId, mintAmount)} />
                )}
                {isShareModalOpen && focusedSubmission && (
                    <ShareModalContent spaceName={spaceName} post={focusedSubmission} handleClose={handleModalClose} />
                )}
            </SubmissionModal>
        </div>
    )
}
