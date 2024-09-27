"use client";;
import MenuSelect, { Option } from "@/ui/OptionSelect/OptionSelect";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { SettingsStateType } from "@/hooks/useMintboardSettings";
import { ChainLabel } from "../ContestLabels/ContestLabels";
import { zeroAddress } from "viem";
import { getChainName, supportedChains } from "@/lib/chains/supportedChains";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { Label } from "../DesignKit/Label";
import { Input } from "../DesignKit/Input";
import { Button } from "../DesignKit/Button";
import { Dialog, DialogContent, DialogFooter } from "../DesignKit/Dialog";
import { AddToken } from "../ManageTokenModal/ManageTokenModal";
import { useManagedTokenEditor } from "@/hooks/useTokenManager";
import { ChainSelect } from "../ChannelSettings/ChainSelect";
import { DevModeOnly } from "@/utils/DevModeOnly";

export const Options = ({ label, options, selected, onSelect }: { label: string, options: Option[], selected: string, onSelect: (option: Option) => void }) => {
    return (
        <div>
            <Label>
                <p>{label}</p>
            </Label>
            <div className="flex flex-col gap-2 p-2 rounded-xl ">
                <div className="flex flex-row gap-2">
                    {options.map((option, idx) => (
                        <Button
                            key={idx}
                            variant={option.value === selected ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onSelect(option)}
                        >{option.label}</Button>
                    ))}
                </div>
            </div>
        </div>
    )

}

export const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode }) => {
    const [isCustom, setIsCustom] = useState(value ? value !== "0" : false);

    const handleChange = (value: string) => {
        const selectedOption = options.find((option) => option.value === value);
        if (selectedOption) {
            onOptionSelect(selectedOption);
            setIsCustom(false);
        }
    };

    const handleCustomChange = () => {
        onOptionSelect({ value: "100", label: "custom" });
        setIsCustom(true);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="flex flex-row gap-2">
                {options.map((option, idx) => (
                    <div className="flex items-center space-x-2" key={idx}>
                        <Button
                            variant={option.value === value && !isCustom ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Button
                        variant={isCustom ? "secondary" : "ghost"}
                        size="sm"
                        onClick={handleCustomChange}
                    >
                        {customLabel}
                    </Button>
                </div>
            </div>
            {isCustom && customChild}
        </div>
    )

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
            <Label>
                {label}
            </Label>
            <div className="flex flex-col">
                <textarea
                    ref={textAreaRef}
                    placeholder="My new masterpiece"
                    value={value}
                    rows={3}
                    onChange={onChange}
                    className={`rounded-lg p-2.5 w-full bg-base-100 outline-none resize-none leading-normal border ${error ? "border-error" : "border-border"}`}
                />
                {error && (
                    <Label>
                        <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                    </Label>
                )}
            </div>
        </div>
    );
};

export const BasicInput = ({
    value,
    label,
    placeholder,
    onChange,
    error,
    inputType,
    styleOverrides
}: {
    value: string,
    label: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error: string[],
    inputType: string,
    styleOverrides?: string
}) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <Label>
                {label}
            </Label>
            <Input
                variant={error ? "error" : "outline"}
                type={inputType}
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}
                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styleOverrides}
            />
            {error && (
                <Label>
                    <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                </Label>
            )}
        </div>
    )
}


export const FeeRow = ({ value, label, placeholder, onChange, error }) => {
    return (
        <div className="flex flex-row items-center justify-between">
            <Label>
                {label}
            </Label>
            <Input
                variant={error ? "error" : "outline"}
                type="number"
                min="0"
                max="100"
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}

                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="max-w-[10rem] text-center"
            />
            {error && (
                <Label>
                    <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                </Label>
            )}
        </div>
    )
}

/*
    Todo, fix this for dev / staging mode
*/

