"use client";

import Image from "next/image";
import { useState } from "react";
import { TrashIcon, CheckIcon, LockClosedIcon } from "@heroicons/react/24/solid";

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
        <h2 className="card-title">Submission #1</h2>
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

export function SubmissionCardVote() {
  return (
    <div
      className="flex flex-row w-full max-h-28 bg-base-100 rounded-xl
                    cursor-pointer"
    >
      <figure className="relative w-1/3 ">
        <Image
          src={subImage}
          alt="submission image"
          fill
          className="object-cover w-full rounded-l-xl"
        />
      </figure>
      <div className="flex items-center justify-evenly gap-2 p-4 h-full w-full">
        <div className="flex flex-col justify-evenly items-center gap-4 h-full">
          <h2 className="">My Submission!</h2>
          <input
            type="text"
            placeholder="votes"
            className="input input-bordered w-1/2 text-center"
          />
        </div>

        <button className="btn btn-sm btn-square btn-ghost">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function LockedCardVote() {
  return (
    <div
      className="flex flex-row w-full min-h-16 bg-base-100 rounded-xl
                    cursor-pointer-none"
    >
      <figure className="relative w-1/3 ">
        <Image
          src={subImage}
          alt="submission image"
          fill
          className="object-cover w-full rounded-l-xl"
        />
      </figure>
        <div className="flex flex-row justify-evenly items-center gap-2 w-full">
          <h2 className="">My Submission!</h2>
          <p>10</p>
        </div>
    </div>
  );
}

/*
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Vote</button>
          </div>

          transition-all duration-300 ease-linear hover:scale-110
*/
