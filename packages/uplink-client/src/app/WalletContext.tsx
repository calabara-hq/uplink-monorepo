"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { wagmiClient, chains } from "@/configs/wallet";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export interface IWalletContextProps {
  children: React.ReactNode;
  session: Session | null;
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "sign here please!",
  domain: "uplink.wtf",
});

export default function WalletContext({
  children,
  session,
}: IWalletContextProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
