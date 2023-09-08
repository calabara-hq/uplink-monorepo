"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import {
  AvatarComponent,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "@/configs/wallet";
import { SessionProvider } from "./SessionProvider";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { Session } from "./SessionProvider";
import Noggles from "@/ui/Noggles/Noggles";
export interface IWalletProviderProps {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval: number;
}

const generateColorFromAddress = (address) => {
  const hexColor = address.slice(2, 8);
  const firstInt = parseInt(hexColor.charAt(0));

  // Convert hex to RGB
  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);

  if (firstInt < 5) r = 0;
  else if (firstInt < 11) g = 0;
  else b = 0;

  return {
    foreground: "rgb(" + r + "," + g + "," + b + ")",
    background: "rgb(" + r + "," + g + "," + b + ", 35%)",
  };
};

export const CustomAvatar = ({
  address,
  size,
  context,
}: {
  address: string;
  size: number;
  context?: string;
}) => {
  const colors = generateColorFromAddress(address);
  const avatarStyle = {
    backgroundColor: colors.background,
    width: size,
    height: size,
  };
  if (!context) {
    return (
      <div
        style={avatarStyle}
        className="flex items-center rounded-full overflow-hidden p-2.5"
      >
        <Noggles color={colors.foreground} />
      </div>
    );
  } else {
    return (
      <div
        style={avatarStyle}
        className="flex h-full items-center overflow-hidden p-1 rounded-lg transition-all duration-300 ease-linear"
      >
        <Noggles color={colors.foreground} />
      </div>
    );
  }
};

export default function WalletProvider({
  children,
  session,
  refetchInterval,
}: any) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider
        refetchInterval={refetchInterval ? refetchInterval : 0}
        session={session}
      >
        <AuthenticationProvider>
          <RainbowKitProvider
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
