"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React from "react";
import { AddressOrEns, CustomAvatar } from "@/ui/AddressDisplay/AddressDisplay";

export default function WalletConnectButton({
  children,
  styleOverride,
}: {
  children?: React.ReactNode;
  styleOverride?: string;
}) {
  const { data: session, status } = useSession();
  if (!status || status === "loading")
    return <div className="h-12 w-20 rounded-full shimmer"></div>;
  else
    return (
      <ConnectButton.Custom>
        {({ account, openAccountModal, openConnectModal }) => {
          if (status === "authenticated") {
            if (children) return children;
            else
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
                    <AddressOrEns address={session?.user?.address} />
                  </div>
                  <div className="flex md:hidden">
                    <CustomAvatar
                      address={session?.user?.address}
                      size={40}
                      context={"button"}
                    />
                  </div>
                </div>
              );
          }

          return (
            <button
              className={`btn normal-case ${
                styleOverride
                  ? styleOverride
                  : "btn-ghost btn-active normal-case rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear"
              }`}
              onClick={openConnectModal}
            >
              Sign in
            </button>
          );
        }}
      </ConnectButton.Custom>
    );
}
