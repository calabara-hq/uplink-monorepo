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
    const decodedContext = context ? Buffer.from(context, 'base64').toString() : null
    const router = useRouter();
    const handleClick = () => {
        router.push(decodedContext || '/')
    }

    return (
        <Link className="flex gap-2 w-fit text-t2 hover:text-t1 cursor-pointer p-2 pl-0"
            href={decodedContext || '/'}
            scroll={false}
        >
            <HiArrowNarrowLeft className="w-6 h-6" />
            <p>Back</p>
        </Link>
    )
}


export const HeaderButtons = ({ submission, referrer, context }: { submission: Submission, referrer: string | null, context: string | null }) => {
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { data: session, status } = useSession();
    const handleClose = () => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
    }

    return (
        <div className="flex gap-2 ml-auto">
            <ShareButton submission={submission} openShareModal={() => setIsShareModalOpen(true)} />
            <MintButton submission={submission} openMintModal={() => setIsMintModalOpen(true)} />
            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
                {isShareModalOpen && (
                    <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
                        <div className="flex justify-between">
                            <h2 className="text-t1 text-xl font-bold">Share</h2>
                            <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsShareModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
                        </div>
                        {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
                        <WalletConnectButton>
                            <ShareButton submission={submission} openShareModal={() => { }} />
                        </WalletConnectButton>
                    </div>
                )}

                {isMintModalOpen && (
                    <MintEdition submission={submission} setIsModalOpen={setIsMintModalOpen} />
                )}
            </SubmissionModal>
        </div>
    )
}

export const MintButton = ({ submission, openMintModal }: { submission: Submission, openMintModal: () => void }) => {
    if (!isNftSubmission(submission)) return null;
    return <button className="btn btn-md normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300" onClick={openMintModal}>Mint</button>
}

export const ShareButton = ({ submission, openShareModal }: { submission: Submission, openShareModal: () => void }) => {
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
            handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission2/${submission.id}`)
        }
        else {
            if (status === 'authenticated') {
                handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission2/${submission.id}?referrer=${session?.user?.address}`)
            }
            else {
                openShareModal();
            }
        }
    }

    return <button className="btn normal-case btn-ghost" onClick={handleShareClick}>{shareText}</button>

}