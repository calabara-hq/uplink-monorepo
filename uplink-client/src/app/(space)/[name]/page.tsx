import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import Link from "next/link";
import Image from "next/image";
import TokenBadge from "@/ui/TokenBadge/TokenBadge";
// import { getSpace } from "@/lib/fetch/space";
import { calculateContestStatus } from "@/utils/staticContestState";
import {
  CategoryLabel,
  StatusLabel,
  RemainingTimeLabel,
  ContestCategory,
} from "@/ui/ContestLabels/ContestLabels";
import { BiPencil, BiWorld } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const getSpace = async (name: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query space($name: String!){
          space(name: $name) {
            id
            name
            displayName
            logoUrl
            twitter
            website
            admins{
                address
            }
            contests {
                deadlines {
                  endTime
                  snapshot
                  startTime
                  voteTime
                }
                id
                metadata {
                  category
                }
                promptUrl
            }
          }
      }`,
      variables: {
        name,
      },
    }),
    next: { tags: [`space/${name}`] /*revalidate: 60 */ },
  })
    .then((res) => res.json())
    .then((res) => res.data.space);
  return data;
};

const SpaceInfo = async ({ name }: { name: string }) => {
  const space = await getSpace(name);
  const { id, contests, displayName, logoUrl, twitter, website } = space;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="avatar">
        <div className="w-48 rounded-xl bg-base-100">
          <Image
            src={logoUrl}
            alt={"org avatar"}
            width={192}
            height={192}
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row gap-2">
          <h2 className="card-title text-3xl">{displayName}</h2>
        </div>
        <div className="flex flex-row gap-2">
          {twitter && (
            <Link
              href={`https://twitter.com/${twitter}`}
              target="_blank"
              className="link link-neutral "
              prefetch={false}
            >
              <FaTwitter className="w-6 h-6" />
            </Link>
          )}
          {website && (
            <Link
              href={`${website}`}
              target="_blank"
              className="link link-neutral"
              prefetch={false}
            >
              <BiWorld className="w-6 h-6" />
            </Link>
          )}
          <Link href={`/spacebuilder/edit/${id}`} className="link link-neutral">
            <BiPencil className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="stats stats-horizontal md:stats-vertical w-full bg-transparent border-2 border-border shadow-box">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">ETH rewards</div>
        <div className="stat-value text-primary">25.6K</div>
        <div className="stat-desc"></div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">ERC rewards</div>
        <div className="stat-value text-secondary">2.6M</div>
        <div className="stat-desc">tokens + nfts</div>
      </div>
    </div>
  );
};

const ContestDisplay = ({
  contests,
  spaceName,
  isAllContests,
}: {
  contests: any;
  spaceName: string;
  isAllContests: boolean;
}) => {
  const now = new Date().toISOString();

  const filteredContests = isAllContests
    ? contests
    : contests.filter((contest) => {
        return contest.deadlines.endTime > now;
      });
  return (
    <div className="flex flex-col w-full lg:w-3/4 ml-auto mr-auto items-center gap-4 border-2 border-border p-6 rounded-xl shadow-box min-h-[500px]">
      <div className="flex flex-col lg:flex-row w-full lg:justify-between items-center">
        <h1 className="text-3xl font-bold">Contests</h1>
        <div
          tabIndex={0}
          className="tabs tabs-boxed content-center p-1 bg-transparent text-white font-bold"
        >
          <Link
            href={`${spaceName}`}
            className={`tab ${!isAllContests && "tab-active"}`}
          >
            Active
          </Link>
          <Link
            href={`${spaceName}?allContests=true`}
            className={`tab ${isAllContests && "tab-active"}`}
          >
            All Contests
          </Link>
          <Link href={`${spaceName}/contests/create`} className="tab">
            <span>New</span>
            <HiSparkles className="h-5 w-5 text-secondary pl-0.5" />
          </Link>
        </div>
      </div>

      {filteredContests.length === 0 && isAllContests && (
        <div className="card bg-base-100 m-auto border-2 border-border">
          <div className="card-body">
            <p>This space has not yet hosted any contests. Check back later!</p>
          </div>
        </div>
      )}
      {filteredContests.length === 0 && !isAllContests && (
        <div className="card bg-base-100 m-auto border-2 border-border">
          <div className="card-body">
            <p>No active contests</p>
            <Link
              href={`${spaceName}?allContests=true`}
              className="btn btn-sm btn-primary lowercase"
            >
              view previous
            </Link>
          </div>
        </div>
      )}
      {filteredContests.length > 0 && (
        <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full">
          {filteredContests.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              spaceName={spaceName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContestCard = ({
  spaceName,
  contest,
}: {
  contest: any;
  spaceName: any;
}) => {
  const { contestState, stateRemainingTime } = calculateContestStatus(
    contest.deadlines
  );
  return (
    <Link href={`${spaceName}/contests/${contest.id}`} prefetch={false}>
      <div
        key={contest.id}
        className="card bg-base-100 
        cursor-pointer border border-border rounded-2xl p-4 h-fit max-h-36 overflow-hidden w-full shimmer-hover"
      >
        <div className="card-body items-start p-0">
          <div className="flex w-full">
            <div className="flex-grow overflow-hidden">
              <h2 className="card-title mb-0 normal-case whitespace-nowrap overflow-ellipsis overflow-hidden">
                test prompt
              </h2>
            </div>
            <div className="ml-4">
              <CategoryLabel category={contest.metadata.category} />
            </div>
          </div>
          <StatusLabel status={contestState} />
          <RemainingTimeLabel remainingTime={stateRemainingTime} />
        </div>
      </div>
    </Link>
  );
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: any;
}) {
  try {
    const { allContests: isAllContests } = searchParams;
    const space = await getSpace(params.name);
    console.log(space);
    const { id, contests, displayName, logoUrl, twitter, website } = space;
    return (
      <div className="flex flex-col md:flex-row m-auto py-6 w-11/12 gap-4">
        <div className="flex flex-col w-full md:w-56 gap-4">
          {/*@ts-expect-error */}
          <SpaceInfo name={params.name} />
          <Stats />
        </div>
        <div className="flex flex-col flex-grow">
          <ContestDisplay
            contests={contests}
            spaceName={params.name}
            isAllContests={isAllContests}
          />
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}
