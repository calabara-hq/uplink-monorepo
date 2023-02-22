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
}

export default function WalletProvider({ children, session }: any) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={3} session={session}>
        <AuthenticationProvider>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </AuthenticationProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
