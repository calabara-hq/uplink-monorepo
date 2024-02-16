import Link from "next/link";
import { BiLink, BiPencil, BiWorld } from "react-icons/bi";
import { FaRegClock, FaTwitter } from "react-icons/fa";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import fetchSpaceContests, { FetchSpaceContestResponse, SpaceContest } from "@/lib/fetch/fetchSpaceContests";
import { Suspense } from "react";
import { calculateContestStatus } from "@/utils/staticContestState";
import { HiSparkles } from "react-icons/hi2";
import UplinkImage from "@/lib/UplinkImage"
import {
  CategoryLabel,
  StatusLabel,
} from "@/ui/ContestLabels/ContestLabels";
import { Boundary } from "@/ui/Boundary/Boundary";
import { AdminWrapper } from "@/lib/AdminWrapper";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { parseIpfsUrl } from "@/lib/ipfs";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })
const round_formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/Card/Card"
import { Button } from "@/ui/Button/Button";
import fetchSpaceStats from "@/lib/fetch/fetchSpaceStats";
import { fetchPaginatedMintBoardPosts, fetchPopularMintBoardPosts } from "@/lib/fetch/fetchMintBoardPosts";

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
      <Card className="bg-base border-border items-center w-full">
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
          <div className="flex flex-col gap-0.5 justify-end pt-4">
            <CardHeader className="p-0 pt-2 lg:pt-2 text-left lg:text-center">
              <CardTitle>{displayName}</CardTitle>
            </CardHeader>
            <CardContent className="p-1 lg:p-2">
              {website && (
                <div className="flex flex-row gap-2 items-center hover:text-blue-500 w-fit lg:m-auto">
                  <BiLink className="w-5 h-5 text-t2" />
                  <a
                    href={
                      /^(http:\/\/|https:\/\/)/.test(website)
                        ? website
                        : `//${website}`
                    }
                    rel="noopener noreferrer"
                    draggable={false}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {website.includes("http") ? website.split("//")[1] : website}
                  </a>
                </div>
              )}
              {twitter && (
                <div className="flex flex-row gap-2 items-center hover:text-blue-500 w-fit lg:m-auto">
                  <FaTwitter className="w-4 h-4 text-t2" />
                  <Link
                    href={`https://twitter.com/${twitter}`}
                    rel="noopener noreferrer"
                    draggable={false}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                    prefetch={false}
                  >
                    {twitter}
                  </Link>
                </div>
              )}
            </CardContent>
          </div>
        </div>
        <CardFooter className="p-6 pt-2">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/spacebuilder/edit/${name}`}>Edit</Link>
          </Button>
        </CardFooter>
      </Card >
    </div >
  )
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
  const spaceStats = await fetchSpaceStats(name)

  return (
    <Card className="bg-base border-border items-center w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Stats</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Onchain Creations</p>
          <p className="text-t1 font-bold">{compact_formatter.format(spaceStats.totalEditions)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Mints</p>
          <p className="text-t1 font-bold">{compact_formatter.format(spaceStats.totalMints)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
          <p>Rewards</p>
          <p className="text-t1 font-bold">{round_formatter.format(spaceStats.totalMints * 0.000666)} ETH</p>
        </div>
        <div className="flex w-full justify-end pt-2">
          <Link
            href={`/${name}/stats`}
            className="hover:underline text-blue-500 cursor-pointer"
          >
            + More
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


const ContestCard = ({
  contest,
  spaceLogo,
}: {
  contest: SpaceContest;
  spaceLogo: string;
}) => {
  const { id, metadata, promptData, deadlines, tweetId } = contest;
  const contestId = id;
  const contestTitle = promptData.title;
  const category = metadata.category;
  const { contestState, stateRemainingTime } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );

  return (
    <Link
      href={`/contest/${contestId}`} draggable={false} className="cursor-pointer hover:shadow-lg hover:shadow-blue-600 rounded-lg "
    >
      <div className="bg-base-100 relative flex flex-col gap-2 rounded-lg w-full p-2 h-full">
        <h3 className="text-t1 text-lg font-bold line-clamp-2">{promptData.title}</h3>
        <div className="mt-auto" />
        <ImageWrapper>
          <UplinkImage
            src={promptData?.coverUrl ?? spaceLogo}
            draggable={false}
            alt="contest image"
            fill
            sizes="30vw"
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out rounded-xl"
          />
        </ImageWrapper>
        <div className="grid grid-cols-[auto_1fr_auto] w-full items-center">
          <div className="w-[60px]">
            <CategoryLabel category={category} />
          </div>
          <div className="m-auto">
            <StatusLabel status={contestState} />
          </div>
          <div className="ml-auto w-[80px]">
            {stateRemainingTime ? (
              <div className="flex flex-row gap-2 items-center bg-t2 bg-opacity-5 text-t2 p-2 rounded-lg ">
                <FaRegClock className="w-4 h-4 text-t2" />
                <p className="text-sm">{stateRemainingTime}</p>
              </div>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div >
    </Link >
  );
};

const AdminButtons = async ({ spaceName }: { spaceName: string }) => {
  const space = await fetchSingleSpace(spaceName);
  return (
    <AdminWrapper admins={space.admins}>
      <Boundary labels={["Admin"]}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-end">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-t1">Mintboard</p>
              <p className="text-t2">Earn protocol rewards with your users by allowing them to mint under a template config.</p>
            </div>
            <Link
              href={`${spaceName}/mintboard/settings`}
              className="btn btn-ghost btn-active btn-sm text-t1 normal-case ml-auto hover:text-primary"
            >
              <span>Configure</span>
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-end">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-t1">Contests</p>
              <p className="text-t2">Create a contest</p>
            </div>
            <Link
              href={`${spaceName}/create-contest`}
              className="btn btn-ghost btn-active btn-sm text-t1 normal-case ml-auto hover:text-secondary"
            >
              <span>New</span>
              <HiSparkles className="h-5 w-5 pl-0.5" />
            </Link>
          </div>
        </div>
      </Boundary>
    </AdminWrapper>
  )
}



const MintboardHeatMap = async ({ spaceName }: { spaceName: string }) => {
  const [firstPagePosts, mintBoard] = await Promise.all([
    fetchPaginatedMintBoardPosts(spaceName, null, 50),
    fetchMintBoard(spaceName)
  ])
  if (!mintBoard || !mintBoard.enabled) return null;
  return (
    <Boundary size="small">
      <div className="flex flex-col p-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold text-t1">Mintboard</p>

          <div className="flex flex-row items-center gap-4">
            <p className="text-t2 mr-2">Earn ETH by posting and sharing posts on the {mintBoard.space.displayName} mintboard.</p>
            <Link
              href={`${spaceName}/mintboard`}
              className="btn btn-sm normal-case ml-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300"
            >
              <span>Enter</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {firstPagePosts.posts.map((post, idx) => {
            return (
              <div className="w-[40px]" key={idx}> {/* Adjust this class as needed for sizing */}
                <ImageWrapper>
                  <UplinkImage
                    src={parseIpfsUrl(post.edition.imageURI).gateway}
                    fill
                    alt="post"
                    sizes="10vw"
                    className="rounded-xl object-cover cursor-pointer aspect-square"
                  />
                </ImageWrapper>
              </div>
            )
          })}
        </div>
      </div>
    </Boundary>
  )

}

const Contests = ({ contests, spaceName, spaceLogo }: { contests: FetchSpaceContestResponse['contests'], spaceName: string, spaceLogo: string }) => {

  if (contests.length < 1) {
    return (
      <div className="w-9/12 sm:w-full m-auto flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-center m-auto mt-10">
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
      {contests.map((contest) => {
        return <ContestCard key={contest.id} contest={contest} spaceLogo={spaceLogo} />;
      })}
    </div>
  )

}


const ContestDisplay = async ({ spaceName }: { spaceName: string }) => {
  const spaceWithContests = await fetchSpaceContests(spaceName);
  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-t1 font-semibold text-2xl break-words">
          Contests
        </h2>
      </div>
      <div className="w-full h-1 bg-base-100 rounded-lg" />
      <Contests contests={spaceWithContests.contests} spaceName={spaceName} spaceLogo={spaceWithContests.logoUrl} />
    </div>
  )
}

export default async function Page({ params }: { params: { name: string } }) {
  const spaceName = params.name;

  return (
    <div className="flex flex-col gap-2 w-full lg:w-11/12 m-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[25%_auto] w-full gap-8">
        <div className="lg:sticky lg:top-6 lg:left-0 w-full h-fit">
          <div className="flex flex-col md:flex-row lg:flex-col gap-2 w-full lg:max-w-[300px] ">
            <Suspense fallback={<SpaceInfoSkeleton />}>
              <SpaceInfo name={spaceName} />
            </Suspense>
            <Suspense fallback={<SpaceStatsSkeleton />}>
              <SpaceStats name={spaceName} />
            </Suspense>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-6">
          <Suspense>
            <AdminButtons spaceName={spaceName} />
          </Suspense>
          <Suspense fallback={<HeatMapSkeleton />}>
            <MintboardHeatMap spaceName={spaceName} />
          </Suspense>
          <Suspense fallback={<SpaceContestsSkeleton />}>
            <ContestDisplay spaceName={spaceName} />
          </Suspense>
        </div>
      </div>
    </div>
  )

}

