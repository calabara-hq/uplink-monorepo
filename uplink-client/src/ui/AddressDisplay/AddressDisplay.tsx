"use client";

import { User } from "@/types/user";
import Noggles from "../Noggles/Noggles";
import useEnsName from "@/hooks/useEnsName";
import { Session } from "@/providers/SessionProvider";
import UplinkImage from "@/lib/UplinkImage";
import {ImageWrapper} from "@/ui/Submission/MediaWrapper"
// returns one of the following:
// "anonymous" if address is null | undefined
// "0x..." if address is a string and doesn't have an ens name
// ens name if address is a string and has an ens name
// optional avatar if address is a string and has an ens name

const formatAddress = (address: string) => {
  return `${address.substring(0, 4)}\u2026${address.substring(
    address.length - 4
  )}`;
};

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

export const NoggleAvatar = ({
  address,
  size,
  styleOverride,
}: {
  address: string;
  size: number;
  styleOverride?: string;
}) => {
  const colors = generateColorFromAddress(address);
  const avatarStyle = {
    backgroundColor: colors.background,
    width: size,
    height: size,
  };

  return (
    <div
      style={avatarStyle}
      className={styleOverride ? styleOverride : "flex h-full items-center overflow-hidden p-1 rounded-lg transition-all duration-300 ease-linear"}
    >
      <Noggles color={colors.foreground} />
    </div>
  );
};



export const AddressOrEns = ({
  address,
}: {
  address: null | undefined | string;
}) => {
  const { ensName, error, loading } = useEnsName(address ?? "");
  if (!address) return <span>anonymous</span>;
  const shortAddress = formatAddress(address);
  if (ensName) return <span>{ensName}</span>;
  return <span>{shortAddress}</span>;
};


export const UserAvatar = ({
  user,
  size,
  styleOverride,
}: {
  user: Session['user'] | User;
  size: number;
  styleOverride?: string;
}) => {
  if (user?.profileAvatar) return (
    <div style={{ width: `${size}px` }}>
      <ImageWrapper>
        <UplinkImage src={user.profileAvatar} alt="avatar" className={styleOverride ? styleOverride : "rounded-lg"} fill blur sizes="5vw"/>
      </ImageWrapper>
    </div>
  )

  const dispAddr = user?.address ? user.address : "0x123456";
  return <NoggleAvatar address={dispAddr} size={size} styleOverride={styleOverride} />;
};

export const UsernameDisplay = ({ user }: { user: Session['user'] | User }) => {
  if (user?.displayName) return <span>{user.displayName}</span>;
  return AddressOrEns({ address: user?.address });
}