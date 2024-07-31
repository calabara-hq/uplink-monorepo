"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
import { TransmissionsProvider } from "@tx-kit/hooks";

import "@rainbow-me/rainbowkit/styles.css";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia, Chain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { coinbaseWallet, walletConnectWallet, rainbowWallet, injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

coinbaseWallet.preference = 'smartWalletOnly';

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
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  },
  ssr: true,
  wallets: [{
    groupName: "Popular",
    wallets: [coinbaseWallet, metaMaskWallet]
  },
  {
    groupName: "More",
    wallets: [walletConnectWallet, rainbowWallet]
  }
  ],
})



const TxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TransmissionsProvider>
      {children}
    </TransmissionsProvider>
  )
}



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
              modalSize="compact"
            // avatar={(user) => <UserAvatar user={user} size={160} styleOverride="flex items-center rounded-full overflow-hidden p-2.5" />}
            >
              <TxProvider>
                {children}
              </TxProvider>
            </RainbowKitProvider>
          </AuthenticationProvider>
        </SessionProvider>

      </QueryClientProvider>
    </WagmiProvider>
  );
}
