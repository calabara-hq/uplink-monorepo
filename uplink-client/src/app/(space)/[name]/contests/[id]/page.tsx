import Image from "next/image";
import contestImage from "public/tns-sketch-contest.jpeg";
import Modal from "@/ui/Modal/Modal";
import Contests from "@/ui/Contests/Contests";
import { ContestByIdDocument } from "@/lib/graphql/contests.gql";
import graphqlClient from "@/lib/graphql/initUrql";

const getContest = async (id: string) => {
  const contest = {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
    submitterRewards: [
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ETH",
            address: "0xabcd",
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
    ],
  };
  const space = {
    id: "1",
    displayName: "Shark DAO",
  };
  const selectedSubs = [
    {
      id: "1",
      name: "Sub1",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
    {
      id: "2",
      name: "Sub2",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
  ];
  return { contest, space, selectedSubs };
};

const getSpace = () => {
  return {
    id: "1",
    displayName: "Shark DAO",
  };
};

const getselectedSubs = () => {
  return [
    {
      id: "1",
      name: "Sub1",
      votes: '10',
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
    {
      id: "2",
      name: "Sub2",
      votes: '10',
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
  ];
};
const getContest2 = async (contestId: string) => {
  const results = await graphqlClient
    .query(ContestByIdDocument, { contestId: parseInt(contestId) })
    .toPromise();
  console.log(results);
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

export default async function Page({ params }: { params: { id: string } }) {
  const contest = await getContest2(params.id).then((res) => {
    return {
      ...res.data.contest,
      prompt: {
        title: "Sketch a DAO",
        body: "Draw a DAO",
        coverUrl:
          "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
      },
    };
  });
  const space = await getSpace();
  const selectedSubs = await getselectedSubs();
  return (
    <Contests contest={contest} space={space} selectedSubs={selectedSubs} />
  );
}

{
  /*
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
        */
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
