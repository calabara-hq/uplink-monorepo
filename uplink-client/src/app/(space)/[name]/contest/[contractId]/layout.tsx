import React from "react";

export default function Layout({ children, sidebar }: { children: React.ReactNode, sidebar: React.ReactNode }) {

    return (
        <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
            {children}
            {sidebar}
        </div>
    )
}