import Image from "next/image";
import contestImage from "public/tns-sketch-contest.jpeg";
import SubmissionCard, { SubmissionCardVote } from "@/ui/SubmissionCard/SubmissionCard";
import { SubmissionCard2 } from "@/ui/SubmissionCard/SubmissionCard";
import Modal from "@/ui/Modal/Modal";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-row m-auto w-[90vw] gap-2">
      <div className="flex flex-col w-full lg:w-3/4 p-2 gap-4">
        <div className="card lg:card-side bg-transparent shadow-box">
          <div className="card-body border-2 border-border rounded-lg">
            <div className="flex gap-4 items-center">
              <div className="avatar">
                <div className=" w-20 lg:w-24 rounded-full bg-transparent">
                  <Image
                    src={"/noun-47.png"}
                    alt={"org avatar"}
                    height={300}
                    width={300}
                  />
                </div>
              </div>
              <h2 className="card-title text-3xl">The Noun Square</h2>
              <div className="ml-auto btn btn-sm btn-active">Submitting</div>
            </div>

            <div className="flex flex-col p-2 lg:p-4 gap-4">
              <h3 className="text-2xl">✏️ TNS Sketch Contest ✏️ </h3>
              <p className="text-xl">
                Create an illustration or sketch using any or all the Nouns from
                610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @
                10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends
              </p>
            </div>

            <div className="card-actions justify-end">
              <SubmitButton />
            </div>
          </div>
        </div>
        <h1 className="text-4xl text-center">Submissions</h1>

        <div className="flex flex-col w-full gap-4 lg:flex-row lg:flex-wrap justify-center rounded-xl">
          <SubmissionCard />
          <SubmissionCard2 />
          <SubmissionCard />
          <SubmissionCard2 />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
        </div>
      </div>
      <div className="hidden sticky top-10 right-0 lg:flex lg:flex-col items-center w-1/4 h-1/2 gap-4">
        <div className="flex flex-col justify-center gap-4 bg-base-100 w-full rounded-xl">
          <figure className="relative h-80">
            <Image
              src={contestImage}
              alt="contest image"
              fill
              className="object-fill rounded-xl"
            />
          </figure>
        </div>
        {/*}
        <div className="flex flex-row items-center justify-between gap-2 bg-base-100 w-full rounded-lg">
          <button className="btn btn-primary w-3/4">Submit</button>
          <p className="w-1/4 text-center">4 days</p>
        </div>
        */}

        <VoterRewards />
        <VoterCart />

        {/*
        <div className="flex flex-row justify-evenly p-4 bg-base-100 w-full rounded-xl">
          <label htmlFor="my-modal-5">
            <button className="btn gap-2">
              <p className="">Rewards</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                justify-end
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
            </button>
          </label>
          <label htmlFor="my-modal-5">
            <div className="btn gap-2">
              <p>More Details</p>
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
          </label>
        </div>
  

        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box w-11/12 max-w-5xl flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Contest Rewards</h2>

            <div className="flex flex-col p-4 gap-4 bg-base-100 rounded-xl">
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
            <div className="flex flex-col p-4 gap-4 bg-base-100 rounded-xl">
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

        <div className="flex flex-col gap-4 p-4 bg-base-100 rounded-xl w-full">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xl">Requirements</p>
            <p className="btn btn-xs btn-circle">i</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p>Wallet</p>
            <div className="flex flex-row items-center gap-2">
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
          </div>
          <div className="flex flex-row justify-between items-center">
            <p>Token Check</p>
            <div className="flex flex-row items-center gap-2 ml-auto">
              <div className="dropdown">
                <label tabIndex={0} className="hover:cursor-pointer">
                  <button className="btn btn-sm btn-outline">Eligible</button>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-neutral border-2 border-base-100 rounded-box w-48"
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
          </div>
          <div className="flex flex-row justify-between items-center">
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
        */}
      </div>
      {/*
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      </Modal>
  */}
    </div>
  );
}

