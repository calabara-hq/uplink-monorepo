"use client";;
import { useSession } from "@/providers/SessionProvider";
import { Submission } from "@/types/submission"
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { HiCheckBadge } from "react-icons/hi2";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { Boundary } from "@/ui/Boundary/Boundary"
import { Button } from "@/ui/DesignKit/Button";
import { Input } from "@/ui/DesignKit/Input";
import { Modal } from "@/ui/Modal/Modal";


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
                <Input
                    variant="outline"
                    className="w-1/3"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    value={confirmationText}
                    onChange={(e) => { setConfirmationText(e.target.value) }}
                />
                <Button variant="destructive" onClick={onDelete} disabled={!isConfirmed} className="ml-auto">delete post</Button>
            </div>
        </div>
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
            <Modal isModalOpen={isMintModalOpen || isShareModalOpen} onClose={handleClose} >
                {isShareModalOpen && (
                    <ShareModalContent submission={submission} handleClose={handleClose} context={context} />
                )}

            </Modal>
        </div>
    )
}


export const ShareModalContent = ({ submission, handleClose, context }: { submission: Submission, handleClose: () => void, context: string }) => {
    const { status, data: session } = useSession();
    const [success, setSuccess] = useState(false);

    const handleShare = () => {
        const referralLink = session?.user?.address ? `&referrer=${session?.user?.address}` : ''
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
                <Button variant="ghost" className="ml-auto" onClick={handleClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></Button>
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
                        <Button variant="secondary" onClick={handleShare}>Copy Link</Button>
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
        handleShare(event, `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${submission.id}?context=${context}`)
    }

    return <Button variant="ghost" onClick={handleShareClick}>{shareText}</Button>

}
