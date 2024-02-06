import fetchSpaceStats from "@/lib/fetch/fetchSpaceStats";
import { Card, CardContent, CardHeader } from "@/ui/Card/Card";
import { SpaceStats } from "@/types/spaceStats";
import fetchUser from "@/lib/fetch/fetchUser";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(
    () => import("./client"),
    {
        ssr: false,
        loading: () => <div className="w-full h-[350px] rounded-lg  m-auto" />
    }
)


const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })
const round_formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const date_formatter = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric'
})

export const runtime = 'nodejs'

const RewardStat = ({ heading, content }: { heading: React.ReactNode, content: React.ReactNode }) => {
    return (
        <Card className="bg-base border-border items-center w-full">
            <CardHeader>
                {heading}
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}


// sort editions by created date
// find min / max date range
// bucket depending on date range ( < 30d = days, > 30 days = weeks)

const constructData = (editions: SpaceStats['editions']) => {

    if (editions.length === 0) return [];

    const unix30d = 2_592_000; // 30 days in seconds
    const oneDay = 86_400; // 1 day in seconds
    const oneWeek = 604_800; // 1 week in seconds
    const sorted = editions.sort((a, b) => parseInt(a.edition.saleConfig.publicSaleStart) - parseInt(b.edition.saleConfig.publicSaleStart))
    const first = sorted[0]
    const last = sorted.at(-1)

    const range = parseInt(last.edition.saleConfig.publicSaleStart) - parseInt(first.edition.saleConfig.publicSaleStart);

    const buckets = range > unix30d ? 'weeks' : 'days'

    const result = [];

    if (buckets === 'days') {
        let currentDate = parseInt(first.edition.saleConfig.publicSaleStart);

        while (currentDate <= parseInt(last.edition.saleConfig.publicSaleStart)) {
            const date = new Date(currentDate * 1000);
            const formattedDate = date_formatter.format(date);
            const total = sorted.filter(el => {
                const editionDate = new Date(parseInt(el.edition.saleConfig.publicSaleStart) * 1000);
                return date_formatter.format(editionDate) === formattedDate;
            }).reduce((acc, curr) => acc + 1, 0);
            result.push({ name: formattedDate, total });
            currentDate += oneDay;
        }
    } else {
        let currentWeekStart = parseInt(first.edition.saleConfig.publicSaleStart);
        while (currentWeekStart <= parseInt(last.edition.saleConfig.publicSaleStart)) {
            const weekEnd = currentWeekStart + oneWeek;
            const total = sorted.filter(el => {
                const start = parseInt(el.edition.saleConfig.publicSaleStart);
                return start >= currentWeekStart && start < weekEnd;
            }).reduce((acc, curr) => acc + 1, 0);
            const weekStartName = date_formatter.format(new Date(currentWeekStart * 1000));
            result.push({ name: weekStartName, total });
            currentWeekStart += oneWeek;
        }
    }

    return result

}


const MintingStats = ({ spaceStats }: { spaceStats: SpaceStats }) => {

    const creatorMintsMap = spaceStats.editions.reduce((acc, item) => {
        const creator = item.edition.defaultAdmin;
        if (!acc[creator]) {
            acc[creator] = 0;
        }
        acc[creator] += item.totalMints;
        return acc;
    }, {});

    const numberOfUniqueCreators = Object.keys(creatorMintsMap).length;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
                <p className="text-t1 font-semibold">Total Mints</p>
                <p className="text-center font-bold">{compact_formatter.format(spaceStats.totalMints)}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-t1 font-semibold">Total Creations</p>
                <p className="text-center font-bold">{compact_formatter.format(spaceStats.totalEditions)}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-t1 font-semibold">Unique Creators</p>
                <p className="text-center font-bold">{compact_formatter.format(numberOfUniqueCreators)}</p>
            </div>

        </div>
    )
}

const CreatorStats = ({ spaceStats }: { spaceStats }) => {
    return (
        <div className="flex flex-row lg:flex-col gap-2 w-full">
            {spaceStats.topMintsUser && (
                <div className="flex flex-col items-center gap-2 bg-base-100 rounded-lg w-full p-2 text-center justify-between">
                    <p className="text-t1 font-semibold">Most Mints</p>
                    <UserAvatar user={spaceStats.topMintsUser} size={36} />
                    <div className="text-t1 font-semibold">
                        <UsernameDisplay user={spaceStats.topMintsUser} />
                    </div>
                </div>
            )}

            {spaceStats.topAppearanceUser && (
                <div className="flex flex-col items-center gap-2 bg-base-100 rounded-lg w-full p-2 text-center justify-between">
                    <p className="text-t1 font-semibold">Most Creations</p>
                    <UserAvatar user={spaceStats.topAppearanceUser} size={36} />
                    <div className="text-t1 font-semibold">
                        <UsernameDisplay user={spaceStats.topAppearanceUser} />
                    </div>
                </div>
            )}
        </div>
    )
}

