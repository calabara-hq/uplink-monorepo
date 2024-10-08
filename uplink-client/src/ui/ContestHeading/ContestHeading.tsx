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
import { CategoryLabel } from "../ContestLabels/ContestLabels";
import Link from "next/link";
import LiveContestState from "../ContestLabels/LiveContestState";
import { ImageWrapper } from "../Submission/MediaWrapper";
import MobileContestActions from "../MobileContestActions/MobileContestActions";
import ContestDetails from "../ContestDetails/ContestDetails";
import fetchContest from "@/lib/fetch/fetchContest";
import ExpandableTextSection from "../ExpandableTextSection/ExpandableTextSection";
import { ContractID, TokenMetadata } from "@/types/channel";
import { parseIpfsUrl } from "@/lib/ipfs";
import { RenderMarkdown } from "../Markdown/RenderMarkdown";
import { Space } from "@/types/space";
import { Button } from "../DesignKit/Button";
import { SmallScreenToolbar } from "./ClientUtils";

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
          <div className="flex flex-col gap-2 break-words">
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
                className="text-sm text-t2 hover:underline hover:text-t1"
                href={`/${space.name}`}
                draggable={false}
              >
                {space.displayName}
              </Link>
              <CategoryLabel category={metadata.category} />
              <LiveContestState />
              {/* render a details button when the screen gets smaller */}
              {/* <div className="hidden lg:block xl:hidden">
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
              </div> */}
            </div>
            <div className="grid grid-cols-1">
              <ExpandableTextSection>
                <ParseBlocks data={prompt.body} omitImages={false} />
              </ExpandableTextSection>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start w-full gap-2">
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
      <div className="p-4 lg:hidden">
        <MobileContestActions
          contestId={contestId}
        />
      </div>
    </div>
  );
};

// export const ContestHeadingV2 = ({
//   space,
//   contestMetadata,
//   contractId,
// }: {
//   space: Space;
//   contestMetadata: TokenMetadata;
//   contractId: ContractID;
// }) => {

//   return (
//     <div className="grid grid-cols-1 w-full gap-2">
//       <div className="w-full ml-auto p-4">
//         <h2 className="text-4xl font-[600] text-t1">
//           {contestMetadata.name}
//         </h2>
//         <div className="flex flex-row gap-2 items-center">
//           <Link
//             className="relative w-8 h-8 flex flex-col"
//             href={`/${space.name}`}
//             draggable={false}
//           >
//             <UplinkImage
//               src={space.logoUrl}
//               alt="Org Avatar"
//               fill
//               className="rounded-full object-cover"
//             />
//           </Link>
//           <Link
//             href={`/${space.name}`}
//             draggable={false}
//             passHref
//           >
//             <Button variant="link" className="pl-0 ml-0">
//               {space.displayName}
//             </Button>
//           </Link>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full">
//           <div className="grid grid-cols-1 order-2 sm:order-1 text-t2 prose prose-neutral prose-invert max-w-full">
//             <ExpandableTextSection>
//               <RenderMarkdown content={contestMetadata.description} />
//             </ExpandableTextSection>
//           </div>
//           <div className="grid grid-cols-1 items-start order-1 sm:order-2 w-full gap-2">
//             {contestMetadata.image && (
//               <ImageWrapper>
//                 <UplinkImage
//                   src={parseIpfsUrl(contestMetadata.image).gateway}
//                   alt="contest image"
//                   fill
//                   className="object-contain rounded-xl"
//                 />
//               </ImageWrapper>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="w-full h-0.5 bg-base-100" />
//       <div className="p-4 lg:hidden">
//         <SmallScreenToolbar contractId={contractId} />
//       </div>
//     </div>
//   );

// }

export const ContestHeadingV2 = ({
  space,
  contestMetadata,
  contractId,
}: {
  space: Space;
  contestMetadata: TokenMetadata;
  contractId: ContractID;
}) => {

  return (
    <div className="grid grid-cols-1 w-full gap-2">
      <div className="w-full p-6 grid grid-cols-1 md:grid-cols-[75%_25%] gap-6">
        <div className="w-full ml-auto">
          <h2 className="text-4xl font-[600] text-t1">
            {contestMetadata.name}
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
              href={`/${space.name}`}
              draggable={false}
              passHref
            >
              <Button variant="link" className="pl-0 ml-0">
                {space.displayName}
              </Button>
            </Link>
          </div>
          <div className="">
            <div className="">
              <ExpandableTextSection>
                <RenderMarkdown content={contestMetadata.description} />
              </ExpandableTextSection>
            </div>

          </div>
        </div>
        <div className="order-1 md:order-2">
          {contestMetadata.image && (
            <ImageWrapper>
              <UplinkImage
                src={parseIpfsUrl(contestMetadata.image).gateway}
                alt="contest image"
                fill
                className="object-contain rounded-xl"
              />
            </ImageWrapper>
          )}
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-100" />
      <div className="p-4 lg:hidden">
        <SmallScreenToolbar contractId={contractId} />
      </div>
    </div>
  );

}

export const ContestHeadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 w-full gap-2">
      <div className="w-full ml-auto">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
          <div className="flex flex-col gap-2">
            <div className="shimmer h-8 w-64 bg-base-100 rounded-lg" />
            <div className="flex gap-2 items-center">
              <div className="rounded-full w-8 h-8 shimmer bg-base-100" />
              <div className="rounded-lg w-16 h-5 shimmer bg-base-100" />
              <div className="rounded-xl w-10 h-5 shimmer bg-base-100" />
              <div className="rounded-xl w-10 h-5 shimmer bg-base-100" />
            </div>
            <div className="shimmer h-4 w-80 bg-base-100 rounded-lg" />
            <div className="shimmer h-4 w-80 bg-base-100 rounded-lg" />
            <div className="shimmer h-4 w-80 bg-base-100 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-100" />
    </div>
  );
};

export default ContestHeading;
