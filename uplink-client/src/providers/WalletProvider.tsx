"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import {
  AvatarComponent,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
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

const generateColorFromAddress = (address) => {
  if (!address) return { foreground: "black", background: "white" };

  const hexColor = address.slice(2, 8);
  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);

  // Minimum brightness threshold
  const brightnessThreshold = 300;
  const colorDecision = parseInt(hexColor, 16) % 3;

  if (colorDecision === 0) {
    r = 255; // Make red dominant
    if (g + b < brightnessThreshold - r) {
      g = g > b ? Math.min(255, brightnessThreshold - r - b) : g;
      b = g > b ? b : Math.min(255, brightnessThreshold - r - g);
    }
  } else if (colorDecision === 1) {
    g = 255; // Make green dominant
    if (r + b < brightnessThreshold - g) {
      r = r > b ? Math.min(255, brightnessThreshold - g - b) : r;
      b = r > b ? b : Math.min(255, brightnessThreshold - g - r);
    }
  } else {
    b = 255; // Make blue dominant
    if (r + g < brightnessThreshold - b) {
      r = r > g ? Math.min(255, brightnessThreshold - b - g) : r;
      g = r > g ? g : Math.min(255, brightnessThreshold - b - r);
    }
  }

  return {
    foreground: `rgb(${r},${g},${b})`,
    background: `rgba(${r},${g},${b},0.35)`,
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
