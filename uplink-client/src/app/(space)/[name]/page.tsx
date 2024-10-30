import Link from "next/link";
import { BiLink } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import fetchSpaceContests, { SpaceContest } from "@/lib/fetch/fetchSpaceContests";
import { Suspense } from "react";
import { HiSparkles } from "react-icons/hi2";
import UplinkImage from "@/lib/UplinkImage"
import { Boundary } from "@/ui/Boundary/Boundary";
import { AdminWrapper } from "@/lib/AdminWrapper";
import { parseIpfsUrl } from "@/lib/ipfs";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";

const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })
const round_formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui/Card/Card";
import { Button } from "@/ui/DesignKit/Button";
import fetchSpaceStats from "@/lib/fetch/fetchSpaceStats";
import fetchSpaceChannels from "@/lib/fetch/fetchSpaceChannels";
import { Channel, concatContractID, ContractID, isFiniteChannel, isInfiniteChannel } from "@/types/channel";
import { fetchPopularTokens } from "@/lib/fetch/fetchTokensV2";
import { IFiniteTransportConfig, ITokenMetadata } from "@tx-kit/sdk/subgraph";
import { ContestStatusLabel, FormatTokenStatistic } from "./client";
import { isAddress } from "viem";

const SpaceContestsSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-10 min-h-[500px]">
      <div className="flex w-full items-center">
        <div className="w-48 h-8 bg-base-100 rounded-lg shimmer" />
      </div>
      <div className="w-9/12 sm:w-full m-auto grid gap-4 contest-columns auto-rows-fr">
        <div className="bg-base-100 h-72 rounded-xl shimmer" />
        <div className="bg-base-100 h-72 rounded-xl shimmer" />
        <div className="bg-base-100 h-72 rounded-xl shimmer" />
        <div className="bg-base-100 h-72 rounded-xl shimmer" />
        <div className="bg-base-100 h-72 rounded-xl shimmer" />
      </div>
    </div>
  );
};

const HeatMapSkeleton = () => {
  return (
    <Boundary size="small">
      <div className="flex flex-col w-full gap-10">
        <div className="flex w-full items-center">
          <div className="w-48 h-8 bg-base-100 rounded-lg shimmer" />
          <div className="bg-base-100 w-16 ml-auto h-8 rounded-lg shimmer" />
        </div>
        <div className="flex flex-row flex-wrap gap-2 ">
          <div className="bg-base-100 h-10 w-10 rounded-xl shimmer" />
          <div className="bg-base-100 h-10 w-10 rounded-xl shimmer" />
          <div className="bg-base-100 h-10 w-10 rounded-xl shimmer" />
          <div className="bg-base-100 h-10 w-10 rounded-xl shimmer" />
          <div className="bg-base-100 h-10 w-10 rounded-xl shimmer" />
        </div>
      </div>
    </Boundary>
  )
}

const SpaceInfoSkeleton = () => {

  return (
    <div className="flex flex-col gap-2 w-full">
      <Card className="bg-base border-border items-center w-full">
        <div className="flex flex-row lg:flex-col items-center">
          <div className="p-6 pb-0">
            <div className="w-24 h-24 rounded-xl lg:rounded-full shimmer bg-base-100" />
          </div>
          <div className="flex flex-col gap-0.5 justify-end pt-4">
            <CardContent className="p-1 lg:p-2">
              <div className="flex flex-col gap-2 items-start lg:items-center">
                <div className="w-28 h-4 bg-base-100 rounded-lg shimmer" />
                <div className="w-16 h-4 bg-base-100 rounded-lg shimmer" />
                <div className="w-16 h-4 bg-base-100 rounded-lg shimmer" />
              </div>
            </CardContent>
          </div>
        </div>
        <CardFooter className="p-6 pt-2">
          <Button className="w-full shimmer bg-base-100" variant="outline" />
        </CardFooter>
      </Card >
    </div >
  )
}


