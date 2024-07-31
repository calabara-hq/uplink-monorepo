"use client";
import { useCreateTokenReducer } from "@/hooks/useCreateTokenReducer"
import { Boundary } from "@/ui/Boundary/Boundary";
import { MediaUpload } from "@/ui/MediaUpload/MediaUpload";
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { useEffect, useRef, useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { Address, maxUint256 } from "viem"
import toast from "react-hot-toast";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { Channel, ChannelUpgradePath, ContractID, splitContractID } from "@/types/channel";
import { useSession } from "@/providers/SessionProvider";
import { useAccount, useConnect } from "wagmi";
import { handleV2MutationError } from "@/lib/fetch/handleV2MutationError";
import { HiCheckBadge } from "react-icons/hi2";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { insertIntent } from "@/lib/fetch/insertIntent";
import { DeferredTokenIntentWithSignature } from "@tx-kit/sdk";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { nanoid } from "nanoid";
import { Option } from "@/ui/MenuSelect/MenuSelect";
import { useMonitorChannelUpgrades } from "@/hooks/useMonitorChannelUpgrades";


/// media plugin inputs:

// title
// description
// max supply
// media

const TextArea = ({
    value,
    label,
    placeholder,
    onChange,
    error
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea({ textAreaRef, value });
    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <div className="flex flex-col">
                <textarea
                    ref={textAreaRef}
                    placeholder="My new masterpiece"
                    value={value}
                    rows={3}
                    onChange={onChange}
                    className={`rounded-lg p-2.5 w-full outline-none resize-none leading-normal bg-transparent border ${error ? "border-error" : "border-border"}`}
                />
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{error.join(",")}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

const BasicInput = ({ value, label, placeholder, onChange, error, inputType }) => {
    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type={inputType}
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}
                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input input-bordered w-full max-w-xs ${error ? "input-error" : "input"
                    }`}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{error.join(",")}</span>
                </label>
            )}
        </div>
    )
}

const Toggle = ({
    defaultState,
    onSelectCallback,
}: {
    defaultState: boolean;
    onSelectCallback: (isSelected: boolean) => void;
}) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectCallback(e.target.checked);
    };
    return (
        <input
            type="checkbox"
            className="toggle toggle-success border-2"
            defaultChecked={defaultState}
            onChange={handleToggle}
        />
    );
};

const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode }) => {
    const [isCustom, setIsCustom] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOption = options.find((option) => option.label === e.target.dataset.title);
        if (selectedOption) {
            onOptionSelect(selectedOption);
            setIsCustom(false);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onOptionSelect({ value: "100", label: "custom" });
        setIsCustom(e.target.checked);

    };

    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <div className="flex flex-col gap-2 p-2 rounded-xl w-full">
                <div className="btn-group">
                    {options.map((option, idx) => (
                        <input
                            key={idx}
                            type="radio"
                            name={`option-${nanoid()}`}
                            className="btn normal-case bg-base"
                            data-title={option.label}
                            checked={option.value === value && !isCustom}
                            onChange={handleChange}

                        />
                    ))}
                    <input
                        type="radio"
                        name={`custom-${nanoid()}`}
                        className="btn normal-case bg-base"
                        data-title={customLabel}
                        checked={isCustom}
                        onChange={handleCustomChange}
                    />
                </div>
                {isCustom && customChild}
            </div>
        </div>
    );
}

const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

export const CreateToken = ({ contractId, spaceDisplayName, spaceSystemName }: { contractId: ContractID, spaceDisplayName: string, spaceSystemName: string }) => {

    const [areIntentsEnabled, setAreIntentsEnabled] = useState(false);
    const { upgradePath, isLoading: isUpgradePathLoading, mutate } = useMonitorChannelUpgrades(contractId);

    const { contractAddress, chainId } = splitContractID(contractId);
    const { connectors } = useConnect();

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
    useTransmissionsErrorHandler(txError);


    useEffect(() => {

        // unless the channel is upgraded to a certain contract version, coinbase smart wallet signatures will not work
        // we should disable the intent flow in those cases

        const coinbaseWalletConnector = connectors.find(
            (connector) => connector.id === 'coinbaseWalletSDK'
        );

        const areIntentsDisabled = coinbaseWalletConnector &&
            chainId === 84532 ? (upgradePath?.upgradeImpl === "0xF16aE8A8c0F4c578451EBC61c74d45A4b851bc7a") : (upgradePath?.baseImpl === "0x30bEE66d8D87F49D75751dDDAd72b007c379E946")

        setAreIntentsEnabled(!areIntentsDisabled)

    }, [connectors, upgradePath])



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
        if (txStatus === "txInProgress") {
            setIsModalOpen(true);
        }

        if (txStatus == "complete") {
            handleTokenCreated();
            if (isIntent) setIsModalOpen(true);
        }
    }, [txStatus, setIsModalOpen, isIntent]);


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
        const { success, data } = await validate();
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
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] md:w-10/12 m-auto">
            <div className="flex flex-col gap-6 w-full m-auto mt-4 p-4 md:max-w-[600px]">
                <Boundary>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-t1">Create Post</h1>
                        {/* <div className="bg-base-100 p-4 rounded-lg">
                            <p className="text-t1">Post to the {spaceDisplayName} mint board and earn 0.000333 ETH for every mint!</p>
                        </div> */}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <MediaUpload
                                acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'video/mp4']}
                                uploadStatusCallback={uploadStatusCallback}
                                ipfsImageCallback={ipfsImageCallback}
                                ipfsAnimationCallback={ipfsAnimationCallback}
                                mimeTypeCallback={mimeTypeCallback}
                                maxVideoDuration={210}
                            />
                            {state.errors?.imageURI?._errors && (
                                <label className="label">
                                    <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{state.errors.imageURI._errors.join(",")}</span>
                                </label>
                            )}
                        </div>
                        <BasicInput inputType="text" label="Title" value={state.title} placeholder={"Based Management Interns"} onChange={(e) => setField("title", e.target.value)} error={state.errors?.title?._errors} />
                    </div>


                    <div className="p-4" />
                    <div className="flex flex-col gap-2 w-full">
                        {!isMoreOpen && (<button className="self-start" onClick={() => { setIsMoreOpen(true) }}>+ More</button>)}
                        {isMoreOpen && (
                            <>
                                <TextArea value={state.description} label={"Description (optional)"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
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
                            </>
                        )}
                    </div>

                </Boundary >

            </div>


            <div className="flex flex-col gap-2 md:mt-8 p-4">
                {areIntentsEnabled &&
                    <>
                        <div className="flex flex-row gap-2 items-start justify-between">
                            <p>Sponsor post onchain</p>
                            <Toggle defaultState={false} onSelectCallback={(isSelected) => { setIsIntent(!isSelected) }} />
                        </div>
                        <div className="h-2 w-full" />
                        <Boundary size={"small"}>
                            <p className="text-t2">
                                Leaving this toggle off will allow you to post for free.
                                <br />
                                <br />
                                Alternatively, you can sponsor the post for a small gas fee and collect an onchain sponsorship reward each time someone mints.
                            </p>
                        </Boundary>
                        <div className="bg-base-100 h-0.5 w-full" />
                    </>
                }

                <OnchainButton
                    chainId={chainId}
                    title={"Post"}
                    onClick={handleSubmit}
                    isLoading={txStatus === 'pendingApproval' || txStatus === 'txInProgress' || isUploading}
                    loadingChild={
                        <button className="btn btn-disabled normal-case w-auto">
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
                        </button>
                    }
                />
            </div>


            <CreatePostModal
                isModalOpen={isModalOpen}
                onClose={() => { }}
                disableClickOutside={true}
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
                            {!isIntent && <a className="btn btn-ghost normal-case text-t2" href={`${chain?.blockExplorers?.default?.url ?? ''}/tx/${txHash}`} target="_blank" rel="noopener norefferer">View Tx</a>}
                            <Link className="btn normal-case btn-primary" href={`/${spaceSystemName}/mintboard/${contractId}${isIntent ? '?intent=true' : ''}`}>Go to MintBoard</Link>
                        </div>
                    </div>

                )}

            </CreatePostModal>
        </div>
    )
}

const CreatePostModal = ({
    isModalOpen,
    children,
    onClose,
    disableClickOutside,
}: {
    isModalOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    disableClickOutside?: boolean;
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                disableClickOutside ? null : onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, disableClickOutside]);

    if (isModalOpen) {
        return (
            <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
                <div
                    ref={modalRef}
                    className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-4xl"
                >
                    {children}
                </div>
            </div>
        );
    }
    return null;
};
