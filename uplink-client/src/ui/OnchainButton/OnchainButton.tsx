"use client";
import { useChainId, useSwitchChain } from "wagmi";
import { getChainName } from "@/lib/chains/supportedChains";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { Button } from "../DesignKit/Button";

export const SwitchNetworkButton = ({ children, desiredChainId, currentChainId }: { children: React.ReactNode; desiredChainId: number, currentChainId: number }) => {
    const { status, reset, switchChain } = useSwitchChain()

    const handleSwitch = async () => {
        switchChain({ chainId: desiredChainId }, { onError: () => reset() });
    }

    if (currentChainId !== desiredChainId) {
        if (status === 'pending') {

            return (
                <Button variant="outline" size="lg" onClick={handleSwitch} disabled={true}>
                    <div className="flex gap-2 items-center">
                        <p>Switching to {getChainName(desiredChainId)} network</p>
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                </Button>
            )

            // return (
            //     <button className="btn normal-case" onClick={handleSwitch} disabled={true}>
            //         <div className="flex gap-2 items-center">
            //             <p>Switching to {getChainName(desiredChainId)} network</p>
            //             <div
            //                 className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            //                 role="status"
            //             />
            //         </div>
            //     </button>
            // )
        }

        else return (
            // <button className="btn normal-case btn-ghost btn-active rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear" onClick={handleSwitch}>Switch to {getChainName(desiredChainId)}</button>
            <Button variant="outline" size="lg" onClick={handleSwitch}>Switch to {getChainName(desiredChainId)}</Button>
        )
    }

    return children
}

export default function OnchainButton({ chainId, title, onClick, isLoading, loadingChild, disabled = false }: { chainId: number, title: string, onClick: () => void, isLoading: boolean, disabled?: boolean, loadingChild: React.ReactNode }) {
    const currentChainId = useChainId();

    return (
        <WalletConnectButton styleOverride="w-full">
            <SwitchNetworkButton desiredChainId={chainId} currentChainId={currentChainId}>
                {
                    isLoading ?
                        <>{loadingChild}</>
                        : <Button size="lg" onClick={onClick} disabled={disabled}>{title}</Button>
                }
            </SwitchNetworkButton>
        </WalletConnectButton>
    )
}