const SpaceInfo = async ({ name }: { name: string }) => {
  const { displayName, logoUrl, twitter, website } = await fetchSingleSpace(name);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Card className="bg-base-100 border-border border items-center w-full">
        <div className="flex flex-row lg:flex-col items-center">
          <div className="p-6 pb-0">
            <div className="w-24 rounded-xl lg:rounded-full ">
              <ImageWrapper>
                <UplinkImage
                  src={logoUrl}
                  alt={"org avatar"}
                  fill
                  className="rounded-xl object-contain"
                />
              </ImageWrapper>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 justify-end items-start lg:items-center pt-4">
            <CardHeader className="p-0 pt-2 lg:pt-2 text-left lg:text-center">
              <CardTitle>{displayName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 flex-col gap-2">

              {website && (
                <Link href={
                  /^(http:\/\/|https:\/\/)/.test(website)
                    ? website
                    : `//${website}`
                }
                  rel="noopener noreferrer"
                  draggable={false}
                  target="_blank"
                  passHref
                  prefetch={false}
                >
                  <Button variant="link" className="flex gap-2 items-center p-0 h-fit">
                    <BiLink className="w-5 h-5" />
                    {website.includes("http") ? website.split("//")[1] : website}
                  </Button>
                </Link>
              )}

              {twitter && (
                <Link
                  href={`https://twitter.com/${twitter}`}
                  rel="noopener noreferrer"
                  draggable={false}
                  target="_blank"
                  passHref
                  prefetch={false}
                >
                  <Button variant="link" className="flex gap-2 items-center p-0 h-fit">
                    <FaTwitter className="w-4 h-4" />
                    {twitter}
                  </Button>
                </Link>
              )}
            </CardContent>
          </div>
        </div>
        <CardFooter className="p-6 pt-2">
          <Link href={`/spacebuilder/edit/${name}`} className="w-full" passHref>
            <Button className="w-full" variant="outline">
              Edit
            </Button>
          </Link>
          {/*           
          <Button asChild className="w-full" variant="outline">
            <Link href={`/spacebuilder/edit/${name}`}>Edit</Link>
          </Button> */}
        </CardFooter>
      </Card >
    </div >
  );
}

