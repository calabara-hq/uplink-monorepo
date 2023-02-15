"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import {
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";

import { wagmiClient, chains, authenticationAdapter } from "@/configs/wallet";
import { SiweMessage } from "siwe";



export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const authStatus = "unauthenticated";

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authStatus}
      >
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
