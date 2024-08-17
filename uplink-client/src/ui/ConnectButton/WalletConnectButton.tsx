"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NoggleAvatar, UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { UserRejectedRequestError } from 'viem';
import Link from "next/link";
import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { Button } from "../Button/Button";
import { TbLoader2 } from "react-icons/tb";

function AccountModal({
  isModalOpen,
  handleClose,
}: {
  isModalOpen: boolean;
  handleClose?: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();

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

  if (isModalOpen) return (
    <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-30 animate-fadeIn" >
      <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-lg animate-springUp shadow-none" ref={modalRef}>
        <div className="flex flex-col items-center gap-4">
          <NoggleAvatar
            address={session?.user?.address}
            size={80}
          />
          <div className="font-bold text-lg">
            <UsernameDisplay user={session?.user} />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Button variant="destructive" onClick={() => {
              disconnect()
            }}>
              <div className="flex gap-1 items-center p-2 text-black">
                <p>Sign out</p>
                <FaSignOutAlt className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return null;

}


const ConnectedAccountDisplay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center justify-center lg:gap-2 w-full">
      {/* <div tabIndex={0} role="button" onClick={() => setIsModalOpen(!isModalOpen)} className="flex md:gap-2 items-center no-select justify-start text-sm font-bold md:pl-0 btn btn-ghost normal-case rounded-xl hover:bg-base-200 transition-all duration-200 ease-linear h-fit min-h-fit text-t2 hover:text-t1 "> */}
      <div tabIndex={0} role="button" onClick={() => setIsModalOpen(!isModalOpen)} className="flex gap-2 bg-black/10 hover:bg-base-100 w-fit rounded-xl items-center justify-start pr-2 font-bold  no-select text-t2">

        <NoggleAvatar
          address={session?.user?.address}
          size={40}
          styleOverride="flex h-full items-center overflow-hidden p-1 rounded-xl transition-all duration-300 ease-linear"
        />
        <div className="">
          <UsernameDisplay user={session?.user} />
        </div>
      </div>
      <AccountModal isModalOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </div >
  );
};

export function CreateSmartWalletButton({ openConnectModal }: { openConnectModal: () => void }) {
  const { connectors, connect, data } = useConnect();
  const [isCreating, setIsCreating] = useState(false);

  const createWallet = useCallback(() => {
    setIsCreating(true);
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector }, {
        onSuccess: () => {
          setIsCreating(false);
          openConnectModal()
        },
        onSettled: () => {
          setIsCreating(false);
        }
      });
    }
  }, [connectors, connect, setIsCreating]);


  return (
    <button
      className={`btn normal-case btn-ghost btn-active rounded-xl transition-all duration-200 ease-linear`}
      onClick={createWallet}
    >
      {isCreating ?
        <span className="flex items-center gap-2">Creating<TbLoader2 className="w-4 h-4 text-t2 animate-spin" /></span>
        : "Create Wallet"
      }
    </button>

  );
}

export default function WalletConnectButton({
  children,
  styleOverride,
  disabled = false
}: {
  children?: React.ReactNode;
  styleOverride?: string;
  disabled?: boolean;
}) {

  const { data: session, status } = useSession();
  if (!status || status === "loading")
    return (
      <div className="grid grid-cols-2 items-center gap-2 max-w-full">
        <div className={`btn normal-case shimmer btn-ghost rounded-xl text-transparent ${styleOverride}`}>
          Create Wallet
        </div>
        <div className={`btn normal-case shimmer btn-ghost rounded-xl text-transparent ${styleOverride}`}>
          Sign in
        </div>
      </div>
    )
  else
    return (
      <>
        <ConnectButton.Custom>
          {({ account, openAccountModal, openConnectModal }) => {
            if (status === "authenticated") {
              if (children) return children;
              else return <ConnectedAccountDisplay />
            }
            return (
              <div className="grid grid-cols-2 items-center gap-2 max-w-full">
                <CreateSmartWalletButton openConnectModal={openConnectModal} />
                <button
                  className={`btn normal-case btn-ghost btn-active rounded-xl transition-all duration-200 ease-linear ${styleOverride}`}
                  onClick={openConnectModal}
                >
                  Sign in
                </button>
              </div>
            );
          }}
        </ConnectButton.Custom>
      </>
    );
}
