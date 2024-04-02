"use client";
import { mutateMintBoard, mutateSpaces } from "@/app/mutate";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useCreateMintBoardTemplate, { MintBoardTemplate, configureMintBoard } from "@/hooks/useCreateMintBoardTemplate";
import { getChainName, supportedChains } from "@/lib/chains/supportedChains";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import MenuSelect, { Option } from "@/ui/MenuSelect/MenuSelect";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import useSWRMutation from "swr/mutation";



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

const BoardForm = ({ spaceName, initialConfig }: { spaceName: string, initialConfig: MintBoardTemplate | null }) => {
    const { state, setField, validate } = useCreateMintBoardTemplate(initialConfig);
    const { data: session, status } = useSession();
    const router = useRouter();
    const chainOptions = supportedChains.map(chain => { return { value: String(chain.id), label: chain.name } });
    const currentChain = chainOptions.find(chain => chain.value === String(state.chainId));

    const { trigger, data: configureMintBoardResponse, error, isMutating, reset } = useSWRMutation(
        `/api/configureMintBoard/${spaceName}`,
        configureMintBoard,
        {
            onError: (err) => {
                console.log(err);
                reset();
            },
        }
    );


    const handleSubmit = async () => {
        const result = await validate();
        if (!result.success) {
            return toast.error("Some of your fields are invalid")
        }

        try {
            await trigger({
                csrfToken: session.csrfToken,
                spaceName,
                mintBoardData: result.data
            }).then((response) => {
                if (!response.success) {
                    toast.error('Something went wrong')
                    return reset();
                }
                mutateMintBoard(spaceName)
                router.push(`/${spaceName}/mintboard`, { scroll: false })
                router.refresh();
                return toast.success('Mintboard Configured!')
            });
        } catch (e) {
            console.log(e)
            reset();
        }
    }


    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-bold text-t1">Mint Board</h1>
                        <p className="text-t2">Allow users to create mints in this collection</p>
                    </div>
                    <div className="ml-auto">
                        <Toggle defaultState={state.enabled} onSelectCallback={() => setField("enabled", !state.enabled)} />
                    </div>
                </div>
            </div>
            {state.enabled && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                        <h1 className="text-xl font-bold text-t1">Details</h1>

                        <BasicInput inputType="text" label="Title" value={state.boardTitle} placeholder={"Based Management Interns"} onChange={(e) => setField("boardTitle", e.target.value)} error={state.errors?.boardTitle?._errors} />
                        <TextArea value={state.boardDescription} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("boardDescription", e.target.value)} error={state.errors?.boardDescription?._errors} />

                    </div>



                    <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                        <div className="flex flex-row gap-2 items-center">
                            <h1 className="text-xl font-bold text-t1">Network</h1>
                            <div className="flex gap-0.5 items-center ml-auto">
                                <ChainLabel chainId={state.chainId} px={16} />
                                <MenuSelect options={chainOptions} selected={currentChain} setSelected={(option: { value: string, label: string }) => setField("chainId", Number(option.value))} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                        <h1 className="text-xl font-bold text-t1">Token Template</h1>
                        <BasicInput inputType="text" label="Name" value={state.name} placeholder={"Based Management"} onChange={(e) => setField("name", e.target.value)} error={state.errors?.name?._errors} />
                        <BasicInput inputType="text" label="Symbol" value={state.symbol} placeholder={"MGMT"} onChange={(e) => setField("symbol", e.target.value)} error={state.errors?.symbol?._errors} />
                        <TextArea value={state.description} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
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
                            value={state.publicSalePrice}
                            label={"Mint Price"}
                            options={[{ value: "free", label: "Free" }]}
                            onOptionSelect={(option: Option) => setField("publicSalePrice", option.value)}
                            customLabel={"Custom"}
                            customChild={
                                <BasicInput
                                    inputType="number"
                                    value={state.publicSalePrice}
                                    label={"Mint Price"}
                                    placeholder={"0.01"}
                                    onChange={(e) => setField("publicSalePrice", asPositiveFloat(e.target.value, 5))}
                                    error={state.errors?.publicSalePrice?._errors} />
                            } />

                        <Options label={"Mint Duration"} options={[{ value: "3 days", label: "3 days" }, { value: "week", label: "1 week" }, { value: "forever", label: "Forever" }]} selected={state.publicSaleEnd} onSelect={(option: Option) => setField("publicSaleEnd", option.value)} />
                        <BasicInput inputType="text" label="Space Treasury Address" value={state.referrer} placeholder={"0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"} onChange={(e) => setField("referrer", e.target.value)} error={state.errors?.referrer?._errors} />
                    </div>
                    <div className="flex flex-col gap-2 bg-base-100 w-full p-6 rounded-lg">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-xl font-bold text-t1">Mint Threshold</h1>
                                <p className="text-t2">Reward posters when they reach a certain # of mints. Enabling a threshold will show users their progress on the mintboard page.</p>
                            </div>
                        </div>
                        <Options label={""} options={[{ value: "0", label: "none" }, { value: "100", label: "100" }, { value: "500", label: "500" }, {value: "1000", label: "1000"}]} selected={state.threshold.toString()} onSelect={(option: Option) => setField("threshold", Number(option.value))} />
                    </div>
                </div>
            )}
            <WalletConnectButton>
                <button className="btn btn-primary normal-case" disabled={isMutating} onClick={handleSubmit}>
                    {isMutating ? (
                        <div className="flex gap-2 items-center w-full">
                            <p className="text-sm">Saving</p>
                            <TbLoader2 className="w-4 h-4 text-t2 animate-spin ml-auto" />
                        </div>
                    )
                        :
                        "Save"
                    }

                </button>
            </WalletConnectButton>
        </div>
    )
}

export default BoardForm