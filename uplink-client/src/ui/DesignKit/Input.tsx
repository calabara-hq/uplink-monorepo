import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/shadcn"

const inputVariants = cva(
    "flex h-9 w-full bg-base1 rounded-xl border border-border px-3 py-1 text-sm shadow-sm transition-colors max-w-sm items-center gap-1.5 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vas disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-base1 border-none ",
                outline: "bg-base1 focus-visible:base-100 ",
                error: 'focus-visible:ring-destructive',
                success: 'focus-visible:ring-success',
                main: "bg-main border-none focus-visible:ring-primary",
                base3: "bg-base3 border-none ",
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