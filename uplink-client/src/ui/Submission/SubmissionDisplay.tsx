"use client";
import { useEffect, useRef, useState } from "react";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import CardSubmission from "./CardSubmission";
import { HiCheckBadge } from "react-icons/hi2";
import { useContestState } from "@/providers/ContestStateProvider";
import { FaShare } from "react-icons/fa6";
import { BiLayerPlus } from "react-icons/bi";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import SubmissionModal, { ModalAddToCart } from "./SubmissionModal";
import ExpandedSubmission from "./ExpandedSubmission";
import { Submission } from "@/types/submission";
import MintEdition from "../Zora/MintEdition";
import Swiper from "../Swiper/Swiper";
import SwiperSlide from "../Swiper/SwiperSlide";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import useMe from "@/hooks/useMe";

export const AddToCartButton = ({ submission, voteActions }) => {
  const { addProposedVote, currentVotes, proposedVotes } = voteActions;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      [...currentVotes, ...proposedVotes].some(
        (vote) => vote.submissionId === submission.id
      )
    );
  }, [currentVotes, proposedVotes, submission.id]);

  const handleSelect = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <span
        className="ml-auto tooltip tooltip-top pr-2.5"
        data-tip={"Selected"}
      >
        <HiCheckBadge className="h-7 w-7 text-warning" />
      </span>
    );
  } else
    return (
      <span className="ml-auto tooltip tooltip-top " data-tip={"Add to cart"}>
        <button
          className="btn btn-ghost btn-sm text-t2 w-fit hover:bg-warning hover:bg-opacity-30 hover:text-warning"
          onClick={handleSelect}
        >
          <BiLayerPlus className="h-6 w-6 " />
        </button>
      </span>
    );
};

const SubmissionFooter = ({ submission, openMintModal, sharePath }: { submission: Submission, openMintModal: (submission: Submission) => void, sharePath: string }) => {
  const voteActions = useVoteActionContext();
  const { contestState } = useContestState();
  const [shareText, setShareText] = useState("Share");

  const handleShare = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setShareText("Copied Link");
    navigator.clipboard.writeText(sharePath);
    setTimeout(() => {
      setShareText("Share");
    }, 2000);
  };

  const handleMint = (event) => {
    event.stopPropagation();
    event.preventDefault();
    openMintModal(submission);
  }


  return (
    <div className="flex flex-col w-full">
      <div className="p-2 w-full" />
      <div className="grid grid-cols-3 w-full items-center">
        {sharePath ? (
          <span className="tooltip tooltip-top mr-auto" data-tip={shareText}>
            <button
              className="btn btn-ghost btn-sm text-t2 w-fit hover:bg-primary hover:bg-opacity-30 hover:text-primary"
              onClick={(e) => handleShare(e)}
            >
              <FaShare className="h-6 w-6 " />
            </button>
          </span>
        ) : (<span />)}
        {submission.nftDrop ? (
          <button onClick={handleMint} className="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
          hover:rounded-xl rounded-3xl transition-all duration-300">
            Mint
          </button>
        ) : (<span />)
        }
        {contestState === "voting" && (
          <AddToCartButton submission={submission} voteActions={voteActions} />
        )}
      </div>
    </div>
  );
};

export const SubmissionDisplaySkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-8/12 m-auto sm:w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  sm:auto-rows-fr ">
          <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
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
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
    setSubmission(submission)
  }
  const handleMint = (event, submission) => {
    event.stopPropagation();
    event.preventDefault();
    openMintModal(submission);
  }

  const openExpandModal = (submission: Submission) => {
    setIsExpandModalOpen(true)
    setSubmission(submission)
  }

  const handleClose = () => {
    setIsExpandModalOpen(false)
    setIsMintModalOpen(false)
    setSubmission(null);
  }

  // base64 the homepage context
  const context = Buffer.from('/').toString('base64')

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
                handleCardClick={(submission) => openExpandModal(submission)}
                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="grid grid-cols-3 w-full items-center">
                      <span />
                      {submission.nftDrop ? (
                        <button onClick={(event) => handleMint(event, submission)} className="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                      hover:rounded-xl rounded-3xl transition-all duration-300">
                          Mint
                        </button>
                      ) : (<span />)
                      }
                    </div>
                  </div>
                }
              />
            </div>
          </SwiperSlide>
        ))}
        <SubmissionModal isModalOpen={isExpandModalOpen || isMintModalOpen} mode={isExpandModalOpen ? "expand" : "mint"} handleClose={handleClose} >
          {isExpandModalOpen && submission && (
            <div className="flex w-full gap-1 lg:gap-4 p-0">
              <div className="flex flex-col jusitfy-start w-full h-full ">
                <ExpandedSubmission
                  submission={submission}
                />
              </div>
            </div>
          )}

          {isMintModalOpen && submission && (
            <MintEdition submission={submission} setIsModalOpen={setIsMintModalOpen} />
          )}
        </SubmissionModal>
      </Swiper>
    </div>
  )
}

