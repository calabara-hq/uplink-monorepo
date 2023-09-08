"use client";
import { CustomAvatar } from "@/providers/WalletProvider";
import useEnsName from "@/hooks/useEnsName";

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

export const AddressOrEns = ({
  address,
}: {
  address: null | undefined | string;
}) => {
  const { ensName, error, loading } = useEnsName(address);
  if (!address) return <span>anonymous</span>;
  const shortAddress = formatAddress(address);
  if (ensName) return <span>{ensName}</span>;
  return <span>{shortAddress}</span>;
};

// return the userAvatar for an address
// if address is null | undefined, return a default avatar
// otherwise, return the user's avatar
export const UserAvatar = ({
  address,
  size,
}: {
  address: null | undefined | string;
  size: number;
}) => {
  if (!address)
    return <CustomAvatar address="0x123456" size={size} context="true" />;
  return <CustomAvatar address={address} size={size} context="true" />;
};
