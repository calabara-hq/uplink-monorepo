"use client";
import { CreateTokenSchema, useCreateTokenReducer } from "@/hooks/useCreateTokenReducer";
import { ContractID, splitContractID } from "@/types/channel";
import { Button } from "@/ui/DesignKit/Button";
import { Label } from "@/ui/DesignKit/Label";
import { MediaUpload } from "@/ui/MediaUpload/MediaUpload";
import { BasicInput } from "@/ui/Studio/StudioTools";
import { CreateToken } from "@/ui/Studio/TokenStudio";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWalletClient } from "wagmi";
import { z } from "zod";
import { useCreateTokenIntent } from "@tx-kit/hooks"
import useSWRMutation from "swr/mutation";
import { insertIntent } from "@/lib/fetch/insertIntent";
import { DeferredTokenIntentWithSignature } from "@tx-kit/sdk";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

    const channelKey = searchParams.channelKey;

    const contractId = "0xB8FcE4B78f247a7A609Ba8cE142DCE68E2177c89-8453"

    const { contractAddress, chainId } = splitContractID(contractId);

    // get the contractId by connected channel key (later)

    // first, we need to hardcode a contractId and try to create an intent via the farcaster signature

    // const contractId = searchParams.contractId as ContractID;
    // const { contractAddress, chainId } = splitContractID(contractId);

    const {
        state,
        setField,
        setErrors,
        validate,
        setIsIntent,
        txError,
        txStatus,

        txResponse,
        txHash
    } = useCreateTokenReducer(contractAddress)

    const { status: createIntentStatus, createTokenIntent, signedIntent, error: createIntentError } = useCreateTokenIntent()
    const { address } = useAccount()

    const [isUploading, setIsUploading] = useState(false);

    const uploadStatusCallback = (status: boolean) => {
        setIsUploading(status)
    }

    const ipfsImageCallback = (url: string) => {
        setField("imageURI", url)
    }

    const ipfsAnimationCallback = (url: string) => {
        setField("animationURI", url)
    }

    const mimeTypeCallback = (mimeType: string) => {
        setField("mimeType", mimeType);
    }


    const { trigger, data: swrData, error: swrError, isMutating: isSwrMutating, reset: resetSwr } = useSWRMutation(
        `/api/insertIntent/${contractId}`,
        insertIntent,
        {
            onError: (err) => {
                console.log(err);
                resetSwr();
            },
        }
    );

    useEffect(() => {
        if (createIntentStatus === "complete") {
            console.log("Intent created")
            handleIntentCreated()
        }
    }, [createIntentStatus])

    const handleIntentCreated = async () => {

        try {
            await trigger({
                contractId: contractId,
                tokenIntent: signedIntent
            }).then(response => {
                if (!response.success) {
                    toast.error('Something went wrong')
                    return resetSwr()
                }

                sendMessage(response.id, signedIntent);

            })
        } catch (e) {
            console.log(e)
            resetSwr()
        }
    }

    const sendMessage = (intentId: string, intent: DeferredTokenIntentWithSignature) => {
        const message =
        {
            "type": "createCast",
            "data": {
                "cast": {
                    "text": "NYC pizza enjoyers, we need your input on last night's tasting:",
                    "embeds": [
                        `https://staging.uplink.wtf/calabara/mintboard/${contractId}/post/${intentId}/v2?intent=true&referrer=${address}`
                    ]
                }
            }
        }

        console.log(message)

        window.parent.postMessage(message, "*");
    }


    const submit = async () => {

        const { errors, ...rest } = { ...state };

        const result = await CreateTokenSchema.safeParseAsync(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof CreateTokenSchema>).error.format();
            setErrors(formattedErrors);
        }

        if (!result.success) {
            return toast.error("Some of your fields are invalid")
        }

        createTokenIntent(result.data)
    }



    return (
        <div className="flex flex-col gap-2 h-screen w-full bg-base-100">
            <div className="flex flex-col gap-4 w-full p-4 justify-center items-center">
                <h1 className="text-2xl font-bold">Create a new post</h1>
                <div className="flex flex-col w-full max-w-xs">
                    <MediaUpload
                        acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'video/mp4']}
                        uploadStatusCallback={uploadStatusCallback}
                        ipfsImageCallback={ipfsImageCallback}
                        ipfsAnimationCallback={ipfsAnimationCallback}
                        mimeTypeCallback={mimeTypeCallback}
                        maxVideoDuration={210}
                    />
                    {state.errors?.imageURI?._errors && (
                        <Label>
                            <p className="text-error max-w-sm break-words">{state.errors.imageURI._errors.join(",")}</p>
                        </Label>
                    )}
                </div>
                <BasicInput inputType="text" label="Title" value={state.title} placeholder={"My awesome creation"} onChange={(e) => setField("title", e.target.value)} error={state.errors?.title?._errors} />

                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');

                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button onClick={openConnectModal} type="button">
                                                Connect Wallet
                                            </button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <button onClick={openChainModal} type="button">
                                                Wrong network
                                            </button>
                                        );
                                    }

                                    return (
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button
                                                onClick={openChainModal}
                                                style={{ display: 'flex', alignItems: 'center' }}
                                                type="button"
                                            >
                                                {chain.hasIcon && (
                                                    <div
                                                        style={{
                                                            background: chain.iconBackground,
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: 999,
                                                            overflow: 'hidden',
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={chain.name ?? 'Chain icon'}
                                                                src={chain.iconUrl}
                                                                style={{ width: 12, height: 12 }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                {chain.name}
                                            </button>

                                            <button onClick={openAccountModal} type="button">
                                                {account.displayName}
                                                {account.displayBalance
                                                    ? ` (${account.displayBalance})`
                                                    : ''}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>


                <Button onClick={submit} >Create</Button>
            </div>
        </div>
    )
}