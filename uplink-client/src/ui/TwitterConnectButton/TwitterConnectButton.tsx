"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";

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
        className="btn btn-primary btn-outline normal-case w-full"
        onClick={handleClick}
      >
        Connect Twitter
      </button>
    </WalletConnectButton>
  );
};

export default TwitterConnectButton;
