"use client";;
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "@/providers/SessionProvider";
import React, { useCallback, useRef, useState } from "react";
import { NoggleAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import { useConnect, useDisconnect } from 'wagmi';
import { Button } from "@/ui/DesignKit/Button";
import { TbLoader2 } from "react-icons/tb";
import { IoMdPower } from "react-icons/io";
import { Modal } from "../Modal/Modal";

function AccountModal({
  isModalOpen,
  handleClose,
}: {
  isModalOpen: boolean;
  handleClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();

  return (
    <Modal isModalOpen={isModalOpen} onClose={handleClose} className="w-full max-w-[350px]">
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
            <div className="flex gap-1 items-center p-2">
              <p>Sign out</p>
              <IoMdPower className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  )
}


const ConnectedAccountDisplay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center justify-center lg:gap-2 w-full">
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
    <Button variant="outline" onClick={createWallet}>
      {isCreating ?
        <span className="flex items-center gap-2">Creating<TbLoader2 className="w-4 h-4 text-t2 animate-spin" /></span>
        : "Create Wallet"
      }
    </Button>
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

  const { status } = useSession();
  if (!status || status === "loading")
    return (
      <div className="grid grid-cols-2 items-center gap-2 max-w-full">

        <Button variant="outline" className="shimmer text-transparent">Placeholder</Button>
        <Button variant="outline" className="shimmer text-transparent">Placeholder</Button>

      </div>
    )
  else
    return (
      <>
        <ConnectButton.Custom>
          {({ openConnectModal }) => {
            if (status === "authenticated") {
              if (children) return children;
              else return <ConnectedAccountDisplay />
            }
            return (
              <div className="grid grid-cols-2 items-center gap-2 max-w-full">
                <CreateSmartWalletButton openConnectModal={openConnectModal} />
                <Button variant="default" onClick={openConnectModal}>
                  Sign in
                </Button>

              </div>
            );
          }}
        </ConnectButton.Custom>
      </>
    );
}
