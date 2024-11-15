import { Input } from "./Input"
import { Label } from "./Label"

export const FormInput = ({
    value,
    placeholder,
    onChange,
    label,
    error,
    inputType,
    disabled,
    styleOverrides
}: {
    value: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    label?: string,
    error?: string,
    inputType: string,
    disabled?: boolean,
    styleOverrides?: string
}) => {
    return (
        <div className="w-full flex flex-col gap-2">
            {label && (
                <Label>
                    {label}
                </Label>
            )}
            <Input
                variant={error ? "error" : "outline"}
                type={inputType}
                autoComplete="off"
                onWheel={(e) => e.currentTarget.blur()}
                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={styleOverrides}
            />
            {error && (
                <Label>
                    <p className="text-error max-w-sm break-words">{error}</p>
                </Label>
            )}
        </div>
    )
}

