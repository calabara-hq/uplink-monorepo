import Link from "next/link";
import Image from "next/image";
import { BiLink, BiPencil, BiWorld } from "react-icons/bi";
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
import { ActiveContest } from "@/lib/fetch/fetchActiveContests";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Boundary } from "@/ui/Boundary/Boundary";

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
                <a
                  href={
                    /^(http:\/\/|https:\/\/)/.test(website)
                      ? website
                      : `//${website}`
                  }
                  rel="noopener noreferrer"
                  draggable={false}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {website.includes("http") ? website.split("//")[1] : website}
                </a>
              </div>
            )}
            {twitter && (
              <div className="flex flex-row gap-2 items-center hover:text-blue-500 w-fit">
                <FaTwitter className="w-4 h-4" />
                <Link
                  href={`https://twitter.com/${twitter}`}
                  rel="noopener noreferrer"
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

const ContestCard = ({
  contest,
}: {
  contest: ActiveContest;
}) => {
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
    <Link href={`/contest/${contestId}`} draggable={false}>
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

const CardMap = ({
  contests,
}: {
  contests: Array<ActiveContest>;
}) => {
  return (
    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full animate-fadeIn p-6">
      {contests.map((contest, idx) => {
        return <ContestCard key={idx} {...{ contest }} />;
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
      allContestsChild={<CardMap contests={allContests} />}
      activeContestsChild={
        <CardMap contests={activeContests} />
      }
      isActiveContests={activeContests.length > 0}
      isContests={allContests.length > 0}
      newContestChild={
        <Link
          href={`${name}/create-contest`}
          className="btn btn-ghost btn-sm text-t2 normal-case ml-2"
        >
          <span>New</span>
          <HiSparkles className="h-5 w-5 text-secondary pl-0.5" />
        </Link>
      }
    />
  );
};

const SpaceBoard = ({ name }: { name: string }) => {
  const items = Array(16).fill(0)
  return (
    <div className="flex flex-col">
      <h1>Board</h1>
      <div className="grid grid-cols-[auto_100px] gap-2">
        <div className="grid grid-cols-4 gap-2">
          {items.map((_, idx) => {
            return <p key={idx}>hey</p>
          })}
        </div>
        <Link href={`/${name}/board`} className="btn btn-ghost btn-sm text-t2 normal-case ml-2">
          <span>Board</span>
          <HiArrowNarrowRight className="h-5 w-5 text-secondary pl-0.5" />
        </Link>
      </div>
    </div>
  )
}


const AdminButtons = ({ name }: { name: string }) => {

  return (
    <Boundary labels={["Admin"]}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-end">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-t1">Configure Art Board</p>
            <p className="text-t2">Earn protocol rewards with your users by allowing them to mint under a template config</p>
          </div>
          <Link
            href={`${name}/board/settings`}
            className="btn btn-ghost btn-active btn-sm text-t1 normal-case ml-auto hover:text-primary"
          >
            <span>Configure</span>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-end">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-t1">Contest</p>
            <p className="text-t2">Create a contest</p>
          </div>
          <Link
            href={`${name}/create-contest`}
            className="btn btn-ghost btn-active btn-sm text-t1 normal-case ml-auto hover:text-secondary"
          >
            <span>New</span>
            <HiSparkles className="h-5 w-5 pl-0.5" />
          </Link>
        </div>
      </div>
    </Boundary>
  )
}


export default async function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  return (
    <div className="flex flex-col w-full lg:w-11/12 m-auto py-6 px-2 gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full md:w-[70%] lg:w-[20%] ml-auto mr-auto bg-blue-200">
          <Suspense fallback={<SpaceInfoSekelton />}>
            {/*@ts-expect-error*/}
            <SpaceInfo name={name} />
          </Suspense>
        </div>
        <div className="w-full flex flex-col md:w-[70%] flex-grow m-auto gap-8 ">
          <AdminButtons name={name} />
          <Suspense fallback={<SpaceContestsSkeleton />}>
            <SpaceBoard name={name} />
          </Suspense>
          <Suspense fallback={<SpaceContestsSkeleton />}>
            {/*@ts-expect-error*/}
            <SpaceContests name={name} />

          </Suspense>
        </div>

      </div>
      <div className="flex flex-col bg-red-200">

      </div>
    </div>
  );
}
