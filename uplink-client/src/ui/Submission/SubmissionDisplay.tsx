"use client";
import { useEffect, useRef, useState } from "react";
import CardSubmission from "./CardSubmission";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import SubmissionModal from "./SubmissionModal";
import { Submission } from "@/types/submission";
import MintEdition from "../Zora/MintEdition";
import Swiper from "../Swiper/Swiper";
import SwiperSlide from "../Swiper/SwiperSlide";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import useMe from "@/hooks/useMe";
import { useVote, VoteActionProps } from "@/hooks/useVote";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { MintButton, ShareButton, ShareModalContent, AddToCartButton } from "@/app/submission/[submissionId]/client";
import { useSession } from "@/providers/SessionProvider";
import ExpandedSubmission from "./ExpandedSubmission";
import { HiArrowNarrowLeft } from "react-icons/hi";


export const SubmissionDisplaySkeleton = () => {
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
};


export const RenderPopularSubmissions = ({ submissions }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (window) window.sessionStorage.setItem('nav', 'true')
  }, [])


  const router = useRouter();
  const { status } = useSession();

  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
    setSubmission(submission)
  }

  const openShareModal = (submission: Submission) => {
    setIsShareModalOpen(true)
    setSubmission(submission)
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


  const handleClose = () => {
    setIsMintModalOpen(false)
    setIsMintModalOpen(false)
    setSubmission(null);
  }

  // base64 the homepage context
  const context = Buffer.from(encodeURIComponent('/')).toString('base64')

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={16}
        slidesPerView={3.2} // adjusted for peek
        slidesPerGroup={3}
        breakpoints={{
          320: {
            slidesPerView: 1.2, // adjusted for peek
            slidesPerGroup: 1,
            spaceBetween: 10,
          },
          500: {
            slidesPerView: 2.2, // adjusted for peek
            slidesPerGroup: 2,
            spaceBetween: 10,
          },
          850: {
            slidesPerView: 3.2, // adjusted for peek
            slidesPerGroup: 3,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 4.2, // adjusted for peek
            slidesPerGroup: 4,
            spaceBetween: 16,
          },
        }}
      >
        {submissions.map((submission: Submission, index: number) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full animate-scrollInX">
              <CardSubmission
                key={index}
                interactive={true}
                submission={submission}
                handleCardClick={(submission) => router.push(`/submission/${submission.id}?context=${context}`)}

                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="grid grid-cols-3 w-full items-center">
                      <ShareButton submission={submission} onClick={(event) => handleShare(event, submission)} context={context} />
                      <MintButton
                        styleOverride="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                        hover:rounded-xl rounded-3xl transition-all duration-300"
                        submission={submission}
                        onClick={(event) => handleMint(event, submission)}
                      />
                    </div>
                  </div>
                }
              />
            </div>
          </SwiperSlide>
        ))}
        <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
          {isShareModalOpen && submission && (
            <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
              <div className="flex justify-between">
                <h2 className="text-t1 text-xl font-bold">Share</h2>
                <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsShareModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
              </div>
              {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
              <WalletConnectButton>
                <ShareButton submission={submission} onClick={() => { }} context={context} />
              </WalletConnectButton>
            </div>
          )}

          {isMintModalOpen && submission && (
            <MintEdition edition={submission.edition} author={submission.author} setIsModalOpen={setIsMintModalOpen} />
          )}
        </SubmissionModal>
      </Swiper>
    </div>
  )
}