const SpaceStatsSkeleton = () => {
  return (
    <Card className="bg-base border-border items-center w-full">
      <CardHeader className="p-4">
        <CardTitle>
          <div className="w-20 h-6 bg-base-100 rounded-lg shimmer" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-row justify-between items-center">
            <div className="w-16 h-4 bg-base-100 rounded-lg shimmer" />
            <div className="w-8 h-4 bg-base-100 rounded-lg shimmer" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="w-16 h-4 bg-base-100 rounded-lg shimmer" />
            <div className="w-8 h-4 bg-base-100 rounded-lg shimmer" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="w-16 h-4 bg-base-100 rounded-lg shimmer" />
            <div className="w-8 h-4 bg-base-100 rounded-lg shimmer" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SpaceStats = async ({ name }: { name: string }) => {
  const spaceStats = await fetchSpaceStats(name, 8453)

  return (
    <Card className="bg-base border-border items-center w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Stats</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Total Mints</p>
          <p className="text-t1 font-bold">{compact_formatter.format(spaceStats.totalMints)}</p>
        </div>

        {Object.entries(spaceStats).map(([key, value]) => {
          if (isAddress(key)) return (
            <FormatTokenStatistic key={key} tokenAddress={key} amount={BigInt(value)} chainId={8453} />
          )
        })}

        {/* <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Mints</p>
          <p className="text-t1 font-bold">{compact_formatter.format(spaceStats.totalMints)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Rewards</p>
          <p className="text-t1 font-bold">{round_formatter.format(spaceStats.totalMints * 0.000666)} ETH</p>
        </div> */}

      </CardContent>
    </Card>
  )
}


const AdminButtons = async ({ spaceName }: { spaceName: string }) => {
  const space = await fetchSingleSpace(spaceName);
  return (
    <AdminWrapper admins={space.admins}>
      <div>
        <Boundary labels={["Admin"]} size="small">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-t1">Mintboard</p>
              </div>
              <Link
                href={`${spaceName}/mintboard/new`}
                passHref
              >
                <Button variant="secondary" size="sm" className="flex items-center gap-2" >
                  <span>New</span>
                  <HiSparkles className="h-5 w-5 pl-0.5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-t1">Contest</p>
              </div>
              <Link
                href={`${spaceName}/create-contest`}
                passHref
              >
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <span>New</span>
                  <HiSparkles className="h-5 w-5 pl-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Boundary>
      </div>
    </AdminWrapper >
  )
}



const MintboardPostsPreview = async ({ channel }: { channel: Channel }) => {
  const contractID = concatContractID({ contractAddress: channel.id, chainId: channel.chainId });

  const tokens = await fetchPopularTokens(contractID, 10, 0).then(tokens => tokens.data);

  return (
    <div className="flex flex-row -space-x-2 p-2">
      {tokens.map((token) => {
        return (
          <div key={token.id} className="w-[30px]">
            <ImageWrapper>
              <UplinkImage
                src={parseIpfsUrl(token.metadata.image).gateway}
                fill
                alt="post"
                sizes="10vw"
                className="rounded-full object-cover cursor-pointer aspect-square border-[0.5px] border-[#121212] bg-[#121212]"
              />
            </ImageWrapper>
          </div>
        )
      })}
    </div>
  )
}

const MintboardDisplay = async ({ spaceName }: { spaceName: string }) => {
  const channels = await fetchSpaceChannels(spaceName);

  const mintboards = channels.filter(channel => isInfiniteChannel(channel));

  if (mintboards.length > 0) {

    return (
      <div className="flex flex-col gap-2 ">
        <h2 className="text-t1 font-semibold text-2xl break-words">
          Mintboards
        </h2>

        <div className="w-9/12 sm:w-full m-auto grid gap-4 contest-columns auto-rows-fr">
          {mintboards.map(channel => {
            return (
              <Link
                key={channel.id}
                className="flex flex-col gap-2  overflow-hidden bg-base-100 border border-border rounded-lg p-2 hover:bg-base-200"
                href={`${spaceName}/mintboard/${concatContractID({ contractAddress: channel.id, chainId: channel.chainId })}`}
              >
                <h2 className="text-lg text-t1 font-bold">{channel.name}</h2>
                <Suspense fallback={<div>Loading...</div>}>
                  <MintboardPostsPreview channel={channel} />
                </Suspense>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
}


const ContestCard = async ({
  linkTo,
  coverImg,
  title,
  createStart,
  mintStart,
  mintEnd
}: {

  linkTo: string
  coverImg: string,
  title: string,
  contractId?: ContractID,
  createStart?: string,
  mintStart?: string,
  mintEnd?: string
}) => {

  return (
    <Link
      href={linkTo} draggable={false} className="cursor-pointer rounded-lg "
    >
      <div className="bg-base-100 hover:bg-base-200 no-select relative flex flex-col gap-2 rounded-lg w-full p-2 h-full border-border border">
        <h3 className="text-t1 text-lg font-bold line-clamp-2">{title}</h3>
        <ContestStatusLabel createStart={createStart} mintStart={mintStart} mintEnd={mintEnd} />
        <div className="mt-auto" />
        <ImageWrapper>
          <UplinkImage
            src={coverImg}
            draggable={false}
            alt="contest image"
            fill
            sizes="30vw"
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out rounded-lg"
          />
        </ImageWrapper>
      </div >
    </Link >
  );
}


const Contests = ({ contestsV1, contestsV2, spaceName, spaceLogo }: { contestsV1: Array<SpaceContest>, contestsV2: Array<Channel & { metadata: ITokenMetadata }>, spaceName: string, spaceLogo: string }) => {

  if (contestsV1.length + contestsV2.length === 0) {
    return (
      <div className="w-9/12 sm:w-full m-auto flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-center m-auto mt-10 text-center">
          <p className="text-t1 text-lg font-bold">
            This space has not yet hosted any contests.
          </p>
          <p className="text-t2">Check back later!</p>
        </div>
      </div>
    )
  }

  else return (
    <div className="w-9/12 sm:w-full m-auto grid gap-4 contest-columns auto-rows-fr">
      {contestsV2.map((contest, idx) => {
        const contractId = concatContractID({ contractAddress: contest.id, chainId: contest.chainId });
        const coverImg = contest.metadata?.image ? parseIpfsUrl(contest.metadata.image).gateway : spaceLogo;
        const transportConfig = contest.transportLayer.transportConfig as IFiniteTransportConfig;
        return (
          <ContestCard
            contractId={contractId}
            key={contest.id}
            linkTo={`${spaceName}/contest/${contractId}`}
            coverImg={coverImg}
            title={contest.metadata.name}
            createStart={transportConfig.createStart}
            mintStart={transportConfig.mintStart}
            mintEnd={transportConfig.mintEnd}
          />
        );
      })}
      {contestsV1.map((contest, idx) => {
        return (
          <ContestCard
            key={contest.id}
            linkTo={`/contest/${contest.id}`}
            coverImg={contest.promptData?.coverUrl ?? spaceLogo}
            title={contest.promptData.title}
            createStart={Math.floor(new Date(contest.deadlines.startTime).getTime() / 1000).toString()}
            mintStart={Math.floor(new Date(contest.deadlines.voteTime).getTime() / 1000).toString()}
            mintEnd={Math.floor(new Date(contest.deadlines.endTime).getTime() / 1000).toString()}
          />
        );
      })}
    </div>
  )

}


const ContestDisplay = async ({ spaceName }: { spaceName: string }) => {

  const [spaceWithContests, contestsV2] = await Promise.all([
    fetchSpaceContests(spaceName),
    fetchSpaceChannels(spaceName)
      .then(channels =>
        channels
          .filter(isFiniteChannel)
          .sort((a, b) =>
            Number((b.transportLayer.transportConfig as IFiniteTransportConfig).mintEnd) -
            Number((a.transportLayer.transportConfig as IFiniteTransportConfig).mintEnd)
          )
      )
      .then(sortedChannels =>
        Promise.all(sortedChannels.map(async channel => {
          const metadata: ITokenMetadata = await fetch(parseIpfsUrl(channel.uri).gateway).then(res => res.json());
          return { ...channel, metadata };
        }))
      )
  ]);


  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-t1 font-semibold text-2xl break-words">
          Contests
        </h2>
      </div>
      <div className="w-full h-1 bg-base-100 rounded-lg" />
      <Contests contestsV1={spaceWithContests.contests} contestsV2={contestsV2} spaceName={spaceName} spaceLogo={spaceWithContests.logoUrl} />
    </div>
  )
}

export default async function Page({ params }: { params: { name: string } }) {
  const spaceName = params.name;

  return (
    <div className="flex flex-col gap-2 w-full lg:w-11/12 m-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[25%_auto] w-full gap-8">
        <div className="lg:sticky lg:top-6 lg:left-0 w-full h-fit">
          <div className="flex flex-col md:flex-row lg:flex-col gap-6 w-full lg:max-w-[300px] ">
            <Suspense fallback={<SpaceInfoSkeleton />}>
              <SpaceInfo name={spaceName} />
            </Suspense>
            <Suspense>
              <AdminButtons spaceName={spaceName} />
            </Suspense>
            {/* <Suspense fallback={<SpaceStatsSkeleton />}>
              <SpaceStats name={spaceName} />
            </Suspense> */}
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-6">
          <Suspense fallback={<HeatMapSkeleton />}>
            {/* <MintboardHeatMap spaceName={spaceName} /> */}
            <MintboardDisplay spaceName={spaceName} />
          </Suspense>
          <Suspense fallback={<SpaceContestsSkeleton />}>
            <ContestDisplay spaceName={spaceName} />
          </Suspense>
        </div>
      </div>
    </div>
  )

}

