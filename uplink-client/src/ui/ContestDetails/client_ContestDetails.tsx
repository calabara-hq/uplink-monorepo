"use client";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { useContestState } from "@/providers/ContestStateProvider";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { HiXCircle } from "react-icons/hi2";
import { useSession } from "@/providers/SessionProvider";
import useTweetQueueStatus from "@/hooks/useTweetQueueStatus";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import CreateContestTweet from "../ContestForm/CreateContestTweet";

// expand a section from the contest details page.
// we extract this interactivity out to reduce bundle size and improve performance

export const ExpandSection = ({
  data,
  label,
  children,
}: {
  data: any[];
  label: string;
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      {data.length > 3 && (
        <a
          className="hover:underline text-blue-500 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {label}
        </a>
      )}
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {children}
      </Modal>
    </div>
  );
};

export const RenderStateSpecificDialog = ({
  adminsChild,
  pendingChild,
  submittingChild,
  votingChild,
  closedChild,
  skeletonChild,
}: {
  adminsChild: React.ReactNode;
  pendingChild: React.ReactNode;
  submittingChild: React.ReactNode;
  votingChild: React.ReactNode;
  closedChild: React.ReactNode;
  skeletonChild: React.ReactNode;
}) => {
  const { contestState, type, tweetId } = useContestState();

  if (!contestState) return <>{skeletonChild}</>;
  else if (contestState === "pending") {
    if (type === "twitter" && !tweetId) {
      return <>{adminsChild}</>;
    } else {
      return <>{pendingChild}</>;
    }
  } else if (contestState === "pending") {
    return <>{pendingChild}</>;
  } else if (contestState === "submitting") {
    return <>{submittingChild}</>;
  } else if (contestState === "voting") {
    return <>{votingChild}</>;
  } else if (contestState === "closed") {
    return <>{closedChild}</>;
  }
  return null;
};

export const RenderRemainingTime = ({}) => {
  const { stateRemainingTime } = useContestState();
  return <>{stateRemainingTime}</>;
};

export const InteractiveContestClosed = () => {
  const { downloadGnosisResults, downloadUtopiaResults } =
    useContestInteractionState();
  const [downloadClicked, setDownloadClicked] = useState(false);
  return (
    <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
      {!downloadClicked && (
        <button
          className="btn btn-primary normal-case"
          onClick={() => setDownloadClicked(true)}
        >
          Download Winners
        </button>
      )}
      {downloadClicked && (
        <div className="flex gap-2 items-center">
          <button
            className="btn bg-[#12ff80] normal-case text-black border-none hover:bg-[#12ff8099]"
            onClick={downloadGnosisResults}
          >
            Gnosis
          </button>
          <button
            className="btn bg-[#4c7064] normal-case text-white border-none hover:bg-[#4c706499]"
            onClick={downloadUtopiaResults}
          >
            Utopia
          </button>
          <button
            className="btn btn-ghost btn-sm text-t2"
            onClick={() => setDownloadClicked(false)}
          >
            <HiXCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

//
export const InteractiveAdminsRequired = ({
  contestId,
  skeletonChild,
  adminRequiredDialog,
  tweetQueuedDialog,
  tweetNotQueuedDialog,
}: {
  contestId: string;
  skeletonChild: React.ReactNode;
  adminRequiredDialog: React.ReactNode;
  tweetQueuedDialog: React.ReactNode;
  tweetNotQueuedDialog: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const { contestAdmins } = useContestState();
  const { isTweetQueued, isLoading: isQueueStatusLoading } =
    useTweetQueueStatus(contestId);
  const isAdmin = contestAdmins.includes(session?.user?.address ?? "");

  if (status === "loading") return <>{skeletonChild}</>;
  else if (isAdmin) {
    if (isQueueStatusLoading) return <>{skeletonChild}</>;
    else if (isTweetQueued) return <>{tweetQueuedDialog}</>;
    else return <>{tweetNotQueuedDialog}</>;
  } else return <>{adminRequiredDialog}</>;
};

export const InteractiveCreateTweet = ({
  contestId,
  spaceId,
  customDecorators,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSuccess = () => {
    toast.success("Successfully scheduled your tweet");
    mutate(`/api/tweetQueueStatus/${contestId}`);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
        <p className="text-center ">{`This contest requires an announcement tweet before it can begin.`}</p>
        <button
          className="btn btn-primary btn-outline normal-case ml-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Tweet
        </button>
      </div>
      <CreateContestTweet
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        contestId={contestId}
        spaceId={spaceId}
        customDecorators={customDecorators}
        onSuccess={handleSuccess}
        onError={() => {}}
      />
    </>
  );
};
