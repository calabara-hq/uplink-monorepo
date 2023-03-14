import Image from "next/image";
import { useState } from "react";
import contestImage from "public/tns-sketch-contest.jpeg";
import winner from "public/9999-winner.jpeg";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-row bg-pink-900">
      <div className="flex flex-col items-center w-1/2 gap-6 h-fit bg-blue-800">
        <div className="grid grid-cols-2 gap-6 p-4 bg-neutral rounded-xl">
          <p className="text-xl">Details</p>
          <p className="ml-auto">svg</p>
          <p>Status</p>
          <p className="ml-auto bg-purple-600 p-1 rounded-lg font-bold">Submitting</p>
          <p>Voting Begins</p>
          <p className="ml-auto">3/11/23</p>
          <p>Contest End</p>
          <p className="ml-auto">3/13/23</p>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-fit bg-neutral">
          <div className="stat">
            <div className="stat-title">Submitter Rewards</div>
            <div className="stat-value">20 ETH</div>
          </div>

          <div className="stat">
            <div className="stat-title pb-2">Progress</div>
            <div className="radial-progress" style={{ "--value": 70 }}>
              70%
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Voter Rewards</div>
            <div className="stat-value">1 ETH</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 p-4 w-fit bg-neutral rounded-xl">
          <p className="text-xl">Requirements</p>
          <p className="ml-auto">svg</p>
          <p>Wallet</p>
          <div className="flex flex-row gap-2 ml-auto">
            <p>0x44..BBC0</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
          <p>Token Check</p>
          <div className="flex flex-row gap-2 ml-auto">
            <p>1 TNS</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
          <p>Twitter Account</p>
          <div className="flex flex-row gap-2 ml-auto">
            <p>@yungweez703</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 w-full lg:w-3/4 lg:ml-auto bg-neutral">
        <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-xl">
          <div className="w-80 lg:w-96">
            <Image
              src={contestImage}
              alt="contest image"
              height={400}
              width={400}
              className="rounded-xl w-full"
            />
          </div>
          <div className="card-body p-6 gap-4">
            <div className="flex flex-row">
              <div className="avatar">
                <div className="w-20 lg:w-24 rounded-full bg-white mr-6">
                  <Image
                    src={"/noun-47.png"}
                    alt={"org avatar"}
                    height={300}
                    width={300}
                  />
                </div>
              </div>

              <h2 className="card-title text-3xl">The Noun Square</h2>
            </div>
            <p className="text-xl p-2 lg:p-4 bg-neutral rounded-xl">
              ✏️ TNS Sketch Contest ✏️ Create an illustration or sketch using
              any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆
              Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare
              + some friends
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 justify-center gap-4 bg-neutral">
          <div className="card card-compact w-full lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
            <figure className="">
              <Image
                src={winner}
                alt="submission image"
                height={300}
                width={300}
                className="rounded-t-xl w-full "
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Submission #1</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Vote</button>
              </div>
            </div>
          </div>
          <div className="card card-compact w-full lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
            <figure>
              <Image
                src={winner}
                alt="submission image"
                height={300}
                width={300}
                className="rounded-t-xl w-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Submission #1</h2>
              <p>I made a new PFP for you @lastpunk9999 @thenounsquare </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Vote</button>
              </div>
            </div>
          </div>

          <div className="card card-compact w-[325px] h-[450px] bg-base-100 shadow-xl">
            <figure>
              <Image
                src={winner}
                alt="submission image"
                height={300}
                width={300}
                className="rounded-t-xl w-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Submission #2</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Vote</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
