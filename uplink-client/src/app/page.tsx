import {
  CategoryLabel,
  RemainingTimeLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";
import { ContestCategory } from "@/types/contest";
import CardSubmission from "@/ui/Submission/CardSubmission";
import { calculateContestStatus } from "@/utils/staticContestState";
import Image from "next/image";
import Link from "next/link";
import ArtistPfp from "@/../public/pumey_pfp.jpg";
import ArtistSubmission from "@/../public/vinnie_noggles.png";
import landingBg from "@/../public/landing-bg.svg";
import { Swiper, SwiperSlide } from "@/ui/Swiper/Swiper";
import { BiCategoryAlt, BiTime } from "react-icons/bi";


import { LuCoins, LuSettings2, LuVote } from "react-icons/lu";
import { HiOutlineDocument, HiOutlineLockClosed } from "react-icons/hi2";
import { DelayedGridItem, DelayedGridLayout } from "./DelayedGrid";
import { BiPlusCircle } from "react-icons/bi";
import { HiPhoto } from "react-icons/hi2";




const getActiveContests = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query ActiveContests {
        activeContests {
          id
          tweetId
          promptUrl
          deadlines {
            startTime
            voteTime
            endTime
          }
          metadata {
            type
            category
          }
          space {
            logoUrl
            displayName
            name
          }
        }
      }`,
    }),
    next: { revalidate: 60 },
  })
    .then((res) => res.json())
    .then((res) => res.data.activeContests);
  return data;
};

const getPopularSubmissions = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query PopularSubmissions {
        popularSubmissions {
          author
          contestCategory
          spaceDisplayName
          spaceName
          contestId
          created
          id
          type
          url
          version
        }
      }`,
    }),
    next: { revalidate: 60 },
  })
    .then((res) => res.json())
    .then((res) => res.data.popularSubmissions)
    .then(async (submissions) => {
      return await Promise.all(
        submissions.map(async (submission, idx) => {
          const data = await fetch(submission.url).then((res) => res.json());
          return { ...submission, data: data };
        })
      );
    });
  return data;
};

const BannerSection = () => {
  return (
    <div className="w-full h-screen min-h-[750px] flex-grow flex flex-col bg-base-100 relative">
      <div className="grid place-items-center items-center bg-gradient-to-br">
        <div className="hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-5 lg:gap-10 lg:flex-row xl:gap-20 z-[1]">
          <div className="lg:pl-10 ">
            <div className="flex flex-col gap-2 mb-2 py-4 text-left ">
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
                <Image
                  src={ArtistPfp}
                  alt="swim shady"
                  width={50}
                  height={50}
                  sizes="10vw"
                  className="rounded-full"
                />
                <div className="flex-grow flex flex-col gap-2 ml-4">
                  <p className="text-t1">
                    <span className="text-primary">@vinniehager</span> noggles!
                  </p>
                  <div className="flex-grow flex flex-col items-center">
                    <div className="relative w-full">
                      <Image
                        src={ArtistSubmission}
                        alt="twitter submission"
                        className="rounded-lg object-contain"
                        sizes="50vw"
                        priority
                      />
                    </div>
                    <div className="text-sm text-t2 italic font-[500] self-start text-left">
                      <Link
                        href="https://twitter.com/pumey_arts"
                        target="_blank"
                        className="hover:underline"
                        prefetch={false}
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
      <Image
        src={landingBg}
        alt=""
        fill
        className="absolute !h-[80%] !bottom-0 !left-0 !top-auto object-cover"
      />
    </div>
  );
};

const ContestCard = ({
  contestId,
  promptUrl,
  linkTo,
  metadata,
  deadlines,
  spaceName,
  spaceDisplayName,
  spaceLogo,
  tweetId,
}: {
  contestId: string;
  promptUrl: string;
  linkTo: string;
  metadata: { category: ContestCategory; type: "twitter" | "standard" };
  deadlines: { startTime: string; voteTime: string; endTime: string };
  spaceName: string;
  spaceDisplayName: string;
  spaceLogo: string;
  tweetId: string | null;
}) => {
  const { contestState, stateRemainingTime } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );
  return (
    <Link
      className="card bg-base-100 animate-scrollInX
    cursor-pointer border border-border rounded-2xl p-4 h-fit overflow-hidden w-full transform 
    transition-transform duration-300 hoverCard will-change-transform no-select"
      href={linkTo}
    >
      <div className="card-body items-center p-0">
        <div className="flex flex-col gap-2 items-center">
          <div className="avatar online">
            <Image
              src={spaceLogo}
              width={82}
              height={82}
              alt="spaceLogo"
              className="mask mask-squircle"
            />
          </div>
          <h1 className="font-bold text-2xl">{spaceDisplayName}</h1>
        </div>
        {/*@ts-expect-error*/}
        <PromptSummary promptUrl={promptUrl} />
        <div className="flex flex-row gap-2">
          <CategoryLabel category={metadata.category} />
          <StatusLabel status={contestState} />
        </div>
        <RemainingTimeLabel remainingTime={stateRemainingTime} />
      </div>
    </Link>
  );
};

const PromptSummary = async ({ promptUrl }: { promptUrl: string }) => {
  const { title } = await fetch(promptUrl).then((res) => res.json());

  return (
    <div className="flex-grow overflow-hidden">
      <h2 className="card-title mb-0 normal-case whitespace-nowrap overflow-ellipsis overflow-hidden">
        {title}
      </h2>
    </div>
  );
};

const ActiveContests = async () => {
  const activeContests = await getActiveContests();
  if (activeContests.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-t1 px-12">Active Contests</h1>

        <div className="w-full">
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            slidesPerGroup={3}
            breakpoints={{
              320: {
                slidesPerView: 1.4,
                slidesPerGroup: 1,
                spaceBetween: 10,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 10,
              },
              850: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 16,
              },
            }}
          >
            {activeContests.map((contest, index) => (
              <SwiperSlide key={index}>
                <ContestCard
                  contestId={contest.id}
                  promptUrl={contest.promptUrl}
                  spaceName={contest.space.name}
                  spaceDisplayName={contest.space.displayName}
                  spaceLogo={contest.space.logoUrl}
                  linkTo={`${contest.space.name}/contest/${contest.id}`}
                  metadata={contest.metadata}
                  deadlines={contest.deadlines}
                  tweetId={contest.tweetId}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }
  return null;
};

const PopularSubmissions = async () => {
  const popularSubmissions = await getPopularSubmissions();

  return (
    <div className="w-full flex flex-col gap-2 m-auto">
      <h1 className="font-bold text-3xl text-t1 px-12">Weekly Wave</h1>
      <h2 className="text-lg text-t2 px-12">
        Popular submissions. Updated weekly.
      </h2>
      <div className="w-full">
        <Swiper
          spaceBetween={16}
          slidesPerView={3}
          slidesPerGroup={3}
          breakpoints={{
            320: {
              slidesPerView: 1.4,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            500: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 10,
            },
            850: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 16,
            },
            1200: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 16,
            },
          }}
        >
          {popularSubmissions.map((submission, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full animate-scrollInX">
                <CardSubmission
                  submission={submission}
                  basePath={`${submission.spaceName}/contest/${submission.contestId}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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
        {/*@ts-expect-error*/}
        <ActiveContests />
        {/*@ts-expect-error*/}
        <PopularSubmissions />
        <div className="w-full px-4 lg:px-12">
          <ContestBanner />
        </div>
      </div>
    </div>
  );
}
