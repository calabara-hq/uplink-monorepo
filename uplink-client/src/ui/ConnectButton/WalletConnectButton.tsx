"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useEffect, useRef, useState } from "react";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import { useDisconnect } from 'wagmi'
import Link from "next/link";
import { FaSignOutAlt, FaUser } from "react-icons/fa"

function AccountModal({
  isModalOpen,
  handleClose,
}: {
  isModalOpen: boolean;
  handleClose?: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect({
    onSuccess(data) {
      console.log(data)
      console.log('success!')
    }
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

   if(isModalOpen) return (
    <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-30 animate-fadeIn" >
      <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-lg animate-springUp shadow-none" ref={modalRef}>
        <div className="flex flex-col items-center gap-4">
          <UserAvatar
            user={session?.user}
            size={80}
          />
          <div className="font-bold text-lg">
            <UsernameDisplay user={session?.user} />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-0.5 bg-[#42454c] rounded-lg items-center p-1 pl-4 pr-4 cursor-pointer"
              onClick={() => {
                disconnect()
              }}
            >
              
                <FaSignOutAlt className="w-4 h-4"/>
                <p>Sign out</p>
            </div>
            <Link 
              href={`/user/${session?.user?.address}`}
              onClick={() => handleClose()}
              className="flex flex-col gap-0.5 bg-[#42454c] rounded-lg items-center p-1 pl-4 pr-4 cursor-pointer"
              >
                <FaUser className="w-4 h-4"/>
                <p>Profile</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
    );

    return null;
  
}


const NavMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center lg:gap-2">
      <div tabIndex={0} role="button" onClick={() => setIsModalOpen(!isModalOpen)} className="flex md:gap-2 items-center no-select justify-start text-sm font-bold md:pl-0 btn btn-ghost normal-case rounded-xl hover:bg-base-200 transition-all duration-200 ease-linear h-fit min-h-fit text-t2 hover:text-t1 ">
        <UserAvatar
          user={session?.user}
          size={40}
        />
        <div className="hidden md:block">
          <UsernameDisplay user={session?.user} />
        </div>
      </div>
      <AccountModal isModalOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}/>
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
            else return <NavMenu />
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
