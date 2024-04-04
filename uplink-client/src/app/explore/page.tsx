import Link from "next/link";
import { Metadata } from "next";
import fetchSpaces from "@/lib/fetch/fetchSpaces";
import { Suspense } from "react";
import UplinkImage from "@/lib/UplinkImage"
import fetchActiveContests, { ActiveContest } from "@/lib/fetch/fetchActiveContests";
import Swiper from "@/ui/Swiper/Swiper";
import { calculateContestStatus } from "@/utils/staticContestState";
import { CategoryLabel, RemainingTimeLabel, StatusLabel } from "@/ui/ContestLabels/ContestLabels";
import { Boundary } from "@/ui/Boundary/Boundary";
import fetchTrendingSpaces from "@/lib/fetch/fetchTrendingSpaces";
import { SearchSpaces } from "./client";
import { HiTrendingUp } from "react-icons/hi";

// import fetchPopularSubmissions from "@/lib/fetch/fetchPopularSubmissions";
// import { RenderPopularSubmissions } from "@/ui/Submission/SubmissionDisplay";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  openGraph: {
    title: "Uplink",
    description: "Discover spaces on Uplink.",
    url: "/",
    siteName: "Uplink",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 600,
        alt: "Uplink",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const PromptSummary = async ({ contest }: { contest: ActiveContest }) => {
  return (
    <h2 className="line-clamp-1 text-center">
      {contest.promptData.title}
    </h2>
  );
};

// const PopularSubmissions = async () => {
//   const popularSubmissions = await fetchPopularSubmissions();
//   if (popularSubmissions.length === 0) return null;

//   return (
//     <div className="w-full flex flex-col gap-2 m-auto">
//       <h1 className="font-bold text-xl text-t1">Popular Submissions</h1>
//       <RenderPopularSubmissions submissions={popularSubmissions} />
//     </div>
//   );
// };

const ContestCard = ({
  linkTo,
  contest,
}: {
  contest: ActiveContest;
  linkTo: string;
}) => {
  const { contestState, stateRemainingTime } = calculateContestStatus(
    contest.deadlines,
    contest.metadata.type,
    contest.tweetId
  );
  return (
    <Link
      className="card animate-scrollInX
    cursor-pointer border border-border rounded-2xl p-4 h-full overflow-hidden w-[275px] transform 
    transition-transform duration-300 hoverCard will-change-transform no-select"
      href={linkTo}
      draggable={false}
    >
      <div className="card-body items-center p-0">
        <div className="flex flex-col gap-2 items-center">
          <div className="relative w-20 h-20 avatar online">
            <UplinkImage
              src={contest.space.logoUrl}
              alt="spaceLogo"
              fill
              className="mask mask-squircle object-cover"
              sizes="10vw"
            />
          </div>
          <h1 className="font-semibold text-xl line-clamp-1 overflow-ellipsis">
            {contest.space.displayName}
          </h1>
        </div>
        <PromptSummary contest={contest} />
        <div className="flex flex-row gap-2">
          <CategoryLabel category={contest.metadata.category} />
          <StatusLabel status={contestState} />
        </div>
        <RemainingTimeLabel remainingTime={stateRemainingTime} />
      </div>
    </Link>
  );
};

const ActiveContests = async () => {
  const activeContests = await fetchActiveContests();
  if (activeContests.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-end">
          <h1 className="font-bold text-xl text-t1">Active Contests</h1>
        </div>
        <Swiper listSize={activeContests.length - 1}>
          {activeContests.map((contest, index) => (
            <div className="snap-start snap-always h-full" key={index}>
              <ContestCard
                contest={contest}
                linkTo={`/contest/${contest.id}`}
              />
            </div>
          ))}
        </Swiper>
      </div>
    );
  }
  return null;
};

const TrendingSpaces = async () => {
  const trendingSpaces = await fetchTrendingSpaces();
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {trendingSpaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            draggable={false}
            href={`${space.name}`}
            className="relative flex flex-col items-center justify-center gap-4 
              cursor-pointer border border-border rounded-2xl p-4 full overflow-hidden w-full transform 
              transition-transform duration-300 hoverCard will-change-transform no-select animate-fadeIn"
          >
            <div className="relative w-28 h-28">
              <UplinkImage
                src={space.logoUrl}
                fill
                alt="spaceLogo"
                className="object-cover mask mask-circle"
                sizes={"10vw"}
              />
            </div>
            <div className="flex items-center justify-center gap-1 truncate">
              <h1 className="overflow-hidden text-xl font-semibold">
                {space.displayName.length > 15
                  ? space.displayName.slice(0, 15) + "..."
                  : space.displayName}
              </h1>
            </div>
            <span className="absolute top-2 right-3"><HiTrendingUp className="w-6 h-6 text-success"/></span>
          </Link>
        );
      })}
    </div>
  );
}

