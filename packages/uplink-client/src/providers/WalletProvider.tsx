"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { wagmiClient, chains } from "@/configs/wallet";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "sign here please!",
  domain: "uplink.wtf",
});

export default function WalletProvider({ children, session }: any) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={session}>
        <AuthenticationProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </AuthenticationProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
