"use client";
import MenuSelect, { Option } from "@/ui/MenuSelect/MenuSelect";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { SettingsStateType } from "@/hooks/useMintboardSettings";
import { ChainLabel } from "../ContestLabels/ContestLabels";
import { zeroAddress } from "viem";
import { getChainName, supportedChains } from "@/lib/chains/supportedChains";
import TokenModal from "../TokenModal/TokenModal";
import { useErc20TokenInfo } from "@/hooks/useErc20TokenInfo";

const Options = ({ label, options, selected, onSelect }: { label: string, options: Option[], selected: string, onSelect: (option: Option) => void }) => {
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
                            checked={option.value === selected}
                            onChange={(e) => onSelect(option)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )

}

const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild, onCustomSelect }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode, onCustomSelect: () => void }) => {

    const [isCustom, setIsCustom] = useState(value !== "0");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOption = options.find((option) => option.label === e.target.dataset.title);
        if (selectedOption) {
            onOptionSelect(selectedOption);
            setIsCustom(false);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCustom(e.target.checked);
        onCustomSelect();
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

const BasicInput = ({ value, label, placeholder, onChange, error, inputType, styleOverrides = {} }) => {
    return (
        <div className="w-full">
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
                className={`input input-bordered w-full ${styleOverrides} ${error ? "input-error" : "input"
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


const FeeRow = ({ value, label, placeholder, onChange, error }) => {
    return (
        <div className="flex flex-row items-center justify-between">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type="number"
                min="0"
                max="100"
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}

                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input bg-transparent text-center rounded-lg w-full max-w-[10rem] ${error ? "input-error" : "input"
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
                />
            </div>
        </div>
    )
}


const FeesTable = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col bg-base rounded-md p-2">
            {children}
        </div>
    )
}

const ERC20MintPriceInput = ({ state, setField }) => {
    const { symbol, decimals } = useErc20TokenInfo(state.erc20Contract, state.chainId)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onConfigureTokenCallback = (token) => {
        if (token) {
            setField("erc20Contract", token.address)
            setField("erc20MintPrice", "")
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label className="label">
                <span className="label-text">{`Mint Price (${symbol})`}</span>
            </label>
            {state.erc20Contract === zeroAddress ?
                <button onClick={() => setIsModalOpen(true)} className="btn btn-ghost btn-active normal-case w-fit">Enable</button>
                : (
                    <>
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            <input
                                type="text"
                                autoComplete="off"
                                onWheel={(e) => e.currentTarget.blur()}
                                spellCheck="false"
                                value={state.erc20MintPrice}
                                onChange={(e) => { setField("erc20MintPrice", e.target.value) }}
                                placeholder={"100"}
                                className={`input input-bordered rounded-lg w-full max-w-xs ${state.errors?.erc20MintPrice?._errors ? "input-error" : "input"
                                    }`}
                            />
                            <div className="grid grid-cols-2 gap-1 w-full">
                                <button onClick={() => setIsModalOpen(true)} className="btn btn-ghost btn-active normal-case w-full">{"Swap Token"}</button>
                                <button
                                    onClick={() => { setField("erc20Contract", zeroAddress); setField("erc20MintPrice", "0") }}
                                    className="btn btn-ghost btn-active normal-case w-full">
                                    Disable
                                </button>
                            </div>
                        </div>
                        {state.errors?.erc20MintPrice?._errors && (
                            <label className="label">
                                <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{state.errors?.erc20MintPrice?._errors.join(",")}</span>
                            </label>
                        )}
                    </>
                )
            }
            <TokenModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                saveCallback={onConfigureTokenCallback}
                chainId={state.chainId}
                existingTokens={[]}
                quickAddTokens={[]}
                continuous={false}
                uniqueStandard={false}
                strictTypes={["ERC20"]}

            //strictTypes
            />
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

const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

const asPositiveFloat = (value: string, maxMantissaLen: number, maxWhole?: number) => {
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

    const chainOptions = supportedChains.map((chain) => ({ value: chain.id.toString(), label: chain.name }));

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                <h1 className="text-2xl font-bold text-t1">Mintboard</h1>
            </div>
            <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                <ChainSelector
                    value={state.chainId.toString()}
                    label={"Network"}
                    options={chainOptions}
                    onSelect={(option: Option) => setField("chainId", parseInt(option.value))}
                    staticChainId={state.chainId}
                />
            </div>
            <div className="flex flex-col gap-4">
                {/*<-- metadata -->*/}
                <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                    <h1 className="text-xl font-bold text-t1">Details</h1>
                    <BasicInput inputType="text" label="Title" value={state.title} placeholder={"Based Management Interns"} onChange={(e) => setField("title", e.target.value)} error={state.errors?.title?._errors} />
                    <TextArea value={state.description} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
                </div>

                <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                    <h1 className="text-xl font-bold text-t1">Sale Configuration</h1>
                    <OptionOrCustom
                        value={state.ethMintPrice}
                        label={"Mint Price"}
                        options={[{ value: "0", label: "Free" }]}
                        onOptionSelect={(option: Option) => {
                            if (option.label === "Free") {
                                setField("feeContract", zeroAddress)
                                setField("ethMintPrice", option.value)
                            }
                        }}
                        onCustomSelect={() => {
                            setField("feeContract", "CUSTOM_FEES_ADDRESS")
                            setField("ethMintPrice", "")
                            setField("channelTreasury", "")
                        }}
                        customLabel={"Custom"}
                        customChild={
                            <>
                                <FeesTable>

                                    <BasicInput label="Space Treasury" styleOverrides={'max-w-xl'} inputType="text" value={state.channelTreasury} placeholder={"0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"} onChange={(e) => setField("channelTreasury", e.target.value)} error={state.errors?.channelTreasury?._errors} />
                                    <BasicInput label="Mint Price (ETH)" inputType="number" styleOverrides={'max-w-xs ml-auto'} value={state.ethMintPrice} placeholder={"0.01"} onChange={(e) => setField("ethMintPrice", asPositiveFloat(e.target.value, 8))} error={state.errors?.ethMintPrice?._errors} />
                                    <ERC20MintPriceInput state={state} setField={setField} />

                                    <div className="w-full h-3" />
                                    <div className="w-full bg-gray-700 h-0.5" />
                                    <div className="w-full h-2" />
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
                                    <label className="label">
                                        <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{state.errors?.feePercentages?._errors.join(",")}</span>
                                    </label>
                                )}
                            </>
                        } />

                    <Options label={"Mint Duration"} options={[{ value: "3 days", label: "3 days" }, { value: "week", label: "1 week" }, { value: "forever", label: "Forever" }]} selected={state.saleDuration} onSelect={(option: Option) => setField("saleDuration", option.value)} />
                </div>
            </div>
            {children}
        </div>
    )
}
