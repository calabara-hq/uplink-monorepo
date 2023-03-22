import Image from "next/image";
import { useState } from "react";
import contestImage from "public/tns-sketch-contest.jpeg";
import winner from "public/9999-winner.jpeg";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center w-[90vw] m-auto justify-evenly p-4 gap-4 bg-neutral">
      <div className="stats stats-horizontal w-full bg-base-100">
        <div className="stat justify-items-center p-2">
          <div className="stat-title">Eligibility</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>

        <div className="stat justify-items-center p-2">
          <div className="stat-title pb-2">Progress</div>
          <div
            className="radial-progress"
            style={{ "--value": 70, "--size": "4rem" }}
          >
            70%
          </div>
        </div>

        <div className="stat justify-items-center p-2">
          <div className="stat-title">Status</div>
          <p className=" bg-purple-600 p-2 h-fit rounded-lg font-bold">
            Submitting
          </p>
        </div>

        <label
          htmlFor="my-modal-5"
          className="hidden lg:stat justify-items-center p-2 hover:cursor-pointer hover:bg-neutral"
        >
          <div className="stat-title">Submitter Rewards</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </label>

        <label
          htmlFor="my-modal-5"
          className="hidden lg:stat justify-items-center p-2 hover:cursor-pointer hover:bg-neutral"
        >
          <div className="stat-title">Voter Rewards</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </label>
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box w-11/12 max-w-5xl flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Contest Rewards</h2>

            <div className="flex flex-col p-4 gap-4 bg-neutral rounded-xl">
              <h3 className="text-xl">Submitter Rewards</h3>
              <div className="flex flex-row justify-between">
                <p className="">Rank 1:</p>
                <p className="">0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 2:</p>
                <p>0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 3:</p>
                <p>0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 3:</p>
                <p>0.05 ETH</p>
              </div>
            </div>
            <div className="flex flex-col p-4 gap-4 bg-neutral rounded-xl">
              <h3 className="text-xl">Voter Rewards</h3>
              <div className="flex flex-row justify-between">
                <p className="">Rank 1:</p>
                <p className="">0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 2:</p>
                <p>0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 3:</p>
                <p>0.05 ETH</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Rank 3:</p>
                <p>0.05 ETH</p>
              </div>
            </div>
            <div className="modal-action m-0">
              <label htmlFor="my-modal-5" className="btn btn-primary">
                close
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:flex-row lg:items-start lg:justify-evenly w-full items-center gap-4 bg-neutral">
        <div className="lg:flex-row lg:flex-1 flex flex-col-reverse items-center w-full bg-base-100 shadow-xl rounded-xl">
          <div className="flex flex-col justify-evenly lg:w-2/3 h-96 p-4">
            <div className="avatar">
              <div className="w-20 lg:w-24 rounded-full bg-white mr-6">
                <Image
                  src={"/noun-47.png"}
                  alt={"org avatar"}
                  height={300}
                  width={300}
                />
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
              <label htmlFor="my-modal-3" className="btn btn-primary">
                Submit
              </label>
            </div>
          </div>
          <div className="max-w-screen-sm lg:w-[] lg:h-96 ml-auto">
            <Image
              src={contestImage}
              alt="contest image"
              height={400}
              width={400}
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <div className="hidden lg:grid lg:grid-cols-2 w-full gap-6 p-4 bg-base-100 rounded-xl ">
              <p className="text-xl">Details</p>
              <div className="btn btn-sm btn-circle ml-auto">
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
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <p>Voting Begins</p>
              <p className="ml-auto">3/11/23</p>
              <p>Contest End</p>
              <p className="ml-auto">3/13/23</p>
            </div>
          </div>
          <div className="hidden lg:grid lg:grid-cols-2 items-center gap-6 p-4 bg-base-100 rounded-xl">
            <p className="text-xl">Requirements</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>

            <p>Wallet</p>
            <div className="flex flex-row items-center gap-2 ml-auto">
              <p>0x44..BBC0</p>
              <div className="btn btn-sm btn-success btn-circle ml-auto">
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
            <p>Token Check</p>
            <div className="flex flex-row items-center gap-2 ml-auto">
              <div className="dropdown">
                <label tabIndex={0} className="hover:cursor-pointer">
                  Eligible
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-neutral rounded-box w-48"
                >
                  <li>
                    <a>1 TNS</a>
                  </li>
                  <li>
                    <a>1 SHARK</a>
                  </li>
                </ul>
              </div>
              <div className="btn btn-sm btn-error btn-circle ml-auto">
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
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p>Twitter Account</p>
            <div className="flex flex-row items-center gap-2 ml-auto">
              <p>@yungweez703</p>
              <div className="btn btn-sm btn-success btn-circle">
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
        </div>
      </div>
      <h1 className="text-5xl">Submissions</h1>

      <div className="flex flex-col w-full gap-8 lg:flex-row lg:flex-wrap justify-center bg-neutral border-2 border-base-100 p-8 rounded-xl">
        <div
          className="card card-compact lg:w-[325px] h-[450px] bg-base-100 shadow-xl transition-all duration-300 ease-linear hover:scale-110
                        cursor-pointer"
        >
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
        <div className="card card-compact lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
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
        <div className="card card-compact lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
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
        <div className="card card-compact lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
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

        <div className="card card-compact lg:w-[325px] h-[450px] bg-base-100 shadow-xl">
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
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box flex flex-col justify-between items-center w-11/12 max-w-4xl h-[500px] gap-4 ">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-3 top-3"
          >
            ✕
          </label>
          <h2 className="text-3xl font-bold">Submit</h2>
          <div className="flex flex-row mr-auto gap-4">
            <div className="avatar">
              <div className="w-12 lg:w-16 rounded-full bg-white">
                <Image
                  src={"/noun-47.png"}
                  alt={"org avatar"}
                  height={300}
                  width={300}
                />
              </div>
            </div>

            <h2 className="card-title text-lg lg:text-xl">@yungweez703</h2>
          </div>

          <textarea
            placeholder="..."
            className="textarea textarea-bordered textarea-lg w-full h-full bg-neutral"
          ></textarea>
          <div className="flex flex-col lg:flex-row">
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />{" "}
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <button className="btn btn-primary">Submit & tweet for me</button>
            <button className="btn btn-secondary">
              Generate a link for me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
