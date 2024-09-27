import { PolyfillContext } from "@/providers/PolyfillContext";
import ToastProvider from "@/providers/ToastProvider";
import { SimpleWalletProvider } from "@/providers/WalletProvider";

export default function ComposerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SimpleWalletProvider>
            <ToastProvider>
                <PolyfillContext>
                    {children}
                </PolyfillContext>
            </ToastProvider>
        </SimpleWalletProvider>
    )
}