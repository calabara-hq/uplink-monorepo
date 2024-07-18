"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
import { TransmissionsProvider } from "@tx-kit/hooks";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia, Chain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval: number;
}

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: "Uplink.wtf",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [base as Chain, baseSepolia as Chain],
  ssr: true,
})

export default function WalletProvider({
  children,
  session,
  refetchInterval,
}: any) {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider
          refetchInterval={refetchInterval ? refetchInterval : 0}
          session={session}
        >
          <AuthenticationProvider>
            <RainbowKitProvider
              theme={darkTheme()}
            // avatar={(user) => <UserAvatar user={user} size={160} styleOverride="flex items-center rounded-full overflow-hidden p-2.5" />}
            >
              <TransmissionsProvider>
                {children}
              </TransmissionsProvider>
            </RainbowKitProvider>
          </AuthenticationProvider>
        </SessionProvider>

      </QueryClientProvider>
    </WagmiProvider>
  );
}
