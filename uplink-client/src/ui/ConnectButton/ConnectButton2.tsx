"use client";
import { formatAddress } from "@/utils/formatAddress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useContext } from "react";
import { BiLink } from "react-icons/bi";
import { CustomAvatar } from "@/providers/WalletProvider";
export default function WalletConnectButton2({}: {}) {
  const { data: session, status } = useSession();
  if (!status || status === "loading")
    return <div className="h-12 w-20 rounded-lg shimmer"></div>;
  else
    return (
      <ConnectButton.Custom>
        {({ account, openAccountModal, openConnectModal }) => {
          switch (status) {
            case "unauthenticated":
              return (
                <button className={`btn btn-ghost btn-active normal-case rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear`} onClick={openConnectModal}>
                  sign in
                </button>
              );
            case "authenticated":
              return (
                <div
                  className="flex items-center join overflow-hidden cursor-pointer lg:gap-2"
                  onClick={openAccountModal}
                >
                   <div className="hidden md:flex items-center justify-center text-sm font-bold px-2 btn btn-ghost rounded-xl hover:bg-base-200 transition-all duration-200 ease-linear ">
                    <p>{formatAddress(session?.user?.address)}</p>
                  </div> 
                  {/* <div className="divider divider-horizontal mr-1 ml-0"></div> */}
                  {/* <div className="flex flex-col ml-auto bg-primary rounded-r-xl justify-center items-center text-black p-3">
                      <BiLink className="w-6 h-6" />
                    </div> */}
                  <CustomAvatar
                    address={session?.user?.address}
                    size={40}
                    context={"button"}
                  />

                </div>
              );
          }
        }}
      </ConnectButton.Custom>
    );
}
