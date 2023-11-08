"use client";

import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useCreateZoraEdition from "@/hooks/useCreateZoraEdition";
import { useEffect, useRef, useState } from "react";
import type { Option } from "@/ui/MenuSelect/MenuSelect";
import { uint64MaxSafe } from "@/utils/uint64";
import DateTimeSelector from "@/ui/DateTime/DateTime";
import { nanoid } from "nanoid";



const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode }) => {
    const [isCustom, setIsCustom] = useState(false);
    // select from options or enter custom

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOption = options.find((option) => option.label === e.target.dataset.title);
        if (selectedOption) {
            onOptionSelect(selectedOption);
            setIsCustom(false);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // You may need a way to handle the custom value selection, such as a callback.
        setIsCustom(e.target.checked);
    };

    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <div className="flex flex-col gap-2 p-2 rounded-xl bg-base-200">
                <div className="btn-group">
                    {options.map((option, idx) => (
                        <input
                            key={idx}
                            type="radio"
                            name={`option-${nanoid()}`}
                            className="btn normal-case"
                            data-title={option.label}
                            checked={option.value === value && !isCustom}
                            onChange={handleChange}

                        />
                    ))}
                    <input
                        type="radio"
                        name={`custom-${nanoid()}`}
                        className="btn normal-case"
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
                    placeholder="whats happening?"
                    //focused={focusedTweet === id}
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

const BasicInput = ({ value, label, placeholder, onChange, error }) => {
    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type="text"
                autoComplete="off"
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
            <div className="flex flex-col gap-4 border-border border max-w-[400px] rounded-xl p-2 bg-base">{children}</div>
        </div>
    )
}

const ZoraForm = () => {
    const { state, setField, validate } = useCreateZoraEdition();

    const handleSubmit = () => {
        const result = validate();
    }

    useEffect(() => {
        console.log(state.editionSize)
    }, [state.editionSize])


    return (
        <div className="flex flex-col gap-4">
            <SectionWrapper title="Token Details">
                <BasicInput value={state.name} label={"Name"} placeholder={"An amazing new creation"} onChange={(e) => setField("name", e.target.value)} error={state.errors?.name?._errors} />
                <BasicInput value={state.symbol} label={"Symbol"} placeholder={"$TEST"} onChange={(e) => setField("symbol", e.target.value)} error={state.errors?.symbol?._errors} />
                <TextArea value={state.description} label={"Description"} placeholder={"blah blah blah"} onChange={(e) => setField("description", e.target.value)} error={state.errors?.description?._errors} />
            </SectionWrapper>
            <SectionWrapper title="Mint Details">

                <OptionOrCustom
                    value={state.editionSize}
                    label={"Edition Size"}
                    options={[{ value: uint64MaxSafe.toString(), label: "open" }]}
                    onOptionSelect={(option: Option) => setField("editionSize", option.value)}
                    customLabel={"Fixed"}
                    customChild={
                        <BasicInput
                            value={state.editionSize === uint64MaxSafe.toString() ? "100" : state.editionSize}
                            label={"Fixed Supply"}
                            placeholder={"100"}
                            onChange={(e) => setField("editionSize", e.target.value)}
                            error={state.errors?.editionSize?._errors} />
                    } />
                <BasicInput value={state.royaltyBPS} label={"Royalty"} placeholder={"1000"} onChange={(e) => setField("royaltyBPS", e.target.value)} error={state.errors?.royaltyBPS?._errors} />
                <BasicInput value={state.salesConfig.publicSalePrice} label={"Mint Price"} placeholder={"100000000000000000"} onChange={(e) => setField("salesConfig.publicSalePrice", e.target.value)} error={state.errors?.salesConfig?.publicSalePrice?._errors} />
            </SectionWrapper>
            <SectionWrapper title="Mint Timing">

                <OptionOrCustom
                    value={state.salesConfig.publicSaleStart}
                    label={"Mint Start"}
                    options={[{ value: "now", label: "Now" }]}
                    onOptionSelect={(option: Option) => setField("salesConfig.publicSaleStart", option.value)}
                    customLabel={"Later"}
                    customChild={
                        <DateTimeSelector
                            isoString={state.salesConfig.publicSaleStart || "now"}
                            label={"Start"}
                            callback={(value) => setField("salesConfig.publicSaleStart", value)}
                            error={state.errors?.salesConfig?.publicSaleStart?._errors} />
                    } />

                <OptionOrCustom
                    value={state.salesConfig.publicSaleEnd}
                    label={"Mint Duration"}
                    options={[{ value: "forever", label: "Forever" }, { value: "1 week", label: "1 week" }, { value: "contest end", label: "Contest End" }]}
                    onOptionSelect={(option: Option) => setField("salesConfig.publicSaleEnd", option.value)}
                    customLabel={"Later"}
                    customChild={
                        <div>
                            <DateTimeSelector
                                isoString={"now"}
                                label={"End"}
                                callback={(value) => setField("salesConfig.publicSaleEnd", value)}
                                error={state.errors?.salesConfig?.publicSaleEnd?._errors} />
                            {state.errors?.salesConfig?._errors && (
                                <label className="label">
                                    <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{state.errors?.salesConfig?._errors.join(",")}</span>
                                </label>
                            )}
                        </div>
                    } />
            </SectionWrapper>
            <button className="btn normal-case" onClick={handleSubmit}>Submit</button>
        </div>
    )

}



export default function Page() {
    return (
        <div className="flex flex-col w-8/12 mt-6 m-auto">
            <ZoraForm />
        </div>
    )
}