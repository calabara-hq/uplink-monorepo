"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const TwitterConnectButton = ({}) => {
  const { openConnectModal } = useConnectModal();
  const { data: session, status } = useSession();
  const handleClick = async () => {
    const res = await twitterSignIn("write");
    if (res) {
      window.open(res.url, "_blank");
    }
  };

  return (
    <div className="flex gap-2">
      {!session?.user && (
        <button className="btn btn-primary" onClick={openConnectModal}>
          sign in
        </button>
      )}
      {session?.user && (
        <button className="btn bg-twitter" onClick={handleClick}>
          Connect Twitter
        </button>
      )}
    </div>
  );
};

export default TwitterConnectButton;
