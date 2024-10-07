"use client";;
import { useCreateTokenReducer } from "@/hooks/useCreateTokenReducer"
import { MediaUpload } from "@/ui/MediaUpload/MediaUpload";
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import React, { useEffect, useRef, useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { maxUint256 } from "viem"
import toast from "react-hot-toast";
import { Channel, concatContractID, ContractID, isInfiniteChannel, splitContractID } from "@/types/channel";
import { useSession } from "@/providers/SessionProvider";
import { useAccount, useConnect } from "wagmi";
import { HiCheckBadge } from "react-icons/hi2";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { insertIntent } from "@/lib/fetch/insertIntent";
import { DeferredTokenIntentWithSignature } from "@tx-kit/sdk";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { Option } from "@/ui/OptionSelect/OptionSelect";
import { useMonitorChannelUpgrades } from "@/hooks/useMonitorChannelUpgrades";
import { asPositiveInt, BasicInput, MarkdownEditor, OptionOrCustom } from "./StudioTools";
import Toggle from "@/ui/DesignKit/Toggle";
import { Button } from "../DesignKit/Button";
import { useChannel } from "@/hooks/useChannel";
import { DetailSectionWrapper, LogicDisplay } from "../ChannelSidebar/ContestDetailsV2";
import { Label } from "../DesignKit/Label";
import { Modal } from "../Modal/Modal";

export const CreateToken = ({ contractId, spaceSystemName, allowIntents = true }: { contractId: ContractID, spaceSystemName: string, allowIntents?: boolean }) => {
    const [areIntentsEnabled, setAreIntentsEnabled] = useState(false);
    const { upgradePath, isLoading: isUpgradePathLoading, mutate } = useMonitorChannelUpgrades(contractId);
    const { channel } = useChannel(contractId);
    const { contractAddress, chainId } = splitContractID(contractId);
    const { connectors } = useConnect();

    const channelType = isInfiniteChannel(channel) ? "mintboard" : "contest";

    const {
        state,
        setField,
        validate,
        isIntent,
        setIsIntent,
        txError,
        txStatus,
        tx,
        txResponse,
        txHash
    } = useCreateTokenReducer(contractAddress)

    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const { data: session } = useSession()
    const { chain } = useAccount();
    const editorRef = useRef(null);

    useEffect(() => { console.log(txError) }, [txError])

    useTransmissionsErrorHandler(txError);

    useEffect(() => {

        // unless the channel is upgraded to a certain contract version, coinbase smart wallet signatures will not work
        // we should disable the intent flow in those cases

        const coinbaseWalletConnector = connectors.find(
            (connector) => connector.id === 'coinbaseWalletSDK'
        );

        const isIntentCompatible = coinbaseWalletConnector &&
            chainId === 84532 ? (upgradePath?.upgradeImpl === "0xF16aE8A8c0F4c578451EBC61c74d45A4b851bc7a") : (upgradePath?.baseImpl === "0x30bEE66d8D87F49D75751dDDAd72b007c379E946")

        setAreIntentsEnabled(!isIntentCompatible && allowIntents);

    }, [connectors, upgradePath])

    useEffect(() => {
        if (txStatus === "txInProgress") {
            setIsModalOpen(true);
        }

        if (txStatus == "complete") {
            handleTokenCreated();
            if (isIntent) setIsModalOpen(true);
        }
    }, [txStatus, setIsModalOpen, isIntent]);

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

    const handleSubmit = async () => {
        const markdown = editorRef.current?.getMarkdown();

        const { success, data } = await validate(markdown);

        if (!success) {
            return toast.error("Some of your fields are invalid")
        }
        tx(data);
    }


    const handleTokenCreated = async () => {

        if (!isIntent) return toast.success("Token Created!")

        try {
            await trigger({
                csrfToken: session.csrfToken,
                contractId: contractId,
                tokenIntent: txResponse as DeferredTokenIntentWithSignature
            }).then(response => {
                if (!response.success) {
                    toast.error('Something went wrong')
                    return resetSwr()
                }

                return toast.success('Token Configured!')

            })
        } catch (e) {
            console.log(e)
            resetSwr()
        }
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_30%] w-full m-auto justify-end gap-2">
            <div className="flex flex-col gap-8 w-full lg:ml-auto md:max-w-[800px] bg-base-100 rounded-lg p-4">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-t1">Create Post</h1>
                    </div>

                    <div className="flex flex-col max-w-xs gap-2">
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
                    <MarkdownEditor ref={editorRef} label={"Body (optional)"} error={state.errors?.description?._errors} markdown="" />
                    {channel && isInfiniteChannel(channel) && (
                        <div className="flex flex-col gap-2 w-full">
                            {!isMoreOpen && (<Button variant="ghost" className="self-start" onClick={() => { setIsMoreOpen(true) }}>+ More</Button>)}
                            {isMoreOpen && (
                                <OptionOrCustom
                                    value={state.maxSupply.toString()}
                                    label={"Token Supply"}
                                    options={[{ value: "1", label: "1" }, { value: "100", label: "100" }, { value: maxUint256.toString(), label: "unlimited" }]}
                                    onOptionSelect={(option: Option) => setField("maxSupply", option.value)}
                                    customLabel={"custom"}
                                    customChild={
                                        <BasicInput
                                            inputType="number"
                                            value={state.maxSupply} // default to 100 on switchover
                                            label={"Custom Supply"}
                                            placeholder={"100"}
                                            onChange={(e) => setField("maxSupply", asPositiveInt(e.target.value))}
                                            error={state.errors?.maxSupply?._errors} />
                                    } />
                            )}
                        </div>
                    )}
                </div>
            </div>


            <StudioSidebar channel={channel} areIntentsEnabled={areIntentsEnabled} isIntent={isIntent} setIsIntent={setIsIntent}>
                <OnchainButton
                    chainId={chainId}
                    title={"Post"}
                    onClick={handleSubmit}
                    isLoading={txStatus === 'pendingApproval' || txStatus === 'txInProgress' || isUploading}
                    loadingChild={
                        <Button disabled>
                            <div className="flex gap-2 items-center">
                                <p className="text-sm">{
                                    isUploading ? <span>Uploading</span> :
                                        txStatus === 'pendingApproval' ?
                                            <span>Awaiting Signature</span>
                                            :
                                            <span>Processing</span>
                                }
                                </p>
                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                            </div>
                        </Button>
                    }
                />
            </StudioSidebar>


            <Modal
                isModalOpen={isModalOpen}
                onClose={() => { }}
                className="w-full max-w-[500px]"
            >
                {txStatus === 'txInProgress' && (
                    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                        <p className="text-lg text-t1 font-semibold text-center">Etching your creation into the ether</p>
                        <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                )}

                {txStatus === 'complete' && (
                    <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                        <HiCheckBadge className="h-48 w-48 text-success" />
                        <h2 className="font-bold text-t1 text-xl">Successfully created your post.</h2>
                        <div className="flex gap-2 items-center">
                            {!isIntent && <Link
                                href={`${chain?.blockExplorers?.default?.url ?? ''}/tx/${txHash}`}
                                target="_blank"
                                rel="noopener norefferer"
                                passHref
                            >
                                <Button variant="ghost" className="w-auto">
                                    View Tx
                                </Button>
                            </Link>
                            }

                            <Link
                                href={`/${spaceSystemName}/${channelType}/${contractId}${isIntent ? '?intent=true' : ''}`}
                            >
                                <Button>
                                    Go to {channelType}
                                </Button>
                            </Link>
                        </div>
                    </div>

                )}

            </Modal>
        </div>
    )
}

