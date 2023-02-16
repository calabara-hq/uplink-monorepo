"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnectButton() {
  
  return (
    
    <ConnectButton
      accountStatus={{
        smallScreen: "address",
        largeScreen: "full",
      }}
      showBalance={false}
    />
  );
  
 /*
  console.log('IM BEGINNING TO RENDER!!')
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 1,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button
                    className={"btn"}
                    onClick={openConnectModal}
                    type="button"
                  >
                    {"Connect Wallet"}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className={"btn"}
                    onClick={openChainModal}
                    type="button"
                  >
                    {"Wrong network"}
                  </button>
                );
              }
              return (
                <button
                  className={"btn"}
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.displayName}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
  */
}
