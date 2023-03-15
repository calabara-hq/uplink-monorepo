"use client";

import { useSession } from "@/providers/SessionProvider";
import { useConnectModal } from "@rainbow-me/rainbowkit";

// if authenticated, render the "default" button with callback on click
// if not authenticated, render prompt a signature and fire the callback upon success

export default function ConnectWithCallback({
  callback,
  buttonLabel,
}: {
  callback: () => void;
  buttonLabel: string;
}) {
  const { data: session, status } = useSession();
  const { openConnectModal } = useConnectModal();

  if (status === "unauthenticated") {
    return (
      <button className="btn" onClick={openConnectModal}>
        Connect Wallet
      </button>
    );
  }

  return (
    <button className="btn" onClick={callback}>
      {buttonLabel}
    </button>
  );
}
