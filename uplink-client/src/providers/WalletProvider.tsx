"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig, chains, appInfo } from "@/lib/wallet";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
import Noggles from "@/ui/Noggles/Noggles";
export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval: number;
}
import { CustomAvatar } from "@/ui/AddressDisplay/AddressDisplay";

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
            avatar={CustomAvatar}
          >
            {children}
          </RainbowKitProvider>
        </AuthenticationProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
