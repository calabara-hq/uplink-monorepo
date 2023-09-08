import {
  CategoryLabel,
  ContestCategory,
  RemainingTimeLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";
import CardSubmission from "@/ui/Submission/CardSubmission";
import { calculateContestStatus } from "@/utils/staticContestState";
import Image from "next/image";
import Link from "next/link";
import { BiPlusCircle } from "react-icons/bi";
import { HiOutlineTrash, HiPhoto } from "react-icons/hi2";

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
    <div className="grid grid-rows-[80%_20%] h-screen">
      <div className="from-[#1c1f26] to-[#1c1f26] text-white grid place-items-center items-center bg-gradient-to-br pt-5">
        <div className="relative hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-10 pb-10 lg:pb-0 lg:flex-row lg:gap-0 xl:gap-20 ">
          <div className="lg:pl-10 ">
            <div className="mb-2 py-4 text-left ">
              <h1 className="mb-2 text-5xl font-[700] text-t1">
                Crafted for creators
              </h1>
              <h2 className="text-lg max-w-md text-t1">
                Uplink is where creativity finds its canvas. Dive into a vibrant
                community where your knack earns more than just applause.
              </h2>
            </div>
          </div>
          <div className="m-auto w-full max-w-sm">
            <div className="mockup-window bg-base-100 border border-border">
              <div className="grid grid-cols-[32px_auto] md:grid-cols-[64px_auto] bg-base-200 p-4">
                <Image
                  src={"/swim-shady.png"}
                  alt="swim shady"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex-grow flex flex-col gap-2 ml-4">
                  <p className="text-t1">Noun 9999 in 3333D!</p>
                  <div className="flex-grow flex flex-col items-center">
                    <div className="relative w-full">
                      {/* <span className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg">
                      <HiOutlineTrash className="w-5 h-5" />
                    </span> */}
                      <Image
                        src={"/9999-winner.jpeg"}
                        alt="twitter submission"
                        width={200}
                        height={200}
                        className="rounded-lg object-contain"
                      />
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
        <svg
          className="fill-[#FF638D] col-start-1 row-start-1 h-auto w-full self-end"
          width="1600"
          height="410"
          viewBox="0 0 1600 410"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V595H1546.7C1493.3 595 1386.7 595 1280 595C1173.3 595 1066.7 595 960 595C853.3 595 746.7 595 640 595C533.3 595 426.7 595 320 595C213.3 595 106.7 595 53.3 595H0V338Z"></path>
        </svg>
      </div>
      <div className="flex items-center justify-center bg-[#FF638D]" />
    </div>
  );
};

const ContentSection = async () => {
  const activeContests = await getActiveContests();
  const popularSubmissions = await getPopularSubmissions();

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col gap-2 w-10/12 m-auto p-2">
        <h1 className="font-bold text-3xl text-t1">Weekly Wave</h1>
        <h2 className="text-lg text-t2">
          Popular submissions. Updated weekly.
        </h2>
        <div className="w-9/12 sm:w-full m-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {popularSubmissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                basePath={`${submission.spaceName}/contests/${submission.contestId}`}
                submission={submission}
              />
            );
          })}
        </div>

        <h1 className="font-bold text-3xl text-t1">Active Contests</h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeContests.map((contest, idx) => {
            return (
              <ContestCard
                key={idx}
                contestId={contest.id}
                promptUrl={contest.promptUrl}
                spaceName={contest.space.name}
                spaceDisplayName={contest.space.displayName}
                spaceLogo={contest.space.logoUrl}
                linkTo={`${contest.space.name}/contests/${contest.id}`}
                metadata={contest.metadata}
                deadlines={contest.deadlines}
                tweetId={contest.tweetId}
              />
            );
          })}
        </div>
      </div>
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
  const showSpace = spaceName && spaceDisplayName && spaceLogo;
  const { contestState, stateRemainingTime } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );
  return (
    <Link
      className="card bg-base-100 
    cursor-pointer border border-border rounded-2xl p-4 h-fit overflow-hidden w-full transform 
    transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform"
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

export default async function Page() {
  return (
    <div className="flex flex-col w-full ">
      <BannerSection />
      {/*@ts-expect-error*/}
      <ContentSection />
    </div>
  );
}
