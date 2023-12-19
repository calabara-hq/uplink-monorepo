import {
  CategoryLabel,
  RemainingTimeLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";
import { calculateContestStatus } from "@/utils/staticContestState";
import Image from "next/image";
import Link from "next/link";
import ArtistPfp from "@/../public/pumey_pfp.jpg";
import ArtistSubmission from "@/../public/vinnie_noggles.png";
import landingBg from "@/../public/landing-bg.svg";
import dynamic from "next/dynamic";
import { BiCategoryAlt, BiTime } from "react-icons/bi";
import { LuCoins, LuSettings2, LuVote } from "react-icons/lu";
import { HiOutlineDocument, HiOutlineLockClosed } from "react-icons/hi2";
import { BiPlusCircle } from "react-icons/bi";
import { HiPhoto } from "react-icons/hi2";
import fetchActiveContests, {
  ActiveContest,
} from "@/lib/fetch/fetchActiveContests";
import fetchPopularSubmissions from "@/lib/fetch/fetchPopularSubmissions";
import { RenderPopularSubmissions } from "@/ui/Submission/SubmissionDisplay";
import UplinkImage from "@/lib/UplinkImage";
import Swiper from "@/ui/Swiper/Swiper";


const DelayedGridLayout = dynamic(
  () => import("@/ui/DelayedGrid/DelayedGridLayout"),
  {
    ssr: false,
  }
);

const DelayedGridItem = dynamic(
  () => import("@/ui/DelayedGrid/DelayedGridItem"),
  {
    ssr: false,
  }
);

const CardSubmission = dynamic(() => import("@/ui/Submission/CardSubmission"), {
  ssr: false,
});

const SwiperSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 px-12 m-auto">
      <div className="w-full shimmer h-72 bg-base-100 rounded-lg" />
      <div className="w-full shimmer h-72 bg-base-100 rounded-lg hidden md:block" />
      <div className="w-full shimmer h-72 bg-base-100 rounded-lg hidden lg:block" />
      <div className="w-full shimmer h-72 bg-base-100 rounded-lg hidden lg:block" />
    </div>
  );
};

const BannerSection = () => {
  return (
    <div className="w-full h-screen min-h-[750px] flex-grow flex flex-col bg-base-100 relative">
      <div className="grid place-items-center items-center bg-gradient-to-br">
        <div className="hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-5 lg:gap-10 lg:flex-row xl:gap-20 z-[1]">
          <div className="lg:pl-10 ">
            <div className="flex flex-col gap-2 py-4 text-left ">
              <div className="flex gap-2">
                <h1 className="mb-2 text-5xl font-[700] text-t1 w-fit">
                  Unleash your biggest fans
                </h1>
              </div>
              <h2 className="text-lg max-w-md text-t1">
                Uplink lets individuals, brands, and decentralized orgs create
                rewards systems to amplify their reach and co-create
                masterpieces with their most passionate supporters.
              </h2>
            </div>
          </div>
          <div className="m-auto w-full max-w-[300px] sm:max-w-sm lg:max-w-lg animate-springUp">
            <div className="mockup-window bg-base-100 border border-border">
              <div className="grid grid-cols-[32px_auto] md:grid-cols-[64px_auto] bg-base-200 p-4">
                <UplinkImage
                  src={ArtistPfp}
                  alt="swim shady"
                  width={50}
                  height={50}
                  sizes="10vw"
                  className="rounded-full"
                  blur={false}
                />
                <div className="flex-grow flex flex-col gap-2 ml-4">
                  <p className="text-t1">
                    <span className="text-primary">@vinniehager</span> noggles!
                  </p>
                  <div className="flex-grow flex flex-col items-center">
                    <div className="relative w-full">
                      <UplinkImage
                        src={ArtistSubmission}
                        alt="twitter submission"
                        className="rounded-lg object-contain"
                        width={600}
                        priority
                        blur={false}
                      />
                    </div>
                    <div className="text-sm text-t2 italic font-[500] self-start text-left">
                      <Link
                        href="https://twitter.com/pumey_arts"
                        target="_blank"
                        className="hover:underline"
                        prefetch={false}
                        draggable={false}
                      >
                        @pumey_arts -
                      </Link>{" "}
                      Vinnie Hager x Nouns contest
                    </div>
                  </div>
                  <div className="w-full h-0.5 bg-border"></div>
                  <div className="flex items-center justify-start w-full">
                    <HiPhoto className="w-5 h-5 opacity-50" />
                    <BiPlusCircle className="w-5 h-5 opacity-50 ml-auto mr-2" />
                    <button
                      className="btn btn-xs btn-primary normal-case"
                      disabled
                    >
                      Submitting
                      <div
                        className="text-xs ml-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UplinkImage
        src={landingBg}
        alt=""
        fill
        className="absolute !h-[70%] !bottom-0 !left-0 !top-auto object-cover"
        blur={false}
      />
    </div>
  );
};

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
      className="card bg-base-100 animate-scrollInX
    cursor-pointer border border-border rounded-2xl p-4 h-full overflow-hidden w-full min-w-[250px] transform 
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

