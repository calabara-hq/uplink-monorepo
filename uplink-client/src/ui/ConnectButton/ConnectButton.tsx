"use client";
import { formatAddress } from "@/configs/wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useEffect } from "react";

export default function WalletConnectButton() {
  const { data: session, status } = useSession();
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
            return (
              <button className="btn" onClick={openAccountModal}>
                {formatAddress(session?.user?.address || "test")}
              </button>
            );
        }
      }}
    </ConnectButton.Custom>
  );
}