export function SubRewards1() {
  return (
    <div className="flex flex-col bg-transparent w-full">
      <div className="bg-neutral w-fit p-2 rounded-t-lg">
        <p>Submitter Rewards</p>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex flex-row justify-evenly p-2 gap-2 bg-base-100 border-2 border-border rounded-b-xl rounded-tr-xl w-full">
          <p className="btn btn-ghost">1 ETH</p>
        </div>
      </div>
    </div>
  );
}

export function SubRewards3() {
  return (
    <div className="flex flex-col bg-transparent w-full">
      <div className="bg-neutral w-fit p-2 rounded-t-lg">
        <p>Submitter Rewards</p>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex flex-row justify-evenly p-2 gap-2 bg-base-100 border-2 border-border rounded-b-xl rounded-tr-xl w-full">
          <p className="btn btn-ghost">1 ETH</p>
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost">
              2 More
            </label>
            <div
              tabIndex={0}
              className="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
            >
              <div className="card-body">
                <h2 className="card-title">You needed more info?</h2>
                <p>Here is a description!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubRewards2() {
  return (
    <div className="flex flex-col bg-transparent w-full">
      <div className="bg-neutral w-fit p-2 rounded-t-lg">
        <p>Submitter Rewards</p>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex flex-row justify-evenly p-2 gap-2 bg-base-100 border-2 border-border rounded-b-xl rounded-tr-xl w-full">
          <p className="btn btn-ghost">1 ETH</p>
          <p className="btn btn-ghost">20K SHARK</p>
        </div>
      </div>
    </div>
  );
}

export function SubRewards23() {
  return (
    <div className="flex flex-col justify-between h-24 bg-base-100 border-2 border-border rounded-lg w-full">
      <div className="bg-info text-lg text-black px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Submitter Rewards
      </div>
      <div className="flex flex-row justify-evenly p-2 gap-2 ">
        <p className="btn btn-ghost">1 ETH</p>
        <div className="dropdown dropdown-right dropdown-end dropdown-hover ">
          <label tabIndex={0} className="btn btn-ghost">
            2 More
          </label>
          <div
            tabIndex={0}
            className=" card compact dropdown-content bg-base-200 shadow-box rounded-box w-36 ml-1"
          >
            <div className="card-body">
              <p>1 NOUN</p>
              <p>1 TNS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubRewards21() {
  return (
    <div className="flex flex-col justify-between h-24 bg-base-100 border-2 border-border rounded-lg w-full">
      <div className="bg-info text-lg text-black px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Submitter Rewards
      </div>
      <div className="flex flex-row justify-evenly p-2 gap-2 ">
        <p className="btn btn-ghost">1 ETH</p>
      </div>
    </div>
  );
}

export function SubRewards22() {
  return (
    <div className="flex flex-col justify-between h-24 bg-base-100 border-2 border-border rounded-lg w-full">
      <div className="bg-info text-lg text-black px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Submitter Rewards
      </div>
      <div className="flex flex-row justify-evenly p-2 gap-2 ">
        <p className="btn btn-ghost">1 ETH</p>
        <p className="btn btn-ghost">20K SHARK</p>
      </div>
    </div>
  );
}

export function VoterRewards() {
  return (
    <div className="flex flex-col justify-between bg-base-100 border-2 border-border rounded-lg w-full">
      <div className="bg-warning text-lg text-black px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Voter Rewards
      </div>
      <div className="flex flex-col items-center justify-evenly p-2 gap-2 w-full">
        <p>Voters who select the #1 submission will split <br /> 0.05 ETH</p>
      </div>
    </div>
  );
}

export function VoterCart() {
  return (
    <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-fit">
      <div className="bg-warning text-lg text-black px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Voting Cart
      </div>
      <div className="grid grid-cols-3 justify-items-center justify-evenly p-2 gap-2 w-full ">
        <p>Voting Power</p>
        <p>Votes Spent</p>
        <p>Votes Remaining</p>
        <p>13</p>
        <p>3</p>
        <p>10</p>
      </div>
      <div className="flex flex-col gap-2 p-2">
      <SubmissionCardVote />
      <SubmissionCardVote />
      <SubmissionCardVote />
      <SubmissionCardVote />
      <SubmissionCardVote />

      </div>
    </div>
  );
}

export function SubmitButton() {
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg">
      <button className="btn btn-primary flex flex-1">Submit</button>
      <p className="p-2 text-center">4 days</p>
    </div>
  );
}

/*
      <div className="flex flex-row w-full h-40 bg-base-100 rounded-xl">
        <div className="flex flex-col justify-evenly items-center w-1/3 p-2">
          <p className="text-2xl">Status</p>
          <div className="flex flex-col lg:flex-row w-full items-center justify-evenly">
            <div
              className="radial-progress bg-secondary text-primary-content border-4 border-secondary"
              style={{ "--value": 20, "--size": "4rem" }}
            >
              70%
            </div>
            <p className=" bg-primary p-2 h-fit rounded-lg text-primary-content font-bold">
              Submitting
            </p>
          </div>
        </div>
        <div className="divider divider-horizontal w-0 m-0" />
        <label
          htmlFor="my-modal-5"
          className="flex flex-col justify-evenly items-center w-1/3 p-2 hover:cursor-pointer hover:bg-neutral"
        >
          <p className="text-2xl mb-2">Rewards</p>
          <div className="flex flex-col lg:flex-row w-full justify-evenly">
            <div className="flex flex-col items-center">
              <p>Submitter Rewards</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 lg:w-16 lg:h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <p>Voter Rewards</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 lg:w-16 lg:h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
          </div>
        </label>
        <div className="divider divider-horizontal w-0 m-0" />
        <label
          htmlFor="my-modal-5"
          className="flex flex-col justify-evenly items-center w-1/3 p-2 hover:cursor-pointer hover:bg-neutral"
        >
          <p className="text-2xl">More Details</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 lg:w-16 lg:h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
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



            <div className="lg:flex lg:flex-row lg:h-max w-full items-center gap-4 bg-neutral">
        <div className="lg:flex-row flex flex-col-reverse items-center lg:h-96 lg:w-3/4 bg-base-100 rounded-t-xl lg:rounded-xl">
          <div className="flex flex-col lg:flex-auto lg:h-96 lg:w-1/2 gap-4 p-4">
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
          </div>
          <div className="max-w-screen-sm lg:h-80 lg:pr-4">
            <Image
              src={contestImage}
              alt="contest image"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>
        <div className="flex flex-col lg:h-96 lg:w-1/4 gap-4">
          <div className="lg:flex lg:flex-col gap-4 p-4 bg-base-100 rounded-b-xl lg:rounded-xl">
            <div className="flex flex-row justify-between items-center">
              <p className="text-xl">Submit</p>
              <div className="btn btn-sm btn-circle">
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
            </div>
            <div className="flex justify-center">
              <label
                htmlFor="my-modal-3"
                className="btn lg:btn-wide btn-primary"
              >
                Submit
              </label>
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-col gap-4 p-4 bg-base-100 rounded-xl">
            <div className="flex flex-row justify-between items-center">
              <p className="text-xl">Requirements</p>
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </div>

            <div className="flex flex-row justify-between items-center">
              <p>Wallet</p>
              <div className="flex flex-row items-center gap-2">
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
            </div>

            <div className="flex flex-row justify-between items-center">
              <p>Token Check</p>
              <div className="flex flex-row items-center gap-2 ml-auto">
                <div className="dropdown">
                  <label tabIndex={0} className="hover:cursor-pointer">
                    <button className="btn btn-sm btn-outline">Eligible</button>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-neutral border-2 border-base-100 rounded-box w-48"
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
            </div>

            <div className="flex flex-row justify-between items-center">
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
      </div>

              <h1 className="text-5xl">Submissions</h1>

        <div className="flex flex-col w-full gap-8 lg:flex-row lg:flex-wrap justify-center bg-neutral border-2 border-base-100 p-8 rounded-xl">
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />
          <SubmissionCard />

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
                <button className="btn btn-primary">
                  Submit & tweet for me
                </button>
                <button className="btn btn-secondary">
                  Generate a link for me
                </button>
              </div>
            </div>
          </div>
        </div>

*/