const PromptSummary = async ({ contest }: { contest: ActiveContest }) => {
  return (
    <h2 className="line-clamp-1 text-center">
      {contest.promptData.title}
    </h2>
  );
};

const ActiveContests = async () => {
  const activeContests = await fetchActiveContests();
  if (activeContests.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-2 px-2 md:px-12 items-end">
          <h1 className="font-bold text-3xl text-t1">Active Contests</h1>
        </div>
        <Swiper listSize={activeContests.length -1}>
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

const PopularSubmissions = async () => {
  const popularSubmissions = await fetchPopularSubmissions();
  if (popularSubmissions.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 m-auto">
      <h1 className="font-bold text-3xl text-t1 px-2 md:px-12">Weekly Wave</h1>
      <h2 className="text-lg text-t2 px-2 md:px-12">
        Popular submissions. Updated weekly.
      </h2>
      <RenderPopularSubmissions submissions={popularSubmissions} />
    </div>
  );
};

const ContestBanner = () => {
  const steps = [
    {
      name: "Contest Type",
      background: "bg-primary",
      icon: <BiCategoryAlt className="w-24 h-24 text-primary" />,
    },

    {
      name: "Deadlines",
      background: "bg-error",
      icon: <BiTime className="w-24 h-24 text-error" />,
    },

    {
      name: "Prompt",
      background: "bg-purple-500",
      icon: <HiOutlineDocument className="w-24 h-24 text-purple-500" />,
    },
    {
      name: "Voting Policy",
      background: "bg-warning",
      icon: <LuVote className="w-24 h-24 text-warning" />,
    },

    {
      name: "Submitter Rewards",
      background: "bg-green-400",
      icon: <LuCoins className="w-24 h-24 text-green-400" />,
    },

    {
      name: "Voter Rewards",
      background: "bg-purple-500",
      icon: <LuCoins className="w-24 h-24 text-purple-500" />,
    },
    {
      name: "Submitter Restrictions",
      background: "bg-orange-600",
      icon: <HiOutlineLockClosed className="w-24 h-24 text-orange-600" />,
    },

    {
      name: "Extras",
      background: "bg-gray-500",
      icon: <LuSettings2 className="w-24 h-24 text-t2" />,
    },
  ];

  return (
    <div className="w-full m-auto grid grid-cols-1 lg:grid-cols-2 rounded-xl bg-base-100 bg-opacity-40">
      <div className="flex flex-col items-start md:items-center lg:items-start justify-end lg:justify-center w-3/4 lg:w-2/3 m-auto gap-6 break-words h-[36vh] lg:h-[60vh]">
        <span className="flex flex-col gap-0.5 items-start font-bold text-3xl">
          <h1 className="text-t1">Unlimited flexibility</h1>
          <h1 className="text-t2">for your next big idea. </h1>
        </span>
        <Link
          href={"/spacebuilder/create"}
          className="btn btn-primary btn-md rounded-md normal-case shadow-black shadow-2xl"
          draggable={false}
        >
          Create a Contest
        </Link>
      </div>

      <div className="relative w-full overflow-hidden h-[60vh]">
        <DelayedGridLayout gridStyle="absolute top-0 left-0 md:right-0 w-[600px] h-full grid grid-cols-3 auto-rows-fr gap-2 !rotate-[-20deg]">
          {steps.map((step, idx) => {
            return (
              <DelayedGridItem
                key={idx}
                gridItemStyle="box border border-border p-2 rounded-xl flex flex-col gap-2 items-center justify-evenly"
                delay={idx * 0.2}
              >
                <h2 className="font-bold text-t1 text-xl text-center">
                  {step.name}
                </h2>
                {step.icon}
              </DelayedGridItem>
            );
          })}
        </DelayedGridLayout>
      </div>
    </div>
  );
};

export default async function Page() {
  return (
    <div className="flex flex-col w-full gap-12 mb-16">
      <BannerSection />
      <div className="flex flex-col w-full md:w-10/12 m-auto gap-12">
        <ActiveContests />
        <PopularSubmissions />
        <div className="w-full px-4 lg:px-12">
          <ContestBanner />
        </div>
      </div>
    </div>
  );
}
