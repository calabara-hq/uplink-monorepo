import Link from "next/link";
import Image from "next/image";
import { BiLink, BiPencil } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";
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
    <div className="flex flex-row lg:flex-col gap-2 w-full">
      <div className="w-28 h-28 lg:w-48 lg:h-48 bg-neutral rounded-xl shimmer" />
      <div className="flex flex-col gap-2">
        <div className="w-28 h-4 bg-neutral rounded-lg shimmer" />
        <div className="w-12 h-4 bg-neutral rounded-lg shimmer" />
        <div className="w-12 h-4 bg-neutral rounded-lg shimmer" />
      </div>
    </div>
  );
};

const SpaceContestsSkeleton = () => {
  return (
    <div className="flex flex-col w-full lg:w-3/4 ml-auto mr-auto gap-10 border-2 border-border p-6 rounded-xl min-h-[500px]">
      <div className="flex w-full items-center">
        <div className="w-48 h-8 bg-neutral rounded-lg" />
        <div className="grid grid-cols-3 gap-4 w-64 ml-auto">
          <div className="bg-base-200 h-8 rounded-lg" />
          <div className="bg-neutral h-8 rounded-lg" />
          <div className="bg-neutral h-8 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full">
        <div className="bg-neutral h-24 rounded-xl" />
        <div className="bg-neutral h-24 rounded-xl" />
        <div className="bg-neutral h-24 rounded-xl" />
        <div className="bg-neutral h-24 rounded-xl" />
        <div className="bg-neutral h-24 rounded-xl" />
      </div>
    </div>
  );
};

const SpaceInfo = async ({ name }: { name: string }) => {
  const { displayName, logoUrl, twitter, website } = await fetchSingleSpace(
    name
  );

  return (
    <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-56  items-start">
      <div className="avatar">
        <div className="w-28 lg:w-48 rounded-full lg:rounded-xl">
          <Image
            src={logoUrl}
            alt={"org avatar"}
            fill
            className="rounded-xl object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-t1 font-semibold text-2xl break-words">
            {displayName}
          </h2>
        </div>

        <div className="flex flex-col gap-0.5 text-t2">
          <div className="flex flex-col md:flex-row lg:flex-col gap-0.5 md:gap-2lg:gap-0.5">
            {website && (
              <div className="flex flex-row gap-2 items-center hover:text-blue-500 w-fit">
                <BiLink className="w-5 h-5" />
                <Link
                  href={`${website}`}
                  draggable={false}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  prefetch={false}
                >
                  {website.includes("http") ? website.split("//")[1] : website}
                </Link>
              </div>
            )}
            {twitter && (
              <div className="flex flex-row gap-2 items-center hover:text-blue-500 w-fit">
                <FaTwitter className="w-4 h-4" />
                <Link
                  href={`https://twitter.com/${twitter}`}
                  draggable={false}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  prefetch={false}
                >
                  {twitter}
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center hover:text-t1 w-fit">
            <BiPencil className="w-5 h-5" />
            <Link href={`/spacebuilder/edit/${name}`} draggable={false}>
              edit
            </Link>
          </div>
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

const SpaceContests = async ({ name }: { name: string }) => {
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
        <Link
          href={`${name}/contest/create`}
          className="btn btn-ghost btn-sm text-t2 normal-case ml-2"
        >
          <span>New</span>
          <HiSparkles className="h-5 w-5 text-secondary pl-0.5" />
        </Link>
      }
    />
  );
};

export default async function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  return (
    <div className="w-full lg:w-11/12 m-auto py-6 px-2 flex flex-col-reverse lg:flex-row gap-8">
      <div className="w-full md:w-[70%] flex-grow m-auto">
        <Suspense fallback={<SpaceContestsSkeleton />}>
          {/*@ts-expect-error*/}
          <SpaceContests name={name} />
        </Suspense>
      </div>
      <div className="w-full md:w-[70%] lg:w-[20%] ml-auto mr-auto">
        <Suspense fallback={<SpaceInfoSekelton />}>
          {/*@ts-expect-error*/}
          <SpaceInfo name={name} />
        </Suspense>
      </div>
    </div>
  );

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
          <SpaceContests name={name} />
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