const StudioSidebar = ({ channel, areIntentsEnabled, isIntent, setIsIntent, children }) => {
    // todo some submitter requirements / user status
    return (
        <div className="flex flex-col gap-2 p-4 bg-base-100 rounded-lg self-start md:max-w-[800px] min-w-[300px]">
            <SubmissionRequirements channel={channel} />
            {areIntentsEnabled &&
                <React.Fragment>
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <p><b>Sponsor post onchain</b></p>
                        <Toggle checked={!isIntent} onCheckedChange={(isChecked) => setIsIntent(!isChecked)} />

                    </div>
                    <div className="h-2 w-full" />
                    <div className="bg-base-200 p-2 rounded-lg">
                        <p className="text-t2 text-sm">
                            Leaving this toggle off will allow you to post for free.
                            <br />
                            <br />
                            Alternatively, you can sponsor the post for a small gas fee and collect an onchain sponsorship reward each time someone mints.
                        </p>
                    </div>
                    <div className="bg-base-100 h-0.5 w-full" />
                </React.Fragment>
            }

            {children}
        </div>
    )
}


const SubmissionRequirements = ({ channel }: { channel: Channel }) => {

    const contractId = concatContractID({ chainId: channel.chainId, contractAddress: channel.id })

    return (
        <div className="flex flex-col gap-2">
            <DetailSectionWrapper
                title="Entry Requirements"
                tooltipContent={<p className="font-normal">{`Users satisfying at least one requirement are elgible to submit.`}</p>}
            >
                <LogicDisplay logicObject={channel.creatorLogic} chainId={channel.chainId} creditContextLabel="entries" />
            </DetailSectionWrapper>
        </div>
    )
}

