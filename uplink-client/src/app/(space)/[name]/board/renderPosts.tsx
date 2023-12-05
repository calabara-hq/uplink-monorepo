"use client"
import useLiveMintBoard from "@/hooks/useLiveMintBoard"
import { parseIpfsUrl } from "@/lib/ipfs";
import { isMobile } from "@/lib/isMobile";
import { useSession } from "@/providers/SessionProvider";
import { Submission } from "@/types/submission";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import { RenderInteractiveVideoWithLoader } from "@/ui/VideoPlayer";
import MintEdition from "@/ui/Zora/MintEdition";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useInView } from "react-intersection-observer";


const MintBoardPost = ({ submission, footer }: { submission: any, footer: React.ReactNode }) => {
    const parsedConfig = JSON.parse(submission.dropConfig);

    const { name, description, imageURI, animationURI } = parsedConfig;

    const siteImageURI = parseIpfsUrl(imageURI);
    const siteAnimationURI = parseIpfsUrl(animationURI);

    return (
        <div className="bg-base-100 relative flex flex-col gap-2 rounded-lg w-full p-2 ">
            <h2 className="text-lg font-semibold">{name}</h2>
            <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
                <UserAvatar user={submission.author} size={28} />
                <h3 className="break-all italic text-sm">
                    <UsernameDisplay user={submission.author} />
                </h3>
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


const MintButton = ({ onClick, styleOverride }: { onClick: (event?) => void, styleOverride?: string }) => {
    return (
        <button
            className={styleOverride ?? "btn btn-md normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300"}
            onClick={onClick}>
            Mint
        </button>
    )
}

const ShareModalContent = ({ spaceName, post, handleClose }: { spaceName: string, post: any, handleClose: () => void }) => {
    const { status } = useSession();
    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <div className="flex justify-between">
                <h2 className="text-t1 text-xl font-bold">Share</h2>
                <button className="btn btn-ghost btn-sm  ml-auto" onClick={handleClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
            </div>
            {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
                <ShareButton spaceName={spaceName} post={post} onClick={() => { }} />
            </WalletConnectButton>
        </div>
    )
}

const ShareButton = ({ spaceName, post, onClick }: { spaceName: string, post: any, onClick: (event?) => void }) => {
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
            handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/board/post/${post.id}?referrer=${session?.user?.address}`)
        }
        else {
            onClick(event);
        }
    }

    return <button className="btn normal-case btn-ghost" onClick={handleShareClick}>{shareText}</button>

}


const PostSkeleton = () => {
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

export const RenderPosts = ({ spaceName }: { spaceName: string }) => {
    const { liveBoard, isBoardLoading } = useLiveMintBoard(spaceName);
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [focusedSubmission, setFocusedSubmission] = useState(null);
    const isMobileDevice = isMobile();

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
        setFocusedSubmission(null);
    }


    if (isBoardLoading) return <PostSkeleton />
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full p-4 submission-columns auto-rows-fr ">
            {liveBoard?.mintBoard?.submissions?.map((submission) => {
                return (
                    <div className="cursor-pointer hover:shadow-lg hover:shadow-blue-600 rounded-lg"
                        key={submission.id}
                        ref={ref}
                        onMouseEnter={() => !isMobileDevice && setIsActive(true)}
                        onMouseLeave={() => !isMobileDevice && setIsActive(false)}
                        onClick={() => openMintModal(submission)}
                    >
                        <MintBoardPost
                            submission={submission}
                            footer={
                                <div className="flex flex-col w-full">
                                    <div className="p-2 w-full" />
                                    <div className="grid grid-cols-3 w-full items-center">
                                        <div>
                                            <ShareButton spaceName={spaceName} post={submission} onClick={(event) => handleShare(event, submission)} />
                                        </div>
                                        <div className="m-auto">
                                            <MintButton
                                                styleOverride="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                                                                hover:rounded-xl rounded-3xl transition-all duration-300"
                                                onClick={(event) => handleMint(event, submission)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                )
            })}
            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleModalClose} >
                {isMintModalOpen && focusedSubmission && (
                    <MintEdition submission={{ ...focusedSubmission, nftDrop: { dropConfig: focusedSubmission.dropConfig, contractAddress: focusedSubmission.contractAddress, chainId: focusedSubmission.chainId } }} setIsModalOpen={setIsMintModalOpen} />
                )}
                {isShareModalOpen && focusedSubmission && (
                    <ShareModalContent spaceName={spaceName} post={{ ...focusedSubmission, nftDrop: { dropConfig: focusedSubmission.dropConfig, contractAddress: focusedSubmission.contractAddress, chainId: focusedSubmission.chainId } }} handleClose={handleModalClose} />
                )}
            </SubmissionModal>
        </div>
    )
}
