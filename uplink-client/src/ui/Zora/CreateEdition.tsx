"use client";

import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useCreateZoraEdition, { ConfigurableZoraEditionOutput, flattenContractArgs, postDrop } from "@/hooks/useCreateZoraEdition";
import { useEffect, useRef, useState } from "react";
import type { Option } from "@/ui/MenuSelect/MenuSelect";
import { uint64MaxSafe } from "@/utils/uint64";
import DateTimeSelector from "@/ui/DateTime/DateTime";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { HiCheckBadge, HiSparkles } from "react-icons/hi2";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { useSession } from "@/providers/SessionProvider";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { ZoraAbi, getContractFromChainId } from "@/lib/abi/zoraEdition";
import { UsernameDisplay, UserAvatar } from "@/ui/AddressDisplay/AddressDisplay";
import { format } from "date-fns";
import { MdOutlineCancelPresentation } from "react-icons/md";
import useSWRMutation from "swr/mutation";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { AddFundsButton, RenderMintMedia, SwitchNetworkButton } from "./common";
import { Decimal } from "decimal.js";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import { getChainName } from "@/lib/chains/supportedChains";

// select from options or render custom child

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
        setIsCustom(e.target.checked);
    };

    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <div className="flex flex-col gap-2 p-2 rounded-xl ">
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
                className={`input w-full max-w-xs ${error ? "input-error" : "input"
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


const SectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold p-1">{title}</h2>
            <div className="flex flex-col gap-4 border-border border rounded-xl p-2 bg-base">{children}</div>
        </div>
    )
}


const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

const asPositiveFloat = (value: string, maxMantissaLen: number, maxWhole?: number,) => {
    const [whole, fractional] = value.split(".");
    if (!whole) return "";
    const wholeNum = Math.abs(Number(whole)).toString();
    if (maxWhole && Number(wholeNum) >= maxWhole) {
        if (Number(wholeNum) > maxWhole) toast.error(`Max is ${maxWhole}`)
        return maxWhole.toString()
    }
    const mantissa = fractional ? `.${fractional.slice(0, maxMantissaLen)}` : "";
    return `${wholeNum}${mantissa}`;
}


const CreateEdition = ({
    contestId,
    chainId,
    submissionId,
    name,
    imageURI,
    animationURI,
    routeOnSuccess,
    referrer,
}: {
    contestId: string,
    chainId: number,
    submissionId: string,
    name: string,
    imageURI: string,
    animationURI: string,
    routeOnSuccess: string,
    referrer?: string
}) => {
    const { contractArguments, state, setField, validate } = useCreateZoraEdition(referrer, { name, imageURI, animationURI });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-full min-w-[300px] sm:min-w-[1px] md:max-w-[400px]">
                <div className="flex flex-col bg-base-100 p-2 rounded-lg text-t2 gap-2">
                    <div className="flex gap-2 items-center">
                        <p className="text-xl font-bold text-t1">Create a drop</p>
                        <HiSparkles className="w-6 h-6 text-t1" />
                        <div className="ml-auto">
                            <ChainLabel chainId={chainId} px={18} />
                        </div>
                    </div>

                    <p className="text-t2 ">
                        {`Make your submission permanent and earn `}
                        <Link
                            href="https://support.zora.co/en/articles/8192123-understanding-protocol-rewards-on-zora"
                            rel="noopener noreferrer"
                            draggable={false}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                            prefetch={false}>
                            protocol rewards
                        </Link>
                        {` by customizing a Zora NFT drop on the ${getChainName(chainId)} network.`}
                    </p>
                </div>
                <SectionWrapper title="">
                    <RenderMintMedia imageURI={imageURI} animationURI={animationURI} />
                </SectionWrapper>

            </div>
            <div className="flex flex-col gap-2 w-full min-w-[300px]">
                <SectionWrapper title="Token Details">
                    <BasicInput inputType="text" value={state.name} label={"Name"} placeholder={"An amazing new creation"} onChange={(e) => setField("name", e.target.value)} error={state.errors?.name?._errors} />
                    <BasicInput inputType="text" value={state.symbol} label={"Symbol"} placeholder={"$NOUN"} onChange={(e) => setField("symbol", e.target.value)} error={state.errors?.symbol?._errors} />
                    <TextArea value={state.description} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
                </SectionWrapper>
                <SectionWrapper title="Mint Details">
                    <OptionOrCustom
                        value={state.editionSize}
                        label={"Edition Size"}
                        options={[{ value: "open", label: "open" }, { value: "one", label: "1/1" }]}
                        onOptionSelect={(option: Option) => setField("editionSize", option.value)}
                        customLabel={"Fixed"}
                        customChild={
                            <BasicInput
                                inputType="number"
                                value={state.editionSize} // default to 100 on switchover
                                label={"Fixed Supply"}
                                placeholder={"100"}
                                onChange={(e) => setField("editionSize", asPositiveInt(e.target.value))}
                                error={state.errors?.editionSize?._errors} />
                        } />

                    <OptionOrCustom
                        value={state.royaltyBPS}
                        label={"Royalty"}
                        options={[{ value: "zero", label: "0%" }, { value: "five", label: "5%" }]}
                        onOptionSelect={(option: Option) => setField("royaltyBPS", option.value)}
                        customLabel={"Custom"}
                        customChild={
                            <BasicInput
                                inputType="number"
                                value={state.royaltyBPS}
                                label={"Royalty"}
                                placeholder={"5%"}
                                onChange={(e) => setField("royaltyBPS", asPositiveFloat(e.target.value, 2, 50))}
                                error={state.errors?.royaltyBPS?._errors} />
                        } />

                    <OptionOrCustom
                        value={state.saleConfig.publicSalePrice}
                        label={"Mint Price"}
                        options={[{ value: "free", label: "Free" }]}
                        onOptionSelect={(option: Option) => setField("saleConfig.publicSalePrice", option.value)}
                        customLabel={"Custom"}
                        customChild={
                            <BasicInput
                                inputType="number"
                                value={state.saleConfig.publicSalePrice}
                                label={"Mint Price"}
                                placeholder={"0.01"}
                                onChange={(e) => setField("saleConfig.publicSalePrice", asPositiveFloat(e.target.value, 5))}
                                error={state.errors?.saleConfig?.publicSalePrice?._errors} />
                        } />
                </SectionWrapper>
                <SectionWrapper title="Mint Timing">
                    <OptionOrCustom
                        value={state.saleConfig.publicSaleStart}
                        label={"Mint Start"}
                        options={[{ value: "now", label: "Now" }]}
                        onOptionSelect={(option: Option) => setField("saleConfig.publicSaleStart", option.value)}
                        customLabel={"Later"}
                        customChild={
                            <DateTimeSelector
                                isoString={state.saleConfig.publicSaleStart || "now"}
                                label={"Start"}
                                callback={(value) => setField("saleConfig.publicSaleStart", value)}
                                error={state.errors?.saleConfig?.publicSaleStart?._errors} />
                        } />

                    <OptionOrCustom
                        value={state.saleConfig.publicSaleEnd}
                        label={"Mint Duration"}
                        options={[{ value: "forever", label: "Forever" }, { value: "week", label: "1 week" }]}
                        onOptionSelect={(option: Option) => setField("saleConfig.publicSaleEnd", option.value)}
                        customLabel={"Custom"}
                        customChild={
                            <div>
                                <DateTimeSelector
                                    isoString={state.saleConfig.publicSaleEnd.length < 8 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() : state.saleConfig.publicSaleEnd}
                                    label={"End"}
                                    callback={(value) => setField("saleConfig.publicSaleEnd", value)}
                                    error={state.errors?.saleConfig?.publicSaleEnd?._errors} />
                                {state.errors?.saleConfig?._errors && (
                                    <label className="label">
                                        <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{state.errors?.saleConfig?._errors.join(",")}</span>
                                    </label>
                                )}
                            </div>
                        } />
                </SectionWrapper>
                <span className="p-2" />
                <CreateEditionButton chainId={chainId} validate={validate} contractArguments={contractArguments} contestId={contestId} submissionId={submissionId} routeOnSuccess={routeOnSuccess} />
            </div>
        </div>
    )

}


const CreateEditionButton = ({
    chainId,
    validate,
    contractArguments,
    contestId,
    submissionId,
    routeOnSuccess,
}: {
    chainId: number,
    validate: any,
    contractArguments: ConfigurableZoraEditionOutput,
    contestId: string,
    submissionId: string,
    routeOnSuccess: string
}) => {
    const { data: session, status } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { creator_contract, explorer, bridge } = getContractFromChainId(chainId);

    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        //chainId: chainId,
        address: creator_contract,
        abi: ZoraAbi,
        functionName: 'createEditionWithReferral',
        args: flattenContractArgs(contractArguments),
        enabled: true,
    });

    const { trigger, data: postContestData, error, isMutating, reset } = useSWRMutation(
        `/api/createDrop/${nanoid()}}`,
        postDrop,
        {
            onError: (err) => {
                console.log(err);
                reset();
            },
        }
    );

    const isInsufficientFundsError = isPrepareError ? prepareError.message.includes("insufficient funds for gas * price + value") : false;

    const {
        data,
        write,
        isLoading: isWriteLoading,
        error: writeError,
        isError: isWriteError
    } = useContractWrite({
        ...config,
        onError(err) {
            if (err.message.includes("User rejected the request")) {
                toast.error("Signature request rejected")
            }
        }
    });


    const { isLoading: isTxPending, isSuccess: isTxSuccessful } = useWaitForTransaction({
        hash: data?.hash,
        onSettled: (data, err) => {
            if (err) {
                console.log(err)
                setIsModalOpen(false);
                return toast.error('Error creating edition')
            }
            if (data) {
                const editionAddress = data.logs[0].address;
                try {
                    trigger({
                        submissionId,
                        contestId,
                        chainId,
                        contractAddress: editionAddress,
                        dropConfig: contractArguments,
                        csrfToken: session.csrfToken,
                    }).then((response) => {
                        if (!response.success) {
                            reset();
                        }
                        return toast.success('Drop created!')
                    });
                } catch (e) {
                    console.log(e)
                    reset();
                }

            }
        }
    });


    const handleSubmit = async () => {
        const result = await validate(session?.user?.address);
        if (!result.success) {
            console.log(result)
            return toast.error("Some of your fields are invalid")
        } else {
            setIsModalOpen(true);
        }
    }

    return (
        <>
            <WalletConnectButton>
                {status === "authenticated" && (
                    <SwitchNetworkButton chainId={chainId}>
                        <button className="btn btn-primary normal-case w-auto" disabled={isModalOpen} onClick={handleSubmit}> {isModalOpen ? "Creating" : "Create"} </button>
                    </SwitchNetworkButton>
                )}
            </WalletConnectButton>
            <EditionModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} disableClickOutside={isTxPending || isWriteLoading || isTxSuccessful}>
                {!isTxPending && !isTxSuccessful && (

                    <div className="flex flex-col gap-2 relative">
                        <div className="flex">
                            <h2 className="text-t1 text-xl font-bold">Create Drop</h2>
                            <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
                        </div>
                        <div className="p-2" />
                        {contractArguments && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black ">
                                <div className="items-center justify-center">
                                    <RenderMintMedia imageURI={contractArguments.imageURI || ""} animationURI={contractArguments.animationURI || ""} />
                                </div>
                                <div className="bg-black-200 items-start flex flex-col gap-8 relative">
                                    <div className="flex flex-col gap-2">
                                        <p className="line-clamp-3 font-bold text-lg break-all">{contractArguments.name}</p>
                                        <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1 w-fit">
                                            <UserAvatar user={session?.user} size={28} />
                                            <UsernameDisplay user={session?.user} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="grid grid-cols-3 gap-4 w-full">
                                            <div className="flex flex-col">
                                                <p className="text-t2">Mint Begins</p>
                                                <p className="font-bold text-t1">{format(new Date(parseInt(contractArguments.saleConfig.publicSaleStart) * 1000), "MMM d, h:mm aa")}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Until</p>
                                                <p className="font-bold text-t1">{contractArguments.saleConfig.publicSaleEnd === uint64MaxSafe.toString() ? "Forever" : format(new Date(parseInt(contractArguments.saleConfig.publicSaleEnd) * 1000), "MMM d, h:mm aa")}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Price</p>
                                                <p className="font-bold text-t1">{contractArguments.saleConfig.publicSalePrice === "0" ? "Free" : `${new Decimal(contractArguments.saleConfig.publicSalePrice).div(Decimal.pow(10, 18)).toString()} ETH`}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Editions</p>
                                                <p className="font-bold text-t1">{contractArguments.editionSize === "1" ? "1/1" : contractArguments.editionSize === uint64MaxSafe.toString() ? "Open" : contractArguments.editionSize}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row w-full items-end justify-end">
                            {status === "authenticated" && (
                                isInsufficientFundsError
                                    ?
                                    (<AddFundsButton chainId={chainId} />)
                                    :
                                    (
                                        <SwitchNetworkButton chainId={chainId}>

                                            <button className="btn btn-primary normal-case" disabled={!write || isWriteLoading} onClick={() => write?.()}>
                                                {isWriteLoading ?
                                                    <div className="flex gap-2 items-center">
                                                        <p className="text-sm">Awaiting signature</p>
                                                        <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                    </div>
                                                    : "Create"
                                                }</button>
                                        </SwitchNetworkButton>
                                    ))}

                        </div>
                    </div>
                )}
                {isTxPending && (
                    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                        <p className="text-lg text-t1 font-semibold text-center">Etching your creation into the ether</p>
                        <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                )}
                {isTxSuccessful && (
                    <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                        <HiCheckBadge className="h-48 w-48 text-success" />
                        <h2 className="font-bold text-t1 text-xl">Successfully created your drop.</h2>
                        <div className="flex gap-2 items-center">
                            <a className="btn btn-ghost normal-case text-t2" href={`${explorer}/tx/${data?.hash}`} target="_blank" rel="noopener norefferer">View Tx</a>
                            <Link className="btn normal-case btn-primary" href={routeOnSuccess}>Go to contest</Link>
                        </div>
                    </div>
                )}
            </EditionModal >
        </>
    )
}


const EditionModal = ({
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

export default CreateEdition;