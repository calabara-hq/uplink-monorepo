import Image from "next/image";
import { ParseBlocks } from "@/lib/blockParser";
import { CategoryLabel, StatusLabel } from "../ContestLabels/ContestLabels";
import { calculateContestStatus } from "@/utils/staticContestState";
const Prompt = async ({
  contestId,
  space,
  metadata,
  deadlines,
  promptUrl,
  tweetId,
}: {
  contestId: string;
  space: any;
  metadata: any;
  deadlines: any;
  promptUrl: string;
  tweetId: string | null;
}) => {
  const { contestState: status } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );

  const prompt = await fetch(promptUrl).then((res) => res.json());

  return (
    <div className="card lg:card-side bg-transparent gap-4 h-min">
      <div className="card-body w-full lg:w-full border-2 border-border shadow-box rounded-lg p-4 lg:p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-center">
          <div className="avatar">
            <div className=" w-20 lg:w-24 rounded-full bg-transparent">
              <Image
                src={space.logoUrl}
                alt={"org avatar"}
                height={300}
                width={300}
              />
            </div>
          </div>
          <h2 className="card-title text-xl lg:text-3xl">
            {space.displayName}
          </h2>
          <div className="flex flex-row items-center gap-2 lg:ml-auto">
            <CategoryLabel category={metadata.category} />
            <StatusLabel status={status} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start  gap-2 w-full">
          <div className="flex flex-col p-1 lg:p-4 gap-4 w-3/4">
            <p>{prompt.title}</p>
            <div>{ParseBlocks({ data: prompt.body })}</div>
          </div>
          {prompt.coverUrl && (
            <div className="w-fit lg:rounded-xl">
              <figure className="relative w-56 h-56 ">
                <Image
                  src={prompt.coverUrl}
                  alt="contest image"
                  fill
                  className="object-fill rounded-xl"
                />
              </figure>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prompt;
