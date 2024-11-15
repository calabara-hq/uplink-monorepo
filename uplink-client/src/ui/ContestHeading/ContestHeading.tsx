import OptimizedImage from "@/lib/OptimizedImage"

import Link from "next/link";
import { ImageWrapper } from "../../app/(legacy)/contest/components/MediaWrapper";
import ExpandableTextSection from "../ExpandableTextSection/ExpandableTextSection";
import { ContractID, TokenMetadata } from "@/types/channel";
import { parseIpfsUrl } from "@/lib/ipfs";
import { RenderMarkdown } from "../Markdown/RenderMarkdown";
import { Space } from "@/types/space";
import { Button } from "../DesignKit/Button";
import { SmallScreenToolbar } from "./ClientUtils";

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
              <OptimizedImage
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
              <OptimizedImage
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
