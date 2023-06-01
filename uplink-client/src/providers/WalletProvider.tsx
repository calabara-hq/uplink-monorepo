"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "@/configs/wallet";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval: number;
}

export default function WalletProvider({ children, session, refetchInterval }: any) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={refetchInterval ? refetchInterval : 0} session={session}>
        <AuthenticationProvider>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </AuthenticationProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
