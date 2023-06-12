"use client";

import Image from "next/image";
import { useState } from "react";
import {
  TrashIcon,
  CheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";

const subImage =
  "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.";
const subImage2 =
  "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.";

export default function SubmissionCard() {
  return (
    <div
      className="card card-compact min-w-max h-96
                      cursor-pointer"
    >
      <figure className="relative bg-red-800 h-2/3">
        <Image
          src={subImage}
          alt="submission image"
          fill
          className="rounded-t-xl object-cover w-full"
        />
      </figure>
      <div className="card-body h-1/3 rounded-b-xl bg-base-100">
        <h2 className="card-title">Submission #1</h2>
      </div>
    </div>
  );
}

export function SubmissionCardText() {
  return (
    <div
      className="card card-compact h-96
                      cursor-pointer "
    >
      <div className="card-body h-1/3 bg-base-100 rounded-xl">
        <h2 className="card-title">
          Hi fam, I made a cardboard mask craft for an unminted chocolate head
          cosplay 🍫🔥 @thenounsquare @nounsdao A video of the process below⬇️
        </h2>
        <p>
          is simply dummy text of the printing and typesetting industry. Lorem
        </p>
      </div>
    </div>
  );
}

export function SubmissionCard2() {
  return (
    <div
      className="card card-compact min-w-max h-96
                    cursor-pointer"
    >
      <figure className="relative bg-red-800 h-2/3 w-full">
        <Image
          src={subImage2}
          alt="submission image"
          fill
          className="rounded-t-xl object-cover w-full"
        />
      </figure>
      <div className="card-body h-1/3 rounded-b-xl bg-base-100">
        <h2 className="card-title">Submission #9</h2>
      </div>
    </div>
  );
}

export function SubmissionCardBoxSelect() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="card card-compact min-w-max h-96 cursor-pointer">
      <figure className="relative bg-red-800 h-2/3">
        <Image
          src={subImage2}
          alt="submission image"
          fill
          className="rounded-t-xl object-cover w-full"
        />
      </figure>
      <div className="card-body h-1/3 rounded-b-xl bg-base-100">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Submission #1</h2>
          <input
            type="checkbox"
            checked={isChecked}
            onClick={handleCheckboxClick}
            className="checkbox checkbox-lg"
          />
        </div>
      </div>
    </div>
  );
}

const SubmissionVoteInput = ({ sub }: { sub: any }) => {
  const { updateProposedVoteAmount } = useVoteProposalContext();

  return (
    <input
      type="number"
      placeholder="votes"
      className="input input-bordered w-1/2 text-center"
      value={sub.votes}
      onChange={(e) => updateProposedVoteAmount(sub.submissionId, e.target.value)}
    />
  );
};

const SubmissionVoteTrash = ({ sub }: { sub: any }) => {
  const { removeProposedVote } = useVoteProposalContext();

  return (
    <button className="btn btn-sm btn-square btn-ghost cursor-pointer">
      <TrashIcon
        onClick={() => removeProposedVote(sub.submissionId)}
      />
    </button>
  );
};

export function SubmissionCardVote({ sub }: { sub: any }) {
  return (
    <div
      className="flex flex-row w-full max-h-28 bg-base-100 rounded-xl
                    cursor-pointer"
    >
      {sub.type === "image" && <CartImageSubmission sub={sub} />}
      {sub.type === "text" && <CartTextSubmission sub={sub} />}
      {sub.type === "video" && <CartVideoSubmission sub={sub} />}
    </div>
  );
}

const CartImageSubmission = ({ sub }: { sub: any }) => {
  const { updateProposedVoteAmount } = useVoteProposalContext();

  return (
    <>
      <figure className="relative w-1/3 ">
        <Image
          src={sub.previewAsset}
          alt="submission image"
          fill
          className="object-cover w-full rounded-l-xl"
        />
      </figure>
      <div className="flex items-center justify-evenly gap-2 p-4 h-full w-full">
        <div className="flex flex-col justify-evenly items-center gap-4 h-full">
          <h2 className="">{sub.title}</h2>
          <SubmissionVoteInput sub={sub} />
        </div>

        <SubmissionVoteTrash sub={sub} />
      </div>
    </>
  );
};

const CartTextSubmission = ({ sub }: { sub: any }) => {
  return (
    <>
      <figure className="relative w-1/3 ">
        <p>text</p>
      </figure>
      <div className="flex items-center justify-evenly gap-2 p-4 h-full w-full">
        <div className="flex flex-col justify-evenly items-center gap-4 h-full">
          <h2 className="">{sub.title}</h2>
          <SubmissionVoteInput sub={sub} />
        </div>

        <SubmissionVoteTrash sub={sub} />
      </div>
    </>
  );
};

const CartVideoSubmission = ({ sub }: { sub: any }) => {
  return (
    <>
      <figure className="relative w-1/3 ">
        <Image
          src={sub.previewAsset}
          alt="submission image"
          fill
          className="object-cover w-full rounded-l-xl"
        />
      </figure>
      <div className="flex items-center justify-evenly gap-2 p-4 h-full w-full">
        <div className="flex flex-col justify-evenly items-center gap-4 h-full">
          <h2 className="">{sub.title}</h2>
          <SubmissionVoteInput sub={sub} />
        </div>

        <SubmissionVoteTrash sub={sub} />
      </div>
    </>
  );
};

export function LockedCardVote({sub}: {sub: any}) {
  console.log('rendering locked card with sub', sub)
  return (
    <div
      className="flex flex-row w-full min-h-16 bg-base-100 rounded-xl
                    cursor-pointer-none"
    >
      {/** TODO: fill this in  */}
      {sub.type === "image" && <CartImageSubmission sub={sub} />}
      {sub.type === "text" && <CartTextSubmission sub={sub} />}
  {sub.type === "video" && <CartVideoSubmission sub={sub} />}
    </div>
  );
}