import {
  CategoryLabel,
  ContestCategory,
  RemainingTimeLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";
import { RenderSubmission } from "@/ui/SubmissionCard/SubmissionCard";
import { calculateContestStatus } from "@/utils/staticContestState";
import Image from "next/image";
import Link from "next/link";

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
    .then((res) => res.data.activeContests)
    .catch((err) => {
      console.log(err);
      return [];
    });
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
    .catch((err) => {
      console.log(err);
      return [];
    });
  return data;
};

const BannerSection = () => {
  return (
    <div className="from-[#CC059590] to-[#CC0595] text-white grid place-items-center items-center bg-gradient-to-br pt-5">
      <div className="relative hero-content col-start-1 row-start-1 w-full max-w-7xl flex-col justify-between gap-10 pb-10 lg:pb-0 lg:flex-row  lg:gap-0 xl:gap-20  ">
        <div className="lg:pl-10 ">
          <div className="mb-2 py-4 text-center lg:text-left ">
            <h1 className="font-title mb-2 text-4xl sm:text-5xl lg:text-6xl font-[900] font-virgil">
              Uplink
            </h1>
            <h2 className="font-title text-lg font-extrabold sm:text-xl lg:text-2xl">
              Where creatives get <u>fun</u>ded
            </h2>
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
  );
};

const ContentSection = async () => {
  const activeContests = await getActiveContests();

  return (
    <div className="relative flex flex-col">
      <div className="h-[20vh] bg-[#FF638D]" />
      <div className="absolute flex flex-col gap-2 w-10/12 glass rounded-xl m-auto p-2 left-0 right-0">
        <h1 className="font-bold text-3xl text-white">Active Contests</h1>
        <div className="grid grid-cols-4 gap-4">
          {activeContests.map((contest) => {
            return (
              <ContestCard
                key={contest.id}
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

const ContentSection2 = async () => {
  const activeContests = await getActiveContests();
  const popularSubmissions = await getPopularSubmissions();

  return (
    <div className="relative flex flex-col">
      <div className="h-[10vh] bg-[#FF638D]" />
      <div className="flex flex-col gap-2 w-10/12 m-auto p-2">
        <div className="grid grid-cols-4 gap-4">
          {popularSubmissions.map((submission, idx) => {
            return (
              /*@ts-expect-error*/
              <SubmissionCard
                key={idx}
                submissionId={submission.id}
                spaceName={submission.spaceName}
                spaceDisplayName={submission.spaceDisplayName}
                author={submission.author}
                type={submission.type}
                url={submission.url}
                version={submission.version}
                created={submission.created}
                contestId={submission.contestId}
                contestCategory={submission.contestCategory}
              />
            );
          })}
        </div>

        <h1 className="text-3xl text-white">Active Contests</h1>

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

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-hidden gap-4 p-4">
          {activeContests.map((contest) => {
            return (
              <>
                <ContestCard
                  key={contest.id}
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
                <ContestCard
                  key={contest.id}
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
                <ContestCard
                  key={contest.id}
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
                <ContestCard
                  key={contest.id}
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
                <ContestCard
                  key={contest.id}
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
                <ContestCard
                  key={contest.id}
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
              </>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

const SubmissionCard = async ({
  submissionId,
  spaceName,
  spaceDisplayName,
  author,
  type,
  url,
  version,
  created,
  contestId,
  contestCategory,
}: {
  submissionId: string;
  spaceName: string;
  spaceDisplayName: string;
  author: string;
  type: string;
  url: string;
  version: string;
  created: string;
  contestId: string;
  contestCategory: string;
}) => {
  const { type: submissionFormat, ...submission } = await fetch(url).then(
    (res) => res.json()
  );

  if (type === "twitter") {
    return (
      <RenderSubmission
        context={"preview"}
        submissionType={submissionFormat}
        title={submission.title}
        author={author}
        video={submission.video}
        thumbnail={submission.thumbnail}
        image={submission.image}
        text={submission.text}
      />
    );
  } else if (type === "standard") {
  } else return null;
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
    <div className="flex flex-col w-full h-screen ">
      <BannerSection />
      {/*@ts-expect-error*/}
      <ContentSection2 />
    </div>
  );
}
