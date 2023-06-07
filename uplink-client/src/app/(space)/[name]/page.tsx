import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import Link from "next/link";
import Image from "next/image";
import TokenBadge from "@/ui/TokenBadge/TokenBadge";
import { getSpace } from "@/lib/fetch/space";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from "date-fns";
import { StatusLabel } from "@/ui/Contests/StatusLabel";

export const fetchCache = "force-no-store";

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
    const { id, contests, displayName, logoUrl, twitter, website } =
      space.data.space;
    return (
      <div className="flex flex-col items-center m-auto py-6 w-[90vw] gap-4">
        <div className="flex flex-col lg:flex-row gap-4 m-auto items-center w-4/5">
          <div className="avatar ">
            <div className="w-24 rounded-full bg-base-100">
              <Image
                src={logoUrl}
                alt={"org avatar"}
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="card-title text-3xl">{displayName}</h2>
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
            <Link href={`/spacebuilder/edit/${id}`}>
              <button className="btn btn-outline btn-accent">edit space</button>
            </Link>
            <br></br>
            <Link href={`${params.name}/contests/create`}>
              <button className="btn btn-primary">create contest</button>
            </Link>
          </div>
        </div>
        <div className="p-2" />
        <Stats />
        <div className="p-2" />
        <ContestDisplay
          contests={contests}
          spaceName={params.name}
          isAllContests={isAllContests}
        />
      </div>
    );
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}

function calculateStatus(deadlines: any) {
  const { startTime, voteTime, endTime } = deadlines;
  const start = parseISO(startTime);
  const vote = parseISO(voteTime);
  const end = parseISO(endTime);

  let contestState = null;
  let remainingTime = null;

  const now = new Date();
  let nextDeadline = end;

  if (now < start) {
    contestState = "pending";
    nextDeadline = start;
  } else if (now < vote) {
    contestState = "submitting";
    nextDeadline = vote;
  } else if (now < end) {
    contestState = "voting";
  } else {
    contestState = "end";
  }

  const seconds = differenceInSeconds(nextDeadline, now);
  const minutes = differenceInMinutes(nextDeadline, now);
  const hours = differenceInHours(nextDeadline, now);
  const days = differenceInDays(nextDeadline, now);

  if (days > 0) {
    remainingTime = `${days} days`;
  } else if (hours > 0) {
    remainingTime = `${hours} hrs`;
  } else if (minutes > 0) {
    remainingTime = `${minutes} mins`;
  } else {
    remainingTime = seconds > 0 ? `${seconds} s` : "";
  }

  return {
    contestState,
    stateRemainingTime: remainingTime,
  };
}

const ContestDisplay = ({
  contests,
  spaceName,
  isAllContests,
}: {
  contests: any;
  spaceName: string;
  isAllContests: boolean;
}) => {
  console.log(contests);

  const filteredContests = isAllContests
    ? contests
    : contests.filter((contest) => {
        const status = calculateStatus(contest.deadlines);
        return status.contestState !== "end";
      });

  return (
    <div className="flex flex-col w-full lg:w-3/4 m-auto items-center gap-4">
      <div className="flex flex-col lg:flex-row w-full lg:justify-between items-center">
        <h1 className="text-3xl font-bold">Contests</h1>
        <div
          tabIndex={0}
          className="tabs tabs-boxed content-center p-2 bg-transparent text-white font-bold"
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
        </div>
      </div>

      <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full">
        {filteredContests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            spaceName={spaceName}
          />
        ))}
      </div>
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
  const { contestState, stateRemainingTime } = calculateStatus(
    contest.deadlines
  );
  return (
    <Link href={`${spaceName}/contests/${contest.id}`}>
      <div
        key={contest.id}
        className="card bg-base-100 
      transition-all duration-300 ease-linear
      cursor-pointer hover:shadow-box hover:scale-105 rounded-3xl p-4 h-fit w-full"
      >
        <div className="card-body items-center p-0">
          <h2 className="card-title mb-0 normal-case">test prompt</h2>
          <p className="badge lg:badge-lg lowercase">
            {contest.metadata.category}
          </p>

          <StatusLabel status={contestState || "end"} />
          {stateRemainingTime && <p>{stateRemainingTime}</p>}

          <div className="card-actions justify-end"></div>
        </div>
      </div>
    </Link>
  );
};

const Stats = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-3/4 lg:m-auto">
      <div className="stats stats-vertical lg:stats-horizontal w-full bg-transparent border-2 border-border shadow-box">
        <div className="stat place-items-center">
          <div className="stat-title">ETH</div>
          <div className="stat-value">20</div>
          <div className="stat-desc">Jan 1st to Feb 1st</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Tokens & NFTs</div>
          <div className="stat-value">5</div>
          <div className="stat-desc text-accent">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Twitter Impressions</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </div>
  );
};
