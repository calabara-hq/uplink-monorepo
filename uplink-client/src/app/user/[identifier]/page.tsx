import fetchUser from "@/lib/fetch/fetchUser";
import { User, UserIdentifier, isUserAddress } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";



const hasProfile = (user: User) => {
    return user.userName && user.displayName
}
 
const UserCard = ({ user }: { user: User }) => {

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
            <div className="bg-base-100 h-64 md:h-40 w-64 rounded-xl border border-border p-2 grid grid-rows-[100px_auto] md:grid-cols-[100px_auto]">
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
                    {user.twitterHandle && (
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
                </div>
            </div>
        </div>
    )
}


export default async function Page({ params }: { params: { identifier: UserIdentifier } }) {
    const user = await fetchUser(params.identifier)
    // will need to decide here if the user is the admin or not
    return (
        <div className="w-8/12 m-auto mt-4 mb-16">
            <div className="flex flex-col gap-4 items-center ">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center md:m-auto gap-4 w-full">
                    <UserCard user={user} />
                </div>
            </div>
        </div>
    )
}