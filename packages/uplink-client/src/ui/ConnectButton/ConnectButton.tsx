"use client";
import { formatAddress } from "@/configs/wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import { useSession } from "next-auth/react";
import { useSession } from "@/providers/SessionProvider";
import React, { useEffect } from "react";
import { useEnsName } from "wagmi";

export default function WalletConnectButton() {
  const { data: session, status } = useSession();
  const _getSession = () => {
    return { session, status };
  };

  //return <ConnectButton />;

  return (
    <ConnectButton.Custom>
      {({ openAccountModal, openConnectModal }) => {
        console.log("session", session);
        console.log("status", status);
        switch (status) {
          case "unauthenticated":
            return (
              <button
                className="btn lowercase bg-red-600"
                onClick={openConnectModal}
              >
                connect
              </button>
            );
          case "authenticated":
            return (
              <button className="btn bg-blue-600" onClick={openAccountModal}>
                {formatAddress(session?.user?.address || "test")}
              </button>
            );
        }
      }}
    </ConnectButton.Custom>
  );
}
