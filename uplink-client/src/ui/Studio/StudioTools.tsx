"use client";

import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Option } from "../MenuSelect/MenuSelect";
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import {
    type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor'

const Editor = dynamic(() => import('@/lib/markdownEditor/InitializedMDXEditor'), {
    // Make sure we turn SSR off
    loading: () => (
        <div className="h-[90px] w-full shimmer bg-base-100 rounded-lg">

        </div>
    ),
    ssr: false
})


export const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

interface MarkdownEditorProps extends MDXEditorProps {
    label: string;
    error: string[];
}

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
    ({ label, error, ...editorProps }, ref) => {
        return (
            <div>
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
                <Editor {...editorProps} editorRef={ref} />
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{error.join(",")}</span>
                    </label>
                )}
            </div>
        );
    }
);

MarkdownEditor.displayName = "MarkdownEditor";

export const TextArea = ({
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

export const BasicInput = ({ value, label, placeholder, onChange, error, inputType }) => {
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
                className={`input input-bordered w-full ${error ? "input-error" : "input"
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

export const Toggle = ({
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

export const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode }) => {
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
