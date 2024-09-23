"use client";;
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { useRef, useState } from "react";
import { Option } from "../OptionSelect/OptionSelect";
import { forwardRef } from 'react';
import {
    type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor'
import { Label } from "../DesignKit/Label";
import dynamic from 'next/dynamic';
import { Input } from "../DesignKit/Input";
import { Button } from "../DesignKit/Button";

const Editor = dynamic(() => import('@/lib/markdownEditor/InitializedMDXEditor'), {
    // Make sure we turn SSR off
    loading: () => (
        <div className="h-[90px] w-full shimmer bg-base-100 rounded-lg" />
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
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Editor {...editorProps} editorRef={ref} placeholder="Start typing here ..." />
                {error && (
                    <Label>
                        <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                    </Label>
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
            <Label>{label}</Label>
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
                    <Label>
                        <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                    </Label>
                )}
            </div>
        </div>
    );
};

export const BasicInput = ({ value, label, placeholder, onChange, error, inputType }) => {
    return (
        <div>
            <Label>{label}</Label>
            <Input
                variant={error ? "error" : "outline"}
                type={inputType}
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}
                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && (
                <Label>
                    <p className="text-error max-w-sm break-words">{error.join(",")}</p>
                </Label>
            )}
        </div>
    )
}

export const OptionOrCustom = ({ value, label, options, onOptionSelect, customLabel, customChild }: { value: string, label: string, options: Option[], onOptionSelect: (option: Option) => void; customLabel: string; customChild: React.ReactNode }) => {
    const [isCustom, setIsCustom] = useState(false);

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
