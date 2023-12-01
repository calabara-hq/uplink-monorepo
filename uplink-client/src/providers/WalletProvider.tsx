"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";

export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval: number;
}
import { UserAvatar } from "@/ui/AddressDisplay/AddressDisplay";

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { mainnet, base, baseGoerli } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useEffect, useState } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base, baseGoerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "Uplink.wtf",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains,
});

const appInfo = {
  appName: "Uplink.wtf",
};

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  connectors,
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function WalletProvider({
  children,
  session,
  refetchInterval,
}: any) {

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider
        refetchInterval={refetchInterval ? refetchInterval : 0}
        session={session}
      >
        <AuthenticationProvider>
          <RainbowKitProvider
            appInfo={appInfo}
            theme={darkTheme()}
            chains={chains}
            avatar={(user) => <UserAvatar user={user} size={160} styleOverride="flex items-center rounded-full overflow-hidden p-2.5" />}
          >
            {children}
          </RainbowKitProvider>
        </AuthenticationProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
