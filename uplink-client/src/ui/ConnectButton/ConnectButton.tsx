"use client";
import { formatAddress } from "@/utils/formatAddress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React from "react";
import { BiLink } from "react-icons/bi";

export default function WalletConnectButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (!status || status === "loading")
    return <div className="h-12 w-20 rounded-lg shimmer"></div>;
  else
    return (
      <ConnectButton.Custom>
        {({ openAccountModal, openConnectModal }) => {
          switch (status) {
            case "unauthenticated":
              return (
                <button className="btn lowercase" onClick={openConnectModal}>
                  sign in
                </button>
              );
            case "authenticated":
              if (children) {
                return <>{children}</>;
              } else
                return (
                  <div
                    className="flex bg-base-100 rounded-xl btn  p-0 overflow-hidden hover:bg-base-100 hover:border-primary"
                    onClick={openAccountModal}
                  >
                    <div className="join rounded-xl items-center justify-center p-2 text-xs font-bold">
                      <p>{formatAddress(session?.user?.address)}</p>
                    </div>
                    <div className="flex flex-col ml-auto bg-primary rounded-r-xl justify-center items-center text-black p-3">
                      <BiLink className="w-6 h-6" />
                    </div>
                  </div>
                );
          }
        }}
      </ConnectButton.Custom>
    );
}
