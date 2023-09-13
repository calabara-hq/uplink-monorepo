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
  console.log(JSON.stringify(prompt, null, 2));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
      <div className="flex flex-col gap-2 break-word">
        <h2 className="lg:text-3xl text-xl font-[600] text-t1">
          {prompt.title}
        </h2>
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
      <div className="w-full ml-auto">
        <Prompt
          space={space}
          metadata={metadata}
          deadlines={deadlines}
          prompt={prompt}
          tweetId={tweetId}
        />
      </div>
      <div className="w-full h-0.5 bg-base-100" />
    </div>
  );
};

export default ContestHeading;
