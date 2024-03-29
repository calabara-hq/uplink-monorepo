import Image from "next/image";
import dynamic from "next/dynamic";
import UplinkImage from "@/lib/UplinkImage"
const ParseBlocks = dynamic(() => import("@/lib/blockParser"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-2 w-full">
      <div className="shimmer h-4 w-64 bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
    </div>
  )
});
import { CategoryLabel, ChainLabel, StatusLabel } from "../ContestLabels/ContestLabels";
import Link from "next/link";
import LiveContestState from "../ContestLabels/LiveContestState";
import { ImageWrapper } from "../Submission/MediaWrapper";
import { DetailsMenuDrawer } from "../MobileContestActions/MobileContestActions";
import ContestDetails from "../ContestDetails/ContestDetails";
import type { FetchSingleContestResponse } from "@/lib/fetch/fetchContest";
import fetchContest from "@/lib/fetch/fetchContest";
import ExpandableTextSection from "../ExpandableTextSection/ExpandableTextSection";

const ContestHeading = async ({
  contestId,
}: {
  contestId: string;
}) => {
  const contestData = await fetchContest(contestId).then(async (res) => {
    const promptData = await fetch(res.promptUrl).then((res) => res.json());
    return { ...res, prompt: promptData };
  });

  const { prompt, space, metadata, chainId } = contestData;

  return (
    <div className="grid grid-cols-1 w-full gap-2">
      <div className="w-full ml-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
          <div className="flex flex-col gap-2 break-word">
            <h2 className="lg:text-3xl text-xl font-[600] text-t1">
              {prompt.title}
            </h2>
            <div className="flex flex-row gap-2 items-center">
              <Link
                className="relative w-8 h-8 flex flex-col"
                href={`/${space.name}`}
                draggable={false}
              >
                <UplinkImage
                  src={space.logoUrl}
                  alt="Org Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </Link>
              <Link
                className="card-title text-sm text-t2 hover:underline hover:text-t1"
                href={`/${space.name}`}
                draggable={false}
              >
                {space.displayName}
              </Link>
              <CategoryLabel category={metadata.category} />
              <LiveContestState />
              {/* render a details button when the screen gets smaller */}
              <div className="hidden lg:block xl:hidden">
                <DetailsMenuDrawer
                  detailChildren={
                    <ContestDetails contestId={contestId} />
                  }
                  ui={{
                    classNames:
                      "text-sm font-[600] text-t2 hover:underline hover:text-t1 ",
                    label: <p>details</p>,
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
              <ExpandableTextSection>
                <ParseBlocks data={prompt.body} omitImages={false} />
              </ExpandableTextSection>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start  w-full gap-2">
            {prompt.coverUrl && (
              <ImageWrapper>
                <UplinkImage
                  src={prompt.coverUrl}
                  alt="contest image"
                  sizes="20vw"
                  fill
                  className="object-contain rounded-xl"
                />
              </ImageWrapper>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-100" />
    </div>
  );
};

export const ContestHeadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 w-full gap-2">
      <div className="w-full ml-auto">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
          <div className="flex flex-col gap-2">
            <div className="shimmer h-8 w-64 bg-neutral rounded-lg" />
            <div className="flex gap-2 items-center">
              <div className="rounded-full w-8 h-8 shimmer bg-neutral" />
              <div className="rounded-lg w-16 h-5 shimmer bg-neutral" />
              <div className="rounded-xl w-10 h-5 shimmer bg-neutral" />
              <div className="rounded-xl w-10 h-5 shimmer bg-neutral" />
            </div>
            <div className="shimmer h-4 w-80 bg-neutral rounded-lg" />
            <div className="shimmer h-4 w-80 bg-neutral rounded-lg" />
            <div className="shimmer h-4 w-80 bg-neutral rounded-lg" />
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-100" />
    </div>
  );
};

export default ContestHeading;
