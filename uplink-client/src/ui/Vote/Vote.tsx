"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiLockClosed,
  HiLockOpen,
  HiPhoto,
  HiPlus,
  HiSparkles,
} from "react-icons/hi2";
import { VotableSubmission, useVoteActionContext } from "@/providers/VoteActionProvider";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import formatDecimal from "@/lib/formatDecimal";
import { useContestState } from "@/providers/ContestStateProvider";
import Image from "next/image";
import { HiTrash, HiDocumentText } from "react-icons/hi2";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import { Submission, isStandardSubmission, isTwitterSubmission } from "@/types/submission";
import { ImageWrapper } from "../Submission/MediaWrapper";

const SubmissionVoteInput = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  const { updateVoteAmount } = useVoteActionContext();

  return (
    <input
      type="number"
      placeholder="votes"
      className="input input-bordered focus:ring-transparent text-center w-full py-1 text-sm bg-base-200 "
      value={submission.votes}
      onWheel={(e: React.WheelEvent<HTMLElement>) => {
        (e.target as HTMLElement).blur();
      }}
      onChange={(e) =>
        updateVoteAmount(submission.submissionId, e.target.value, mode)
      }
    />
  );
};

const SubmissionCardVote = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  const { removeSingleVote } = useVoteActionContext();

  return (
    <div className="grid grid-cols-[70%_30%] w-full h-24 max-h-24 bg-base-100 rounded-xl">
      {submission.data.type === "text" && (
        <div className="flex flex-col justify-center w-full p-2">
          <p className="text-base line-clamp-4 text-t1">
            {submission.data.title}
          </p>
        </div>
      )}
      {submission.data.type !== "text" && (
        <div className="grid grid-cols-2 w-full p-2">
          <CartMediaSubmission submission={submission} />
        </div>
      )}
      <div className="grid grid-rows-2 ">
        <div className="flex">
          <button
            className="btn btn-ghost btn-sm ml-auto text-error"
            onClick={() => removeSingleVote(submission.submissionId, mode)}
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-br-xl">
          <SubmissionVoteInput submission={submission} mode={mode} />
        </div>
      </div>
    </div>

    // <div className="grid grid-cols-2 w-full h-24 max-h-24 bg-base-100 rounded-xl overflow-hidden items-center">
    //   {submission.data.type === "text" && (
    //     <div className="flex flex-col justify-center w-full p-2">
    //       <p className="text-base line-clamp-4 text-t1">
    //         {submission.data.title}
    //       </p>
    //     </div>
    //   )}
    //   {submission.data.type !== "text" && (
    //     <div className="w-full h-full">
    //       <CartMediaSubmission submission={submission} />
    //     </div>
    //   )}


    //   <div className="flex flex-col gap-2 w-1/2 ml-auto mr-1">
    //     <div className="flex">
    //       <button
    //         className="btn btn-ghost btn-sm ml-auto text-error"
    //         onClick={() => removeSingleVote(submission.submissionId, mode)}
    //       >
    //         <HiTrash className="w-4 h-4" />
    //       </button>
    //     </div>
    //     <div className="rounded-br-xl">
    //       <SubmissionVoteInput submission={submission} mode={mode} />
    //     </div>
    //   </div>
    // </div>
  );
};

const LockedCardVote = ({ submission }: { submission: any }) => {
  const displayableVotes = formatDecimal(submission.votes);

  return (
    <div className="grid grid-cols-[70%_30%] gap-2 h-20 min-h-20 bg-base-100 rounded-xl">
      {submission.data.type === "text" && (
        <div className="flex flex-col justify-center w-full p-2">
          <p className="text-base line-clamp-4 text-t1">
            {submission.data.title}
          </p>
        </div>
      )}
      {submission.data.type !== "text" && (
        <div className="grid grid-cols-2 w-full">
          <CartMediaSubmission submission={submission} />
        </div>
      )}
      <div className="flex flex-col items-center justify-center m-auto gap-1 px-2">
        <p>{displayableVotes.short}</p>
      </div>
    </div>

    // <div className="grid grid-cols-2 w-full h-24 max-h-24 bg-base-100 rounded-xl overflow-hidden items-center">
    //   {submission.data.type === "text" && (
    //     <div className="flex flex-col justify-center w-full p-2">
    //       <p className="text-base line-clamp-4 text-t1">
    //         {submission.data.title}
    //       </p>
    //     </div>
    //   )}
    //   {submission.data.type !== "text" && (
    //     <div className="w-full h-full">
    //       <CartMediaSubmission submission={submission} />
    //     </div>
    //   )}
    //   <div className="flex flex-col w-1/2 ml-auto mr-1 items-center justify-center m-auto gap-1 px-2">
    //     <p className="text-t2">{displayableVotes.short} votes</p>
    //   </div>
    // </div>
  );
};





