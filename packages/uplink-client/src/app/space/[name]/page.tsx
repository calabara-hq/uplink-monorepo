import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import Link from "next/link";
import Image from "next/image";
import TokenBadge from "@/ui/TokenBadge/TokenBadge";
import TabGroup from "@/ui/TabGroup/TabGroup";

// return the space data and contests
const contests = [
  {
    id: "1",
    spaceId: "1",
    category: "art",
    startTime: "2023-04-25T22:15:49Z",
    voteTime: "2023-04-26T22:15:49Z",
    endTime: "2023-04-27T22:15:49Z",
    created: "2023-04-25T22:15:49Z",
    prompt: {
      title: "What is the best noun?",
    },
  },

  {
    id: "2",
    spaceId: "1",
    category: "meme",
    startTime: "2023-03-4T22:15:49Z",
    voteTime: "2023-04-4T22:15:49Z",
    endTime: "2023-05-25T22:15:49Z",
    created: "2023-05-4T22:15:49Z",
    prompt: {
      title: "What is the best meme?",
    },
  },
  {
    id: "3",
    spaceId: "1",
    category: "video",
    startTime: "2023-05-4T22:15:49Z",
    voteTime: "2023-05-5T22:15:49Z",
    endTime: "2023-05-8T22:15:49Z",
    created: "2023-05-4T22:15:49Z",
    prompt: {
      title: "What is the best video?",
    },
  },
  {
    id: "4",
    spaceId: "1",
    category: "video",
    startTime: "2023-05-4T22:15:49Z",
    voteTime: "2023-05-5T22:15:49Z",
    endTime: "2023-05-8T22:15:49Z",
    created: "2023-05-4T22:15:49Z",
    prompt: {
      title: "What is the best IRL picture?",
    },
  },
];

const spaceRewards = [
  {
    type: "ETH",
    symbol: "ETH",
    decimals: 18,
    amount: 5,
  },

  {
    type: "ERC20",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "USDC",
    decimals: 6,
    amount: 1000,
  },
  {
    type: "ERC721",
    address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    symbol: "NOUN",
    decimals: 0,
    amount: 5,
  },

  {
    type: "ERC1155",
    address: "0xab0ab2fc1c498942B24278Bbd86bD171a3406A5E",
    symbol: "MmSzr",
    decimals: 0,
    amount: 100,
  },
];
// calculate label
// function takes start time, vote time, end time and returns either "accepting submissions", "voting", or "closed"

function calculateStatus(startTime: string, voteTime: string, endTime: string) {
  const now = new Date().toISOString();
  if (now < voteTime) {
    return {
      label: "accepting submissions",
      timeRemaining: "6 days",
    };
  } else if (now > voteTime && now < endTime) {
    return {
      label: "voting",
      timeRemaining: "6 days",
    };
  } else if (now > endTime) {
    return { label: "closed", timeRemaining: "6 days" };
  }
}

const getSpace = async (name: string) => {
  const results = await graphqlClient
    .query(SpaceDocument, { name })
    .toPromise();
  if (results.error) throw new Error(results.error.message);
  if (!results.data.space) throw new Error("Space not found");
  results.data.space.contests = contests;
  results.data.space.twitter = "@thenounsquare";
  results.data.space.website = "https://calabara.com";
  return results.data;
};

export default async function Page({ params }: { params: { name: string } }) {
  try {
    const spaceData = await getSpace(params.name);
    const { contests, displayName, logoUrl, twitter, website } =
      spaceData.space;
    return (
      <div className="flex flex-col m-auto mt-6 w-[90vw] gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="avatar">
            <figure className=" w-20 lg:w-24 rounded-full bg-transparent">
              <Image
                src={"/noun-47.png"}
                alt={"org avatar"}
                height={300}
                width={300}
              />
            </figure>
          </div>
          <div className="flex flex-col">
            <h2 className="card-title text-3xl">The Noun Square</h2>
            {twitter && (
              <a
                href={`https:/twitter.com/${twitter}`}
                target="_blank"
                className="lg:ml-4 m-auto link"
              >
                {twitter}
              </a>
            )}
            {website && (
              <a
                href={`${website}`}
                target="_blank"
                className="lg:ml-4 m-auto link"
              >
                {website}
              </a>
            )}
          </div>
          <div className="flex flex-row justify-end gap-2 lg:ml-auto">
            <Link href={`/spacebuilder/edit/${spaceData.space.id}`}>
              <button className="btn btn-outline btn-accent">edit space</button>
            </Link>
            <br></br>
            <Link href={"/contestbuilder/create"}>
              <button className="btn btn-primary">create contest</button>
            </Link>
          </div>
        </div>
        <TotalRewards1 />

        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl">Contests</h1>
            <TabGroup />
          </div>
          <div className="grid grid-rows-1 lg:grid-cols-4 gap-4 justify-center w-full">
            {contests.map((contest: any) => {
              return <ContestCard contest={contest} />;
            })}
            {contests.map((contest: any) => {
              return <ContestCard contest={contest} />;
            })}
          </div>
        </div>
        {/*
        <pre className="text-white">{JSON.stringify(spaceData, null, 2)}</pre>
        */}
      </div>
    );
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}

export const ContestCard = ({ contest }: { contest: any }) => {
  const status = calculateStatus(
    contest.startTime,
    contest.voteTime,
    contest.endTime
  );
  return (
    <div
      key={contest.id}
      className="card bg-base-100 shadow-box
  transition-all duration-300 ease-linear
  cursor-pointer hover:scale-105 rounded-3xl p-4"
    >
      <div className="card-body  p-0">
        <h2 className="card-title mb-0">{contest.prompt.title}</h2>
        <p className="badge">{contest.category}</p>
        <p>{status?.label}</p>
        <p>{status?.timeRemaining}</p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

{
  /*}
export const TotalRewards = () => {
  return (
    <div className="flex flex-col justify-evenly items-center lg:w-1/4 gap-4 p-4 border-2 border-border rounded-lg shadow-box">
      <h2 className="text-2xl">Total Rewards Distributed</h2>
      {spaceRewards.map((reward) => {
        return (
          <div className="flex justify-between w-3/4">
            <TokenBadge token={reward} />
            <p>{reward.amount}</p>
          </div>
        );
      })}
    </div>
  );
};

*/
}

export const TotalRewards1 = () => {
  return (
    <div className="flex flex-col justify-evenly items-center gap-4 p-4">
      <h2 className="text-2xl">Total Rewards Distributed</h2>
      <div className="stats stats-vertical lg:stats-horizontal w-full">
        <div className="stat place-items-center">
          <div className="stat-title">ETH</div>
          <div className="stat-value">20</div>
          <div className="stat-desc">From January 1st to February 1st</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Tokens & NFTs</div>
          <div className="stat-value text-secondary">4,200</div>
          <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Twitter Engagement</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </div>
  );
};
