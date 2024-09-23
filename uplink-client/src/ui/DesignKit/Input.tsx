import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/shadcn"

const inputVariants = cva(
    "flex h-9 w-full bg-base-100 rounded-lg border border-border px-3 py-1 text-sm shadow-sm transition-colors max-w-sm items-center gap-1.5 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
    {
        variants: {
            variant: {
                default: "bg-base-100 border-none ",
                outline: "bg-base-100 focus-visible:ring-accent focus-visible:ring-1",
                error: "ring-error ring-1",
                success: "focus-visible:ring-success focus-visible:ring-1",
            }

        },
        defaultVariants: {
            variant: "default",
        }
    }
)

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
    asChild?: boolean
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, size, type, ...props }, ref) => {
        return (
            <input
                className={cn(
                    inputVariants({ variant, className })
                )}
                type={type}

                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input, inputVariants }