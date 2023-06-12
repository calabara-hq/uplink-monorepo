"use client"
import { SWRConfig } from "swr";

export default function SwrProvider({children, fallback}: {children: React.ReactNode, fallback: any}){
    return (
    <SWRConfig value={{fallback}}>
        {children}
    </SWRConfig>
    )
}