const isFuzzyMatch = (str1: string, str2: string, maxEdits: number = 2) => {
  let edits = 0;
  const len = Math.min(str1.length, str2.length);
  for (let i = 0; i < len; i++) {
    if (str1[i] !== str2[i]) {
      edits++;
      if (edits > maxEdits) {
        return false;
      }
    }
  }
  return true;
}

const normalizeString = (str: string) => {
  return str.trim().replace(/\s+/g, '').toLowerCase();
}

const AllSpaces = async ({searchTerm}: {searchTerm: string | null}) => {
  let spaces = await fetchSpaces();

  if(searchTerm){
    const decodedSearchTerm = decodeURIComponent(searchTerm);
    spaces = spaces.filter((space) => {
      return isFuzzyMatch(normalizeString(space.displayName), normalizeString(decodedSearchTerm));
    });
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {spaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            draggable={false}
            href={`${space.name}`}
            className="flex flex-col items-center justify-center gap-4 
              cursor-pointer border border-border rounded-2xl p-4 full overflow-hidden w-full transform 
              transition-transform duration-300 hoverCard will-change-transform no-select animate-fadeIn"
          >
            <div className="relative w-28 h-28">
              <UplinkImage
                src={space.logoUrl}
                fill
                alt="spaceLogo"
                className="object-cover mask mask-circle"
                sizes={"10vw"}
              />
            </div>
            <div className="flex items-center justify-center gap-1 truncate">
              <h1 className="overflow-hidden text-xl font-semibold">
                {space.displayName.length > 15
                  ? space.displayName.slice(0, 15) + "..."
                  : space.displayName}
              </h1>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const SpaceListSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {[...Array(20)].map((_, index) => {
        return (
          <div
            key={index}
            className="h-[190px] shimmer bg-base-100 rounded-xl"
          ></div>
        );
      })}
    </div>
  );
};


const ActiveContestsSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-6 w-[150px] rounded-xl bg-base-100 shimmer" />
      <div className="grid grid-cols-3 grid-rows-1 gap-4" >
        <div className="h-[190px] shimmer bg-base-100 rounded-xl w-full"></div>
        <div className="h-[190px] shimmer bg-base-100 rounded-xl w-full"></div>
        <div className="h-[190px] shimmer bg-base-100 rounded-xl w-full"></div>
      </div>
    </div>
  )
}

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const isAll = searchParams?.all === "true";
  const isTrending = !isAll;
  const searchTerm = searchParams?.query as string || null;
  return (
    <div className="flex flex-col w-11/12 lg:w-9/12 m-auto justify-center py-12 gap-4">
      {/* <PopularSubmissions /> */}
      <Suspense fallback={<ActiveContestsSkeleton />}>
        <ActiveContests />
      </Suspense>
      <div className="flex flex-col gap-4 w-full">
        <div className="rounded-lg border border-dashed p-3 lg:p-5 border-gray-700 ">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="font-bold text-xl text-t1">Spaces</h1>
              <div className="ml-auto">
                <Link
                  className="primary-btn"
                  href="/spacebuilder/create"
                  draggable={false}
                >
                  New Space
                </Link>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/explore`}
                  className={`hover:text-t1 ${isTrending ? "text-t1" : "text-t2"}`}
                  scroll={false}
                  draggable={false}
                >
                  Trending
                </Link>
                <div className={`${isTrending ? "bg-t1" : "bg-transparent"} w-full h-0.5 animate-scrollInX`} />
              </div>
              <div className="flex flex-col gap-1 w-fit">
                <Link
                  href={`/explore?all=true`}
                  className={`hover:text-t1 ${isAll ? "text-t1" : "text-t2"}`}
                  scroll={false}
                  draggable={false}
                >
                  All
                </Link>
                <div className={`${isAll ? "bg-t1" : "bg-transparent"} w-full h-0.5 animate-scrollInX`} />
              </div>
              <div className="ml-auto hidden md:flex">
                <SearchSpaces/>
              </div>  
            </div>
            <div className="p-2"/>
            <Suspense fallback={<SpaceListSkeleton />}>
              {isTrending && 
                <TrendingSpaces/>
              }  
            </Suspense>
        <div className="w-full h-0.5 bg-base-100 rounded-lg" />
          <Suspense fallback={<SpaceListSkeleton />}>
            {isAll && 
              <AllSpaces searchTerm={searchTerm}/>
            }
          </Suspense>
        </div>
        </div>
      </div> 
    </div>
  );
}