const PageContent = async ({ name }: { name: string }) => {
    const spaceStats = await fetchSpaceStats(name)

    const creatorRewards = spaceStats.totalMints * 0.000444;
    const treasuryRewards = spaceStats.totalMints * 0.000111;
    const referralRewards = spaceStats.totalMints * 0.000111;

    const chartData = constructData(spaceStats.editions)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 md:gap-6">
                <RewardStat
                    heading={<p className="text-t1 font-semibold">Creator Rewards</p>}
                    content={
                        <div>
                            <p className="text-2xl text-center font-bold">{round_formatter.format(creatorRewards)} ETH</p>
                        </div>
                    }
                />
                <RewardStat
                    heading={<p className="text-t1 font-semibold">Treasury Rewards</p>}
                    content={
                        <div>
                            <p className="text-2xl text-center font-bold">{round_formatter.format(treasuryRewards)} ETH</p>
                        </div>
                    }
                />
                <RewardStat
                    heading={<p className="text-t1 font-semibold">Referral Rewards</p>}
                    content={
                        <div>
                            <p className="text-2xl text-center font-bold">{round_formatter.format(referralRewards)} ETH</p>
                        </div>
                    }
                />
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-start">
                <RewardStat
                    heading={<p className="text-t1 font-semibold">New Creations</p>}
                    content={
                        <div>
                            {chartData.length > 0 ? <Chart data={chartData} /> : <p className="text-center font-semibold">no data to display</p>}
                        </div>
                    }
                ></RewardStat>
                <div className="flex flex-col w-full lg:w-1/3 gap-2">
                    <RewardStat
                        heading={<p className="text-t1 text-xl font-semibold">Overall</p>}
                        content={
                            <div>
                                <MintingStats spaceStats={spaceStats} />
                            </div>
                        }
                    />
                    <CreatorStats spaceStats={spaceStats} />
                </div>
            </div>
        </>
    )
}


const RewardStatSkeleton = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card className="bg-base border-border items-center w-full">
            <CardHeader>
                <div className="w-28 h-4 bg-base-100 rounded-lg shimmer" />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

const ChartSkeleton = () => {
    return (
        <RewardStatSkeleton >
            <div className="w-full h-[350px] rounded-lg  m-auto" />
        </RewardStatSkeleton>
    )
}

const PageContentSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 md:gap-6">
                <RewardStatSkeleton >
                    <div className="w-24 h-8 bg-base-100 rounded-lg shimmer m-auto" />
                </RewardStatSkeleton>
                <RewardStatSkeleton >
                    <div className="w-24 h-8 bg-base-100 rounded-lg shimmer m-auto" />
                </RewardStatSkeleton >
                <RewardStatSkeleton >
                    <div className="w-24 h-8 bg-base-100 rounded-lg shimmer m-auto" />
                </RewardStatSkeleton >
            </div >
            <div className="flex flex-col md:flex-row gap-2 items-start">
                <ChartSkeleton />
                <div className="flex flex-col w-full lg:w-1/3 gap-2">
                    <RewardStatSkeleton>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between items-center">
                                <div className="w-24 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                                <div className="w-10 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <div className="w-24 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                                <div className="w-10 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <div className="w-24 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                                <div className="w-10 h-4 bg-base-100 rounded-lg shimmer m-auto" />
                            </div>
                        </div>
                    </RewardStatSkeleton>
                </div>
            </div>
        </div>
    )
}



export default async function Page({ params }: { params: { name: string } }) {
    const spaceName = params.name;

    return (
        <div className="flex flex-col gap-6 w-full lg:w-11/12 xl:w-9/12 m-auto py-6 px-4">
            <h2 className="text-3xl font-bold">Onchain Stats</h2>
            <Suspense fallback={<PageContentSkeleton />}>
                <PageContent name={spaceName} />
            </Suspense>
        </div>
    )
}