const ChainSelector = ({
    value,
    label,
    options,
    onSelect,
    staticChainId
}: {
    value: string,
    label: string,
    options: Option[],
    onSelect: (option: Option) => void,
    staticChainId: number | null
}) => {

    // if staticChainId is provided, we don't allow changing the chain

    if (staticChainId) return (
        <div className="flex flex-row gap-2 items-center">
            <h1 className="text-xl font-bold text-t1">Network</h1>
            <div className="flex gap-2 items-center ml-auto">
                <p className="text-t1 font-bold">{getChainName(staticChainId)}</p>
                <ChainLabel chainId={staticChainId} px={24} />
            </div>
        </div>
    )

    // otherwise render the dropdown list

    return (
        <div className="flex flex-row gap-2 items-center">
            <h1 className="text-xl font-bold text-t1">Network</h1>
            <div className="flex gap-0.5 items-center ml-auto">
                <MenuSelect
                    selected={options.find((option) => option.value === value)}
                    options={options}
                    setSelected={onSelect}
                    menuLabel="Select Network"
                />
            </div>
        </div>
    )
}


export const FeesTable = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col bg-base-100 rounded-md p-2 gap-4">
            {children}
        </div>
    )
}

export const ERC20MintPriceInput = ({ state, setField }) => {
    const { symbol, decimals } = useTokenInfo(state.erc20Contract, state.chainId)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { managedToken, setManagedToken, validateManagedToken } = useManagedTokenEditor({ chainId: state.chainId });

    const handleModalConfirm = () => {
        try {
            const result = validateManagedToken();
            setField("erc20Contract", result.data.address)
            setField("erc20MintPrice", "")
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="flex flex-col w-full gap-2">
            <Label>
                {`Mint Price (${symbol})`}
            </Label>
            {state.erc20Contract === zeroAddress ?
                <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="w-fit">Enable</Button>
                : (
                    <>
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            <Input
                                type="number"
                                variant={state.errors?.erc20MintPrice?._errors ? "error" : "outline"}
                                autoComplete="off"
                                onWheel={(e) => e.currentTarget.blur()}
                                spellCheck="false"
                                value={state.erc20MintPrice}
                                onChange={(e) => { setField("erc20MintPrice", asPositiveFloat(e.target.value, 8)) }}
                                placeholder={"100"}
                                className="max-w-[10rem] text-center"
                            />
                            <div className="grid grid-cols-2 gap-1 w-full">
                                <Button variant="outline" onClick={() => setIsModalOpen(true)}>Swap Token</Button>
                                <Button variant="destructive" onClick={() => { setField("erc20Contract", zeroAddress); setField("erc20MintPrice", "0") }}>
                                    Disable
                                </Button>
                            </div>
                        </div>
                        {state.errors?.erc20MintPrice?._errors && (
                            <Label>
                                <p className="text-error max-w-sm break-words">{state.errors?.erc20MintPrice?._errors.join(",")}</p>
                            </Label>
                        )}
                    </>
                )
            }

            <Dialog open={isModalOpen} onOpenChange={val => setIsModalOpen(val)}>
                <DialogContent>
                    <AddToken
                        state={managedToken}
                        setManagedToken={setManagedToken}
                    />
                    <DialogFooter>
                        <div className="flex w-full justify-between">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button disabled={!managedToken.address} onClick={handleModalConfirm}>Confirm</Button>
                        </div>
                    </DialogFooter >
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const asPositiveFloat = (value: string, maxMantissaLen: number, maxWhole?: number) => {
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

export const MintboardSettings = ({
    state,
    setField,
    children,
    isNew = false
}: {
    state: SettingsStateType,
    setField: (field: string, value: string | boolean | number) => void,
    children: React.ReactNode,
    isNew?: boolean
}) => {

    return (
        <div className="flex flex-col gap-4 w-full">
            <DevModeOnly>
                <div className="flex flex-col gap-2 bg-base-200 w-full p-6 rounded-lg border border-border">
                    <h1 className="text-xl font-bold text-t1">Network</h1>
                    <ChainSelect chainId={state.chainId} setChainId={(val) => setField("chainId", val)} />
                </div>
            </DevModeOnly>
            <div className="flex flex-col gap-2 bg-base-200 w-full p-6 rounded-lg border border-border">
                <h1 className="text-xl font-bold text-t1">Network</h1>
                <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">{getChainName(state.chainId)}</p>
                    <ChainLabel chainId={state.chainId} px={20} />
                </div>
            </div>
            {/*<-- metadata -->*/}
            <div className="flex flex-col gap-2 bg-base-200 w-full p-6 rounded-lg border border-border">
                <h1 className="text-xl font-bold text-t1">Details</h1>
                <BasicInput inputType="text" label="Title" value={state.title} placeholder={"Based Management Interns"} onChange={(e) => setField("title", e.target.value)} error={state.errors?.title?._errors} />
                <TextArea value={state.description} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
            </div>

            <div className="flex flex-col gap-6 bg-base-200 w-full p-6 rounded-lg border border-border">
                <h1 className="text-xl font-bold text-t1">Sale Configuration</h1>
                <OptionOrCustom
                    value={state.ethMintPrice}
                    label={"Mint Price"}
                    options={[{ value: "0", label: "Free" }]}
                    onOptionSelect={(option: Option) => {
                        if (option.label === "Free") {
                            setField("feeContract", zeroAddress)
                            setField("ethMintPrice", option.value)
                        } else {

                        }
                    }}
                    customLabel={"Custom"}
                    customChild={
                        <>
                            <FeesTable>

                                <BasicInput label="Space Treasury" styleOverrides={'max-w-sm'} inputType="text" value={state.channelTreasury} placeholder={"0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"} onChange={(e) => setField("channelTreasury", e.target.value)} error={state.errors?.channelTreasury?._errors} />
                                <BasicInput label="Mint Price (ETH)" inputType="number" styleOverrides={'max-w-[10rem] text-center'} value={state.ethMintPrice} placeholder={"0.01"} onChange={(e) => setField("ethMintPrice", asPositiveFloat(e.target.value, 8))} error={state.errors?.ethMintPrice?._errors} />
                                <ERC20MintPriceInput state={state} setField={setField} />

                                <div className="w-full bg-base-200 h-0.5" />

                                <FeeRow
                                    value={state.creatorPercentage}
                                    label={"Creator Percentage"}
                                    placeholder={"60%"}
                                    onChange={(e) => setField("creatorPercentage", asPositiveFloat(e.target.value, 2))}
                                    error={state.errors?.creatorPercentage?._errors} />
                                <FeeRow
                                    value={state.channelPercentage}
                                    label={"Space Treasury Percentage"}
                                    placeholder={"10%"}
                                    onChange={(e) => setField("channelPercentage", asPositiveFloat(e.target.value, 2))}
                                    error={state.errors?.channelPercentage?._errors} />
                                <FeeRow
                                    value={state.mintReferralPercentage}
                                    label={"Mint Referral Percentage"}
                                    placeholder={"10%"}
                                    onChange={(e) => setField("mintReferralPercentage", asPositiveFloat(e.target.value, 2))}
                                    error={state.errors?.mintReferralPercentage?._errors} />
                                <FeeRow
                                    value={state.sponsorPercentage}
                                    label={"Sponsor Percentage"}
                                    placeholder={"10%"}
                                    onChange={(e) => setField("sponsorPercentage", asPositiveFloat(e.target.value, 2))}
                                    error={state.errors?.sponsorPercentage?._errors} />
                                <FeeRow
                                    value={state.uplinkPercentage}
                                    label={"Protocol Percentage"}
                                    placeholder={"10%"}
                                    onChange={(e) => setField("uplinkPercentage", asPositiveFloat(e.target.value, 2))}
                                    error={state.errors?.uplinkPercentage?._errors} />
                            </FeesTable>
                            {state.errors?.feePercentages?._errors && (
                                <Label>
                                    <p className="text-error max-w-sm break-words">{state.errors?.feePercentages?._errors.join(",")}</p>
                                </Label>
                            )}
                        </>
                    } />

                <Options label={"Mint Duration"} options={[{ value: "3 days", label: "3 days" }, { value: "week", label: "1 week" }, { value: "forever", label: "Forever" }]} selected={state.saleDuration} onSelect={(option: Option) => setField("saleDuration", option.value)} />
            </div>

            {children}
        </div>
    )
}
