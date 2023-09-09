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
                <button
                  className={`btn btn-ghost btn-active normal-case rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear`}
                  onClick={openConnectModal}
                >
                  sign in
                </button>
              );
            case "authenticated":
              return (
                <div
                  className="flex items-center join overflow-hidden cursor-pointer lg:gap-2"
                  onClick={openAccountModal}
                >
                  <div className="hidden md:flex gap-2 items-center justify-start text-sm font-bold pl-0 btn btn-ghost normal-case rounded-xl hover:bg-base-200 transition-all duration-200 ease-linear h-fit min-h-fit text-t2 hover:text-t1 ">
                    <CustomAvatar
                      address={session?.user?.address}
                      size={40}
                      context={"button"}
                    />
                    <p>{formatAddress(session?.user?.address)}</p>
                  </div>
                </div>
              );
          }
        }}
      </ConnectButton.Custom>
    );
}
