"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { useEffect, useState } from "react";

const TwitterConnectButton = () => {
  const [url, setUrl] = useState(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      twitterSignIn("write").then((data) => {
        if (data.url) setUrl(data.url);
      });
    }
  }, [status]);
  const handleClick = async () => {
    if (url) window.open(url, "_blank");
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
