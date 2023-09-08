"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import WalletConnectButton from "../ConnectButton/ConnectButton";

const TwitterConnectButton = ({}) => {
  const handleClick = async () => {
    const res = await twitterSignIn("write");
    if (res) {
      window.open(res.url, "_blank");
    }
  };

  return (
    <WalletConnectButton>
      <button
        className="btn btn-primary lowercase  w-full"
        onClick={handleClick}
      >
        Connect Twitter
      </button>
    </WalletConnectButton>
  );
};

export default TwitterConnectButton;
