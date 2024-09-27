import fetchUser from "@/lib/fetch/fetchUser"
import { UserIdentifier } from "@/types/user"
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton"
import Settings from "./settings"
import SwrProvider from "@/providers/SwrProvider"

export default async function Page({ params }: { params: { identifier: UserIdentifier } }) {
    const user = await fetchUser(params.identifier)
    const fallback = {
        [`me/${user.address}`]: user,
    };
    return (
        <div className=" w-full md:w-[50vw] lg:w-[35vw] m-auto mt-4 mb-16 bg-base">
            <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
                <div className="flex flex-col gap-2  w-full border-2 border-border p-6 rounded-xl shadow-box">
                    <h2 className="text-3xl font-bold text-center md:text-left">Profile</h2>
                    <SwrProvider fallback={fallback}>
                        <WalletConnectButton>
                            <Settings accountAddress={user.address} />
                        </WalletConnectButton>
                    </SwrProvider>
                </div>
            </div>
        </div>
    )
}