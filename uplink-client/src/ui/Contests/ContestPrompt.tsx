import Image from "next/image";
import { DynamicLabel } from "@/ui/Contests/DynamicLabel";
import { ParseBlocks } from "@/lib/blockParser";
const Prompt = async ({
  contestId,
  metadata,
  deadlines,
  promptUrl,
}: {
  contestId: string;
  metadata: any;
  deadlines: any;
  promptUrl: string;
}) => {
  //TODO: remove these hardcoded values
  const space = {
    displayName: "Shark DAO",
  };
  const status = "submitting";

  const prompt = await fetch(promptUrl).then((res) => res.json());

  return (
    <div className="card lg:card-side bg-transparent gap-4 h-min">
      <div className="card-body w-full lg:w-full border-2 border-border shadow-box rounded-lg p-4 lg:p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-center">
          <div className="avatar">
            <div className=" w-20 lg:w-24 rounded-full bg-transparent">
              <Image
                src={
                  "https://calabara.mypinata.cloud/ipfs/QmUtZj7ksJumBa3amYnQb2tsCE7pdQcLLeD1SNWP1Jir9S"
                }
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
            <p className="badge lg:badge-lg">{metadata.category}</p>
            <DynamicLabel status={status} />
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
