import Link from "next/link";
import Image from "next/image";
import { BiPencil, BiWorld } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";
import { Metadata } from "next";
import ListContests from "./ListContests";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import fetchSpaceContests from "@/lib/fetch/fetchSpaceContests";
import { Suspense } from "react";
import { calculateContestStatus } from "@/utils/staticContestState";
import { HiSparkles } from "react-icons/hi2";
import {
  CategoryLabel,
  RemainingTimeLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";

const SpaceInfoSekelton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full h-48 bg-base-100 rounded-xl" />
      <div className="w-full h-8 bg-base-100 rounded-lg" />
    </div>
  );
};

const SpaceContestsSkeleton = () => {
  return (
    <div className="flex flex-col w-full lg:w-3/4 ml-auto mr-auto gap-10 border-2 border-border p-6 rounded-xl min-h-[500px]">
      <div className="flex w-full items-center">
        <div className="w-48 h-8 bg-base-100 rounded-lg" />
        <div className="grid grid-cols-3 gap-4 w-64 ml-auto">
          <div className="bg-base-200 h-8 rounded-lg" />
          <div className="bg-base-100 h-8 rounded-lg" />
          <div className="bg-base-100 h-8 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full">
        <div className="bg-base-100 h-24 rounded-xl" />
        <div className="bg-base-100 h-24 rounded-xl" />
        <div className="bg-base-100 h-24 rounded-xl" />
        <div className="bg-base-100 h-24 rounded-xl" />
        <div className="bg-base-100 h-24 rounded-xl" />
      </div>
    </div>
  );
};

const SpaceInfo = async ({ name }: { name: string }) => {
  const { displayName, logoUrl, twitter, website } = await fetchSingleSpace(name);
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
          <h2 className="card-title text-3xl text-center">{displayName}</h2>
        </div>
        <div className="flex flex-row gap-2">
          {twitter && (
            <Link
              href={`https://twitter.com/${twitter}`}
              draggable={false}
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
              draggable={false}
              target="_blank"
              className="link link-neutral"
              prefetch={false}
            >
              <BiWorld className="w-6 h-6" />
            </Link>
          )}
          <Link
            href={`/spacebuilder/edit/${name}`}
            draggable={false}
            className="link link-neutral"
          >
            <BiPencil className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ContestCard = ({ contest, spaceName }) => {
  const { id, metadata, promptData, deadlines, tweetId } = contest;
  const contestId = id;
  const contestTitle = promptData.title;
  const category = metadata.category;
  const { contestState, stateRemainingTime } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );

  return (
    <Link href={`${spaceName}/contest/${contestId}`} draggable={false}>
      <div
        key={contestId}
        className="card bg-base-100
        cursor-pointer border border-border rounded-2xl p-4 h-full max-h-36 overflow-hidden w-full transform transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform"
      >
        <div className="card-body items-start p-0">
          <div className="flex w-full">
            <div className="flex-grow ">
              <h2
                className={`card-title mb-0 normal-case break-all line-clamp-2`}
              >
                {contestTitle}
              </h2>
            </div>
            <div className="ml-2">
              <CategoryLabel category={category} />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <StatusLabel status={contestState} />
            <RemainingTimeLabel remainingTime={stateRemainingTime} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CardMap = ({ contests, spaceName }) => {
  return (
    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full animate-fadeIn p-6">
      {contests.map((contest, idx) => {
        return <ContestCard key={idx} {...{ contest, spaceName }} />;
      })}
    </div>
  );
};

const SpaceContests = async ({
  name,
  isAllContests,
}: {
  name: string;
  isAllContests: boolean;
}) => {
  const allContests = await fetchSpaceContests(name);
  const now = new Date().toISOString();
  const activeContests = allContests.filter((contest) => {
    return contest.deadlines.endTime > now;
  });

  return (
    <ListContests
      allContestsChild={<CardMap contests={allContests} spaceName={name} />}
      activeContestsChild={
        <CardMap contests={activeContests} spaceName={name} />
      }
      isActiveContests={activeContests.length > 0}
      isContests={allContests.length > 0}
      newContestChild={
        <Link href={`${name}/contest/create`} className="btn btn-ghost btn-sm text-t2 normal-case ml-2">
          <span>New</span>
          <HiSparkles className="h-5 w-5 text-secondary pl-0.5" />
        </Link>
      }
    />
  );
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { isAllContests: string };
}) {
  const { name } = params;
  const isAllContests = searchParams.isAllContests === "true";
  return (
    <div className="flex flex-col md:flex-row m-auto py-6 w-11/12 gap-4">
      <div className="flex flex-col w-full md:w-56 gap-4">
        <Suspense fallback={<SpaceInfoSekelton />}>
          {/*@ts-expect-error*/}
          <SpaceInfo name={name} />
        </Suspense>
        {/* <Stats /> */}
      </div>
      <div className="flex flex-col flex-grow">
        <Suspense fallback={<SpaceContestsSkeleton />}>
          {/*@ts-expect-error*/}
          <SpaceContests name={name} isAllContests={isAllContests} />
        </Suspense>
      </div>
    </div>
  );
}

// const Stats = () => {
//   return (
//     <div className="stats stats-horizontal md:stats-vertical w-full bg-transparent border-2 border-border shadow-box">
//       <div className="stat">
//         <div className="stat-figure text-primary">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline-block w-8 h-8 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//             ></path>
//           </svg>
//         </div>
//         <div className="stat-title">ETH rewards</div>
//         <div className="stat-value text-primary">25.6K</div>
//         <div className="stat-desc"></div>
//       </div>

//       <div className="stat">
//         <div className="stat-figure text-secondary">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline-block w-8 h-8 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M13 10V3L4 14h7v7l9-11h-7z"
//             ></path>
//           </svg>
//         </div>
//         <div className="stat-title">ERC rewards</div>
//         <div className="stat-value text-secondary">2.6M</div>
//         <div className="stat-desc">tokens + nfts</div>
//       </div>
//     </div>
//   );
// };
