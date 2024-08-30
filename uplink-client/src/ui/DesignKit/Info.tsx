import { cn } from "@/lib/shadcn"

export const Info = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div
            className={cn(
                "bg-primary4/30 rounded-lg p-2 text-primary12 ",
                className
            )}
        >
            {children}
        </div>
    )
}