export const UserSubmissionDisplay = ({ user }: { user: User }) => {
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const { me, getFallbackData } = useMe(user.address);
  console.log('HERES ME', me)
  const router = useRouter();

  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
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

  const handleClose = () => {
    setIsExpandModalOpen(false)
    setIsMintModalOpen(false)
    setSubmission(null);
  }


  const isAnonSubmission = (submission: Submission) => {
    // we can't expose the submission author on backwards nav (i.e. authorized user shared their own stuff)
    // we need to check if the original submission data (without any credentials) has a visible author
    // to do so, we need to get the fallback data from the user swr hook 
    const fallbackData = getFallbackData();
    const [sub] = fallbackData.submissions.filter((el: Submission) => el.id === submission.id)
    return !sub.author
  }



  const calcNavContext = (submission: Submission) => {
    if (isAnonSubmission(submission)) {
      return Buffer.from(`/contest/${submission.contestId}`).toString('base64')
    }
    else {
      return Buffer.from(`/user/${user.address}`).toString('base64')
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
                handleCardClick={(submission) => router.push(`/submission2/${submission.id}?context=${calcNavContext(submission)}`)}
                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="grid grid-cols-3 w-full items-center">
                      <span />
                      {submission.nftDrop ? (
                        <button onClick={(event) => handleMint(event, submission)} className="btn btn-sm normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black 
                      hover:rounded-xl rounded-3xl transition-all duration-300">
                          Mint
                        </button>
                      ) : (<span />)
                      }
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      </div>
      <SubmissionModal isModalOpen={isExpandModalOpen || isMintModalOpen} mode={isExpandModalOpen ? "expand" : "mint"} handleClose={handleClose} >
        {isExpandModalOpen && submission && (
          <div className="flex w-full gap-1 lg:gap-4 p-0">
            <div className="flex flex-col jusitfy-start w-full h-full ">
              <ExpandedSubmission
                submission={submission}
              />
            </div>
          </div>
        )}

        {isMintModalOpen && submission && (
          <MintEdition submission={submission} setIsModalOpen={setIsMintModalOpen} />
        )}
      </SubmissionModal>
    </div >
  );
}

export const LiveSubmissionDisplay = ({
  contestId,
  spaceName,
}: {
  contestId: string;
  spaceName: string;
}) => {
  const { liveSubmissions: submissions } = useLiveSubmissions(contestId);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const router = useRouter();
  const openMintModal = (submission: Submission) => {
    setIsMintModalOpen(true)
    setSubmission(submission)
  }
  const openExpandModal = (submission: Submission) => {
    setIsExpandModalOpen(true)
    setSubmission(submission)
  }

  const handleClose = () => {
    setIsExpandModalOpen(false)
    setIsMintModalOpen(false)
    setSubmission(null);
  }

  // base64 the spaceName & contestId
  const context = Buffer.from(`/${spaceName}/contest/${contestId}`).toString('base64')

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
                handleCardClick={(submission) => router.push(`/submission2/${submission.id}?context=${context}`)}
                footerChildren={
                  <SubmissionFooter
                    sharePath={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/contest/${contestId}/submission/${submission.id}`}
                    submission={submission}
                    openMintModal={(submission) => openMintModal(submission)}
                  />
                }
              />
            );
          })}
        </div>
      </div>
      <SubmissionModal isModalOpen={isExpandModalOpen || isMintModalOpen} mode={isExpandModalOpen ? "expand" : "mint"} handleClose={handleClose} >
        {isExpandModalOpen && submission && (
          <div className="flex w-full gap-1 lg:gap-4 p-0">
            <div className="flex flex-col jusitfy-start w-full h-full ">
              <ExpandedSubmission
                submission={submission}
                headerChildren={
                  <div className="flex p-1 ml-auto items-center justify-center">
                    <ModalAddToCart submission={submission} />
                  </div>
                }
              />
            </div>
          </div>
        )}

        {isMintModalOpen && submission && (
          <MintEdition submission={submission} setIsModalOpen={setIsMintModalOpen} />
        )}
      </SubmissionModal>
    </div >
  );
};

