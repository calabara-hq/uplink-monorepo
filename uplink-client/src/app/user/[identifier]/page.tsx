import fetchUser from "@/lib/fetch/fetchUser";
import { Submission } from "@/types/submission";
import { User, UserIdentifier, isUserAddress } from "@/types/user";
import { SubmissionDisplaySkeleton, UserSubmissionDisplay } from "@/ui/Submission/SubmissionDisplay";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";
import { ClaimableUserRewards, UserSubmissions } from "./client";
import SwrProvider from "@/providers/SwrProvider";
import { Suspense } from "react";
import { useSession } from "@/providers/SessionProvider";



const hasProfile = (user: User) => {
    return user.userName && user.displayName
}

const UserCard = async ({ userPromise }: { userPromise: Promise<User> }) => {

    const user = await userPromise;

    return (
        <div className="relative w-fit pt-8 m-auto md:mr-auto md:ml-0">
            <div className="absolute top-0 left-0 right-0 ml-auto mr-auto md:-left-5 md:right-full w-32 h-32">
                <Image
                    src={user.profileAvatar}
                    alt="avatar"
                    fill
                    className="rounded-full object-cover"
                    sizes="10vw"
                    quality={100}
                />
            </div>
            <div className="h-fit w-[300px] rounded-xl border border-border p-2 grid grid-rows-[100px_auto] md:grid-cols-[100px_auto]">
                <div className="" />
                {hasProfile(user) ? (
                    <div className="h-full p-2 hidden md:flex md:flex-col" >
                        <p className="text-xl font-bold text-t1 text-center md:text-left">{user.userName}</p>
                        <p className="text-sm text-t1 text-center md:text-left">{user.displayName}</p>
                    </div>
                ) : (
                    <div className="flex flex-col bg-purple-200">
                        <Link href={`/user/${user.address}/settings`} className="btn btn-primary btn-sm normal-case">Set up profile</Link>
                    </div>
                )}

                <div className="col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col md:hidden">
                        <p className="text-xl font-bold text-t1 text-center md:text-left">nickd</p>
                        <p className="text-sm text-t1 text-center md:text-left">nickdodson</p>
                    </div>
                    {user.twitterHandle && user.visibleTwitter && (
                        <div className="flex flex-row gap-2 items-center hover:text-blue-500 justify-center md:justify-start">
                            <FaTwitter className="w-4 h-4" />
                            <Link
                                href={`https://twitter.com/${user.twitterHandle}`}
                                rel="noopener noreferrer"
                                draggable={false}
                                target="_blank"
                                className="text-blue-500 hover:underline"
                                prefetch={false}
                            >
                                nickddsn
                            </Link>
                        </div>
                    )}
                    {!hasProfile && <button className="btn normal-case mb-1">Claim Account</button>}
                </div>
            </div>
        </div>
    )
}



const PageContent = async ({ userPromise, isMintableOnly }: { userPromise: Promise<User>, isMintableOnly: boolean }) => {
    const user = await userPromise;
    const fallback = {
        [`me/${user.address}`]: user,
    };
    return (
        <SwrProvider fallback={fallback}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center md:m-auto gap-4 w-full">
                {/*@ts-expect-error*/}
                <UserCard userPromise={userPromise} />
                <ClaimableUserRewards accountAddress={user.address} />
            </div>
            <div className="flex flex-col gap-4 w-full mt-8">
                {/* <h2 className="text-t1 text-xl font-bold">Collection</h2> */}
                <div
                    tabIndex={0}
                    className="flex gap-6 font-bold text-t2 text-xl"
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
                <UserSubmissions accountAddress={user.address} isMintableOnly={isMintableOnly} />
            </div>
        </SwrProvider >
    )

}


export default async function Page({ params, searchParams }: { params: { identifier: UserIdentifier }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const userPromise = fetchUser(params.identifier)
    // will need to decide here if the user is the admin or not
    return (
        <div className="w-full md:w-9/12 m-auto mt-4 mb-16 p-4">
            <div className="flex flex-col gap-4 items-center ">
                <Suspense fallback={<p>loading</p>}>

                    {/*@ts-expect-error*/}
                    <PageContent userPromise={userPromise} isMintableOnly={searchParams?.drops === 'true'} />
                </Suspense>
            </div>
        </div >
    )
}