const CartMediaSubmission = ({ submission }: { submission: VotableSubmission }) => {
  const src = submission.type === "standard" ? submission.data.previewAsset : submission.data.thread[0].previewAsset
  console.log(src)
  return (
    <div className="relative w-full h-full">
      <figure className="absolute inset-0 overflow-hidden">
        <Image
          src={src}
          alt="submission image"
          fill
          className="object-cover rounded-xl"
          sizes="30vw" // same as SubmissionCard to hit cache
        />
      </figure>
    </div>
  );
};

export const VoteButton = ({
  setIsEditMode,
}: {
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  const {
    submitVotes,
    areCurrentVotesDirty,
    proposedVotes,
    areUserVotingParamsLoading,
  } = useVoteActionContext();
  const { stateRemainingTime } = useContestState();

  const { status } = useSession();

  const isVoteButtonEnabled =
    !areUserVotingParamsLoading &&
    (areCurrentVotesDirty || proposedVotes.length > 0);

  const handleSubmit = () => {
    submitVotes();
    setIsEditMode(false);
  };

  return (
    <div className="w-full p-2">
      <WalletConnectButton styleOverride="w-full rounded-lg btn btn-primary">
        <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-9/10 m-2">
          <button
            className="btn btn-warning flex flex-1 normal-case"
            onClick={handleSubmit}
            disabled={!isVoteButtonEnabled}
          >
            Cast Votes
          </button>
          <p className="mx-2 p-2 text-center text-t2">{stateRemainingTime}</p>
        </div>
      </WalletConnectButton>
    </div>
  );
};

const EditButton = ({
  isEditMode,
  setIsEditMode,
}: {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  if (isEditMode) {
    return (
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => setIsEditMode(false)}
      >
        <HiLockOpen className="w-4 h-4" />
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-sm btn-ghost normal-case"
        onClick={() => setIsEditMode(true)}
      >
        <HiLockClosed className="w-4 h-4 mr-2" />
        Edit
      </button>
    );
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const VoteTab = ({ contestId }: { contestId: string }) => {
  const {
    removeAllVotes,
    proposedVotes,
    currentVotes,
    totalVotingPower,
    votesSpent,
    votesRemaining,
    areUserVotingParamsLoading,
  } = useVoteActionContext();

  const { liveSubmissions, areSubmissionsLoading } = useLiveSubmissions(contestId);
  const [isEditMode, setIsEditMode] = useState(false);
  const displayableVotesSpent = formatDecimal(votesSpent);
  const displayableVotesRemaining = formatDecimal(votesRemaining);
  const displayableTotalVotingPower = formatDecimal(totalVotingPower);

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[...proposedVotes, ...currentVotes].length > 0 && (
        <div className="flex flex-row w-full justify-end items-center p-2">
          <button
            className="btn btn-sm btn-ghost normal-case"
            onClick={removeAllVotes}
          >
            Remove All
          </button>
        </div>
      )}
      {currentVotes.length > 0 && (
        <motion.div
          className="max-h-[30vh] overflow-y-auto"
          variants={itemVariants}
        >
          <div className="flex flex-col gap-2 p-2 m-2 bg-base-200 rounded-lg">
            <div className="flex flex-row w-full justify-between items-center">
              <p className="">Your current selections</p>
              <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
            </div>
            <div className="flex flex-col gap-2 transition-opacity">
              {currentVotes.map((submission: any, idx: number) => {
                if (areSubmissionsLoading || !liveSubmissions) return null;
                if (isEditMode) {
                  return (
                    <SubmissionCardVote
                      key={idx}
                      mode={"current"}
                      submission={{
                        ...submission,
                        data: liveSubmissions.find(
                          (el) => el.id === submission.submissionId
                        ).data,
                      }}
                    />
                  );
                } else {
                  return (
                    <LockedCardVote
                      key={idx}
                      submission={{
                        ...submission,
                        data: liveSubmissions.find(
                          (el) => el.id === submission.submissionId
                        ).data,
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        </motion.div>
      )}

      {proposedVotes.length > 0 && (
        <motion.div variants={itemVariants}>
          {currentVotes.length > 0 && (
            <div className="flex flex-row w-full justify-start items-center p-2 text-t2">
              <p className="">+ Your proposed additions</p>
            </div>
          )}
          <div className="flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto">
            {proposedVotes.map((submission: any, idx: number) => (
              <SubmissionCardVote
                key={idx}
                submission={submission}
                mode={"proposed"}
              />
            ))}
          </div>
        </motion.div>
      )}

      {proposedVotes.length === 0 && currentVotes.length === 0 && (
        <motion.div variants={itemVariants}>
          <div className="p-10"></div>
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="w-1/4 ml-auto">
              <HiSparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-base-100 rounded-xl">
              <HiPhoto className="w-24 h-24" />
              <div className="space-y-2 w-full">
                <div className="h-3 w-1/3 rounded-lg bg-gray-500 shimmer ml-2" />
                <div className="h-2 w-1/2 rounded-lg bg-gray-500 shimmer ml-2" />
              </div>
              <HiPlus className="absolute bottom-0 right-0 w-6 h-6 ml-auto m-2 text-primary" />
            </div>
            <div className="w-1/4 mr-auto flex justify-end">
              <HiSparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="p-4"></div>
            <h1 className="text-center text-t2">No entries selected.</h1>
            <p className="text-center text-t2 px-8">
              Select entries by hovering a submission and clicking the plus sign
              in the bottom right corner.
            </p>
          </div>
          <div className="p-10"></div>
        </motion.div>
      )}

      <motion.div className="flex flex-col gap-2 p-2" variants={itemVariants}>
        <div className="grid grid-cols-3 justify-items-center justify-evenly gap-2 font-bold text-center">
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableTotalVotingPower.long}
          >
            <p className="text-sm">Credits</p>
            <p>{displayableTotalVotingPower.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableVotesSpent.long}
          >
            <p className="text-sm text-gray-500">Spent</p>
            <p className="mt-auto">{displayableVotesSpent.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableVotesRemaining.long}
          >
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="mt-auto">{displayableVotesRemaining.short}</p>
          </div>
        </div>
      </motion.div>
      <VoteButton setIsEditMode={setIsEditMode} />
    </motion.div>
  );
};

const SidebarVote = ({ contestId }: { contestId: string }) => {
  const { contestState } = useContestState();
  const { proposedVotes } = useVoteActionContext();

  //if (!contestState || contestState !== "voting") {
  // if (!contestState) {
  //   // return placeholder
  //   return (
  //     <div className="hidden w-1/3 lg:flex lg:flex-col items-center gap-4">
  //       <div className="sticky top-3 right-0 flex flex-col justify-center items-center gap-4 w-full h-[60vh] rounded-xl mt-2"></div>
  //     </div>
  //   );
  // }

  if (contestState === "voting") {
    return (
      <div className="hidden w-1/3 xl:w-1/4 flex-shrink-0 lg:flex lg:flex-col items-center gap-4">
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl mt-2">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-t1 text-lg font-semibold">My Selections </h2>
            {proposedVotes.length > 0 && (
              <span className="badge badge-sm text-sm badge-warning font-bold">
                {proposedVotes.length}
              </span>
            )}
          </div>
          <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
            <VoteTab contestId={contestId} />
          </div>
        </div>
      </div>
    );
  }
  // render a placeholder so the other flex's don't grow too wide
  // return <div className="w-0 lg:w-1/12" />;
};

export default SidebarVote;
