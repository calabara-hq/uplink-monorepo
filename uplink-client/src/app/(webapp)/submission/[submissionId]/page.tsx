import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission"
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission"
import { Suspense } from "react";
import { BackButton, HeaderButtons, MintButton, ShareButton } from "./client";
import { Metadata } from "next";
import { Submission, isNftSubmission } from "@/types/submission";
import { parseIpfsUrl } from "@/lib/ipfs";
import { getChainName } from "@/lib/chains/supportedChains";

type NftMetadata = {
  "eth:nft:contract_address": string,
  "eth:nft:schema": string,
  "eth:nft:chain_id": number,
  "eth:nft:chain": string,
  "eth:nft:collection": string,
  "eth:nft:creator_address": string,
  "eth:nft:media_url": string,
  "eth:nft:mint_count": string
};

const calculateImageAspectRatio = async (url: string) => {
  try {
    const fileInfo = await fetch(`https://res.cloudinary.com/drrkx8iye/image/fetch/fl_getinfo/${url}`).then(res => res.json())
    const { output } = fileInfo;
    if (output.width / output.height > 1.45) return "1.91:1";
    return "1:1"
  } catch (e) {
    return "1:1"
  }
}


const generateNftMetadata = async (submission: Submission) => {
  const aspect = await calculateImageAspectRatio(parseIpfsUrl(submission.edition.imageURI).gateway)
  const warpable = submission.edition.chainId === 8453 || submission.edition.chainId === 7777777 ? true : false;

  const nftMetadata: NftMetadata = {
    "eth:nft:contract_address": submission.edition.contractAddress,
    "eth:nft:schema": "ERC721",
    "eth:nft:chain_id": submission.edition.chainId,
    "eth:nft:chain": getChainName(submission.edition.chainId).toLowerCase(),
    "eth:nft:collection": submission.edition.name,
    "eth:nft:creator_address": submission.edition.defaultAdmin,
    "eth:nft:media_url": parseIpfsUrl(submission.edition.imageURI).gateway,
    "eth:nft:mint_count": "0"
  }

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:image": parseIpfsUrl(submission.edition.imageURI).gateway,
    "fc:frame:image:aspect_ratio": aspect,
  };

  const warpableMetadata: Record<string, string> = {
    "fc:frame:button:1": "Mint",
    "fc:frame:button:1:action": "mint",
    "fc:frame:button:1:target": `eip155:${submission.edition.chainId}:${submission.edition.contractAddress}`,
    //eip155:8453:0x800243201fb33b86219315f5f44e1795dfb5d97a:19
  }

  return {
    nftMetadata,
    fcMetadata,
    warpableMetadata
  }
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: { submissionId: string };
  searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {
  const submission = await fetchSingleSubmission(params.submissionId)

  const referrer = searchParams?.referrer ?? null
  const context = searchParams?.context ?? null

  const isNft = isNftSubmission(submission)

  const { nftMetadata, fcMetadata, warpableMetadata } = isNft ? await generateNftMetadata(submission) : { nftMetadata: {}, fcMetadata: {}, warpableMetadata: {} }

  return {
    title: `${submission.data.title}`,
    description: `${submission.data.title} on Uplink`,
    openGraph: {
      title: `${submission.data.title}`,
      description: `${submission.data.title} on Uplink`,
      images: [
        {
          url: `api/submission/${params.submissionId}/submission_metadata`,
          width: 600,
          height: 600,
          alt: `${submission.data.title} media`,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    other: {
      ...fcMetadata,
      ...nftMetadata,
      ...warpableMetadata
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/submission/${params.submissionId}?context=${context}&referrer=${referrer}`
    }
  };
}

const ExpandedSubmissionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="w-64 h-8 bg-base-100 shimmer rounded-lg" />
        <div className="flex flex-row items-center h-8">
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 bg-base-100 shimmer rounded-xl" />
            <div className="w-16 h-4 bg-base-100 shimmer rounded-lg" />
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-200" />
      <div className="w-full m-auto h-96 bg-base-100 shimmer rounded-lg" />
    </div>
  );
};




// extract this out so we can suspend it
const PageContent = async ({ submissionId, referrer, context }: { submissionId: string, referrer: string | null, context: string | null }) => {
  const submission = await fetchSingleSubmission(submissionId);
  return <ExpandedSubmission submission={submission} headerChildren={<HeaderButtons submission={submission} referrer={referrer} context={context} />} />;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { submissionId: string };
  searchParams: { [key: string]: string | undefined }
}) {
  return (
    <div className="grid grid-cols-1 w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full mt-4 p-4">
      <BackButton context={searchParams?.context ?? null} />
      <Suspense fallback={<ExpandedSubmissionSkeleton />}>
        <PageContent submissionId={params.submissionId} referrer={searchParams?.referrer ?? null} context={searchParams?.context ?? null} />
      </Suspense>
    </div>
  );
}