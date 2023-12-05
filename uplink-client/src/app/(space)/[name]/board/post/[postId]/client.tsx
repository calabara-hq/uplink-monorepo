"use client";

import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import MintEdition from "@/ui/Zora/MintEdition";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdOutlineCancelPresentation } from "react-icons/md";

export const BackButton = ({ spaceName }: { spaceName: string }) => {
    const router = useRouter();
    const [hasNavd, setHasNavd] = useState(false);
    const buttonText = hasNavd ? "Back" : "Mint Board";
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const nav = window.sessionStorage.getItem('nav')
            if (nav === 'true') {
                setHasNavd(true);
            }
            else {
                setHasNavd(false);
            }
        }
    }, [])

    const handleNav = () => {
        if (hasNavd) {
            router.back();
        }
        else {
            router.push(`/${spaceName}/board`, { scroll: false });
        }
    };

    return (
        <button className="flex gap-2 w-fit text-t2 hover:text-t1 cursor-pointer p-2 pl-0"
            onClick={handleNav}
        >
            <HiArrowNarrowLeft className="w-6 h-6" />
            <p>{buttonText}</p>
        </button>
    )
}


export const HeaderButtons = ({ spaceName, post, referrer }: { spaceName: string, post: any, referrer: string | null }) => {
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const handleClose = () => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
    }

    return (
        <div className="flex gap-2 ml-auto items-center">
            <ShareButton spaceName={spaceName} post={post} onClick={() => setIsShareModalOpen(true)} />
            <MintButton onClick={() => setIsMintModalOpen(true)} />
            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
                {isShareModalOpen && (
                    <ShareModalContent spaceName={spaceName} post={post} handleClose={handleClose} />
                )}

                {isMintModalOpen && (
                    <MintEdition submission={{ ...post, nftDrop: { dropConfig: post.dropConfig, contractAddress: post.contractAddress, chainId: post.chainId } }} setIsModalOpen={setIsMintModalOpen} />
                )}
            </SubmissionModal>
        </div>
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
