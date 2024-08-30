
export const SectionWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="bg-base-100 flex flex-col gap-6 w-full m-auto mt-0 border border-border rounded-xl p-6 ">
            <h2 className="font-bold text-t1 text-xl">{title}</h2>
            {children}
        </div>
    )
}

export const FieldError = ({ error }: { error: string }) => {
    return (
        <span className="text-error text-md overflow-wrap break-word">{error}</span>
    )
}