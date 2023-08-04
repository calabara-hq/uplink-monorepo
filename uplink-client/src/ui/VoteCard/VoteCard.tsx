"use client";

import Image from "next/image";
import { useState } from "react";
import { HiTrash, HiDocumentText } from "react-icons/hi2";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";

const SubmissionVoteInput = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  console.log(submission);
  const { updateVoteAmount } = useVoteProposalContext();

  return (
    <input
      type="number"
      placeholder="votes"
      className="input input-bordered text-center w-24 py-1 text-sm"
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

const SubmissionVoteTrash = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  const { removeSingleVote } = useVoteProposalContext();

  return (
    <div
      className="btn btn-ghost w-auto h-full rounded-xl text-white ml-auto"
      onClick={() => removeSingleVote(submission.submissionId, mode)}
    >
      <HiTrash className="w-5 h-5" />
    </div>
  );
};

export function SubmissionCardVote({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) {
  return (
    <div className="flex flex-row w-full h-24 max-h-24 gap-1">
      <div
        className="flex flex-row w-full bg-base-100 rounded-xl
                    cursor-pointer"
      >
        {submission.data.type === "text" && (
          <CartTextSubmission submission={submission} />
        )}
        {submission.data.type !== "text" && (
          <CartMediaSubmission submission={submission} />
        )}
        <div className="flex flex-col justify-between items-center gap-4 h-full p-2 w-full">
          <h2 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap text-center w-3/4">
            {submission.data.title}
          </h2>
          <SubmissionVoteInput submission={submission} mode={mode} />
        </div>
      </div>
      <SubmissionVoteTrash submission={submission} mode={mode} />
    </div>
  );
}

const CartMediaSubmission = ({ submission }: { submission: any }) => {
  return (
    <figure className="relative w-1/4 md:w-1/2 p-2 m-2 rounded-xl">
      <Image
        src={submission.data.previewAsset}
        alt="submission image"
        fill
        className="object-cover rounded-xl"
      />
    </figure>
  );
};

const CartTextSubmission = ({ submission }: { submission: any }) => {
  return (
    <figure className="relative w-1/4 md:w-1/2 p-2 m-2 rounded-xl">
      <HiDocumentText className="w-full h-full object-cover" />
    </figure>
  );
};

export function LockedCardVote({ submission }: { submission: any }) {
  console.log("rendering locked card with sub", submission);
  return (
    <div
      className="flex flex-row w-full h-16 min-h-16 bg-base-100 rounded-xl
                    cursor-pointer-none"
    >
      {submission.data.type === "text" && (
        <CartTextSubmission submission={submission} />
      )}
      {submission.data.type !== "text" && (
        <CartMediaSubmission submission={submission} />
      )}
      <div className="flex flex-row justify-center items-center gap-4 p-2 w-full">
        <h2 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap text-center w-3/4">
          {submission.data.title}
        </h2>
        {/*<SubmissionVoteInput submission={submission} mode={mode} />*/}
        <div className="flex flex-col items-center justify-center ml-auto gap-1 px-2">
          <p>{submission.votes}</p>
        </div>
      </div>
    </div>
  );
}
