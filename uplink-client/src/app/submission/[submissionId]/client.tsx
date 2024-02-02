"use client"
import { VoteActionProps } from "@/hooks/useVote";
import { AdminWrapper } from "@/lib/AdminWrapper";
import { useContestState } from "@/providers/ContestStateProvider";
import { useSession } from "@/providers/SessionProvider";
import { Submission, isNftSubmission } from "@/types/submission"
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import MintEdition from "@/ui/Zora/MintEdition";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLayerPlus } from "react-icons/bi";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { HiCheckBadge } from "react-icons/hi2";
import { MdOutlineCancelPresentation, MdOutlineSettings } from "react-icons/md";
import { Boundary } from "@/ui/Boundary/Boundary"


export const AddToCartButton = ({ submission, voteActions }: { submission: Submission, voteActions: VoteActionProps }) => {
    const { addProposedVote, currentVotes, proposedVotes } = voteActions;
    const { contestState } = useContestState();

    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const isSelected = currentVotes.some(vote => vote.submissionId === submission.id) || proposedVotes.some(vote => vote.id === submission.id)
        setIsSelected(isSelected);
    }, [currentVotes, proposedVotes, submission.id]);

    const handleSelect = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (!isSelected) {
            addProposedVote(submission);
        }
        setIsSelected(!isSelected);
    };

    if (contestState === "voting") {

        if (isSelected) {
            return (
                <span
                    className="tooltip tooltip-top pr-2.5"
                    data-tip={"Selected"}
                >
                    <HiCheckBadge className="h-7 w-7 text-warning" />
                </span>
            );
        } else
            return (
                <span className="tooltip tooltip-top " data-tip={"Add to cart"}>
                    <button
                        className="btn btn-ghost btn-sm text-t2 w-fit hover:bg-warning hover:bg-opacity-30 hover:text-warning"
                        onClick={handleSelect}
                    >
                        <BiLayerPlus className="h-6 w-6 " />
                    </button>
                </span>
            );
    }

    return null;
};


export const ManageModalContent = ({ onDelete }: { onDelete: () => void }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);


    useEffect(() => {
        if (confirmationText === 'delete') {
            return setIsConfirmed(true)
        }
        setIsConfirmed(false)
    }, [confirmationText])

    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <h2 className="text-t1 text-xl font-bold">Manage Post</h2>
            <Boundary size="small">
                <p>Once deleted, this post will be gone forever. Type <b>delete</b> if you understand</p>
            </Boundary>
            <div className="flex flex-row items-center">
                <input
                    className="input input-bordered w-1/3"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    value={confirmationText}
                    onChange={(e) => { setConfirmationText(e.target.value) }}
                />
                <button onClick={onDelete} disabled={!isConfirmed} className="ml-auto btn btn-active text-error w-fit hover:bg-error bg-opacity-30 hover:bg-opacity-30 text-error border-none normal-case">delete post</button>
            </div>
        </div>
    )
}


export const AdminButton = ({ contestId, submission, onClick }: { contestId: string, submission: Submission, onClick: (event?) => void }) => {
    const { contestAdmins } = useContestState();

    return (
        <AdminWrapper admins={contestAdmins.map(admin => { return { address: admin } })}>
            <button onClick={onClick} className="btn btn-ghost text-t2 w-fit" >
                <MdOutlineSettings className="h-6 w-6" />
            </button>
        </AdminWrapper>
    )
}




export const BackButton = ({ context }: { context: string | null }) => {
    const router = useRouter();
    const decodedContext = context ? decodeURIComponent(Buffer.from(context, 'base64').toString('utf8')) : ''
    const buttonText = decodedContext.includes('user') ? "Author Profile" : decodedContext.includes('contest') ? "Back" : "Home"
    const [hasNavd, setHasNavd] = useState(false);

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
                    <MintEdition edition={submission.edition} author={submission.author} setIsModalOpen={setIsMintModalOpen} referrer={referrer} />
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
    const { status, data: session } = useSession();
    const [success, setSuccess] = useState(false);

    const handleShare = () => {
        const referralLink = session?.user?.address ? `&refferrer=${session?.user?.address}` : ''
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${submission.id}?context=${context}${referralLink}`);
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
            {status !== 'authenticated' && <p className="text-t2">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
                {success && (
                    <div className="flex flex-col gap-2 items-center text-center animate-springUp">
                        <HiCheckBadge className="w-16 h-16 text-success" />
                        <p className="text-t1 text-lg font-bold">Link Copied!</p>
                    </div>
                )}
            </WalletConnectButton>
            {status !== 'authenticated' &&
                <>
                    <div className="w-full h-0.5 bg-base-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-t2">Or just copy link</p>
                        <button className="secondary-btn btn-sm" onClick={handleShare}>Copy Link</button>
                    </div>
                </>
            }
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
                handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${submission.id}?context=${context}&referrer=${session?.user?.address}`)
            }
            else {
                onClick(event);
            }
        }
    }

    return <button className="btn normal-case btn-ghost" onClick={handleShareClick}>{shareText}</button>

}
