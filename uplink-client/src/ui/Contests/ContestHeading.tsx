import Image from "next/image";
import { ParseBlocks } from "@/lib/blockParser";
import { CategoryLabel, StatusLabel } from "../ContestLabels/ContestLabels";
import { calculateContestStatus } from "@/utils/staticContestState";
import Link from "next/link";
const Prompt = ({
  space,
  metadata,
  deadlines,
  prompt,
  tweetId,
}: {
  space: any;
  metadata: any;
  deadlines: any;
  prompt: any;
  tweetId: string | null;
}) => {
  const { contestState: status } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );
console.log(JSON.stringify(prompt, null, 2))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full border border-border rounded-lg p-4">
      <div className="flex flex-col gap-2 break-word">
        <h2 className="lg:text-3xl text-xl font-[600] text-t1">{prompt.title}</h2>
        <div className="flex flex-row gap-2 items-center">
          <Link
            className="relative w-8 h-8 flex flex-col"
            href={`/${space.name}`}
          >
            <Image
              src={space.logoUrl}
              alt="Org Avatar"
              fill
              className="rounded-full object-contain"
            />
          </Link>
          <Link
            className="card-title text-sm text-t2 hover:underline hover:text-t1"
            href={`/${space.name}`}
          >
            {space.displayName}
          </Link>
          <CategoryLabel category={metadata.category} />
          <StatusLabel status={status} />
        </div>
        <div className="grid grid-cols-1">
          {ParseBlocks({ data: prompt.body, omitImages: false })}
        </div>
      </div>
      <div className="grid grid-cols-1 w-full gap-2">
        {prompt.coverUrl && (
          <div className="relative w-full h-32 sm:h-64">
            <Image
              src={prompt.coverUrl}
              alt="contest image"
              fill
              className="object-contain rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ContestExplainer = () => {
  return (
    <div className="grid grid-rows-[90%_10%] rounded-lg">
      <div className="from-[#00223390] to-[#002233] text-white grid place-items-center items-center bg-gradient-to-br rounded-xl">
        <div className="relative hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-10 pb-10 lg:pb-0 lg:flex-row  lg:gap-0 xl:gap-20  ">
          <div className="lg:pl-10 ">
            <div className="mb-2 py-4 text-center lg:text-left ">
              {/* <h1 className="font-title mb-2 text-4xl sm:text-5xl lg:text-6xl font-virgil">
              Twitter Contest
            </h1>
            <h2 className="font-title text-lg font-extrabold sm:text-xl lg:text-2xl text-t1">
              Create a submission in 3 easy steps.
              <br />
              When you're done, we'll tweet it
              <br />
              for you!
            </h2> */}
            </div>
          </div>
          <div className="w-full max-w-sm">{/*hero right */}</div>
        </div>
        <svg
          className="fill-[#57BAD7] col-start-1 row-start-1 h-auto w-full self-end rounded-t-xl"
          width="1200"
          height="410"
          viewBox="0 0 1600 410"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V595H1546.7C1493.3 595 1386.7 595 1280 595C1173.3 595 1066.7 595 960 595C853.3 595 746.7 595 640 595C533.3 595 426.7 595 320 595C213.3 595 106.7 595 53.3 595H0V338Z"></path>
        </svg>
      </div>
      <div className="flex flex-col gap-2 bg-[#57BAD7] rounded-b-lg" />
    </div>
  );
};

const ContestHeading = ({
  space,
  metadata,
  deadlines,
  tweetId,
  prompt,
}: {
  space: any;
  metadata: any;
  deadlines: any;
  tweetId: string | null;
  prompt: any;
}) => {
  return (
    <div className="grid grid-cols-1 w-full gap-2">
      {/* <OrgDetails space={space} /> */}
      {/* <ContestExplainer /> */}
      <div className="w-full ml-auto">
        <Prompt
          space={space}
          metadata={metadata}
          deadlines={deadlines}
          prompt={prompt}
          tweetId={tweetId}
        />
      </div>
    </div>
  );
};

export default ContestHeading;