export const UserSubmissionDisplay = ({ user }: { user: User }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const { me, getFallbackData } = useMe(user.address);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (window) window.sessionStorage.setItem('nav', 'true')
  }, [])

  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
    setSubmission(submission)
  }

  const openShareModal = (submission: Submission) => {
    setIsShareModalOpen(true)
    setSubmission(submission)
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


  const handleClose = () => {
    setIsShareModalOpen(false)
    setIsMintModalOpen(false)
    setSubmission(null);
  }




  const isAnonSubmission = (submission: Submission) => {
    // we can't expose the submission author on backwards nav (i.e. authorized user shared their own stuff)
    // we need to check if the original submission (under the user) is returned or not
    // to do so, we need to get the fallback data from the user swr hook 

    const fallbackData = getFallbackData();
    const [sub] = fallbackData.submissions.filter((el: Submission) => el.id === submission.id)
    return !sub
  }



  const calcNavContext = (submission: Submission) => {
    if (isAnonSubmission(submission)) {
      return Buffer.from(encodeURIComponent(`/contest/${submission.contestId}`)).toString('base64')
    }
    else {
      return Buffer.from(encodeURIComponent(`/user/${user.address}`)).toString('base64')
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
          {user.submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                interactive={true}
                submission={submission}
                handleCardClick={(submission) => router.push(`/submission/${submission.id}?context=${calcNavContext(submission)}`)}
                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="grid grid-cols-3 w-full items-center">
                      <ShareButton submission={submission} onClick={(event) => handleShare(event, submission)} context={calcNavContext(submission)} />
                      <MintButton
                        styleOverride="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                        hover:rounded-xl rounded-3xl transition-all duration-300"
                        submission={submission}
                        onClick={(event) => handleMint(event, submission)}
                      />
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      </div>
      <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen} mode={isMintModalOpen ? "mint" : "share"} handleClose={handleClose} >
        {isShareModalOpen && submission && (
          <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <div className="flex justify-between">
              <h2 className="text-t1 text-xl font-bold">Share</h2>
              <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsShareModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
            </div>
            {status !== 'authenticated' && <p className="text-t1 text-lg">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
              <ShareButton submission={submission} onClick={() => { }} context={calcNavContext(submission)} />
            </WalletConnectButton>
          </div>
        )}

        {isMintModalOpen && submission && (
          <MintEdition edition={submission.edition} author={submission.author} setIsModalOpen={setIsMintModalOpen} />
        )}
      </SubmissionModal>
    </div >
  );
}


const HeaderButtons = ({ submission, referrer, context }: { submission: Submission, referrer: string | null, context: string | null }) => {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const voteActions = useVote(submission.contestId);
  const handleClose = () => {
    setIsMintModalOpen(false);
    setIsShareModalOpen(false);
  }

  return (
    <div className="flex gap-2 ml-auto items-center">
      <ShareButton submission={submission} onClick={() => setIsShareModalOpen(true)} context={context} />
      <MintButton submission={submission} onClick={() => setIsMintModalOpen(true)} />
      <AddToCartButton submission={submission} voteActions={voteActions} />
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


export const LiveSubmissionDisplay = ({
  contestId,
}: {
  contestId: string;
}) => {
  const { liveSubmissions: submissions } = useLiveSubmissions(contestId);
  const voteActions = useVote(contestId);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const router = useRouter();
  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
    setSubmission(submission)
  }

  const openShareModal = (submission: Submission) => {
    setIsShareModalOpen(true)
    setSubmission(submission)
  }

  const openExpandModal = (submission: Submission) => {
    setIsExpandModalOpen(true)
    setSubmission(submission)
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


  const handleClose = () => {
    setIsShareModalOpen(false)
    setIsMintModalOpen(false)
    setIsExpandModalOpen(false)
    setSubmission(null);
  }


  const handleExpand = (submission) => {
    openExpandModal(submission)
  }


  // base64 the contestId
  const context = Buffer.from(encodeURIComponent(`/contest/${contestId}`)).toString('base64')

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
          {submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                interactive={true}
                submission={submission}
                handleCardClick={(submission) => handleExpand(submission)}
                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="grid grid-cols-3 w-full items-center">
                      <div>
                        <ShareButton submission={submission} onClick={(event) => handleShare(event, submission)} context={context} />
                      </div>
                      <div className="m-auto">
                        <MintButton
                          styleOverride="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                        hover:rounded-xl rounded-3xl transition-all duration-300"
                          submission={submission}
                          onClick={(event) => handleMint(event, submission)}
                        />
                      </div>
                      <div className="ml-auto">
                        <AddToCartButton submission={submission} voteActions={voteActions} />
                      </div>
                    </div>
                  </div>
                }

              />
            );
          })}
        </div>
      </div>
      <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen || isExpandModalOpen} mode={isMintModalOpen ? "mint" : isExpandModalOpen ? "expand" : "share"} handleClose={handleClose} >
        {isShareModalOpen && submission && (
          <ShareModalContent submission={submission} handleClose={handleClose} context={context} />
        )}

        {isMintModalOpen && submission && (
          <MintEdition edition={submission.edition} author={submission.author} setIsModalOpen={setIsMintModalOpen} />
        )}

        {isExpandModalOpen && submission && (
          <div className="flex flex-col w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full mt-4 p-4">
            <button className="flex gap-2 w-fit text-t2 hover:text-t1 cursor-pointer p-2 pl-0 "
              onClick={handleClose}
            >
              <HiArrowNarrowLeft className="w-6 h-6" />
              <p>{"Back"}</p>
            </button>
            <ExpandedSubmission submission={submission} headerChildren={
              <HeaderButtons submission={submission} referrer={null} context={context} />
            } />
          </div>
        )}
      </SubmissionModal>
    </div >
  );
};

