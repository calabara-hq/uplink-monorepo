"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useEffect, useRef, useState } from "react";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import Link from "next/link";

const NavMenu = ({ openAccountModal }: { openAccountModal: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center cursor-pointer lg:gap-2" ref={dropdownRef}>
      <div className="dropdown dropdown-top md:dropdown-bottom left-[-20px]">
        <div tabIndex={0} role="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex md:gap-2 items-center justify-start text-sm font-bold md:pl-0 btn btn-ghost normal-case rounded-xl hover:bg-base-200 transition-all duration-200 ease-linear h-fit min-h-fit text-t2 hover:text-t1 ">
          <UserAvatar
            user={session?.user}
            size={40}
          />
          <div className="hidden md:block">
            <UsernameDisplay user={session?.user} />
          </div>
        </div>
        {isDropdownOpen && <ul className="menu menu-sm dropdown-content mb-3 mt-0 md:mb-0 md:mt-3 mr-4 md:mr-0 z-[1] p-2 border border-border shadow-2xl  shadow-black bg-base-100 rounded-box w-fit">
          <Link href={`/user/${session?.user?.address}`} onClick={() => setIsDropdownOpen(false)} className="btn btn-ghost normal-case">Profile</Link>
          <button className="btn btn-ghost normal-case"
            onClick={() => {
              setIsDropdownOpen(false)
              openAccountModal()
            }}
          >Wallet</button>
        </ul>}
      </div>
    </div >
  );
};

export default function WalletConnectButton({
  children,
  styleOverride,
}: {
  children?: React.ReactNode;
  styleOverride?: string;
}) {
  const { data: session, status } = useSession();
  if (!status || status === "loading")
    return <div className="h-12 w-full rounded-full shimmer"></div>;
  else
    return (
      <ConnectButton.Custom>
        {({ account, openAccountModal, openConnectModal }) => {
          if (status === "authenticated") {
            if (children) return children;
            else return <NavMenu openAccountModal={openAccountModal} />
          }

          return (
            <button
              className={`btn normal-case btn-ghost btn-active rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear ${styleOverride}`}
              onClick={openConnectModal}
            >
              Sign in
            </button>
          );
        }}
      </ConnectButton.Custom>
    );
}
