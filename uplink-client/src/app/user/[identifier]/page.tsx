import fetchUser from "@/lib/fetch/fetchUser";
import { User, UserIdentifier, isUserAddress } from "@/types/user";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";



const UserCard = ({ user }: { user: User }) => {
    console.log(user)

    return (
        <div className="relative w-fit pt-8">
            <div className="absolute top-0 left-0 right-0 ml-auto mr-auto md:-left-5 md:right-full bg-green-200 rounded-full w-32 h-32" />
            <div className="bg-base-100 h-64 md:h-40 w-64 rounded-xl border border-border p-2 grid grid-rows-[100px_auto] md:grid-cols-[100px_auto]">
                <div className="" />
                <div className="h-full p-2 hidden md:flex md:flex-col" >
                    <p className="text-xl font-bold text-t1 text-center md:text-left">nickd</p>
                    <p className="text-sm text-t1 text-center md:text-left">nickdodson</p>
                </div>
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
            <div className="flex flex-col gap-4 items-center bg-green-400">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
                    <UserCard user={user} />
                </div>
            </div>
        </div>
    )
}