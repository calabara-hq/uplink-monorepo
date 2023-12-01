import fetchUser from "@/lib/fetch/fetchUser";
import { Submission } from "@/types/submission";
import { User, UserIdentifier, isUserAddress } from "@/types/user";
import { SubmissionDisplaySkeleton, UserSubmissionDisplay } from "@/ui/Submission/SubmissionDisplay";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";
import { ClaimableUserRewards, ClientUserProfile, RewardsSkeleton, UserSubmissions } from "./client";
import SwrProvider from "@/providers/SwrProvider";
import { Suspense } from "react";
import { useSession } from "@/providers/SessionProvider";
import { HiPencil } from "react-icons/hi2";


const SuspendableUserCard = async ({ userPromise, accountAddress }: { userPromise: Promise<User>, accountAddress: string }) => {

    const user = await userPromise;
    const fallback = {
        [`me/${user.address}`]: user,
    };
    return (
        <SwrProvider fallback={fallback}>
            <ClientUserProfile accountAddress={accountAddress} />
        </SwrProvider>
    )
}
const SuspendableUserSubmissions = async ({ userPromise, isMintableOnly }: { userPromise: Promise<User>, isMintableOnly: boolean }) => {

    const user = await userPromise;
    const fallback = {
        [`me/${user.address}`]: user,
    };
    return (
        <SwrProvider fallback={fallback}>
            <div className="flex flex-col gap-4 w-full mt-8">
                {/* <h2 className="text-t1 text-xl font-bold">Collection</h2> */}
                {user.submissions.length > 0 && <div
                    tabIndex={0}
                    className="flex gap-6 font-bold text-t2 text-xl ml-12 md:ml-0"
                >
                    <div className="flex flex-col gap-1 w-fit">
                        <Link
                            href={`/user/${user.address}`}
                            className={`hover:text-t1 ${!isMintableOnly && "text-t1 "}`}
                            scroll={false}
                        >
                            All
                        </Link>
                        {!isMintableOnly && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
                    </div>
                    <div className="flex flex-col gap-1">

                        <Link
                            href={`/user/${user.address}?drops=true`}
                            className={`hover:text-t1 ${isMintableOnly && "text-t1 "}`}
                            scroll={false}
                        >
                            Drops
                        </Link>
                        {isMintableOnly && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
                    </div>
                </div>
                }
                <UserSubmissions accountAddress={user.address} isMintableOnly={isMintableOnly} />
            </div>
        </SwrProvider>
    )
}

const UserSubmissionSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full mt-8">
            {/* <h2 className="text-t1 text-xl font-bold">Collection</h2> */}
            <div
                tabIndex={0}
                className="flex gap-2 font-bold text-t2 text-xl"
            >
                <div className="flex flex-col gap-1 w-fit">
                    <div className="bg-base-200 w-12 h-4 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="bg-base-200 w-16 h-4 rounded-xl" />
                </div>
            </div>
            <SubmissionDisplaySkeleton />
        </div>
    )
}

const UserCardSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:m-auto gap-4 w-full">
            <div className="relative w-fit pt-8 m-auto md:mr-auto md:ml-0">
                <div className="absolute top-0 left-0 right-0 ml-auto mr-auto md:-left-5 md:right-full w-32 h-32">
                    <div className="rounded-full bg-base-200 shimmer w-32 h-32" />
                </div>
                <div className="h-fit w-[300px] rounded-xl border border-border p-2 grid grid-rows-[100px_auto] md:grid-cols-[100px_auto]">
                    <div className="" />
                    <div className="h-full p-2 hidden md:flex md:flex-col gap-2" >
                        <div className="rounded-lg w-2/3 bg-base-200 shimmer h-2" />
                        <div className="rounded-lg w-1/2 bg-base-200 shimmer h-2" />
                    </div>
                </div>
            </div>
            {/* <ClaimableUserRewards accountAddress={user.address} /> */}
            <RewardsSkeleton />
        </div>
    )
}



export default async function Page({ params, searchParams }: { params: { identifier: UserIdentifier }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const userPromise = fetchUser(params.identifier)
    const isMintableOnly = searchParams?.drops === 'true'
    return (
        <div className="w-full lg:w-9/12 m-auto mt-4 mb-16 p-4">
            <div className="flex flex-col gap-4 items-center ">
                <Suspense fallback={<UserCardSkeleton />}>
                    {/*@ts-expect-error*/}
                    <SuspendableUserCard userPromise={userPromise} accountAddress={params.identifier} />
                </Suspense>
                <Suspense fallback={<UserSubmissionSkeleton />}>
                    {/*@ts-expect-error*/}
                    <SuspendableUserSubmissions userPromise={userPromise} isMintableOnly={isMintableOnly} />
                </Suspense>
            </div>
        </div >
    )
}