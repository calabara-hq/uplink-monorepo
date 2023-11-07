"use client";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ZoraAbi } from "./ZoraAbi"
import { useEffect } from "react";
import { z } from "zod";


const ZORA_NFT_CREATOR_PROXY = '0xf74b146ce44cc162b601dec3be331784db111dc1';

const SalesConfig = z.object({
    publicSalePrice: z.string(),
    maxSalePurchasePerAddress: z.number(),
    publicSaleStart: z.string(),
    publicSaleEnd: z.string(),
    presaleStart: z.string(),
    presaleEnd: z.string(),
    presaleMerkleRoot: z.string(),
});

const EditionConfig = z.object({
    name: z.string(),
    symbol: z.string(),
    editionSize: z.string(),
    royaltyBPS: z.string(),
    fundsRecipient: z.string(),
    defaultAdmin: z.string(),
    saleConfig: SalesConfig,
    description: z.string(),
    animationURI: z.string(),
    imageURI: z.string(),
})



export default function CreateZoraEdition() {
    useEffect(() => { }, [])
    const args = [
        "test",
        "test",
        "100",
        "1000",
        "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
        "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
        [
            "100000000000000000",
            5,
            "1699367854",
            "1699467854",
            "0",
            "0",
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ],
        "test",
        "",
        "ipfs://bafybeibocdfvyfmbi75jnz7meflvf35hluihjk6jibh4t4tnpe3qq2tdza",
        "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"
    ];




    const { config } = usePrepareContractWrite({
        chainId: 1,
        address: ZORA_NFT_CREATOR_PROXY,
        abi: ZoraAbi,
        functionName: 'createEditionWithReferral',
        args: args,
        enabled: true,
    });

    console.log(config)

    const {
        write,
        isLoading,
        error
    } = useContractWrite(config);

    const handleClick = () => {
        console.log(write)
        if (write) {
            write();
        }
    };

    console.log(write, isLoading, error)

    return (
        <div className="flex flex-col gap-2">
            <button className="btn btn-primary" onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Create Edition'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </div>
    );
}