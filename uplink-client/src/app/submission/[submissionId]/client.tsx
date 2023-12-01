"use client"
import { useSession } from "@/providers/SessionProvider";
import { Submission, isNftSubmission } from "@/types/submission"
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import MintEdition from "@/ui/Zora/MintEdition";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdOutlineCancelPresentation } from "react-icons/md";


export const BackButton = ({ context }: { context: string | null }) => {
    const router = useRouter();
    const decodedContext = context ? decodeURIComponent(Buffer.from(context, 'base64').toString('utf8')) : null
    const buttonText = decodedContext.includes('user') ? "Author Profile" : decodedContext.includes('contest') ? "Back" : "Home"
    const [hasNavd, setHasNavd] = useState(false);

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const nav = window.sessionStorage.getItem('nav')
    //         if (nav === 'true') {
    //             setHasNavd(true);
    //         }
    //         else {
    //             setHasNavd(false);
    //         }
    //     }
    // }, [])

    const handleNav = () => {
        if (hasNavd) {
            router.back();
        }
        else {
            router.push(decodedContext || '/', { scroll: false });
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


export const HeaderButtons = ({ submission, referrer, context }: { submission: Submission, referrer: string | null, context: string | null }) => {
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const handleClose = () => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
    }

    return (
        <div className="flex gap-2 ml-auto items-center">
            <ShareButton submission={submission} onClick={() => setIsShareModalOpen(true)} context={context} />
            <MintButton submission={submission} onClick={() => setIsMintModalOpen(true)} />
            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
                {isShareModalOpen && (
                    <ShareModalContent submission={submission} handleClose={handleClose} context={context} />
                )}

                {isMintModalOpen && (
                    <MintEdition submission={submission} setIsModalOpen={setIsMintModalOpen} referrer={referrer} />
                )}
            </SubmissionModal>
        </div>
    )
}

export const MintButton = ({ submission, onClick, styleOverride }: { submission: Submission, onClick: (event?) => void, styleOverride?: string }) => {
    if (!isNftSubmission(submission)) return null;
    return (
        <button
            className={styleOverride ?? "btn btn-md normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300"}
            onClick={onClick}>
            Mint
        </button>
    )
}

export const ShareModalContent = ({ submission, handleClose, context }: { submission: Submission, handleClose: () => void, context: string }) => {
    const { status } = useSession();
    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <div className="flex justify-between">
                <h2 className="text-t1 text-xl font-bold">Share</h2>
                <button className="btn btn-ghost btn-sm  ml-auto" onClick={handleClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
            </div>
            {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
                <ShareButton submission={submission} onClick={() => { }} context={context} />
            </WalletConnectButton>
        </div>
    )
}

export const ShareButton = ({ submission, onClick, context }: { submission: Submission, onClick: (event?) => void, context: string }) => {
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
        if (!isNftSubmission(submission)) {
            handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${submission.id}?context=${context}`)
        }
        else {
            if (status === 'authenticated') {
                handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${submission.id}?context=${context}?referrer=${session?.user?.address}`)
            }
            else {
                onClick(event);
            }
        }
    }

    return <button className="btn normal-case btn-ghost" onClick={handleShareClick}>{shareText}</button>

}
