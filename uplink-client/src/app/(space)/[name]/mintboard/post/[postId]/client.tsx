"use client";

import SubmissionModal from "@/ui/Submission/SubmissionModal";
import MintEdition from "@/ui/Zora/MintEdition";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MintButton, ShareButton, ShareModalContent, useMintTimer } from "../../renderPosts";
import { FaRegClock } from "react-icons/fa";

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
            router.push(`/${spaceName}/mintboard`, { scroll: false });
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
    const remainingTime = useMintTimer(post);

    const handleClose = () => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
    }

    return (
        <div className="flex gap-2 ml-auto items-center">
            {post.totalMints > 0 ? (
                <span className="ml-auto text-t2 text-sm font-medium">
                    {post.totalMints} mints
                </span>
            ) : (
                <span />
            )}
            {remainingTime && (
                <div className="flex flex-row gap-2 items-center bg-t2 bg-opacity-5 text-t2 p-2 rounded-lg">
                    <FaRegClock className="w-4 h-4 text-t2" />
                    <p className="text-sm">{remainingTime}</p>
                </div>
            )}
            <ShareButton
                spaceName={spaceName}
                post={post}
                onClick={() => setIsShareModalOpen(true)}
                styleOverride="btn normal-case bg-t2 bg-opacity-5 border-none btn-md hover:bg-opacity-20 text-t2 hover:text-t1"
            />
            {remainingTime && <MintButton onClick={() => setIsMintModalOpen(true)} />}

            <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
                {isShareModalOpen && (
                    <ShareModalContent spaceName={spaceName} post={post} handleClose={handleClose} />
                )}

                {isMintModalOpen && (
                    <MintEdition edition={post.edition} author={post.author} setIsModalOpen={setIsMintModalOpen} referrer={referrer} />
                )}
            </SubmissionModal>
        </div>
    )
}
