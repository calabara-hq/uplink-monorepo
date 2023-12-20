import UplinkImage from "@/lib/UplinkImage"
import { ImageWrapper } from "../Submission/MediaWrapper";
import { RenderStandardVideoWithLoader } from "../VideoPlayer";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { parseIpfsUrl } from "@/lib/ipfs";
import { getChainName } from "@/lib/chains/supportedChains";
import Link from "next/link";
import { getContractFromChainId } from "@/lib/abi/zoraEdition";

export const RenderMintMedia = ({ imageURI, animationURI }: { imageURI: string; animationURI: string }) => {
    const gatewayImageURI = parseIpfsUrl(imageURI).gateway
    const gatewayAnimationURI = parseIpfsUrl(animationURI).gateway

    if (gatewayAnimationURI) {
        return (
            <RenderStandardVideoWithLoader videoUrl={gatewayAnimationURI} posterUrl={gatewayImageURI} />
        )

    }
    else if (gatewayImageURI) {
        return (
            <ImageWrapper>
                <UplinkImage src={gatewayImageURI} fill sizes={"30vw"} alt="media" className="object-contain" blur={false}/>
            </ImageWrapper>
        )
    }
}

export const SwitchNetworkButton = ({ children, chainId }: { children: React.ReactNode; chainId: number }) => {
    const { chain } = useNetwork();
    const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

    const handleSwitch = async () => {
        switchNetwork(chainId);
    }

    if (!chain) return null; // bail early if user not connected

    if (isLoading && pendingChainId === chainId) {
        return (
            <button className="btn normal-case" onClick={handleSwitch} disabled={true}>
                <div className="flex gap-2 items-center">
                    <p>Switching to {getChainName(pendingChainId)} network</p>
                    <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    />
                </div>
            </button>
        )
    }

    else if (!isLoading && chain.id !== chainId) {
        return (
            <button className="btn normal-case btn-ghost btn-active rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear" onClick={handleSwitch}>Switch to {getChainName(chainId)}</button>
        )
    }

    else return children as JSX.Element
}


export const AddFundsButton = ({ chainId }: { chainId: number }) => {
    const { bridge } = getContractFromChainId(chainId);
    return <Link className="btn btn-outline btn-warning normal-case" href={bridge} prefetch={false} target="_blank">Add Funds</Link>
}