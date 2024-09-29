import Link from "next/link";
import { Metadata } from "next";
import fetchSpaces from "@/lib/fetch/fetchSpaces";
import { Suspense } from "react";
import UplinkImage from "@/lib/UplinkImage"
import { ActiveContest } from "@/lib/fetch/fetchActiveContests";
import { SearchSpaces } from "./client";
import { ColorCards } from "@/ui/DesignKit/ColorCards";
import { Card, CardContent, CardFooter } from "@/ui/DesignKit/Card";
import { CardHeader, CardTitle } from "@/ui/Card/Card";
import { fetchTrendingChannels } from "@/lib/fetch/fetchChannel";
import { Channel, concatContractID } from "@/types/channel";
import { parseIpfsUrl } from "@/lib/ipfs";
import { Space } from "@/types/space";
import { fetchFeaturedTokens } from "@/lib/fetch/fetchTokensV2";
import { AddressOrEns, Avatar } from "@/ui/AddressDisplay/AddressDisplay";
import { TokenCard } from "@/ui/Token/Card";
import { Button } from "@/ui/DesignKit/Button";
import { HiTrendingUp } from "react-icons/hi";

export const metadata: Metadata = {
  openGraph: {
    title: "Uplink",
    description: "Discover spaces on Uplink.",
    url: "/",
    siteName: "Uplink",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 600,
        alt: "Uplink",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const PromptSummary = async ({ contest }: { contest: ActiveContest }) => {
  return (
    <h2 className="line-clamp-1 text-center">
      {contest.promptData.title}
    </h2>
  );
};


// const ContestCard = ({
//   linkTo,
//   contest,
// }: {
//   contest: ActiveContest;
//   linkTo: string;
// }) => {
//   const { contestState, stateRemainingTime } = calculateContestStatus(
//     contest.deadlines,
//     contest.metadata.type,
//     contest.tweetId
//   );
//   return (
//     <Link
//       className="animate-scrollInX
//     cursor-pointer border border-border rounded-2xl p-4 h-full overflow-hidden w-[275px] transform 
//     transition-transform duration-300 hoverCard will-change-transform no-select"
//       href={linkTo}
//       draggable={false}
//     >
//       <div className="items-center p-0">
//         <div className="flex flex-col gap-2 items-center">
//           <div className="relative w-20 h-20 avatar online">
//             <UplinkImage
//               src={contest.space.logoUrl}
//               alt="spaceLogo"
//               fill
//               className="rounded-xl object-cover"
//               sizes="10vw"
//             />
//           </div>
//           <h1 className="font-semibold text-xl line-clamp-1 overflow-ellipsis">
//             {contest.space.displayName}
//           </h1>
//         </div>
//         <PromptSummary contest={contest} />
//         <div className="flex flex-row gap-2">
//           <CategoryLabel category={contest.metadata.category} />
//           <StatusLabel status={contestState} />
//         </div>
//         <RemainingTimeLabel remainingTime={stateRemainingTime} />
//       </div>
//     </Link>
//   );
// };

// const ActiveContests = async () => {
//   const activeContests = await fetchActiveContests();
//   if (activeContests.length > 0) {
//     return (
//       <div className="w-full flex flex-col gap-4">
//         <div className="flex flex-row gap-2 items-end">
//           <h1 className="font-bold text-xl text-t1">Active Contests</h1>
//         </div>
//         <Swiper listSize={activeContests.length - 1}>
//           {activeContests.map((contest, index) => (
//             <div className="snap-start snap-always h-full" key={index}>
//               <ContestCard
//                 contest={contest}
//                 linkTo={`/contest/${contest.id}`}
//               />
//             </div>
//           ))}
//         </Swiper>
//       </div>
//     );
//   }
//   return null;
// };

const TrendingChannels = async () => {
  let trendingChannels = await fetchTrendingChannels(8453)

  if (trendingChannels.length > 0)
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Trending</h1>
          <HiTrendingUp className="w-6 h-6 text-success" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
          {trendingChannels.map(async (channel: Channel & { space: Space }, index: number) => {

            const logoUrl = parseIpfsUrl(channel.tokens[0].metadata.image).gateway

            return (
              <Link key={index} href={`${channel.space.name}/mintboard/${concatContractID({ contractAddress: channel.id, chainId: channel.chainId })}`} draggable={false} className="w-full h-full">
                <ColorCards imageUrl={logoUrl} key={index} className="p-4">

                  <div className="flex flex-col gap-2 items-center justify-between h-full rounded-xl bg-black/[.25] p-4 overflow-hidden">
                    <div className="w-[112px] h-[112px] flex items-center justify-center overflow-hidden rounded-xl">
                      <div className="relative w-28 h-28">
                        <UplinkImage
                          src={logoUrl}
                          fill
                          alt="spaceLogo"
                          className="object-cover rounded-xl"
                          sizes={"10vw"}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-center">{channel.tokens[0].metadata.name}</CardTitle>

                    <CardFooter className="flex flex-col gap-2 p-0">
                      <div className='flex flex-row gap-2 items-center -space-x-4 w-full px-2 overflow-hidden'>
                        {channel.tokens.slice(1, 10).map(token => {
                          return (
                            <div key={token.id} className='w-7 h-7 relative'>
                              <UplinkImage
                                src={parseIpfsUrl(token.metadata.image).gateway}
                                fill
                                alt="spaceLogo"
                                className="object-cover rounded-full"
                                sizes={"10vw"}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </CardFooter>
                  </div>
                </ColorCards>
              </Link>

            );
          })}
        </div>
      </div>
    );
};

const SpaceListSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {[...Array(20)].map((_, index) => {
        return (
          <div
            key={index}
            className="h-[190px] shimmer bg-base-100 rounded-xl"
          ></div>
        );
      })}
    </div>
  );
};

const ExploreHeaderSkeleton = () => {
  return (
    <div className="flex flex-row gap-12 items-center justify-end sm:justify-normal w-full">
      <div className="hidden sm:flex w-8/12 md:w-6/12 ">
        <div className="rounded-lg shimmer w-full h-[48px]"></div>
      </div>
      <div className="w-28 h-[48px] rounded-3xl shimmer"></div>
    </div>
  )
}

const ExploreHeader = async () => {

  const allSpaces = await fetchSpaces();

  return (
    <div className="flex flex-row gap-6 items-start w-full lg:w-6/12 m-auto ">
      <div className="w-full">
        <SearchSpaces allSpaces={allSpaces} />
      </div>
      <Link
        passHref
        className="w-fit"
        href="/spacebuilder/create"
        draggable={false}
      >
        <Button className="h-10 rounded-lg">
          New Space
        </Button>
      </Link>
    </div>
  )
}


const FeaturedMints = async () => {
  const featuredTokens = await fetchFeaturedTokens(8453, 10, 0)

  if (featuredTokens.data.length > 0) return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Featured Mints</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
        {featuredTokens.data.slice(0, 5).map((tokenData, index) => {

          return (
            <Link
              key={index}
              href={`${tokenData.space.name}/mintboard/${tokenData.channel.id}-8453/post/${tokenData.token.tokenId}/v2`}
              draggable={false}
              className="w-full h-full" >
              <ColorCards
                key={index}
                imageUrl={parseIpfsUrl(tokenData.token.metadata.image).gateway}
              >

                <TokenCard
                  token={tokenData.token}
                  showTotalMints={false}
                  footer={
                    <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
                      {/* <div className="flex gap-2 items-center bg-base rounded-xl p-1"> */}
                      <Avatar address={tokenData.token.author} size={28} />
                      <AddressOrEns address={tokenData.token.author} />
                    </div>
                    // </div>
                  }
                />
              </ColorCards>
            </Link>
          )
        })
        }
      </div>
    </div>
  )
}

const AllSpaces = async () => {
  const allSpaces = await fetchSpaces();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Spaces</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full ">
        {allSpaces.map((space, index) => {
          return (
            <Link key={index} href={`/${space.name}`} passHref>
              <Card
                className="h-full bg-base-100"
              >
                <CardHeader>
                  <CardTitle className="text-t1 text-lg">{space.displayName}</CardTitle>
                </CardHeader>
                <CardContent >
                  <div className="w-[120px] h-[120px] relative m-auto">
                    <UplinkImage
                      src={space.logoUrl}
                      fill
                      alt="spaceLogo"
                      className="object-cover rounded-xl"
                      sizes={"10vw"}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


export default async function Page() {

  return (
    <div className="flex flex-col w-11/12 lg:w-9/12 m-auto justify-center py-12 gap-4">
      <div className="flex flex-col gap-6 w-full">
        <Suspense fallback={<ExploreHeaderSkeleton />}>
          <ExploreHeader />
        </Suspense>
        <Suspense fallback={<SpaceListSkeleton />}>
          <TrendingChannels />
        </Suspense>
        <Suspense fallback={<SpaceListSkeleton />}>
          {/* <FeaturedMints /> */}
          <AllSpaces />
        </Suspense>
      </div>
    </div>
  );
}
